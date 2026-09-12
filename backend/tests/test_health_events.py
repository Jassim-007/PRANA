import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.tests.conftest import db_available

client = TestClient(app)


def test_create_health_event_rejects_negative_counts():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "farmer",
            "species": "cattle",
            "event_type": "illness",
            "affected_count": -1,
            "death_count": 0,
        },
    )
    assert response.status_code == 422


def test_create_health_event_rejects_invalid_source():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "drone",
            "species": "cattle",
            "event_type": "illness",
        },
    )
    assert response.status_code == 422


def test_create_health_event_rejects_invalid_species():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "farmer",
            "species": "lion",
            "event_type": "illness",
        },
    )
    assert response.status_code == 422


def test_create_health_event_rejects_invalid_event_type():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "farmer",
            "species": "cattle",
            "event_type": "explosion",
        },
    )
    assert response.status_code == 422


def test_create_health_event_rejects_invalid_coordinates():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "farmer",
            "species": "cattle",
            "event_type": "illness",
            "latitude": 200,
            "longitude": 76.4,
        },
    )
    assert response.status_code == 422


def test_create_health_event_rejects_negative_duration():
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": "11111111-1111-1111-1111-111111111111",
            "source": "farmer",
            "species": "cattle",
            "event_type": "illness",
            "duration_days": -3,
        },
    )
    assert response.status_code == 422


def test_create_health_event_pipeline(farm_id):
    response = client.post(
        "/api/health-events",
        json={
            "farm_id": farm_id,
            "source": "farmer",
            "species": "cattle",
            "event_type": "illness",
            "symptoms": ["fever", "mouth_lesions", "lameness"],
            "affected_count": 8,
            "death_count": 1,
            "duration_days": 2,
            "latitude": 10.123,
            "longitude": 76.456,
            "notes": "Animals are not eating properly",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["message"] == "Health event created successfully"
    assert body["status"] == "open"
    assert "id" in body
    assert "analysis" in body
    assert body["analysis"]["prediction"]["disease"] == "FMD"
    assert "score" in body["analysis"]["risk"]
    assert "flag" in body["analysis"]["zoonotic"]

    listed = client.get("/api/health-events")
    assert listed.status_code == 200
    assert isinstance(listed.json(), list)
    assert any(item["id"] == body["id"] for item in listed.json())

    detail = client.get(f"/api/health-events/{body['id']}")
    assert detail.status_code == 200
    assert detail.json()["id"] == body["id"]


def test_get_health_events_requires_database():
    if not db_available():
        pytest.skip("database not connected")
    response = client.get("/api/health-events")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
