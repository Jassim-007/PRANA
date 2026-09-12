import logging

from backend.app.database.connection import get_connection
from backend.app.exceptions import raise_database_http_error

logger = logging.getLogger(__name__)


def get_dashboard_summary() -> dict:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM farms")
                total_farms = cur.fetchone()[0]

                cur.execute(
                    """
                    SELECT COUNT(*)
                    FROM health_events
                    WHERE status IN ('open', 'under_review')
                    """
                )
                active_events = cur.fetchone()[0]

                cur.execute(
                    """
                    SELECT
                        COUNT(*) FILTER (WHERE ap.risk_level = 'CRITICAL') AS critical_events,
                        COUNT(*) FILTER (WHERE ap.risk_level IN ('HIGH', 'CRITICAL')) AS high_risk_events
                    FROM health_events he
                    LEFT JOIN LATERAL (
                        SELECT risk_level
                        FROM ai_predictions
                        WHERE health_event_id = he.id
                        ORDER BY created_at DESC
                        LIMIT 1
                    ) ap ON TRUE
                    WHERE he.status IN ('open', 'under_review')
                    """
                )
                risk_row = cur.fetchone()

                cur.execute("SELECT COUNT(*) FROM clusters")
                active_clusters = cur.fetchone()[0]

                cur.execute("SELECT COUNT(*) FROM alerts WHERE status = 'active'")
                active_alerts = cur.fetchone()[0]

        return {
            "summary": {
                "total_farms": total_farms,
                "active_events": active_events,
                "critical_events": risk_row[0] or 0,
                "high_risk_events": risk_row[1] or 0,
                "active_clusters": active_clusters,
                "active_alerts": active_alerts,
            }
        }
    except Exception as exc:
        logger.exception("Failed to load dashboard summary")
        raise_database_http_error(exc, "Could not load dashboard")


def get_dashboard_trends() -> dict:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        DATE(created_at) AS event_date,
                        COUNT(*) AS event_count
                    FROM health_events
                    WHERE created_at >= NOW() - INTERVAL '14 days'
                    GROUP BY DATE(created_at)
                    ORDER BY event_date
                    """
                )
                rows = cur.fetchall()

        return {
            "trends": [
                {
                    "date": row[0].isoformat(),
                    "event_count": row[1],
                }
                for row in rows
            ]
        }
    except Exception as exc:
        logger.exception("Failed to load dashboard trends")
        raise_database_http_error(exc, "Could not load dashboard trends")
