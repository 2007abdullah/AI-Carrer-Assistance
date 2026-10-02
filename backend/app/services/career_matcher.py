import json
from app.config import DATA_DIR

with open(DATA_DIR / "careers.json") as f:
    CAREERS_DB: dict = json.load(f)


def match_careers(user_skills: list[str]) -> list[dict]:
    user_skills_set = set(user_skills)
    results = []
    for career, meta in CAREERS_DB.items():
        required = meta["skills"]
        total_weight = sum(required.values())
        matched_weight = sum(w for s, w in required.items() if s in user_skills_set)
        compatibility = round((matched_weight / total_weight) * 100) if total_weight else 0
        results.append({
            "career": career,
            "description": meta["description"],
            "compatibility": compatibility,
        })
    return sorted(results, key=lambda r: r["compatibility"], reverse=True)


def career_detail(career: str, user_skills: list[str]) -> dict:
    if career not in CAREERS_DB:
        raise KeyError(f"Unknown career: {career}")
    required = CAREERS_DB[career]["skills"]
    user_skills_set = set(user_skills)
    current = [s for s in required if s in user_skills_set]
    missing = [s for s in required if s not in user_skills_set]
    # order missing by importance (highest weight first) - matches roadmap ordering
    missing.sort(key=lambda s: required[s], reverse=True)
    return {
        "career": career,
        "description": CAREERS_DB[career]["description"],
        "current_skills": current,
        "missing_skills": missing,
    }
