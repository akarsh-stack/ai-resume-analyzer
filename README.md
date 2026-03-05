# AI Resume Analyzer & Job Matcher

An AI-powered full-stack platform that automatically analyzes resumes, extracts skills, matches candidates with job descriptions using NLP and semantic similarity, and ranks candidates for recruiters.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML/CSS/JS, Chart.js (CDN), no build tools |
| **Backend** | Python FastAPI, SQLAlchemy, JWT Auth |
| **AI/NLP** | spaCy, Sentence Transformers (all-MiniLM-L6-v2), scikit-learn |
| **Vector Search** | FAISS |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Deployment** | Docker, Docker Compose |

## Features

- **Resume Upload & Parsing** – PDF/DOCX upload with automatic text extraction
- **AI Skill Extraction** – 90+ skill database with NLP-based detection
- **Job Description Management** – Create and manage job postings with required skills
- **AI Matching Engine** – Combines skill overlap (60%) + semantic similarity (40%)
- **Candidate Ranking** – Ranked candidate list per job with match percentages
- **Skill Gap Analysis** – Shows missing skills and AI recommendations
- **Semantic Search** – FAISS-powered natural language candidate search
- **Data Visualization** – Chart.js charts for skills and score distribution
- **Dark/Light Mode** – Full theme support with smooth transitions
- **Role-Based Auth** – Separate flows for Recruiters and Candidates

## Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- **No Node.js required** — the frontend is pure HTML/CSS/JS served by the backend

### Setup & Run

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Run the server (serves both API and frontend)
uvicorn main:app --reload --port 8000
```

Open `http://localhost:8000` — both the frontend and API are served from the same server.

API docs available at `http://localhost:8000/docs`.

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── main.py              # FastAPI entrypoint + static file serving
│   ├── config.py             # Settings & environment
│   ├── database.py           # SQLAlchemy engine
│   ├── models.py             # DB models (User, Resume, Job, etc.)
│   ├── schemas.py            # Pydantic schemas
│   ├── auth.py               # JWT authentication
│   ├── resume_parser.py      # PDF/DOCX parsing with spaCy
│   ├── skill_extractor.py    # Skill database & NLP extraction
│   ├── matching_engine.py    # AI matching + FAISS vector search
│   ├── routers/              # API route handlers
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html            # Single-page HTML shell
│   ├── css/styles.css        # Full design system (glassmorphism, dark mode)
│   └── js/
│       ├── api.js            # Fetch-based API layer with JWT
│       ├── auth.js           # Auth state management
│       ├── router.js         # Hash-based SPA router
│       ├── icons.js          # SVG icon library
│       ├── app.js            # Main initializer, navbar, theme
│       └── pages/            # Page modules (landing, login, signup, etc.)
├── docker-compose.yml
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/resumes/upload` | Upload resume (candidate) |
| GET | `/api/resumes/me` | Get my resume |
| POST | `/api/jobs` | Create job (recruiter) |
| GET | `/api/jobs` | List jobs |
| GET | `/api/jobs/{id}` | Get job detail |
| DELETE | `/api/jobs/{id}` | Delete job |
| GET | `/api/jobs/{id}/matches` | AI-ranked candidates |
| GET | `/api/search/candidates` | Semantic search |
| GET | `/api/dashboard/stats` | Dashboard analytics |

## AI Matching Algorithm

```
Overall Score = 0.6 × Skill Match Score + 0.4 × Semantic Similarity Score
```

- **Skill Match Score**: `(matched_skills / required_skills) × 100`
- **Semantic Similarity**: Cosine similarity between resume and job description embeddings (Sentence Transformers)
- **FAISS Search**: Inner product search on normalized resume embeddings for semantic candidate search
