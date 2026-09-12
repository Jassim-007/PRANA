import logging
from uuid import UUID

from backend.app.database.connection import get_connection
from backend.app.exceptions import raise_database_http_error

logger = logging.getLogger(__name__)


def list_farms() -> list[dict]:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        id, name, owner_name, village, block, district,
                        latitude, longitude, species, animal_count, created_at
                    FROM farms
                    ORDER BY name
                    """
                )
                rows = cur.fetchall()
        return [_map_farm(row) for row in rows]
    except Exception as exc:
        logger.exception("Failed to list farms")
        raise_database_http_error(exc, "Could not load farms")


def get_farm(farm_id: UUID) -> dict | None:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        id, name, owner_name, village, block, district,
                        latitude, longitude, species, animal_count, created_at
                    FROM farms
                    WHERE id = %s
                    """,
                    (farm_id,),
                )
                row = cur.fetchone()
        return _map_farm(row) if row else None
    except Exception as exc:
        logger.exception("Failed to load farm")
        raise_database_http_error(exc, "Could not load farm")


def _map_farm(row) -> dict:
    return {
        "id": str(row[0]),
        "name": row[1],
        "owner_name": row[2],
        "village": row[3],
        "block": row[4],
        "district": row[5],
        "latitude": row[6],
        "longitude": row[7],
        "species": row[8],
        "animal_count": row[9],
        "created_at": row[10].isoformat() if row[10] else None,
    }
