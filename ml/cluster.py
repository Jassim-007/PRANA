"""Geospatial clustering of recent health events (DBSCAN + Haversine).

A cluster is a potential spatial grouping for early warning.
It is not a confirmed outbreak and is not clinically calibrated.
"""

from __future__ import annotations

from math import asin, cos, radians, sin, sqrt

EARTH_RADIUS_KM = 6371.0
DEFAULT_EPS_KM = 5.0
DEFAULT_MIN_SAMPLES = 3


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    rlat1, rlon1, rlat2, rlon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = rlat2 - rlat1
    dlon = rlon2 - rlon1
    a = sin(dlat / 2) ** 2 + cos(rlat1) * cos(rlat2) * sin(dlon / 2) ** 2
    return 2 * EARTH_RADIUS_KM * asin(sqrt(a))


def _cluster_risk(event_count: int, affected_count: int, death_count: int) -> str:
    score = min(event_count * 12, 40)
    score += min(affected_count * 2, 30)
    score += min(death_count * 10, 30)
    if score >= 80:
        return "CRITICAL"
    if score >= 60:
        return "HIGH"
    if score >= 35:
        return "MODERATE"
    return "LOW"


def _majority_disease(events: list[dict]) -> str | None:
    counts: dict[str, int] = {}
    for event in events:
        disease = event.get("disease") or event.get("possible_disease")
        if not disease or disease == "Unknown":
            continue
        counts[disease] = counts.get(disease, 0) + 1
    if not counts:
        return None
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]


def detect_clusters(
    events: list[dict],
    *,
    eps_km: float = DEFAULT_EPS_KM,
    min_samples: int = DEFAULT_MIN_SAMPLES,
) -> dict:
    """Cluster events that include latitude/longitude.

    Expected event keys: latitude, longitude, optional id, disease,
    affected_count, death_count.

    sklearn DBSCAN with metric='haversine' expects radians; eps is
    converted from kilometres.
    """
    usable: list[tuple[int, dict]] = []
    for index, event in enumerate(events or []):
        lat = event.get("latitude")
        lon = event.get("longitude")
        if lat is None or lon is None:
            continue
        try:
            lat_f = float(lat)
            lon_f = float(lon)
        except (TypeError, ValueError):
            continue
        if not (-90 <= lat_f <= 90 and -180 <= lon_f <= 180):
            continue
        usable.append((index, {**event, "latitude": lat_f, "longitude": lon_f}))

    if len(usable) < min_samples:
        return {"clusters": []}

    try:
        import numpy as np
        from sklearn.cluster import DBSCAN
    except ImportError:
        return {
            "clusters": [],
            "note": "scikit-learn is required for DBSCAN clustering",
        }

    coords = np.radians(
        np.array([[row[1]["latitude"], row[1]["longitude"]] for row in usable], dtype=float)
    )
    eps_rad = float(eps_km) / EARTH_RADIUS_KM
    labels = DBSCAN(
        eps=eps_rad,
        min_samples=min_samples,
        metric="haversine",
    ).fit_predict(coords)

    grouped: dict[int, list[dict]] = {}
    for label, (_index, event) in zip(labels, usable):
        if int(label) < 0:
            continue
        grouped.setdefault(int(label), []).append(event)

    clusters = []
    for order, label in enumerate(sorted(grouped.keys()), start=1):
        members = grouped[label]
        lats = [m["latitude"] for m in members]
        lons = [m["longitude"] for m in members]
        center_lat = sum(lats) / len(lats)
        center_lon = sum(lons) / len(lons)
        radius = max(
            haversine_km(center_lat, center_lon, m["latitude"], m["longitude"])
            for m in members
        )
        affected = sum(int(m.get("affected_count") or 0) for m in members)
        deaths = sum(int(m.get("death_count") or 0) for m in members)
        clusters.append(
            {
                "id": f"CL{order:03d}",
                "disease": _majority_disease(members),
                "latitude": round(center_lat, 6),
                "longitude": round(center_lon, 6),
                "radius_km": round(radius, 3),
                "event_count": len(members),
                "affected_count": affected,
                "risk_level": _cluster_risk(len(members), affected, deaths),
                "event_ids": [m.get("id") for m in members if m.get("id") is not None],
            }
        )

    return {"clusters": clusters}
