from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
import json

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_create: UserCreate):
    db_user = User(
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

def user_update_last_login_time(db: Session, email: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.last_login_time = func.now()
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_phone_number(db: Session, email: str, phone_number: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.phone_number = phone_number
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_email_preferences(db: Session, email: str, email_preferences: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.email_preferences = email_preferences
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_account_access_settings(db: Session, email: str, account_access_settings: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.account_access_settings = account_access_settings
    db.commit()
    db.refresh(db_user)
    return db_user