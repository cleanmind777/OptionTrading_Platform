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
from typing import Optional, Dict, Any, List
import numpy as np
import datetime
import pandas as pd

def make_json_serializable(obj):
    if isinstance(obj, (datetime.datetime, datetime.date, pd.Timestamp)):
        return obj.isoformat()
    if isinstance(obj, datetime.timedelta):
        return obj.total_seconds()
    if isinstance(obj, np.generic):
        return obj.item()
    if isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [make_json_serializable(v) for v in obj]
    return obj
def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val

async def user_create_backtest(db: Session, backtest_task: BacktestTask):
    print("+++++++++++++++++++++++++++++")
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

def user_get_backtest(token: UUID, db: Session):
    db_backtest = db.query(Backtest).filter(Backtest.id == token).first()
    return db_backtest

def user_get_backtests(user_id: UUID, db: Session):
    db_backtests = db.query(Backtest).filter(Backtest.user_id == user_id).all()
    return db_backtests

def user_finish_backtest(session: Session, id: UUID, result: Dict[str, Any]):
    db_backtest = session.query(Backtest).filter(Backtest.id == id).first()
    db_backtest.is_active = False
    db_backtest.result = make_json_serializable(result)
    db_backtest.finised_at = func.now()
    session.commit()
    session.refresh(db_backtest)
    db_backtest = session.query(Backtest).filter(Backtest.id == id).first()
    print("is_Active: ", db_backtest.is_active)
    return db_backtest