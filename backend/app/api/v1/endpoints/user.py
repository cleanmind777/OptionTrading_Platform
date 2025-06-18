from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas.user import UpdateUserPhoneNumber
from app.services.user_service import user_update_phone_number
from app.dependencies.database import get_db
from app.core.config import settings

router = APIRouter()

@router.post("/update/phone_number", response_model=UpdateUserPhoneNumber, status_code=status.HTTP_201_CREATED)
def update_phone_number(email_phone_number: UpdateUserPhoneNumber, db: Session = Depends(get_db)):
    user_update_phone_number(db, email_phone_number.email, email_phone_number.phone_number)
    return {"email": email_phone_number.email, "phone_number": email_phone_number.phone_number}


