from backend.app.constants import RISK_LEVELS

RISK_RANK = {level: index for index, level in enumerate(RISK_LEVELS)}


def higher_risk_level(left: str | None, right: str | None) -> str | None:
    if left is None:
        return right
    if right is None:
        return left
    if RISK_RANK.get(right, -1) > RISK_RANK.get(left, -1):
        return right
    return left


def should_create_alert(risk_level: str | None, cluster_event_count: int = 0) -> bool:
    if risk_level in ("HIGH", "CRITICAL"):
        return True
    return cluster_event_count >= 2


def severity_from_risk_level(risk_level: str | None) -> str:
    if risk_level == "CRITICAL":
        return "critical"
    if risk_level == "HIGH":
        return "high"
    if risk_level == "MODERATE":
        return "moderate"
    return "low"
