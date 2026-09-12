from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from backend.app.schemas.feedback import VetFeedbackCreate
from backend.app.schemas.health_event import HealthEventCreate
from backend.app.services.health_event_service import (
    create_health_event_pipeline,
    get_health_event,
    list_health_events,
    record_feedback,
)

router = APIRouter(
    prefix="/api/health-events",
    tags=["Health Events"]
)


@router.post("")
def create_health_event(event: HealthEventCreate):
    return create_health_event_pipeline(event)


@router.get("")
def get_health_events(
    species: str | None = Query(default=None),
    source: str | None = Query(default=None),
    event_type: str | None = Query(default=None),
    status: str | None = Query(default=None),
):
    return list_health_events(
        species=species,
        source=source,
        event_type=event_type,
        status=status,
    )


@router.get("/{event_id}")
def get_health_event_by_id(event_id: UUID):
    event = get_health_event(event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Health event not found")
    return event


@router.post("/{event_id}/feedback")
def create_health_event_feedback(event_id: UUID, payload: VetFeedbackCreate):
    result = record_feedback(
        event_id=event_id,
        vet_id=payload.vet_id,
        decision=payload.decision,
        notes=payload.notes,
        action_taken=payload.action_taken,
    )
    if not result.get("found"):
        raise HTTPException(status_code=404, detail="Health event not found")

    return {
        "status": "recorded",
        "message": "Veterinary feedback recorded successfully",
    }
