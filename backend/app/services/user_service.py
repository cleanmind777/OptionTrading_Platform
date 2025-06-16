from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.user_repository import get_user_by_username, create_user
from app.core.security import verify_password
from app.schemas.user import UserCreate
from app.models.user import User

def register_user(db: Session, user_create: UserCreate) -> User:
    existing_user = get_user_by_username(db, user_create.username)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    return create_user(db, user_create)

def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
