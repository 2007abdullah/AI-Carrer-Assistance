from app.services.career_matcher import CAREERS_DB

# skills that commonly substitute for one another - a partial match softens the gap
RELATED = {
    "PostgreSQL": ["SQL", "MySQL"],
    "MySQL": ["SQL", "PostgreSQL"],
    "Docker": ["Kubernetes"],
    "REST APIs": ["Express", "FastAPI", "Django", "Flask"],
    "Authentication": ["REST APIs"],
}


def compute_skill_gap(career: str, user_skills: list[str]) -> list[dict]:
    if career not in CAREERS_DB:
        raise KeyError(f"Unknown career: {career}")
    required = CAREERS_DB[career]["skills"]
    user_skills_set = set(user_skills)

    gaps = []
    for skill, importance in required.items():
        if skill in user_skills_set:
            continue  # fully known, not a gap
        related_known = [r for r in RELATED.get(skill, []) if r in user_skills_set]
        proficiency = 50 if related_known else 0
        gaps.append({
            "skill": skill,
            "proficiency": proficiency,
            "gap": 100 - proficiency,
            "importance": importance,
        })

    # biggest true gaps (0% known, high importance) surface first
    gaps.sort(key=lambda g: (g["gap"], g["importance"]), reverse=True)
    return gaps
