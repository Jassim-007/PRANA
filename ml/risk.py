"""Risk score 0–100 from symptoms, counts, and model confidence.

Not clinically calibrated. Used only for demo triage ranking.
"""

from __future__ import annotations


def risk_level_from_score(score: int) -> str:
    if score >= 80:
        return "CRITICAL"
    if score >= 60:
        return "HIGH"
    if score >= 35:
        return "MODERATE"
    return "LOW"


def compute_risk(
    *,
    affected_count: int,
    death_count: int,
    confidence: float,
    symptom_count: int = 0,
    duration_days: int | None = None,
    zoonotic: bool = False,
) -> dict:
    affected = max(int(affected_count or 0), 0)
    deaths = max(int(death_count or 0), 0)

    score = 20
    score += min(affected * 5, 30)
    score += min(deaths * 15, 30)

    if confidence >= 0.75:
        score += 15
    elif confidence >= 0.60:
        score += 10

    # Symptom breadth is a weak extra signal (capped).
    score += min(max(symptom_count - 1, 0) * 2, 8)

    if duration_days is not None:
        days = max(int(duration_days), 0)
        if days >= 10:
            score += 8
        elif days >= 5:
            score += 5

    if affected > 0 and deaths / affected >= 0.25:
        score += 8

    if zoonotic:
        score += 5

    score = min(int(score), 100)
    return {
        "score": score,
        "level": risk_level_from_score(score),
    }
