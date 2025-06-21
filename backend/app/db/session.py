from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool, StaticPool
from contextlib import contextmanager
from typing import Generator
import logging
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Create engine with appropriate configuration for SQLite or PostgreSQL
if settings.DATABASE_URL.startswith('sqlite'):
    # SQLite configuration (for development)
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=StaticPool,  # SQLite doesn't support connection pooling
        connect_args={"check_same_thread": False},  # Allow multiple threads
        echo=settings.DEBUG,  # Log SQL queries in debug mode
    )
else:
    # PostgreSQL configuration (for production)
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=QueuePool,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,
        pool_recycle=3600,  # Recycle connections after 1 hour
        echo=settings.DEBUG,  # Log SQL queries in debug mode
    )

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session.
    Automatically handles session lifecycle.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Context manager for database sessions.
    Use this for manual session management.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        logger.error(f"Database context error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db() -> None:
    """
    Initialize database tables.
    Call this on application startup.
    """
    from app.models.base import Base
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise

def check_db_connection() -> bool:
    """
    Check if database connection is working.
    Returns True if connection is successful, False otherwise.
    """
    try:
        with get_db_context() as db:
            db.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database connection check failed: {e}")
        return False

Base = declarative_base()
