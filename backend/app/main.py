from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database.connection import test_database_connection
from backend.app.routes.ai import router as ai_router
from backend.app.routes.alerts import router as alerts_router
from backend.app.routes.clusters import router as clusters_router
from backend.app.routes.dashboard import router as dashboard_router
from backend.app.routes.farms import router as farms_router
from backend.app.routes.field_workers import router as field_workers_router
from backend.app.routes.health_events import router as health_events_router

app = FastAPI(
    title="PRANA",
    description="Livestock Health Surveillance & Early-Warning Platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_events_router)
app.include_router(ai_router)
app.include_router(farms_router)
app.include_router(clusters_router)
app.include_router(alerts_router)
app.include_router(dashboard_router)
app.include_router(field_workers_router)


@app.get("/")
def root():
    return {
        "message": "PRANA API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/database")
def database_health():
    connected = test_database_connection()

    return {
        "database": "connected" if connected else "not connected"
    }
