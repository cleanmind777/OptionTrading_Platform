from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.user_repository import user_update_preferences, user_update_discord, user_update_first_name, get_user_by_id, get_user_by_email, create_user, user_update_last_login_time, user_update_phone_number, user_update_email_preferences, user_update_account_access_settings, user_update_social_account, user_update_user_preferences, user_update_bot_preferences, user_update_email, user_update_password
from app.core.security import verify_password
from app.core.security import hash_password
from app.schemas.user import UserCreate
from app.models.user import User
import json

def get_user_info(db: Session, account_id) -> User:
    return get_user_by_id(db, account_id)

def register_user(db: Session, user_create: UserCreate) -> User:
    return create_user(db, user_create)

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    print("DB Password:", user.hashed_password)
    print("Input Password:", hash_password(password))
    if not user or not verify_password(password, user.hashed_password):
        return None
    else:
        user_update_last_login_time(db, email)
    return user

def get_account_id(db: Session, email: str) -> str:
    user = get_user_by_email(db, email)
    print(user.id)
    return user.id
def update_phone_number(db: Session, email: str, new_phone_number: str)-> User:
    return user_update_phone_number(db, email, new_phone_number)

def update_email_preferences(db: Session, email: str, email_preferences: json)-> User:
    return user_update_email_preferences(db, email, email_preferences)

def update_account_access_settings(db: Session, email: str, account_access_settings: json)-> User:
    return user_update_account_access_settings(db, email, account_access_settings)

def update_social_account(db: Session, email: str, social_account: json)-> User:
    return user_update_social_account(db, email, social_account)

def update_user_preferences(db: Session, email: str, user_preferences: json)-> User:
    return user_update_user_preferences(db, email, user_preferences)

def update_bot_preferences(db: Session, email: str, bot_preferences: json)-> User:
    return user_update_bot_preferences(db, email, bot_preferences)

def update_preferences(db: Session, email: str, user_preferences: json, bot_preferences: json) -> User:
    return user_update_preferences(db, email,user_preferences, bot_preferences)

def update_email(db: Session, current_email: str, new_email: str):
    return user_update_email(db, current_email, new_email)

def update_password(db: Session, email: str, password: str):
    return user_update_password(db, email, password)

def update_first_name(db: Session, email: str, new_first_name: str):
    return user_update_first_name(db, email, new_first_name)

def update_discord(db: Session, email: str, new_discord: str):
    return user_update_discord(db, email, new_discord)