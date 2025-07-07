from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.user import User
from uuid import UUID

from app.schemas.user import UserCreate, UserResponse, Token, LoginRequest, UserInfo
from app.services.user_service import register_user, authenticate_user, get_account_id, get_user_info, get_user_by_email
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def sign_up(user_create: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_create.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")  
    return register_user(db, user_create)

# @router.post("/token", response_model=Token)
# def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = authenticate_user(db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password",
#                             headers={"WWW-Authenticate": "Bearer"})
#     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
#     return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=UserInfo)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    print(user)
    if user == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    userinfo = get_user_by_email(db, user.email)
    # Set JWT in HttpOnly cookie
    user_info_model = UserInfo.from_orm(userinfo)
    response = JSONResponse(
        content=jsonable_encoder(user_info_model)
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        # httponly=True,
        secure=False,  # Set to True in production
        samesite="strict",
        max_age=1800,  # 30 minutes in seconds
    )
    response.set_cookie(
        key="refresh_token",
        value="your_refresh_token_value",
        httponly=True,
        secure=False,  # Set to True in production
        samesite="strict",
        max_age=86400  # 24 hours
    )
    return response

# Sign out with JWT is stateless; token invalidation requires blacklist (not implemented here)
@router.post("/signout")
def sign_out():
    return {"msg": "Sign out handled client-side by deleting the token"}
