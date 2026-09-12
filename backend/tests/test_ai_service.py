from backend.app.services.ai_service import analyze_health_event


def test_backend_ai_service_uses_ml_contract_shape():
    result = analyze_health_event(
        species="cattle",
        symptoms=["fever", "mouth_lesions", "lameness"],
        affected_count=8,
        death_count=1,
        duration_days=2,
    )
    assert result["prediction"]["disease"] == "FMD"
    assert set(result) == {"prediction", "risk", "zoonotic", "explanation"}
    assert isinstance(result["risk"]["score"], int)
    assert result["zoonotic"]["flag"] is False


def test_backend_signature_still_accepts_four_args():
    result = analyze_health_event(
        "poultry",
        ["respiratory_distress", "cough"],
        20,
        5,
    )
    assert "prediction" in result
    assert result["prediction"]["disease"] in {"Avian Influenza", "Unknown"}
