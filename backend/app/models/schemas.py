from pydantic import BaseModel
from typing import Optional


class JobMatchRequest(BaseModel):
    resume_id: str
    job_description: str


class RoadmapRequest(BaseModel):
    resume_id: str
    career: str
    weeks: Optional[int] = 8


class CareerSelectRequest(BaseModel):
    resume_id: str
    career: str
