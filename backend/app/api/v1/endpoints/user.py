from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas.user import (
    UserInfo,
    UpdatePreferences,
    UpdateUserDiscord,
    UpdateUserFirstName,
    UpdateUserPhoneNumber,
    UpdateUserEmailPreferences,
    UpdateAccountAccessSettings,
    UpdateSocialAccount,
    UpdateUserPreferences,
    UpdateBotPreferences,
    Email,
    UpdateEmail,
    UpdatePassword,
)
from app.services.user_service import (
    update_preferences,
    update_discord,
    update_first_name,
    get_user_info,
    authenticate_user,
    update_phone_number,
    update_email_preferences,
    update_account_access_settings,
    update_social_account,
    update_user_preferences,
    update_bot_preferences,
    update_email,
    update_password,
)
from app.dependencies.database import get_db
from app.core.config import settings

router = APIRouter()


@router.get("/me", response_model=UserInfo, status_code=status.HTTP_201_CREATED)
def get_User_info(user_id: str, db: Session = Depends(get_db)):
    return get_user_info(db, user_id)


@router.post(
    "/update/phone_number", response_model=UserInfo, status_code=status.HTTP_201_CREATED
)
def update_Phone_number(
    email_phone_number: UpdateUserPhoneNumber, db: Session = Depends(get_db)
):
    update_phone_number(
        db, email_phone_number.email, email_phone_number.new_phone_number
    )
    return update_phone_number(
        db, email_phone_number.email, email_phone_number.new_phone_number
    )


@router.post(
    "/update/email_preferences",
    response_model=UpdateUserEmailPreferences,
    status_code=status.HTTP_201_CREATED,
)
def update_Email_preferences(
    email_email_preferences: UpdateUserEmailPreferences, db: Session = Depends(get_db)
):
    update_email_preferences(
        db, email_email_preferences.email, email_email_preferences.email_preferences
    )
    return {
        "email": email_email_preferences.email,
        "email_preferences": email_email_preferences.email_preferences,
    }


@router.post(
    "/update/account_access_settings",
    response_model=UserInfo,
    status_code=status.HTTP_201_CREATED,
)
def update_Account_access_settings(
    email_account_access_settings: UpdateAccountAccessSettings,
    db: Session = Depends(get_db),
):
    return update_account_access_settings(
        db,
        email_account_access_settings.email,
        email_account_access_settings.account_access_settings,
    )


@router.post(
    "/update/social_account",
    response_model=UpdateSocialAccount,
    status_code=status.HTTP_201_CREATED,
)
def update_Social_account(
    email_social_account: UpdateSocialAccount, db: Session = Depends(get_db)
):
    update_social_account(
        db, email_social_account.email, email_social_account.social_account
    )
    return {
        "email": email_social_account.email,
        "social_account": email_social_account.social_account,
    }


@router.post(
    "/update/user_preferences",
    response_model=UpdateUserPreferences,
    status_code=status.HTTP_201_CREATED,
)
def update_User_preferences(
    email_user_preferences: UpdateUserPreferences, db: Session = Depends(get_db)
):
    update_user_preferences(
        db, email_user_preferences.email, email_user_preferences.user_preferences
    )
    return {
        "email": email_user_preferences.email,
        "user_preferences": email_user_preferences.user_preferences,
    }


@router.post(
    "/update/preferences", response_model=UserInfo, status_code=status.HTTP_201_CREATED
)
def update_Preferences(
    email_preferences: UpdatePreferences, db: Session = Depends(get_db)
):
    return update_preferences(
        db,
        email_preferences.email,
        email_preferences.user_preferences,
        email_preferences.bot_preferences,
    )


@router.post(
    "/update/bot_preferences",
    response_model=UpdateBotPreferences,
    status_code=status.HTTP_201_CREATED,
)
def update_Bot_preferences(
    email_bot_preferences: UpdateBotPreferences, db: Session = Depends(get_db)
):
    update_bot_preferences(
        db, email_bot_preferences.email, email_bot_preferences.bot_preferences
    )
    return {
        "email": email_bot_preferences.email,
        "bot_preferences": email_bot_preferences.bot_preferences,
    }


@router.post("/update/email", response_model=Email, status_code=status.HTTP_201_CREATED)
def update_Email(email_password: UpdateEmail, db: Session = Depends(get_db)):
    user = authenticate_user(db, email_password.current_email, email_password.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    update_email(db, email_password.current_email, email_password.new_email)
    return {"email": email_password.new_email}


@router.post(
    "/update/first_name", response_model=UserInfo, status_code=status.HTTP_201_CREATED
)
def update_First_name(
    email_firstname: UpdateUserFirstName, db: Session = Depends(get_db)
):
    return update_first_name(db, email_firstname.email, email_firstname.new_first_name)


@router.post(
    "/update/discord", response_model=UserInfo, status_code=status.HTTP_201_CREATED
)
def update_Discord(email_discord: UpdateUserDiscord, db: Session = Depends(get_db)):
    return update_discord(db, email_discord.email, email_discord.new_discord)


@router.post(
    "/update/password", response_model=UserInfo, status_code=status.HTTP_201_CREATED
)
def update_Password(email_new_password: UpdatePassword, db: Session = Depends(get_db)):
    user = authenticate_user(
        db, email_new_password.email, email_new_password.current_password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return update_password(
        db, email_new_password.email, email_new_password.new_password
    )


@router.post("/update/email", response_model=Email, status_code=status.HTTP_201_CREATED)
def update_Email(email_password: UpdateEmail, db: Session = Depends(get_db)):
    user = authenticate_user(db, email_password.current_email, email_password.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    update_email(db, email_password.current_email, email_password.new_email)
    return {"email": email_password.new_email}
