from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.models.schemas import JobMatchRequest, RoadmapRequest, CareerSelectRequest
from app.services.pdf_extractor import extract_pdf_text
from app.services.skill_extractor import extract_skills_from_text
from app.services.cv_analyzer import analyze_cv
from app.services.career_matcher import match_careers, career_detail, CAREERS_DB
from app.services.skill_gap import compute_skill_gap
from app.services.job_matcher import match_job
from app.services.roadmap_generator import generate_roadmap
from app import storage

app = FastAPI(title="AI Career Advisor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_resume_or_404(resume_id: str) -> dict:
    resume = storage.get_resume(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found. Upload a CV first.")
    return resume


@app.get("/")
def root():
    return {"status": "ok", "service": "AI Career Advisor API"}


# ---- Feature 1: CV Upload ----------------------------------------------
@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    file_bytes = await file.read()
    text = extract_pdf_text(file_bytes)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from this PDF (is it a scanned image?).")

    skills = extract_skills_from_text(text)
    resume_id = storage.save_resume(file.filename, text, skills)

    return {"resume_id": resume_id, "filename": file.filename, "skills": skills}


@app.get("/resume/{resume_id}")
def get_resume(resume_id: str):
    return _get_resume_or_404(resume_id)


# ---- Feature 2: CV Analysis --------------------------------------------
@app.get("/resume/{resume_id}/analyze")
def analyze_resume(resume_id: str):
    resume = _get_resume_or_404(resume_id)
    return analyze_cv(resume["extracted_text"], resume["skills"])


# ---- Feature 3: Career Recommendation ----------------------------------
@app.get("/careers")
def list_careers():
    return [{"career": name, "description": meta["description"]} for name, meta in CAREERS_DB.items()]


@app.get("/career/match/{resume_id}")
def career_match(resume_id: str):
    resume = _get_resume_or_404(resume_id)
    return match_careers(resume["skills"])


@app.post("/career/detail")
def career_detail_route(payload: CareerSelectRequest):
    resume = _get_resume_or_404(payload.resume_id)
    try:
        return career_detail(payload.career, resume["skills"])
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---- Feature 2 (cont.): Skill Gap ---------------------------------------
@app.post("/skills/gap")
def skill_gap_route(payload: CareerSelectRequest):
    resume = _get_resume_or_404(payload.resume_id)
    try:
        return compute_skill_gap(payload.career, resume["skills"])
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---- Feature 5: Job Description Matcher ---------------------------------
@app.post("/job/match")
def job_match_route(payload: JobMatchRequest):
    resume = _get_resume_or_404(payload.resume_id)
    return match_job(resume["skills"], payload.job_description)


# ---- Feature 4: Personalized Learning Roadmap ---------------------------
@app.post("/roadmap/generate")
def roadmap_route(payload: RoadmapRequest):
    resume = _get_resume_or_404(payload.resume_id)
    try:
        return generate_roadmap(payload.career, resume["skills"], payload.weeks or 8)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
