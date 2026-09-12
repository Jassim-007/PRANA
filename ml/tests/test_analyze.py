from ml.analyze import analyze_health_event
from ml.rules import DISCLAIMER


def test_cattle_fmd_sample_is_decision_support():
    result = analyze_health_event(
        species="cattle",
        symptoms=["fever", "mouth_lesions", "lameness"],
        affected_count=8,
        death_count=1,
        duration_days=2,
    )
    assert result["prediction"]["disease"] == "FMD"
    assert 0.6 <= result["prediction"]["confidence"] <= 0.9
    assert result["risk"]["score"] >= 60
    assert result["risk"]["level"] in {"HIGH", "CRITICAL"}
    assert result["zoonotic"]["flag"] is False
    assert DISCLAIMER in result["explanation"]
    joined = " ".join(result["explanation"]).lower()
    assert "diagnos" not in joined or "not a confirmed" in joined


def test_goat_ppr_pattern():
    result = analyze_health_event(
        species="goat",
        symptoms=["fever", "nasal_discharge", "diarrhea"],
        affected_count=10,
        death_count=2,
    )
    assert result["prediction"]["disease"] == "PPR"
    assert result["zoonotic"]["flag"] is False


def test_poultry_avian_influenza_zoonotic():
    result = analyze_health_event(
        species="poultry",
        symptoms=["respiratory_distress", "cough", "sudden_death"],
        affected_count=40,
        death_count=12,
    )
    assert result["prediction"]["disease"] == "Avian Influenza"
    assert result["zoonotic"]["flag"] is True
    assert result["risk"]["level"] in {"HIGH", "CRITICAL"}


def test_brucellosis_zoonotic_flag():
    result = analyze_health_event(
        species="buffalo",
        symptoms=["abortion", "retained_placenta", "fever"],
        affected_count=3,
        death_count=0,
    )
    assert result["prediction"]["disease"] == "Brucellosis"
    assert result["zoonotic"]["flag"] is True


def test_unknown_when_symptoms_too_weak():
    result = analyze_health_event(
        species="cattle",
        symptoms=["lethargy"],
        affected_count=1,
        death_count=0,
    )
    assert result["prediction"]["disease"] == "Unknown"
    assert result["prediction"]["confidence"] == 0.30
    assert result["risk"]["level"] in {"LOW", "MODERATE"}


def test_lsd_not_confused_with_fmd_when_skin_nodules_present():
    result = analyze_health_event(
        species="cattle",
        symptoms=["skin_nodules", "fever", "reduced_milk"],
        affected_count=5,
        death_count=0,
    )
    assert result["prediction"]["disease"] == "LSD"


def test_api_shape_matches_contract():
    result = analyze_health_event(
        species="sheep",
        symptoms=["mouth_sores", "scabs", "lips_lesions"],
        affected_count=2,
        death_count=0,
    )
    assert set(result) == {"prediction", "risk", "zoonotic", "explanation"}
    assert set(result["prediction"]) == {"disease", "confidence"}
    assert set(result["risk"]) == {"score", "level"}
    assert set(result["zoonotic"]) == {"flag"}
    assert isinstance(result["explanation"], list)
    assert 0 <= result["risk"]["score"] <= 100
