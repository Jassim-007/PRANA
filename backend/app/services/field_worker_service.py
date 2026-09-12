import logging
from uuid import UUID

from backend.app.database.connection import get_connection
from backend.app.exceptions import raise_database_http_error

logger = logging.getLogger(__name__)


def list_field_workers() -> list[dict]:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT worker_code, name, phone, region, assigned_area, status, created_at
FROM field_workers
                    ORDER BY name
                    """
                )
                rows = cur.fetchall()
        return [_map_worker(row) for row in rows]
    except Exception as exc:
        logger.exception("Failed to list field workers")
        raise_database_http_error(exc, "Could not load field workers")


def list_assigned_farms(field_worker_code: str) -> dict | None:
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                # Resolve public worker code (e.g. FW001)
                # to the internal UUID.
                cur.execute(
                    """
                    SELECT id
                    FROM field_workers
                    WHERE worker_code = %s
                    """,
                    (field_worker_code,),
                )

                worker = cur.fetchone()

                if worker is None:
                    return None

                field_worker_id = worker[0]

                cur.execute(
                    """
                    SELECT
                        f.id, f.name, f.owner_name, f.village, f.block, f.district,
                        f.latitude, f.longitude, f.species, f.animal_count, f.created_at
                    FROM farms f
                    JOIN field_worker_assignments a ON a.farm_id = f.id
                    WHERE a.field_worker_id = %s
                      AND a.status = 'active'
                    ORDER BY f.name
                    """,
                    (field_worker_id,),
                )

                rows = cur.fetchall()

        farms = [
            {
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
            for row in rows
        ]

        return {"farms": farms}

    except Exception as exc:
        logger.exception("Failed to load field worker farms")
        raise_database_http_error(exc, "Could not load assigned farms")


def _map_worker(row) -> dict:
    return {
        "id": str(row[0]),
        "name": row[1],
        "phone": row[2],
        "region": row[3],
        "assigned_area": row[4],
        "status": row[5],
        "created_at": row[6].isoformat() if row[6] else None,
    }
