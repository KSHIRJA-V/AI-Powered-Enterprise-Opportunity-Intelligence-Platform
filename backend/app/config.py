import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "TransforMind AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment & Database
    ENV: str = os.getenv("ENV", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./transformind.db")
    
    # LLM Settings (OpenRouter / DeepSeek / Fallback)
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY", "")
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek/deepseek-chat")
    LLM_TEMPERATURE: float = 0.2
    
    # External APIs
    NEWS_API_KEY: Optional[str] = os.getenv("NEWS_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: Optional[str] = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    GITHUB_API_TOKEN: Optional[str] = os.getenv("GITHUB_API_TOKEN", "")
    
    # Qdrant Vector DB
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", ":memory:")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_COLLECTION: str = "enterprise_evidence"
    
    # Security & Guardrails
    ENABLE_PII_SCRUBBING: bool = True
    MIN_CREDIBILITY_THRESHOLD: float = 0.45
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
