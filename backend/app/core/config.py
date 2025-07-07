from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    debug: bool = False
    # Database connection URL
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # Secret key for JWT signing
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    
    # JWT token expiration time in minutes
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Algorithm used for JWT encoding
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    
    FRONTEND_URL: str = Field("http://localhost:5173", env="FRONTEND_URL")
    
    EMAILJS_SERVICE_ID: str = Field(env="EMAILJS_SERVICE_ID")
    
    EMAILJS_RESET_TEMPLATE_ID: str = Field(env="EMAILJS_RESET_TEMPLATE_ID")
    
    EMAILJS_PUBLIC_KEY: str = Field(env="EMAILJS_PUBLIC_KEY")
    
    EMAILJS_RRIVATE_KEY: str = Field(env="EMAILJS_RRIVATE_KEY")

    class Config:
        # Path to the .env file (relative to project root)
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"

# Create a singleton settings instance to be imported and used throughout the app
settings = Settings()
