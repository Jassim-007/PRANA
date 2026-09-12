"""Public AI analysis entrypoint used by the backend adapter.

Output is decision support, not a confirmed diagnosis.
"""

from __future__ import annotations

import os

from ml.risk import compute_risk
from ml.rules import ZOONOTIC_DISEASES, match_disease
from ml.normalize import normalize_symptoms


def _try_random_forest(
    species: str,
    symptoms: list[str],
    affected_count: int,
    death_count: int,
    duration_days: int | None,
) -> dict | None:
    """Use a local scikit-learn model only when explicitly enabled.

    There is no suitable field dataset in this repo. The optional RF path
    is trained on synthetic rule-labeled samples and must not be described
    as clinical accuracy.
    """
    if os.getenv("PRANA_USE_RF", "").strip() not in {"1", "true", "TRUE", "yes"}:
        return None
    try:
        from ml.model import predict_with_forest
    except Exception:
        return None
    return predict_with_forest(
        species=species,
        symptoms=symptoms,
        affected_count=affected_count,
        death_count=death_count,
        duration_days=duration_days,
    )


def analyze_health_event(
    species: str,
    symptoms: list[str],
    affected_count: int,
    death_count: int,
    duration_days: int | None = None,
):
    rf_result = _try_random_forest(
        species,
        symptoms,
        affected_count,
        death_count,
        duration_days,
    )
    if rf_result is not None:
        matched = rf_result
    else:
        matched = match_disease(species, symptoms)

    disease = matched["disease"]
    confidence = float(matched["confidence"])
    zoonotic_flag = disease in ZOONOTIC_DISEASES
    symptoms_n = normalize_symptoms(symptoms)

    risk = compute_risk(
        affected_count=affected_count,
        death_count=death_count,
        confidence=confidence,
        symptom_count=len(symptoms_n),
        duration_days=duration_days,
        zoonotic=zoonotic_flag,
    )

    # Public API contract — do not add extra top-level keys.
    return {
        "prediction": {
            "disease": disease,
            "confidence": round(confidence, 2),
        },
        "risk": {
            "score": risk["score"],
            "level": risk["level"],
        },
        "zoonotic": {
            "flag": zoonotic_flag,
        },
        "explanation": list(matched["explanation"]),
    }
