from fastapi import APIRouter

from backend.app.services.alert_service import list_clusters

router = APIRouter(
    prefix="/api/clusters",
    tags=["Clusters"]
)


@router.get("")
def get_clusters():
    return {"clusters": list_clusters()}
