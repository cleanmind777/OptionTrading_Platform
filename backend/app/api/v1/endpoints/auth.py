from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from uuid import UUID
import logging

from app.schemas.user import (
    UserCreate, UserResponse, Token, LoginRequest, 
    TokenRefresh, PasswordChange, UserLogin
)
from app.services.user_service import (
    register_user, authenticate_user, get_account_id,
    update_password
)
from app.dependencies.database import get_db
from app.core.security import (
    TokenManager, PasswordManager, SessionManager
)
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(
    user_create: UserCreate, 
    response: Response,
    db: Session = Depends(get_db)
):
    """Register a new user account"""
    try:
        user = register_user(db, user_create)
        logger.info(f"New user registered: {user.email}")
        return user
    except Exception as e:
        logger.error(f"User registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    """Authenticate user and create session"""
    try:
        # Authenticate user
        user = authenticate_user(db, login_data.email, login_data.password)
        if not user:
            logger.warning(f"Failed login attempt for email: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is disabled
        if user.disabled is True:
            logger.warning(f"Login attempt for disabled user: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled"
            )
        
        # Create tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = TokenManager.create_access_token(
            data={"sub": user.email, "user_id": str(user.id)},
            expires_delta=access_token_expires
        )
        
        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = TokenManager.create_refresh_token(
            data={"sub": user.email, "user_id": str(user.id)},
            expires_delta=refresh_token_expires
        )
        
        # Set cookies
        SessionManager.set_auth_cookies(
            response=response,
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=str(user.id)
        )
        
        # Update last login time
        user.last_login_time = datetime.utcnow()
        db.commit()
        
        logger.info(f"User logged in successfully: {login_data.email}")
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=str(user.id)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Get refresh token from cookies
        refresh_token = SessionManager.get_refresh_token_from_cookies(request)
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )
        
        # Verify refresh token
        payload = TokenManager.verify_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        email = payload.get("sub")
        user_id = payload.get("user_id")
        
        if not email or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Create new tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = TokenManager.create_access_token(
            data={"sub": email, "user_id": user_id},
            expires_delta=access_token_expires
        )
        
        new_refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        new_refresh_token = TokenManager.create_refresh_token(
            data={"sub": email, "user_id": user_id},
            expires_delta=new_refresh_token_expires
        )
        
        # Update cookies
        SessionManager.set_auth_cookies(
            response=response,
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            user_id=user_id
        )
        
        logger.info(f"Token refreshed for user: {email}")
        
        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/logout")
async def logout(response: Response):
    """Logout user and clear session"""
    try:
        # Clear all authentication cookies
        SessionManager.clear_auth_cookies(response)
        
        logger.info("User logged out successfully")
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/change-password")
async def change_user_password(
    password_change: PasswordChange,
    request: Request,
    db: Session = Depends(get_db)
):
    """Change user password"""
    try:
        # Get user from token
        token = SessionManager.get_token_from_cookies(request)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        payload = TokenManager.verify_token(token)
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Verify current password first
        user = authenticate_user(db, email, password_change.current_password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Change password
        update_password(db, email, password_change.new_password)
        
        logger.info(f"Password changed for user: {email}")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current authenticated user information"""
    try:
        # Get token from cookies
        token = SessionManager.get_token_from_cookies(request)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        # Verify token
        payload = TokenManager.verify_token(token)
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user from database
        from app.db.repositories.user_repository import get_user_by_email
        user = get_user_by_email(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.disabled is True:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get current user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Legacy endpoint for backward compatibility
@router.post("/token", response_model=Token)
async def login_for_access_token(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """Legacy login endpoint"""
    return await login(UserLogin(**login_data.dict()), response, db)
