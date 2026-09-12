"""AI analysis adapter.

Disease and risk logic lives in ml/ (P5). Response shape stays on the
documented /api/ai/analyze contract. Output is decision support, not a
confirmed diagnosis.
"""

from ml.analyze import analyze_health_event

__all__ = ["analyze_health_event"]
