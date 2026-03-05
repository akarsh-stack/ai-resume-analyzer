import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models
import schemas
from resume_parser import parse_resume
from skill_extractor import extract_skills
from matching_engine import generate_embedding
from config import settings

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


@router.post("/upload", response_model=schemas.ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can upload resumes")

    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("pdf", "docx"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    # Save file
    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Parse resume
    try:
        parsed = parse_resume(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

    # Generate embedding
    embedding = None
    if parsed["raw_text"]:
        try:
            embedding = generate_embedding(parsed["raw_text"])
        except Exception:
            pass

    # Delete old resumes for this user
    old_resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    for old in old_resumes:
        db.delete(old)

    # Create resume record
    resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        raw_text=parsed["raw_text"],
        parsed_name=parsed["name"],
        parsed_email=parsed["email"],
        parsed_experience=parsed["experience"],
        parsed_education=parsed["education"],
        embedding=embedding,
    )
    db.add(resume)
    db.flush()

    # Extract and store skills
    skills = extract_skills(parsed["raw_text"])
    for skill_name in skills:
        db.add(models.CandidateSkill(resume_id=resume.id, skill_name=skill_name))

    db.commit()
    db.refresh(resume)

    return schemas.ResumeOut(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        parsed_name=resume.parsed_name,
        parsed_email=resume.parsed_email,
        parsed_experience=resume.parsed_experience,
        parsed_education=resume.parsed_education,
        skills=[s.skill_name for s in resume.skills],
        created_at=resume.created_at,
    )


@router.get("/me", response_model=schemas.ResumeDetail)
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")

    return schemas.ResumeDetail(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        raw_text=resume.raw_text,
        parsed_name=resume.parsed_name,
        parsed_email=resume.parsed_email,
        parsed_experience=resume.parsed_experience,
        parsed_education=resume.parsed_education,
        skills=[s.skill_name for s in resume.skills],
        created_at=resume.created_at,
    )
