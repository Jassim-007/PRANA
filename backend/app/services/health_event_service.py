import json
import logging
from uuid import UUID

from backend.app.database.connection import get_connection
from backend.app.exceptions import raise_database_http_error
from backend.app.schemas.health_event import HealthEventCreate
from backend.app.services.ai_service import analyze_health_event
from backend.app.services.alert_service import maybe_create_alert, process_cluster, save_ai_prediction

logger = logging.getLogger(__name__)


def create_health_event_pipeline(event: HealthEventCreate) -> dict:
    try:
        with get_connection() as conn:
            with conn.transaction():
                saved = _insert_health_event(conn, event)
    except Exception as exc:
        logger.exception("Failed to save health event")
        raise_database_http_error(exc, "Could not create health event")

    analysis = None
    try:
        analysis = analyze_health_event(
            species=event.species,
            symptoms=event.symptoms,
            affected_count=event.affected_count,
            death_count=event.death_count,
        )
        with get_connection() as conn:
            with conn.transaction():
                save_ai_prediction(conn, saved["id"], analysis)
                cluster_id = process_cluster(conn, saved, analysis)
                maybe_create_alert(conn, saved, analysis, cluster_id)
    except Exception:
        logger.exception("Health event intelligence pipeline failed")

    response = {
        "id": str(saved["id"]),
        "status": saved["status"],
        "created_at": saved["created_at"].isoformat(),
        "message": "Health event created successfully",
    }
    if analysis:
        response["analysis"] = analysis
    return response


def list_health_events(
    species: str | None = None,
    source: str | None = None,
    event_type: str | None = None,
    status: str | None = None,
    farm_id: UUID | None = None,
    risk_level: str | None = None,
    district: str | None = None,
) -> list[dict]:
    filters = []
    params: list = []

    if species:
        filters.append("he.species = %s")
        params.append(species)
    if source:
        filters.append("he.source = %s")
        params.append(source)
    if event_type:
        filters.append("he.event_type = %s")
        params.append(event_type)
    if status:
        filters.append("he.status = %s")
        params.append(status)
    if farm_id:
        filters.append("he.farm_id = %s")
        params.append(farm_id)
    if risk_level:
        filters.append("ap.risk_level = %s")
        params.append(risk_level)
    if district:
        filters.append("f.district = %s")
        params.append(district)

    where_sql = f"WHERE {' AND '.join(filters)}" if filters else ""

    query = f"""
        SELECT
            he.id,
            he.farm_id,
            f.name AS farm_name,
            he.source,
            he.species,
            he.event_type,
            he.symptoms,
            he.affected_count,
            he.death_count,
            he.duration_days,
            he.notes,
            he.latitude,
            he.longitude,
            he.status,
            he.created_at,
            ap.disease,
            ap.confidence,
            ap.risk_score,
            ap.risk_level,
            ap.zoonotic_flag,
            ap.explanation
        FROM health_events he
        LEFT JOIN farms f ON f.id = he.farm_id
        LEFT JOIN LATERAL (
            SELECT disease, confidence, risk_score, risk_level, zoonotic_flag, explanation
            FROM ai_predictions
            WHERE health_event_id = he.id
            ORDER BY created_at DESC
            LIMIT 1
        ) ap ON TRUE
        {where_sql}
        ORDER BY he.created_at DESC
    """

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, params)
                rows = cur.fetchall()
        return [_map_event_row_with_ai(row) for row in rows]
    except Exception as exc:
        logger.exception("Failed to list health events")
        raise_database_http_error(exc, "Could not load health events")



def _map_event_row_with_ai(row) -> dict:
    payload = {
        "id": str(row[0]),
        "farm_id": str(row[1]),
        "farm_name": row[2],
        "source": row[3],
        "species": row[4],
        "event_type": row[5],
        "symptoms": row[6] or [],
        "affected_count": row[7],
        "death_count": row[8],
        "duration_days": row[9],
        "notes": row[10],
        "latitude": row[11],
        "longitude": row[12],
        "status": row[13],
        "created_at": row[14].isoformat() if row[14] else None,
    }
    if row[15] is not None:
        payload.update(
            {
                "possible_disease": row[15],
                "risk_level": row[18],
                "risk_score": row[17],
                "ai_confidence": row[16],
                "zoonotic_flag": row[19],
                "explanation": row[20] or [],
            }
        )
    return payload

def get_health_event(event_id: UUID) -> dict | None:
    query = """
        SELECT
            he.id,
            he.farm_id,
            he.source,
            he.species,
            he.event_type,
            he.symptoms,
            he.affected_count,
            he.death_count,
            he.duration_days,
            he.notes,
            he.latitude,
            he.longitude,
            he.status,
            he.created_at,
            ap.disease,
            ap.confidence,
            ap.risk_score,
            ap.risk_level,
            ap.zoonotic_flag,
            ap.explanation
        FROM health_events he
        LEFT JOIN LATERAL (
            SELECT disease, confidence, risk_score, risk_level, zoonotic_flag, explanation
            FROM ai_predictions
            WHERE health_event_id = he.id
            ORDER BY created_at DESC
            LIMIT 1
        ) ap ON TRUE
        WHERE he.id = %s
    """

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, (event_id,))
                row = cur.fetchone()
        if row is None:
            return None

        payload = _map_event_row(row[:14])
        if row[14] is not None:
            payload["analysis"] = {
                "prediction": {
                    "disease": row[14],
                    "confidence": row[15],
                },
                "risk": {
                    "score": row[16],
                    "level": row[17],
                },
                "zoonotic": {
                    "flag": row[18],
                },
                "explanation": row[19] or [],
            }
        return payload
    except Exception as exc:
        logger.exception("Failed to load health event")
        raise_database_http_error(exc, "Could not load health event")


def record_feedback(event_id: UUID, vet_id: str, decision: str, notes: str | None, action_taken: str | None) -> dict:
    try:
        with get_connection() as conn:
            with conn.transaction():
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM health_events WHERE id = %s", (event_id,))
                    if cur.fetchone() is None:
                        return {"found": False}

                    cur.execute(
                        """
                        INSERT INTO vet_feedback (
                            health_event_id,
                            vet_id,
                            decision,
                            notes,
                            action_taken
                        )
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (event_id, vet_id, decision, notes, action_taken),
                    )

                    next_status = "resolved" if decision in ("confirmed", "rejected") else "under_review"
                    cur.execute(
                        "UPDATE health_events SET status = %s WHERE id = %s",
                        (next_status, event_id),
                    )
        return {"found": True}
    except Exception as exc:
        logger.exception("Failed to record veterinary feedback")
        raise_database_http_error(exc, "Could not record feedback")


def _insert_health_event(conn, event: HealthEventCreate) -> dict:
    query = """
        INSERT INTO health_events (
            farm_id,
            source,
            species,
            event_type,
            symptoms,
            affected_count,
            death_count,
            duration_days,
            notes,
            photo_base64,
            latitude,
            longitude
        )
        VALUES (
            %s, %s, %s, %s, %s::jsonb,
            %s, %s, %s, %s, %s, %s, %s
        )
        RETURNING id, status, created_at, farm_id, affected_count, latitude, longitude
    """

    with conn.cursor() as cur:
        cur.execute(
            query,
            (
                event.farm_id,
                event.source,
                event.species,
                event.event_type,
                json.dumps(event.symptoms),
                event.affected_count,
                event.death_count,
                event.duration_days,
                event.notes,
                event.photo_base64,
                event.latitude,
                event.longitude,
            ),
        )
        row = cur.fetchone()

    return {
        "id": row[0],
        "status": row[1],
        "created_at": row[2],
        "farm_id": row[3],
        "affected_count": row[4],
        "latitude": row[5],
        "longitude": row[6],
    }


def _map_event_row(row) -> dict:
    return {
        "id": str(row[0]),
        "farm_id": str(row[1]),
        "source": row[2],
        "species": row[3],
        "event_type": row[4],
        "symptoms": row[5] or [],
        "affected_count": row[6],
        "death_count": row[7],
        "duration_days": row[8],
        "notes": row[9],
        "latitude": row[10],
        "longitude": row[11],
        "status": row[12],
        "created_at": row[13].isoformat() if row[13] else None,
    }
