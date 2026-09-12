from uuid import UUID

from fastapi import APIRouter, HTTPException

from backend.app.services.farm_service import get_farm, list_farms
from backend.app.services.health_event_service import list_health_events

router = APIRouter(
    prefix="/api/farms",
    tags=["Farms"]
)


@router.get("")
def get_farms():
    return {"farms": list_farms()}


@router.get("/{farm_id}")
def get_farm_by_id(farm_id: UUID):
    farm = get_farm(farm_id)
    if farm is None:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm


@router.get("/{farm_id}/health-events")
def get_farm_health_events(farm_id: UUID):
    farm = get_farm(farm_id)
    if farm is None:
        raise HTTPException(status_code=404, detail="Farm not found")
    return list_health_events(farm_id=farm_id)
