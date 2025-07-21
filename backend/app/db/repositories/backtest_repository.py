from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.backtest import Backtest
from app.schemas.backtest import BacktestCreate, BacktestResult, BacktestTask
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from sqlalchemy.future import select
from datetime import timedelta
from uuid import UUID
from app.dependencies.database import get_db
from app.core.config import settings
from sqlalchemy import cast, JSON
import json

def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val

async def user_create_backtest(db: Session, backtest_task: BacktestTask):
    db_backtest = Backtest(
        user_id = backtest_task.user_id,
        is_active = True,
        created_at = func.now(),
        strategy_id = backtest_task.strategy_id,
        bot_id = backtest_task.bot_id,
        start_date = backtest_task.start_date,
        end_date = backtest_task.end_date,
    )
    db.add(db_backtest)
    db.commit()
    db.refresh(db_backtest)
    return db_backtest

async def user_get_backtest(db: Session, id: UUID):
    db_backtest = db.query(Backtest).filter(Backtest.id == id).first()
    return db_backtest

def user_finish_backtest(db: Session, id: UUID, result: json):
    db_backtest = db.query(Backtest).filter(Backtest.id == id).first()
    print("-------------------")
    db_backtest.is_active = False
    db_backtest.result = result
    db_backtest.finised_at = func.now()
    db.commit()
    db.refresh(db_backtest)
    db_backtest = db.query(Backtest).filter(Backtest.id == id).first()
    return db_backtest