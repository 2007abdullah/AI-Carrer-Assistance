import re
from app.services.skill_extractor import detect_sections

# Rough calibration constant: how many distinct recognized skills counts as "excellent"
SKILL_CEILING = 14


def _count_projects(text: str) -> int:
    # counts bullet-like lines following a "projects" heading, capped generously
    matches = re.findall(r"(?im)^\s*[\-\*•]\s+.+$", text)
    return len(matches)


def _clip(value: float, low: float = 0, high: float = 100) -> float:
    return max(low, min(high, value))


def analyze_cv(text: str, skills: list[str]) -> dict:
    sections = detect_sections(text)
    project_lines = _count_projects(text)

    technical_skills_score = _clip(len(skills) / SKILL_CEILING * 100)
    projects_score = _clip(30 + project_lines * 6) if sections["projects"] else _clip(project_lines * 6)
    experience_score = 75 if sections["experience"] else 25
    education_score = 85 if sections["education"] else 30
    structure_score = _clip(
        20
        + (20 if sections["education"] else 0)
        + (20 if sections["experience"] else 0)
        + (20 if sections["projects"] else 0)
        + (20 if sections["contact"] else 0)
    )

    scores = {
        "Technical Skills": round(technical_skills_score),
        "Projects": round(projects_score),
        "Experience": round(experience_score),
        "Education": round(education_score),
        "CV Structure": round(structure_score),
    }

    strengths = []
    improvements = []

    if len(skills) >= 6:
        strengths.append("Strong, varied technical skill set")
    if "React" in skills or "JavaScript" in skills:
        strengths.append("Solid frontend fundamentals")
    if project_lines >= 4:
        strengths.append("Multiple concrete projects listed")
    if any(s in skills for s in ("SQL", "PostgreSQL", "MongoDB", "MySQL")):
        strengths.append("Database experience on the resume")
    if not strengths:
        strengths.append("CV successfully parsed - add more detail to surface more strengths")

    if not sections["experience"]:
        improvements.append("No work experience or internship section detected")
    if not any(s in skills for s in ("SQL", "PostgreSQL", "MongoDB", "MySQL")):
        improvements.append("No database skills or projects mentioned")
    if "Docker" not in skills and "Kubernetes" not in skills:
        improvements.append("No deployment/DevOps tooling mentioned")
    if not sections["contact"]:
        improvements.append("No GitHub/LinkedIn/contact links found")
    if "Testing" not in skills:
        improvements.append("No testing experience mentioned")
    if not improvements:
        improvements.append("Resume looks well-rounded - consider quantifying project impact with numbers")

    return {
        "scores": scores,
        "overall": round(sum(scores.values()) / len(scores)),
        "strengths": strengths[:5],
        "improvements": improvements[:5],
    }
