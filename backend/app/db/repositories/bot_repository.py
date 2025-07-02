from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.bot import Bot
from app.models.strategy import Strategy
from app.models.bots_setting_history import BotsSettingHistory
from app.schemas.bot import BotCreate, BotFilter
from app.schemas.bots_setting_history import BotSettingHistoryCreate, BotSettingHistoryFilter
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from sqlalchemy.future import select
from datetime import timedelta
from uuid import UUID
from app.schemas.bot import BotCreate, BotInfo, BotFilter, BotEdit
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from sqlalchemy import cast, JSON

def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val

def user_create_bot(db: Session, bot_create: BotCreate):
    db_bot = Bot(
        user_id = bot_create.user_id,
        name = bot_create.name,
        description = bot_create.description,
        trading_account_id = bot_create.trading_account_id,
        is_active = bot_create.is_active,
        created_at = func.now(),
        updated_at = func.now(),
        strategy_id = bot_create.strategy_id,
        trade_entry = bot_create.trade_entry,
        trade_exit = bot_create.trade_exit,
        trade_stop = bot_create.trade_stop,
        trade_condition = bot_create.trade_condition,
        bot_dependencies = bot_create.bot_dependencies,
    )
    db.add(db_bot)
    db.commit()
    db.refresh(db_bot)
    return db_bot

def user_edit_bot(db: Session, bot_edit: BotEdit):
    db_bot = db.query(Bot).filter(Bot.id == bot_edit.id).first()
    change_info = []
    if db_bot.name != bot_edit.name:
        change_info.append({"name": [db_bot.name, bot_edit.name]})
        db_bot.name = bot_edit.name
    
    if db_bot.description != bot_edit.description:
        change_info.append({"description": [db_bot.description, bot_edit.description]})
        db_bot.description = bot_edit.description
    
    if db_bot.trading_account_id != bot_edit.trading_account_id:
        change_info.append({"trading_account_id": [db_bot.trading_account_id, bot_edit.trading_account_id]})
        db_bot.trading_account_id = bot_edit.trading_account_id
        
    if db_bot.is_active != bot_edit.is_active:
        change_info.append({"is_active": [db_bot.is_active, bot_edit.is_active]})
        db_bot.is_active = bot_edit.is_active
        
    if db_bot.strategy_id != bot_edit.strategy_id:
        change_info.append({"strategy_id": [db_bot.strategy_id, bot_edit.strategy_id]})
        db_bot.strategy_id = bot_edit.strategy_id
        
    if db_bot.trade_entry != bot_edit.trade_entry:
        change_info.append({"trade_entry": [db_bot.trade_entry, bot_edit.trade_entry]})
        db_bot.trade_entry = bot_edit.trade_entry
        
    if db_bot.trade_exit != bot_edit.trade_exit:
        change_info.append({"trade_exit": [db_bot.trade_exit, bot_edit.trade_exit]})
        db_bot.trade_exit = bot_edit.trade_exit
        
    if db_bot.trade_stop != bot_edit.trade_stop:
        change_info.append({"trade_stop": [db_bot.trade_stop, bot_edit.trade_stop]})
        db_bot.trade_stop = bot_edit.trade_stop
        
    if db_bot.trade_condition != bot_edit.trade_condition:
        change_info.append({"trade_condition": [db_bot.trade_condition, bot_edit.trade_condition]})
        db_bot.trade_condition = bot_edit.trade_condition
        
    if db_bot.bot_dependencies != bot_edit.bot_dependencies:
        change_info.append({"bot_dependencies": [db_bot.bot_dependencies, bot_edit.bot_dependencies]})
        db_bot.bot_dependencies = bot_edit.bot_dependencies
        
    db.updated_at = func.now()
    db.commit()
    db.refresh(db_bot)
    user_id = db_bot.user.id
    if change_info != {}:
        db_bot_setting_history = BotsSettingHistory(
            bot_id = bot_edit.id,
            user_id = user_id,
            change_info = change_info
        )
        db.add(db_bot_setting_history)
        db.commit()
        db.refresh(db_bot_setting_history)
        print(db_bot_setting_history)
    db_bots = db.query(Bot).filter(Bot.user_id == bot_edit.user_id).all()
    return db_bots

async def user_get_bots(db: Session, bot_filters: BotFilter):
    # Start building the query
    query = (
        select(Bot)
        .join(Bot.strategy)
        .options(joinedload(Bot.strategy))
        .filter(Bot.user_id == bot_filters.user_id)
    )

    
    # Filter by is_active if not "All"
    if bot_filters.is_active == "Enabled":
        query = query.filter(Bot.is_active == True)
    elif bot_filters.is_active != "All":
        query = query.filter(Bot.is_active == False)

    # Filter by symbol if not "All"
    if bot_filters.symbol != "All":
        query = query.filter(Strategy.symbol == bot_filters.symbol)
        
    if bot_filters.strategy != "All":
        strategy_id = safe_uuid(getattr(bot_filters, "strategy", None))
        if strategy_id:
            query = query.filter(Bot.strategy_id == strategy_id)
    
    if bot_filters.name != "":
        query = query.filter(Bot.name == bot_filters.name)
    
    if bot_filters.entryDay == "All":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][0].as_boolean() == True
        )
    if bot_filters.entryDay == "Monday":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][1].as_boolean() == True
        )
    if bot_filters.entryDay == "Tuesday":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][2].as_boolean() == True
        )
    if bot_filters.entryDay == "Wednesday":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][3].as_boolean() == True
    )
    if bot_filters.entryDay == "Thursday":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][4].as_boolean() == True
        )
    if bot_filters.entryDay == "Friday":
        query = query.filter(
            Bot.trade_entry['days_of_week_to_enter'][5].as_boolean() == True
        )

    result = db.execute(query)
    bots = result.scalars().all()
    return bots

async def user_get_bot(db: Session, id: UUID):
    db_bot = db.query(Bot).filter(Bot.id == id).first()
    return db_bot

async def user_get_setting_history(db: Session, filter: BotSettingHistoryFilter):
    query = (
        select(BotsSettingHistory)
        .filter(BotsSettingHistory.user_id == filter.user_id)
    )
    
    if filter.bot_id != "ALL":
        query = query.filter(
            BotsSettingHistory.bot_id == filter.bot_id
        )
    
    if filter.from_time == None:
        query = query.filter(
            BotsSettingHistory.changed_at <= filter.to_time
        )
    else:
        query = query.filter(
            BotsSettingHistory.changed_at >= filter.from_time,
            BotsSettingHistory.changed_at <= filter.to_time
        )
        
    result = db.execute(query)
    history = result.scalars().all()
    return history