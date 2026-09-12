from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_ai_analyze_fmd_pattern():
    response = client.post(
        "/api/ai/analyze",
        json={
            "species": "cattle",
            "symptoms": ["fever", "mouth_lesions", "lameness"],
            "affected_count": 8,
            "death_count": 1,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["prediction"]["disease"] == "FMD"
    assert 0 <= body["prediction"]["confidence"] <= 1
    assert body["risk"]["level"] in ("LOW", "MODERATE", "HIGH", "CRITICAL")
    assert "flag" in body["zoonotic"]
    assert isinstance(body["explanation"], list)


def test_ai_analyze_rejects_invalid_species():
    response = client.post(
        "/api/ai/analyze",
        json={
            "species": "tiger",
            "symptoms": ["fever"],
            "affected_count": 1,
            "death_count": 0,
        },
    )
    assert response.status_code == 422
