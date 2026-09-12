from typing import Optional

from pydantic import BaseModel, Field, field_validator

from backend.app.constants import VET_DECISIONS


class VetFeedbackCreate(BaseModel):
    vet_id: str = Field(min_length=1, max_length=100)
    decision: str
    notes: Optional[str] = None
    action_taken: Optional[str] = None

    @field_validator("decision")
    @classmethod
    def validate_decision(cls, value: str) -> str:
        if value not in VET_DECISIONS:
            raise ValueError(f"decision must be one of: {', '.join(VET_DECISIONS)}")
        return value
