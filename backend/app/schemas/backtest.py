from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from uuid import UUID
import json

class BacktestCreate(BaseModel):
    user_id: UUID
    trading_account_id: Optional[UUID] = None
    strategy_id : Optional[UUID] = None
    bot_id : Optional[UUID] = None
 
class BacktestResult(BacktestCreate):
    id: UUID
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    
class BacktestTask(BaseModel):
    user_id: UUID
    bot_id: UUID
    strategy_id: UUID
    start_date: date
    end_date: date
    
    
