import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

# Optional: set this to enable smarter, LLM-powered CV parsing / explanations.
# Without it, the app runs fully on the rule-based skill/keyword engine below.
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
USE_LLM = bool(ANTHROPIC_API_KEY)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
