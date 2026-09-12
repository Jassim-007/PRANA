from pydantic import BaseModel, Field
from typing import List, Optional


class HealthEventCreate(BaseModel):
    farm_id: str
    source: str
    species: str
    event_type: str
    symptoms: List[str] = []
    affected_count: int = Field(default=0, ge=0)
    death_count: int = Field(default=0, ge=0)
    duration_days: Optional[int] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class HealthEventResponse(HealthEventCreate):
    id: str
    status: str
    created_at: str