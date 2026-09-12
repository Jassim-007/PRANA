from fastapi import APIRouter, HTTPException

from backend.app.database.connection import get_connection
from backend.app.schemas.health_event import HealthEventCreate
import json

router = APIRouter(
    prefix="/api/health-events",
    tags=["Health Events"]
)


@router.post("")
def create_health_event(event: HealthEventCreate):

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
            latitude,
            longitude
        )
        VALUES (
            %s, %s, %s, %s, %s::jsonb,
            %s, %s, %s, %s, %s, %s
        )
        RETURNING id, status, created_at;
    """

    symptoms_json = json.dumps(event.symptoms)

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute(
                    query,
                    (
                        event.farm_id,
                        event.source,
                        event.species,
                        event.event_type,
                        symptoms_json,
                        event.affected_count,
                        event.death_count,
                        event.duration_days,
                        event.notes,
                        event.latitude,
                        event.longitude,
                    )
                )

                result = cur.fetchone()

            conn.commit()

        return {
            "id": str(result[0]),
            "status": result[1],
            "created_at": result[2].isoformat(),
            "message": "Health event created successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("")
def get_health_events():

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    SELECT
                        id,
                        farm_id,
                        source,
                        species,
                        event_type,
                        symptoms,
                        affected_count,
                        death_count,
                        duration_days,
                        notes,
                        latitude,
                        longitude,
                        status,
                        created_at
                    FROM health_events
                    ORDER BY created_at DESC;
                """)

                rows = cur.fetchall()

        events = []

        for row in rows:
            events.append({
                "id": str(row[0]),
                "farm_id": str(row[1]),
                "source": row[2],
                "species": row[3],
                "event_type": row[4],
                "symptoms": row[5],
                "affected_count": row[6],
                "death_count": row[7],
                "duration_days": row[8],
                "notes": row[9],
                "latitude": row[10],
                "longitude": row[11],
                "status": row[12],
                "created_at": row[13].isoformat()
            })

        return events

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )