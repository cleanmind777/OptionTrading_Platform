from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy import cast, JSON
from sqlalchemy.future import select
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from datetime import timedelta
from uuid import UUID

from app.models.trading_account import TradingAccount
from app.models.trading_log import TradingLog
from app.models.bot import Bot
from app.models.strategy import Strategy
from app.models.user import User
from app.schemas.demo import DemoTradingAccountCreate
from app.schemas.trading_account import TradingAccountFilter
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings


def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val


def user_create_demo_trading_account(
    db: Session, demo_trading_account_create: DemoTradingAccountCreate
):
    db_demo_trading_account = TradingAccount(
        user_id=demo_trading_account_create.user_id,
        name=demo_trading_account_create.name,
        type=demo_trading_account_create.type,
        current_balance=demo_trading_account_create.current_balance,
    )
    db.add(db_demo_trading_account)
    db.commit()
    db.refresh(db_demo_trading_account)
    return db_demo_trading_account


def user_add_demo_trading_account_to_bot(
    db: Session, bot_id: UUID, trading_account_id: UUID
):
    db_bot = db.query(Bot).filter(Bot.id == bot_id).first()
    db_bot.trading_account_id = trading_account_id
    db.commit()
    db.refresh(db_bot)
    return db_bot


async def user_delete_demo_at_bot(db: Session, user_id: UUID):
    db_bots = db.query(Bot).filter(Bot.user_id == user_id).all()
    if not db_bots:
        return False
    for bot in db_bots:
        bot.trading_account_id = None
        bot.total_profit = 0.0
        bot.total_loss = 0.0
        bot.win_rate = 0.0
        bot.win_trades_count = 0
        bot.loss_trades_count = 0
        db.commit()
        db.refresh(bot)
    return db_bots


async def user_delete_demo_at_user(db: Session, user_id: UUID):
    db_user = db.query(User).filter(User.id == user_id).first()
    db_user.total_balance = 0.0
    db_user.total_profit = 0.0
    db_user.total_loss = 0.0
    db_user.total_wins = 0
    db_user.total_losses = 0
    db_user.win_rate = 0.0
    db_user.demo_status = False
    db.commit()
    db.refresh(db_user)
    return db_user


async def user_delete_demo_at_strategy(db: Session, user_id: UUID):
    db_stratgies = db.query(Strategy).filter(Strategy.user_id == user_id).all()
    if not db_stratgies:
        return False
    for strategy in db_stratgies:
        strategy.total_profit = 0.0
        strategy.total_loss = 0.0
        strategy.total_wins = 0
        strategy.total_losses = 0
        db.commit()
        db.refresh(strategy)
    return db_stratgies
