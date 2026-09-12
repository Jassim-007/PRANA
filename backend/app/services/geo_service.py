import math

CLUSTER_RADIUS_KM = 5.0
LOOKBACK_DAYS = 14


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return 2 * radius * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def should_attempt_clustering(disease: str | None, latitude: float | None, longitude: float | None) -> bool:
    if latitude is None or longitude is None:
        return False
    if not disease or disease == "Unknown":
        return False
    return True
