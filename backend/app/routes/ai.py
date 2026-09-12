from fastapi import APIRouter

from backend.app.schemas.ai import AIAnalyzeRequest
from backend.app.services.ai_service import analyze_health_event

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Analysis"]
)


@router.post("/analyze")
def analyze(request: AIAnalyzeRequest):

    result = analyze_health_event(
        species=request.species,
        symptoms=request.symptoms,
        affected_count=request.affected_count,
        death_count=request.death_count,
    )

    return result