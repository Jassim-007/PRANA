from backend.app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_database_health():
    response = client.get("/health/database")
    assert response.status_code == 200
    assert response.json()["database"] in ("connected", "not connected")
