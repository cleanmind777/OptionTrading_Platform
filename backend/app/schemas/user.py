from pydantic import BaseModel, EmailStr
from typing import Optional

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