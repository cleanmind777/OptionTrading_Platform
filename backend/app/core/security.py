from datetime import datetime, timedelta
from typing import Optional, Union, Any, Literal
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Response, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uuid
import logging
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()

class TokenManager:
    """Manages JWT token creation, validation, and refresh"""
    
    @staticmethod
    def create_access_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a new access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access",
            "jti": str(uuid.uuid4())
        })
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a new refresh token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                days=settings.REFRESH_TOKEN_EXPIRE_DAYS
            )
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
            "jti": str(uuid.uuid4())
        })
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError as e:
            logger.warning(f"Token verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def get_token_payload(token: str) -> dict:
        """Get token payload without verification (for debugging)"""
        try:
            return jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM],
                options={"verify_signature": False}
            )
        except JWTError:
            return {}

class PasswordManager:
    """Manages password hashing and verification"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def validate_password_strength(password: str) -> bool:
        """Validate password strength"""
        if len(password) < 8:
            return False
        if not any(c.isupper() for c in password):
            return False
        if not any(c.islower() for c in password):
            return False
        if not any(c.isdigit() for c in password):
            return False
        return True

class SessionManager:
    """Manages user sessions and cookies"""
    
    @staticmethod
    def set_auth_cookies(
        response: Response,
        access_token: str,
        refresh_token: str,
        user_id: str
    ) -> None:
        """Set authentication cookies"""
        # Convert string to proper literal type
        samesite: Literal["lax", "strict", "none"] = settings.COOKIE_SAMESITE  # type: ignore
        
        # Access token cookie (short-lived)
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=samesite,
            domain=settings.COOKIE_DOMAIN,
            path="/"
        )
        
        # Refresh token cookie (long-lived)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=samesite,
            domain=settings.COOKIE_DOMAIN,
            path="/api/v1/auth/refresh"
        )
        
        # User session cookie
        response.set_cookie(
            key="user_session",
            value=user_id,
            max_age=settings.SESSION_EXPIRE_MINUTES * 60,
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=samesite,
            domain=settings.COOKIE_DOMAIN,
            path="/"
        )
    
    @staticmethod
    def clear_auth_cookies(response: Response) -> None:
        """Clear all authentication cookies"""
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/api/v1/auth/refresh")
        response.delete_cookie("user_session", path="/")
    
    @staticmethod
    def get_token_from_cookies(request: Request) -> Optional[str]:
        """Get access token from cookies"""
        return request.cookies.get("access_token")
    
    @staticmethod
    def get_refresh_token_from_cookies(request: Request) -> Optional[str]:
        """Get refresh token from cookies"""
        return request.cookies.get("refresh_token")

# Legacy functions for backward compatibility
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Legacy function for creating access tokens"""
    return TokenManager.create_access_token(data, expires_delta)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Legacy function for password verification"""
    return PasswordManager.verify_password(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Legacy function for password hashing"""
    return PasswordManager.get_password_hash(password)
