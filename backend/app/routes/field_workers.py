from uuid import UUID

from fastapi import APIRouter, HTTPException

from backend.app.services.field_worker_service import list_assigned_farms, list_field_workers

router = APIRouter(
    prefix="/api/field-workers",
    tags=["Field Workers"]
)


@router.get("")
def get_field_workers():
    return {"field_workers": list_field_workers()}


@router.get("/{worker_id}/farms")
def get_field_worker_farms(worker_id: UUID):
    result = list_assigned_farms(worker_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Field worker not found")
    return result
