"""
Text -> list of recognized skills.

This is the "Python logic" half of the hybrid architecture from the plan:
deterministic keyword matching against a maintained skill dictionary.
It's fast, free, explainable, and good enough for an MVP demo. If
ANTHROPIC_API_KEY is set (see app/config.py), you can layer an LLM call on
top of this to catch skills phrased in ways the dictionary misses -
call llm_extractor.enrich_skills(text, found_skills) from the route and
merge the results.
"""
import json
import re
from app.config import DATA_DIR

with open(DATA_DIR / "skills.json") as f:
    SKILLS_DB: dict = json.load(f)


def extract_skills_from_text(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for skill_name, meta in SKILLS_DB.items():
        for keyword in meta["keywords"]:
            # word-boundary match so "java" doesn't match inside "javascript"
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(keyword) + r"(?![a-zA-Z0-9])"
            if re.search(pattern, text_lower):
                found.append(skill_name)
                break
    return sorted(set(found))


def detect_sections(text: str) -> dict:
    """Very lightweight section detector used by the CV analyzer."""
    text_lower = text.lower()
    return {
        "education": bool(re.search(r"\beducation\b|\buniversity\b|\bdegree\b", text_lower)),
        "experience": bool(re.search(r"\bexperience\b|\binternship\b|\bworked at\b", text_lower)),
        "projects": bool(re.search(r"\bprojects?\b", text_lower)),
        "certifications": bool(re.search(r"\bcertificat", text_lower)),
        "contact": bool(re.search(r"@|\bphone\b|\blinkedin\b|\bgithub\b", text_lower)),
    }
