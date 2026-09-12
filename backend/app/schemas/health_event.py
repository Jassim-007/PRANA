from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from backend.app.constants import EVENT_TYPES, SOURCES, SPECIES


class HealthEventCreate(BaseModel):
    farm_id: UUID
    source: str
    species: str
    event_type: str
    symptoms: List[str] = []
    affected_count: int = Field(default=0, ge=0)
    death_count: int = Field(default=0, ge=0)
    duration_days: Optional[int] = Field(default=None, ge=0, le=3650)
    notes: Optional[str] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)

    @field_validator("source")
    @classmethod
    def validate_source(cls, value: str) -> str:
        if value not in SOURCES:
            raise ValueError(f"source must be one of: {', '.join(SOURCES)}")
        return value

    @field_validator("species")
    @classmethod
    def validate_species(cls, value: str) -> str:
        if value not in SPECIES:
            raise ValueError(f"species must be one of: {', '.join(SPECIES)}")
        return value

    @field_validator("event_type")
    @classmethod
    def validate_event_type(cls, value: str) -> str:
        if value not in EVENT_TYPES:
            raise ValueError(f"event_type must be one of: {', '.join(EVENT_TYPES)}")
        return value

    @model_validator(mode="after")
    def coordinates_must_be_paired(self):
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError("latitude and longitude must both be provided together")
        return self


class HealthEventResponse(BaseModel):
    id: str
    farm_id: str
    source: str
    species: str
    event_type: str
    symptoms: list = []
    affected_count: int = 0
    death_count: int = 0
    duration_days: Optional[int] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str
    created_at: str
