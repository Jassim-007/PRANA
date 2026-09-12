from fastapi import FastAPI
from backend.app.routes.ai import router as ai_router

from backend.app.database.connection import test_database_connection
from backend.app.routes.health_events import router as health_events_router

app = FastAPI(
    title="PRANA",
    description="Livestock Health Surveillance & Early-Warning Platform",
    version="0.1.0"
)

app.include_router(health_events_router)
app.include_router(ai_router)

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