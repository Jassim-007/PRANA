from ml.risk import compute_risk, risk_level_from_score


def test_risk_increases_with_deaths_and_confidence():
    low = compute_risk(
        affected_count=1,
        death_count=0,
        confidence=0.30,
        symptom_count=1,
    )
    high = compute_risk(
        affected_count=10,
        death_count=4,
        confidence=0.80,
        symptom_count=4,
        duration_days=12,
        zoonotic=True,
    )
    assert low["score"] < high["score"]
    assert high["level"] in {"HIGH", "CRITICAL"}
    assert 0 <= low["score"] <= 100
    assert 0 <= high["score"] <= 100


def test_risk_level_thresholds():
    assert risk_level_from_score(20) == "LOW"
    assert risk_level_from_score(35) == "MODERATE"
    assert risk_level_from_score(60) == "HIGH"
    assert risk_level_from_score(80) == "CRITICAL"
