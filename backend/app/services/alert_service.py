import logging

from psycopg.types.json import Json

from backend.app.database.connection import get_connection
from backend.app.exceptions import raise_database_http_error
from backend.app.services.geo_service import (
    CLUSTER_RADIUS_KM,
    LOOKBACK_DAYS,
    haversine_km,
    should_attempt_clustering,
)
from backend.app.services.risk_service import higher_risk_level, severity_from_risk_level, should_create_alert

logger = logging.getLogger(__name__)


def save_ai_prediction(conn, health_event_id, analysis: dict) -> None:
    prediction = analysis["prediction"]
    risk = analysis["risk"]
    zoonotic = analysis["zoonotic"]

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO ai_predictions (
                health_event_id,
                disease,
                confidence,
                risk_score,
                risk_level,
                zoonotic_flag,
                explanation
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                health_event_id,
                prediction.get("disease"),
                prediction.get("confidence"),
                risk.get("score"),
                risk.get("level"),
                zoonotic.get("flag", False),
                Json(analysis.get("explanation") or []),
            ),
        )


def process_cluster(conn, event: dict, analysis: dict) -> str | None:
    disease = analysis.get("prediction", {}).get("disease")
    risk_level = analysis.get("risk", {}).get("level")
    latitude = event.get("latitude")
    longitude = event.get("longitude")

    if not should_attempt_clustering(disease, latitude, longitude):
        return None

    existing = _find_nearby_cluster(conn, disease, latitude, longitude)
    if existing:
        _attach_event_to_cluster(conn, existing, event, risk_level)
        return str(existing["id"])

    nearby_events = _find_nearby_events(conn, event, disease)
    if not nearby_events:
        return None

    members = nearby_events + [event]
    cluster_id = _create_cluster(conn, disease, members, risk_level)
    return str(cluster_id)


def maybe_create_alert(conn, event: dict, analysis: dict, cluster_id: str | None) -> None:
    disease = analysis.get("prediction", {}).get("disease") or "Unknown"
    risk_level = analysis.get("risk", {}).get("level")
    event_count = 1

    if cluster_id:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT event_count FROM clusters WHERE id = %s",
                (cluster_id,),
            )
            row = cur.fetchone()
            if row:
                event_count = row[0]

            cur.execute(
                """
                SELECT id FROM alerts
                WHERE cluster_id = %s AND status = 'active'
                LIMIT 1
                """,
                (cluster_id,),
            )
            if cur.fetchone():
                return

    if not should_create_alert(risk_level, event_count):
        return

    if event_count >= 2:
        title = f"Potential {disease} Cluster"
        message = "Multiple similar health events detected nearby."
        alert_type = "potential_outbreak"
    else:
        title = f"High-risk {disease} event"
        message = "A high-risk livestock health event was reported."
        alert_type = "high_risk_event"

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO alerts (
                cluster_id,
                type,
                severity,
                title,
                message,
                status
            )
            VALUES (%s, %s, %s, %s, %s, 'active')
            """,
            (
                cluster_id,
                alert_type,
                severity_from_risk_level(risk_level),
                title[:200],
                message,
            ),
        )


def _find_nearby_cluster(conn, disease: str, latitude: float, longitude: float):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, latitude, longitude, radius_km, event_count, affected_count, risk_level
            FROM clusters
            WHERE disease = %s
            """,
            (disease,),
        )
        rows = cur.fetchall()

    for row in rows:
        cluster = {
            "id": row[0],
            "latitude": row[1],
            "longitude": row[2],
            "radius_km": row[3] or CLUSTER_RADIUS_KM,
            "event_count": row[4] or 0,
            "affected_count": row[5] or 0,
            "risk_level": row[6],
        }
        distance = haversine_km(latitude, longitude, cluster["latitude"], cluster["longitude"])
        if distance <= max(cluster["radius_km"], CLUSTER_RADIUS_KM):
            return cluster
    return None


def _attach_event_to_cluster(conn, cluster: dict, event: dict, risk_level: str | None) -> None:
    event_count = cluster["event_count"] + 1
    new_lat = ((cluster["latitude"] * cluster["event_count"]) + event["latitude"]) / event_count
    new_lon = ((cluster["longitude"] * cluster["event_count"]) + event["longitude"]) / event_count
    distance = haversine_km(new_lat, new_lon, event["latitude"], event["longitude"])
    radius_km = max(cluster["radius_km"], distance, CLUSTER_RADIUS_KM)
    affected_count = cluster["affected_count"] + (event.get("affected_count") or 0)
    next_risk = higher_risk_level(cluster.get("risk_level"), risk_level)

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO cluster_events (cluster_id, health_event_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """,
            (cluster["id"], event["id"]),
        )
        cur.execute(
            """
            UPDATE clusters
            SET latitude = %s,
                longitude = %s,
                radius_km = %s,
                event_count = %s,
                affected_count = %s,
                risk_level = %s
            WHERE id = %s
            """,
            (new_lat, new_lon, radius_km, event_count, affected_count, next_risk, cluster["id"]),
        )


def _find_nearby_events(conn, event: dict, disease: str) -> list[dict]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT he.id, he.latitude, he.longitude, he.affected_count
            FROM health_events he
            JOIN ai_predictions ap ON ap.health_event_id = he.id
            WHERE ap.disease = %s
              AND he.id <> %s
              AND he.latitude IS NOT NULL
              AND he.longitude IS NOT NULL
              AND he.created_at >= NOW() - (%s * INTERVAL '1 day')
            """,
            (disease, event["id"], LOOKBACK_DAYS),
        )
        rows = cur.fetchall()

    nearby = []
    for row in rows:
        distance = haversine_km(event["latitude"], event["longitude"], row[1], row[2])
        if distance <= CLUSTER_RADIUS_KM:
            nearby.append(
                {
                    "id": row[0],
                    "latitude": row[1],
                    "longitude": row[2],
                    "affected_count": row[3] or 0,
                }
            )
    return nearby


def _create_cluster(conn, disease: str, members: list[dict], risk_level: str | None) -> str:
    count = len(members)
    latitude = sum(member["latitude"] for member in members) / count
    longitude = sum(member["longitude"] for member in members) / count
    radius_km = CLUSTER_RADIUS_KM
    for member in members:
        radius_km = max(
            radius_km,
            haversine_km(latitude, longitude, member["latitude"], member["longitude"]),
        )
    affected_count = sum(member.get("affected_count") or 0 for member in members)

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO clusters (
                disease,
                latitude,
                longitude,
                radius_km,
                event_count,
                affected_count,
                risk_level
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (disease, latitude, longitude, radius_km, count, affected_count, risk_level),
        )
        cluster_id = cur.fetchone()[0]

        for member in members:
            cur.execute(
                """
                INSERT INTO cluster_events (cluster_id, health_event_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (cluster_id, member["id"]),
            )

    return cluster_id


def list_clusters() -> list[dict]:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        id, disease, latitude, longitude, radius_km,
                        event_count, affected_count, risk_level, detected_at
                    FROM clusters
                    ORDER BY detected_at DESC
                    """
                )
                rows = cur.fetchall()
        return [
            {
                "id": str(row[0]),
                "disease": row[1],
                "latitude": row[2],
                "longitude": row[3],
                "radius_km": row[4],
                "event_count": row[5],
                "affected_count": row[6],
                "risk_level": row[7],
                "detected_at": row[8].isoformat() if row[8] else None,
            }
            for row in rows
        ]
    except Exception as exc:
        logger.exception("Failed to list clusters")
        raise_database_http_error(exc, "Could not load clusters")


def list_alerts() -> list[dict]:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, cluster_id, type, severity, title, message, status, created_at
                    FROM alerts
                    WHERE status = 'active'
                    ORDER BY created_at DESC
                    """
                )
                rows = cur.fetchall()
        return [
            {
                "id": str(row[0]),
                "cluster_id": str(row[1]) if row[1] else None,
                "type": row[2],
                "severity": row[3],
                "title": row[4],
                "message": row[5],
                "status": row[6],
                "created_at": row[7].isoformat() if row[7] else None,
            }
            for row in rows
        ]
    except Exception as exc:
        logger.exception("Failed to list alerts")
        raise_database_http_error(exc, "Could not load alerts")
