from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from datetime import timedelta
from app.models.bot import Bot

from uuid import UUID
from app.services.demo_service import add_demo_trading_account_to_bots, create_demo
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()


@router.get("/create", status_code=status.HTTP_201_CREATED)
async def create_demo_trades(user_id: UUID, db: Session = Depends(get_db)):
    response = await create_demo(db, user_id)
    if not response:
        raise HTTPException(status_code=400, detail="You don't have bot")
    return response
