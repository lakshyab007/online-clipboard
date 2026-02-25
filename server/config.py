import os
from typing import List

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables"""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:root@localhost:5432/project"
    )

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")

    # Session
    SESSION_COOKIE_MAX_AGE: int = int(os.getenv("SESSION_COOKIE_MAX_AGE", "604800"))
    SESSION_COOKIE_SECURE: bool = (
        os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
    )
    SESSION_COOKIE_HTTPONLY: bool = (
        os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() == "true"
    )
    SESSION_COOKIE_SAMESITE: str = os.getenv("SESSION_COOKIE_SAMESITE", "lax")

    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "change-this-to-a-secure-random-string-in-production"
    )

    # Application
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"


# Create a single instance to use throughout the application
settings = Settings()