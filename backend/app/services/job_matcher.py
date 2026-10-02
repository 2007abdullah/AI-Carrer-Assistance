from app.services.skill_extractor import extract_skills_from_text


def match_job(resume_skills: list[str], job_description: str) -> dict:
    job_skills = extract_skills_from_text(job_description)
    resume_set = set(resume_skills)

    matched = [s for s in job_skills if s in resume_set]
    missing = [s for s in job_skills if s not in resume_set]

    overall = round((len(matched) / len(job_skills)) * 100) if job_skills else 0

    return {
        "overall_match": overall,
        "required_skills_found_in_posting": job_skills,
        "matched": matched,
        "missing": missing,
        "next_steps": missing[:3],
    }
