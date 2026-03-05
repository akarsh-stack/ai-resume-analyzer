from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter
from database import get_db
from auth import require_role
import models
import schemas

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("recruiter")),
):
    total_candidates = db.query(models.Resume).count()
    total_jobs = db.query(models.Job).filter(
        models.Job.recruiter_id == current_user.id
    ).count()

    # Average match score across this recruiter's jobs
    avg_score = (
        db.query(func.avg(models.MatchScore.overall_score))
        .join(models.Job)
        .filter(models.Job.recruiter_id == current_user.id)
        .scalar()
    ) or 0.0

    # Top skills across all candidates
    all_skills = db.query(models.CandidateSkill.skill_name).all()
    skill_counter = Counter(s[0] for s in all_skills)
    top_skills = [
        {"name": skill, "count": count}
        for skill, count in skill_counter.most_common(10)
    ]

    # Score distribution for this recruiter's jobs
    scores = (
        db.query(models.MatchScore.overall_score)
        .join(models.Job)
        .filter(models.Job.recruiter_id == current_user.id)
        .all()
    )
    # Bucket into ranges
    buckets = {"0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0}
    for (score,) in scores:
        if score < 20:
            buckets["0-20"] += 1
        elif score < 40:
            buckets["20-40"] += 1
        elif score < 60:
            buckets["40-60"] += 1
        elif score < 80:
            buckets["60-80"] += 1
        else:
            buckets["80-100"] += 1

    score_distribution = [
        {"range": k, "count": v} for k, v in buckets.items()
    ]

    return schemas.DashboardStats(
        total_candidates=total_candidates,
        total_jobs=total_jobs,
        avg_match_score=round(avg_score, 2),
        top_skills=top_skills,
        score_distribution=score_distribution,
    )
