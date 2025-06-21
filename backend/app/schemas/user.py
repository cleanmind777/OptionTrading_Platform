from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import json

class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr = Field(..., description="User's email address")
    first_name: str = Field(..., min_length=1, max_length=50, description="User's first name")
    last_name: Optional[str] = Field(None, max_length=50, description="User's last name")
    phone_number: Optional[str] = Field(None, max_length=20, description="User's phone number")

class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8, max_length=128, description="User's password")
    confirm_password: str = Field(..., description="Password confirmation")
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('confirm_password')
    def validate_password_match(cls, v, values):
        """Validate password confirmation"""
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    @validator('phone_number')
    def validate_phone_number(cls, v):
        """Validate phone number format"""
        if v is not None:
            # Remove all non-digit characters
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 10 or len(digits_only) > 15:
                raise ValueError('Phone number must be between 10 and 15 digits')
        return v

class UserUpdate(BaseModel):
    """Schema for user profile updates"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    phone_number: Optional[str] = Field(None, max_length=20)
    
    @validator('phone_number')
    def validate_phone_number(cls, v):
        """Validate phone number format"""
        if v is not None:
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 10 or len(digits_only) > 15:
                raise ValueError('Phone number must be between 10 and 15 digits')
        return v

class UserResponse(UserBase):
    """Schema for user response data"""
    id: UUID
    user_level: int = Field(..., description="User's access level")
    social_account: Optional[Dict[str, Any]] = Field(None, description="Social media accounts")
    two_factor: bool = Field(False, description="Two-factor authentication status")
    account_access_settings: Dict[str, Any] = Field(..., description="Account access preferences")
    email_preferences: Dict[str, Any] = Field(..., description="Email notification preferences")
    user_preferences: Dict[str, Any] = Field(..., description="User interface preferences")
    bot_preferences: Dict[str, Any] = Field(..., description="Bot trading preferences")
    created_time: datetime = Field(..., description="Account creation timestamp")
    last_login_time: datetime = Field(..., description="Last login timestamp")
    last_website_activity: datetime = Field(..., description="Last activity timestamp")
    trades_logged: int = Field(0, description="Total number of trades")
    strategies_created: int = Field(0, description="Total number of strategies created")
    bots_created: int = Field(0, description="Total number of bots created")
    disabled: bool = Field(False, description="Account disabled status")
    group_id: Optional[UUID] = Field(None, description="Group membership ID")
    group_display_name: Optional[str] = Field(None, description="Group display name")
    group_admin: Optional[bool] = Field(None, description="Group admin status")
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v)
        }

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")
    remember_me: bool = Field(False, description="Remember user session")

class Token(BaseModel):
    """Schema for authentication tokens"""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    user_id: str = Field(..., description="User ID")

class TokenRefresh(BaseModel):
    """Schema for token refresh"""
    refresh_token: str = Field(..., description="JWT refresh token")

class PasswordChange(BaseModel):
    """Schema for password change"""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")
    confirm_new_password: str = Field(..., description="New password confirmation")
    
    @validator('new_password')
    def validate_new_password_strength(cls, v):
        """Validate new password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('confirm_new_password')
    def validate_new_password_match(cls, v, values):
        """Validate new password confirmation"""
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('New passwords do not match')
        return v

class UserPreferences(BaseModel):
    """Schema for user preferences update"""
    account_access_settings: Optional[Dict[str, Any]] = None
    email_preferences: Optional[Dict[str, Any]] = None
    user_preferences: Optional[Dict[str, Any]] = None
    bot_preferences: Optional[Dict[str, Any]] = None

class UserStats(BaseModel):
    """Schema for user statistics"""
    total_trades: int = Field(0, description="Total number of trades")
    successful_trades: int = Field(0, description="Number of successful trades")
    total_profit: float = Field(0.0, description="Total profit/loss")
    win_rate: float = Field(0.0, description="Win rate percentage")
    active_bots: int = Field(0, description="Number of active bots")
    total_strategies: int = Field(0, description="Total number of strategies")
    
    class Config:
        json_encoders = {
            float: lambda v: round(v, 2)
        }

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
    user_level : Optional[int] = None
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
    group_id : Optional[str] = None
    group_display_name: Optional[str] = None
    group_admin : Optional[bool] = None