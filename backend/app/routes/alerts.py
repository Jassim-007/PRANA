from fastapi import APIRouter

from backend.app.services.alert_service import list_alerts

router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"]
)


@router.get("")
def get_alerts():
    return {"alerts": list_alerts()}
