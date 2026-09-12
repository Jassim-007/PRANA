from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from backend.app.constants import SPECIES


class AIAnalyzeRequest(BaseModel):
    species: str
    symptoms: List[str]
    affected_count: int = Field(default=0, ge=0)
    death_count: int = Field(default=0, ge=0)
    duration_days: Optional[int] = None

    @field_validator("species")
    @classmethod
    def validate_species(cls, value: str) -> str:
        if value not in SPECIES:
            raise ValueError(f"species must be one of: {', '.join(SPECIES)}")
        return value