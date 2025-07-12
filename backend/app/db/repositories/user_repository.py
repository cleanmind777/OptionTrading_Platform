from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
import json
import secrets

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, id: str):
    return db.query(User).filter(User.id == id).first()

def create_user(db: Session, user_create: UserCreate):
    db_user = User(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
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

def user_update_phone_number(db: Session, email: str, new_phone_number: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.phone_number = new_phone_number
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

def user_update_social_account(db: Session, email: str, social_account: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.social_account = social_account
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_user_preferences(db: Session, email: str, user_preferences: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.user_preferences = user_preferences
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_bot_preferences(db: Session, email: str, bot_preferences: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.bot_preferences = bot_preferences
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_preferences(db: Session, email: str, user_preferences: json, bot_preferences: json):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.bot_preferences = bot_preferences
    db_user.user_preferences = user_preferences
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_email(db: Session, current_email: str, new_email: str):
    db_user = db.query(User).filter(User.email == current_email).first()
    db_user.email = new_email
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_password(db: Session, email: str, password: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.hashed_password = str(hash_password(password))
    db.commit()
    db.refresh(db_user)
    return db_user
def user_update_first_name(db: Session, email: str, new_first_name: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.first_name = new_first_name
    db.commit()
    db.refresh(db_user)
    return db_user

def user_update_discord(db: Session, email: str, new_discord: str):
    db_user = db.query(User).filter(User.email == email).first()
    db_user.social_account = {'Discord': new_discord}
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_verified = True
        db.commit()
        db.refresh(user)
    return user

def delete_unverified_users(db: Session, expire_hours: int):
    from datetime import datetime, timedelta
    threshold = datetime.utcnow() - timedelta(hours=expire_hours)
    users = db.query(User).filter(
        User.is_verified == False,
        User.created_at < threshold
    )
    count = users.count()
    users.delete(synchronize_session=False)
    db.commit()
    return count

def set_reset_token(db: Session, user: User):
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    db.commit()
    db.refresh(user)
    return token

def reset_password(db: Session, token: str, new_password: str):
    user = db.query(User).filter(User.reset_token == token).first()
    if user:
        user.hashed_password = hash_password(new_password)  # Hash this in production!
        user.reset_token = None
        db.commit()
        return True
    return False