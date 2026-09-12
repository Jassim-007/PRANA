from pydantic import BaseModel
from typing import List


class AIAnalyzeRequest(BaseModel):
    species: str
    symptoms: List[str]
    affected_count: int = 0
    death_count: int = 0