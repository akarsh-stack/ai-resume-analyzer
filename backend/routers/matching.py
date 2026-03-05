from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from auth import get_current_user, require_role
from matching_engine import compute_match_score, build_faiss_index, search_similar_resumes
import models
import schemas

router = APIRouter(prefix="/api", tags=["Matching"])


@router.get("/jobs/{job_id}/matches", response_model=List[schemas.MatchResult])
def get_job_matches(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("recruiter")),
):
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Get all resumes
    resumes = db.query(models.Resume).all()
    if not resumes:
        return []

    results = []
    for resume in resumes:
        candidate_skills = [s.skill_name for s in resume.skills]
        match = compute_match_score(
            candidate_skills=candidate_skills,
            required_skills=job.required_skills or [],
            resume_text=resume.raw_text or "",
            job_description=job.description,
        )

        # Upsert match score
        existing = db.query(models.MatchScore).filter(
            models.MatchScore.resume_id == resume.id,
            models.MatchScore.job_id == job.id,
        ).first()

        if existing:
            existing.skill_match_score = match["skill_match_score"]
            existing.semantic_score = match["semantic_score"]
            existing.overall_score = match["overall_score"]
            existing.matched_skills = match["matched_skills"]
            existing.missing_skills = match["missing_skills"]
        else:
            db.add(models.MatchScore(
                resume_id=resume.id,
                job_id=job.id,
                skill_match_score=match["skill_match_score"],
                semantic_score=match["semantic_score"],
                overall_score=match["overall_score"],
                matched_skills=match["matched_skills"],
                missing_skills=match["missing_skills"],
            ))

        user = resume.user
        results.append(schemas.MatchResult(
            resume_id=resume.id,
            candidate_name=resume.parsed_name or user.full_name,
            candidate_email=resume.parsed_email or user.email,
            overall_score=match["overall_score"],
            skill_match_score=match["skill_match_score"],
            semantic_score=match["semantic_score"],
            matched_skills=match["matched_skills"],
            missing_skills=match["missing_skills"],
        ))

    db.commit()

    # Sort by overall score descending
    results.sort(key=lambda x: x.overall_score, reverse=True)
    return results


@router.get("/search/candidates")
def search_candidates(
    q: str = Query(..., description="Search query for finding candidates"),
    top_k: int = Query(10, le=50),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("recruiter")),
):
    # Rebuild FAISS index
    resumes = db.query(models.Resume).filter(models.Resume.embedding.isnot(None)).all()
    embeddings = [r.embedding for r in resumes]
    resume_ids = [r.id for r in resumes]

    if not embeddings:
        return []

    build_faiss_index(embeddings, resume_ids)
    search_results = search_similar_resumes(q, top_k=top_k)

    # Enrich results
    enriched = []
    for result in search_results:
        resume = db.query(models.Resume).filter(models.Resume.id == result["resume_id"]).first()
        if resume:
            enriched.append({
                "resume_id": resume.id,
                "candidate_name": resume.parsed_name or resume.user.full_name,
                "candidate_email": resume.parsed_email or resume.user.email,
                "similarity_score": result["similarity_score"],
                "skills": [s.skill_name for s in resume.skills],
            })

    return enriched
