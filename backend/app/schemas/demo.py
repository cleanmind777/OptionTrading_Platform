from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.models.enums import TradingAccountTypeEnum


class DemoTradingAccountCreate(BaseModel):
    user_id: UUID
    name: str
    type: TradingAccountTypeEnum
    current_balance: float
