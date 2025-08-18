from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import json


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    disabled: Optional[bool]

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    account_id: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UpdateUserPhoneNumber(BaseModel):
    email: EmailStr
    new_phone_number: str

    class Config:
        from_attributes = True


class UpdateUserFirstName(BaseModel):
    email: EmailStr
    new_first_name: str

    class Config:
        from_attributes = True


class UpdateUserDiscord(BaseModel):
    email: EmailStr
    new_discord: str

    class Config:
        from_attributes = True


class UpdateUserEmailPreferences(BaseModel):
    email: EmailStr
    email_preferences: Dict[str, Any]


class UpdateAccountAccessSettings(BaseModel):
    email: EmailStr
    account_access_settings: Dict[str, Any]


class UpdateSocialAccount(BaseModel):
    email: EmailStr
    social_account: Dict[str, Any]


class UpdateUserPreferences(BaseModel):
    email: EmailStr
    user_preferences: Dict[str, Any]


class UpdatePreferences(BaseModel):
    email: EmailStr
    user_preferences: Dict[str, Any]
    bot_preferences: Dict[str, Any]


class UpdateBotPreferences(BaseModel):
    email: EmailStr
    bot_preferences: Dict[str, Any]


class UpdateEmail(BaseModel):
    current_email: EmailStr
    password: str
    new_email: EmailStr


class Email(BaseModel):
    email: EmailStr


class UpdatePassword(BaseModel):
    email: EmailStr
    current_password: str
    new_password: str


class UserInfo(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[UUID] = None
    social_account: Optional[Dict[str, Any]] = None
    user_level: Optional[int] = None
    two_factor: Optional[bool] = None
    user_preferences: Optional[Dict[str, Any]] = None
    bot_preferences: Optional[Dict[str, Any]] = None
    account_access_settings: Optional[Dict[str, Any]] = None
    email_preferences: Optional[Dict[str, Any]] = None
    created_time: Optional[datetime] = None
    last_login_time: Optional[datetime] = None
    last_website_activity: Optional[datetime] = None
    trades_logged: Optional[int] = None
    strategies_created: Optional[int] = None
    bots_created: Optional[int] = None
    group_id: Optional[str] = None
    group_display_name: Optional[str] = None
    group_admin: Optional[bool] = None

    model_config = {
        "from_attributes": True,  # replaces orm_mode=True
    }


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    password: str


class UpdateTrades(BaseModel):
    user_id: UUID
    profit: float
    total_balance: float
