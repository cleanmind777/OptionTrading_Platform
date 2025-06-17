from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user_create: UserCreate):
    db_user = User(
        username=user_create.username,
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.first_name,
        phone_number=user_create.phone_number,
        hashed_password=hash_password(user_create.password),
        disabled=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
