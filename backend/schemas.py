from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ──────────── Auth Schemas ────────────
class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "candidate"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ──────────── Resume Schemas ────────────
class ResumeOut(BaseModel):
    id: int
    user_id: int
    filename: str
    parsed_name: Optional[str] = None
    parsed_email: Optional[str] = None
    parsed_experience: Optional[str] = None
    parsed_education: Optional[str] = None
    skills: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeDetail(ResumeOut):
    raw_text: Optional[str] = None


# ──────────── Job Schemas ────────────
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    experience_required: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None


class JobOut(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    required_skills: List[str]
    experience_required: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────── Match Schemas ────────────
class MatchResult(BaseModel):
    resume_id: int
    candidate_name: str
    candidate_email: str
    overall_score: float
    skill_match_score: float
    semantic_score: float
    matched_skills: List[str]
    missing_skills: List[str]


class SkillGap(BaseModel):
    skill: str
    candidates_with_skill: int
    total_candidates: int


# ──────────── Dashboard Schemas ────────────
class DashboardStats(BaseModel):
    total_candidates: int
    total_jobs: int
    avg_match_score: float
    top_skills: List[dict]
    score_distribution: List[dict]
