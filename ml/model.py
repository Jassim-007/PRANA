"""Optional Random Forest wrapper.

Enabled only when PRANA_USE_RF=1 and a local model file exists.
The bundled trainer uses synthetic rule-labeled rows — not field data.
"""

from __future__ import annotations

from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "artifacts" / "baseline_rf.joblib"

FEATURE_SYMPTOMS = [
    "mouth_lesions",
    "mouth_sores",
    "lameness",
    "fever",
    "excessive_salivation",
    "vesicles",
    "skin_nodules",
    "skin_lumps",
    "reduced_milk",
    "swollen_lymph_nodes",
    "abortion",
    "retained_placenta",
    "swollen_udder",
    "abnormal_milk",
    "cough",
    "nasal_discharge",
    "respiratory_distress",
    "sudden_death",
    "bleeding",
    "diarrhea",
    "scabs",
    "lips_lesions",
    "reduced_egg_production",
    "twisted_neck",
    "ruffled_feathers",
    "depression",
]

SPECIES_INDEX = {
    "cattle": 0,
    "buffalo": 1,
    "goat": 2,
    "sheep": 3,
    "poultry": 4,
}


def vectorize(
    species: str,
    symptoms: list[str],
    affected_count: int,
    death_count: int,
    duration_days: int | None,
) -> list[float]:
    from ml.normalize import normalize_species, normalize_symptoms

    species_n = normalize_species(species)
    symptom_set = set(normalize_symptoms(symptoms))
    features = [float(SPECIES_INDEX.get(species_n, -1))]
    features.extend(1.0 if name in symptom_set else 0.0 for name in FEATURE_SYMPTOMS)
    features.append(float(affected_count or 0))
    features.append(float(death_count or 0))
    features.append(float(duration_days or 0))
    return features


def predict_with_forest(
    species: str,
    symptoms: list[str],
    affected_count: int,
    death_count: int,
    duration_days: int | None,
) -> dict | None:
    if not MODEL_PATH.exists():
        return None

    try:
        import joblib
        import numpy as np
    except ImportError:
        return None

    payload = joblib.load(MODEL_PATH)
    model = payload["model"]
    labels = payload["labels"]
    X = np.array(
        [
            vectorize(
                species, symptoms, affected_count, death_count, duration_days
            )
        ]
    )
    proba = model.predict_proba(X)[0]
    index = int(proba.argmax())
    disease = labels[index]
    confidence = float(proba[index])
    # Bound confidence: this is a synthetic-data model, not a clinic score.
    confidence = min(max(confidence, 0.20), 0.85)

    from ml.rules import DISCLAIMER

    explanation = [
        f"Random Forest suggested {disease} from local synthetic training data",
        "This model is not trained on verified outbreak records",
        DISCLAIMER,
    ]
    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "explanation": explanation,
        "method": "random_forest_synthetic",
        "matched_symptoms": [],
        "alternatives": [],
    }
