import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Resume Analyzer"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-abc123xyz")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./resume_analyzer.db"
    )

    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")

    # AI Model settings
    SPACY_MODEL: str = "en_core_web_sm"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"


settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
