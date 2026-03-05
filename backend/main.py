import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import init_db
from routers import auth, resumes, jobs, matching, dashboard

app = FastAPI(
    title="AI Resume Analyzer",
    description="AI-powered resume analysis and job matching platform",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(jobs.router)
app.include_router(matching.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "AI Resume Analyzer is running"}


# ---- Serve the vanilla frontend ----
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

# Mount static subdirectories (css, js)
if FRONTEND_DIR.exists():
    app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js")), name="js")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    """Catch-all: serve index.html for the SPA (hash-based routing)."""
    index = FRONTEND_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {"detail": "Frontend not found"}
