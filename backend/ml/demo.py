"""Print sample analyses for demo verification."""

from ml.analyze import analyze_health_event
from ml.cluster import detect_clusters

SAMPLES = [
    {
        "name": "cattle FMD-like",
        "payload": {
            "species": "cattle",
            "symptoms": ["fever", "mouth_lesions", "lameness"],
            "affected_count": 8,
            "death_count": 1,
            "duration_days": 2,
        },
    },
    {
        "name": "goat PPR-like",
        "payload": {
            "species": "goat",
            "symptoms": ["fever", "nasal_discharge", "diarrhea"],
            "affected_count": 12,
            "death_count": 2,
            "duration_days": 4,
        },
    },
    {
        "name": "poultry AI-like (zoonotic flag)",
        "payload": {
            "species": "poultry",
            "symptoms": ["respiratory_distress", "sudden_death", "cough"],
            "affected_count": 40,
            "death_count": 15,
            "duration_days": 2,
        },
    },
    {
        "name": "weak / unknown",
        "payload": {
            "species": "cattle",
            "symptoms": ["lethargy"],
            "affected_count": 1,
            "death_count": 0,
            "duration_days": 1,
        },
    },
]


def main() -> None:
    print("PRANA ML samples - decision support, not diagnosis\n")
    for sample in SAMPLES:
        result = analyze_health_event(**sample["payload"])
        print(f"== {sample['name']} ==")
        print(result)
        print()

    clustered = detect_clusters(
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
                "id": "e4",
                "latitude": 11.50,
                "longitude": 77.20,
                "disease": "PPR",
                "affected_count": 3,
                "death_count": 0,
            },
        ]
    )
    print("== DBSCAN sample ==")
    print(clustered)


if __name__ == "__main__":
    main()
