from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
import json

class BotCreate(BaseModel):
    user_id: UUID
    name: str
    description: Optional[str] = None
    trading_account_id: Optional[UUID] = None
    is_active: Optional[bool] = None
    strategy_id : Optional[UUID] = None
    trade_entry: Optional[Dict[str, Any]] = None
    trade_exit: Optional[Dict[str, Any]] = None
    trade_stop: Optional[Dict[str, Any]] = None
    trade_condition: Optional[Dict[str, Any]] = None
    bot_dependencies: Optional[Dict[str, Any]] = None

class BotEdit(BotCreate):
    id: UUID
    
class BotChange(BaseModel):
    bot: BotEdit
    strategy_change_info : Optional[List[Dict[str, Any]]] = None
class BotInfo(BotCreate):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
class BotFilter(BaseModel):
    user_id: UUID
    name: Optional[str] = None
    trading_account: Optional[str] = None
    is_active: Optional[str] = None
    strategy: Optional[str] = None
    entryDay: Optional[str] = None
    symbol: Optional[str] = None
    webhookPartial: Optional[str] = None

class BotForTradingDashboard(BaseModel):
    id: UUID
    
    