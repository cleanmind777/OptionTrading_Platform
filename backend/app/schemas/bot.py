from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import json

class BotCreate(BaseModel):
    user_id: UUID
    name: str
    description: Optional[str] = None
    trading_account: Optional[str] = None
    is_active: Optional[bool] = None
    strategy_id : Optional[UUID] = None
    # symbol: Optional[str] = None
    # parameters: Optional[Dict[str, Any]] = None
    # trade_type: Optional[str] = None
    trade_entry: Optional[Dict[str, Any]] = None
    trade_exit: Optional[Dict[str, Any]] = None
    trad_stop: Optional[Dict[str, Any]] = None
    trade_condition: Optional[Dict[str, Any]] = None
    bot_dependencies: Optional[Dict[str, Any]] = None

class BotInfo(BotCreate):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None