from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
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

class TokenData(BaseModel):
    email: Optional[str] = None
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateUserPhoneNumber(BaseModel):
    email: EmailStr
    phone_number: str
    
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
    
class UpdateBotPreferences(BaseModel):
    email: EmailStr
    bot_preferences: Dict[str, Any]