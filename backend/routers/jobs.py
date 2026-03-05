from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user, require_role
import models
import schemas

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("", response_model=schemas.JobOut)
def create_job(
    job_data: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("recruiter")),
):
    job = models.Job(
        recruiter_id=current_user.id,
        title=job_data.title,
        description=job_data.description,
        required_skills=job_data.required_skills,
        experience_required=job_data.experience_required,
        location=job_data.location,
        salary_range=job_data.salary_range,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return schemas.JobOut.model_validate(job)


@router.get("", response_model=List[schemas.JobOut])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role == "recruiter":
        jobs = db.query(models.Job).filter(models.Job.recruiter_id == current_user.id).order_by(models.Job.created_at.desc()).all()
    else:
        jobs = db.query(models.Job).filter(models.Job.status == "active").order_by(models.Job.created_at.desc()).all()
    return [schemas.JobOut.model_validate(j) for j in jobs]


@router.get("/{job_id}", response_model=schemas.JobOut)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schemas.JobOut.model_validate(job)


@router.delete("/{job_id}")
def delete_job(
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

    db.delete(job)
    db.commit()
    return {"detail": "Job deleted"}
