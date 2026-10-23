import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "FuturePath AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "futurepath_dev_secret_key_change_in_production_9384723984723")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for dev convenience
    
    # Database (uses /tmp on serverless environments like Vercel if not overridden)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:////tmp/futurepath.db" if os.getenv("VERCEL") else "sqlite:///./futurepath.db"
    )
    
    # Upload storage
    UPLOAD_DIR: str = os.getenv(
        "UPLOAD_DIR",
        "/tmp/uploads" if os.getenv("VERCEL") else "./uploads"
    )
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

settings = Settings()
