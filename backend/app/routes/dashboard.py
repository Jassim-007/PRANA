from fastapi import APIRouter

from backend.app.services.dashboard_service import get_dashboard_summary, get_dashboard_trends

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("")
def get_dashboard():
    return get_dashboard_summary()


@router.get("/trends")
def get_trends():
    return get_dashboard_trends()
