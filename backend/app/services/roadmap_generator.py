from app.services.career_matcher import career_detail

# rough topic groupings so weeks read like a real curriculum rather than one skill per week
TOPIC_NOTES = {
    "SQL": "SQL fundamentals - queries, joins, indexing",
    "PostgreSQL": "PostgreSQL setup, schema design, migrations",
    "REST APIs": "Designing and consuming REST APIs",
    "Authentication": "Auth: JWT, sessions, OAuth basics",
    "Docker": "Containerizing your app with Docker",
    "Testing": "Automated testing: unit + integration",
    "Node.js": "Node.js fundamentals & Express basics",
    "Kubernetes": "Kubernetes fundamentals for deployment",
    "CI/CD": "Building a CI/CD pipeline",
    "Machine Learning": "ML fundamentals with scikit-learn",
    "Deep Learning": "Neural networks with PyTorch/TensorFlow",
    "Data Visualization": "Charting with Recharts/Matplotlib",
    "Data Analysis": "Data wrangling with pandas",
}


def generate_roadmap(career: str, user_skills: list[str], weeks: int = 8) -> dict:
    detail = career_detail(career, user_skills)
    missing = detail["missing_skills"]

    if not missing:
        return {
            "career": career,
            "message": f"You already cover every core skill for {career}. Consider a capstone project instead.",
            "weeks": [],
            "already_known": detail["current_skills"],
        }

    # spread missing skills across the requested number of weeks, capstone last
    working_weeks = max(weeks - 1, 1)
    per_week = max(1, -(-len(missing) // working_weeks))  # ceil division
    plan = []
    week_num = 1
    for i in range(0, len(missing), per_week):
        chunk = missing[i:i + per_week]
        topics = [TOPIC_NOTES.get(s, f"{s} fundamentals") for s in chunk]
        plan.append({"week": week_num, "skills": chunk, "focus": topics})
        week_num += 1

    plan.append({"week": week_num, "skills": [], "focus": [f"Capstone project applying all of: {', '.join(missing)}"]})

    return {
        "career": career,
        "already_known": detail["current_skills"],
        "skipped_note": f"You already know {', '.join(detail['current_skills'])}, so those are skipped."
                         if detail["current_skills"] else None,
        "weeks": plan,
    }
