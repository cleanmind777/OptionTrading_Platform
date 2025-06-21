from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Option Trading Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = Field(False, env="DEBUG")
    
    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    DATABASE_POOL_SIZE: int = Field(20, env="DATABASE_POOL_SIZE")
    DATABASE_MAX_OVERFLOW: int = Field(30, env="DATABASE_MAX_OVERFLOW")
    
    # Security
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = Field(
        ["http://localhost:3000", "http://localhost:5173"],
        env="BACKEND_CORS_ORIGINS"
    )
    
    # Redis (for caching and session storage)
    REDIS_URL: Optional[str] = Field(None, env="REDIS_URL")
    
    # Cookie Settings
    COOKIE_SECURE: bool = Field(True, env="COOKIE_SECURE")
    COOKIE_HTTPONLY: bool = Field(True, env="COOKIE_HTTPONLY")
    COOKIE_SAMESITE: str = Field("lax", env="COOKIE_SAMESITE")
    COOKIE_DOMAIN: Optional[str] = Field(None, env="COOKIE_DOMAIN")
    
    # Session Settings
    SESSION_EXPIRE_MINUTES: int = Field(60, env="SESSION_EXPIRE_MINUTES")
    
    # Logging
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    LOG_FORMAT: str = Field("json", env="LOG_FORMAT")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(60, env="RATE_LIMIT_PER_MINUTE")
    
    # Email (for notifications)
    SMTP_HOST: Optional[str] = Field(None, env="SMTP_HOST")
    SMTP_PORT: int = Field(587, env="SMTP_PORT")
    SMTP_USER: Optional[str] = Field(None, env="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(None, env="SMTP_PASSWORD")
    
    # Trading API (for broker integration)
    TRADING_API_KEY: Optional[str] = Field(None, env="TRADING_API_KEY")
    TRADING_API_SECRET: Optional[str] = Field(None, env="TRADING_API_SECRET")
    TRADING_API_URL: Optional[str] = Field(None, env="TRADING_API_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Global settings instance
settings = get_settings()
