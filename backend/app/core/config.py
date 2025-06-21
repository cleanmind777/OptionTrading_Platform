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

    class Config:
        # Path to the .env file (relative to project root)
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"

# Create a singleton settings instance to be imported and used throughout the app
settings = Settings()
