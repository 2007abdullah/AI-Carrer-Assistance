"""
Simple in-memory store so the MVP runs with zero database setup.
Swap this for real PostgreSQL calls (see /database/schema.sql) once
you get to Phase 5 of the roadmap - the function signatures below are
written so that swap doesn't touch any route code.
"""
import uuid
from typing import Optional

_RESUMES: dict[str, dict] = {}


def save_resume(filename: str, extracted_text: str, skills: list[str]) -> str:
    resume_id = str(uuid.uuid4())
    _RESUMES[resume_id] = {
        "id": resume_id,
        "filename": filename,
        "extracted_text": extracted_text,
        "skills": skills,
    }
    return resume_id


def get_resume(resume_id: str) -> Optional[dict]:
    return _RESUMES.get(resume_id)
