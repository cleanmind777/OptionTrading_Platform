from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas.user import UpdateUserPhoneNumber, UpdateUserEmailPreferences, UpdateAccountAccessSettings, UpdateSocialAccount
from app.services.user_service import update_phone_number, update_email_preferences, update_account_access_settings, update_social_account
from app.dependencies.database import get_db
from app.core.config import settings

router = APIRouter()

@router.post("/update/phone_number", response_model=UpdateUserPhoneNumber, status_code=status.HTTP_201_CREATED)
def update_Phone_number(email_phone_number: UpdateUserPhoneNumber, db: Session = Depends(get_db)):
    update_phone_number(db, email_phone_number.email, email_phone_number.phone_number)
    return {"email": email_phone_number.email, "phone_number": email_phone_number.phone_number}

@router.post("/update/email_preferences", response_model=UpdateUserEmailPreferences, status_code=status.HTTP_201_CREATED)
def update_Email_preferences(email_email_preferences: UpdateUserEmailPreferences, db: Session = Depends(get_db)):
    update_email_preferences(db, email_email_preferences.email, email_email_preferences.email_preferences)
    return {"email": email_email_preferences.email, "email_preferences": email_email_preferences.email_preferences}

@router.post("/update/account_access_settings", response_model=UpdateAccountAccessSettings, status_code=status.HTTP_201_CREATED)
def update_Account_access_settings(email_account_access_settings: UpdateAccountAccessSettings, db: Session = Depends(get_db)):
    update_account_access_settings(db, email_account_access_settings.email, email_account_access_settings.account_access_settings)
    return {"email": email_account_access_settings.email, "account_access_settings": email_account_access_settings.account_access_settings}

@router.post("/update/social_account", response_model=UpdateSocialAccount, status_code=status.HTTP_201_CREATED)
def update_Social_account(email_social_account: UpdateSocialAccount, db: Session = Depends(get_db)):
    update_social_account(db, email_social_account.email, email_social_account.social_account)
    return {"email": email_social_account.email, "social_account": email_social_account.social_account}