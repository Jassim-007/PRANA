from ml.cluster import detect_clusters, haversine_km


def test_haversine_zero_for_same_point():
    assert haversine_km(10.0, 76.0, 10.0, 76.0) == 0


def test_nearby_events_form_a_cluster():
    result = detect_clusters(
        [
            {
                "id": "e1",
                "latitude": 10.125,
                "longitude": 76.459,
                "disease": "FMD",
                "affected_count": 8,
                "death_count": 1,
            },
            {
                "id": "e2",
                "latitude": 10.128,
                "longitude": 76.461,
                "disease": "FMD",
                "affected_count": 5,
                "death_count": 0,
            },
            {
                "id": "e3",
                "latitude": 10.122,
                "longitude": 76.455,
                "disease": "FMD",
                "affected_count": 6,
                "death_count": 1,
            },
            {
                "id": "far",
                "latitude": 18.52,
                "longitude": 73.85,
                "disease": "PPR",
                "affected_count": 2,
                "death_count": 0,
            },
        ],
        eps_km=5.0,
        min_samples=3,
    )
    assert len(result["clusters"]) == 1
    cluster = result["clusters"][0]
    assert cluster["event_count"] == 3
    assert cluster["disease"] == "FMD"
    assert cluster["affected_count"] == 19
    assert cluster["id"] == "CL001"
    assert "far" not in cluster["event_ids"]


def test_too_few_points_returns_empty():
    result = detect_clusters(
        [
            {"latitude": 10.1, "longitude": 76.4},
            {"latitude": 10.11, "longitude": 76.41},
        ]
    )
    assert result["clusters"] == []
