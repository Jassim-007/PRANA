from backend.app.services.geo_service import haversine_km, should_attempt_clustering
from backend.app.services.risk_service import should_create_alert, severity_from_risk_level


def test_haversine_zero_distance():
    assert haversine_km(10.0, 76.0, 10.0, 76.0) == 0


def test_clustering_skipped_without_disease_or_coords():
    assert should_attempt_clustering("Unknown", 10.0, 76.0) is False
    assert should_attempt_clustering("FMD", None, 76.0) is False
    assert should_attempt_clustering("FMD", 10.0, 76.0) is True


def test_alert_thresholds():
    assert should_create_alert("CRITICAL", 1) is True
    assert should_create_alert("LOW", 1) is False
    assert should_create_alert("LOW", 2) is True
    assert severity_from_risk_level("CRITICAL") == "critical"
