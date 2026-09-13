"""Train an optional Random Forest on synthetic, rule-labeled samples.

This is NOT a field dataset. Do not report accuracy as clinical performance.
"""

from __future__ import annotations

from pathlib import Path

from ml.model import FEATURE_SYMPTOMS, MODEL_PATH, vectorize
from ml.rules import PROFILES, match_disease


def _synthetic_rows() -> list[dict]:
    rows: list[dict] = []
    for profile in PROFILES:
        species_list = sorted(profile.species)
        symptom_list = sorted(profile.symptoms)
        for species in species_list:
            # Positive-ish examples from the profile itself.
            for width in (2, 3, min(4, len(symptom_list))):
                symptoms = symptom_list[:width]
                if len(symptoms) < 2:
                    continue
                rows.append(
                    {
                        "species": species,
                        "symptoms": symptoms,
                        "affected_count": 4,
                        "death_count": 0,
                        "duration_days": 3,
                    }
                )
            # Mix with a generic fever so the forest sees noisy inputs.
            noisy = list(dict.fromkeys(symptom_list[:2] + ["fever"]))
            rows.append(
                {
                    "species": species,
                    "symptoms": noisy,
                    "affected_count": 6,
                    "death_count": 1,
                    "duration_days": 5,
                }
            )
        # Weak / unknown-like rows for that species group.
        rows.append(
            {
                "species": species_list[0],
                "symptoms": ["lethargy"],
                "affected_count": 1,
                "death_count": 0,
                "duration_days": 1,
            }
        )
    return rows


def train() -> Path:
    try:
        import joblib
        import numpy as np
        from sklearn.ensemble import RandomForestClassifier
    except ImportError as exc:
        raise SystemExit(
            "scikit-learn and joblib are required to train the optional model"
        ) from exc

    X = []
    y = []
    for row in _synthetic_rows():
        matched = match_disease(row["species"], row["symptoms"])
        X.append(
            vectorize(
                row["species"],
                row["symptoms"],
                row["affected_count"],
                row["death_count"],
                row["duration_days"],
            )
        )
        y.append(matched["disease"])

    model = RandomForestClassifier(
        n_estimators=80,
        random_state=42,
        min_samples_leaf=1,
    )
    model.fit(np.array(X), np.array(y))
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    labels = list(model.classes_)
    joblib.dump({"model": model, "labels": labels, "features": FEATURE_SYMPTOMS}, MODEL_PATH)
    print(f"Wrote {MODEL_PATH}")
    print("ASSUMPTION: labels come from the rule engine, not laboratory confirmation.")
    print("Do not cite training accuracy as real-world diagnostic performance.")
    return MODEL_PATH


if __name__ == "__main__":
    train()
