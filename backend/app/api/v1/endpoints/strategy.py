from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.strategy import Strategy
from uuid import UUID
from app.services.strategy_service import create_strategy
from app.schemas.strategy import StrategyInfo, StrategyCreate
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/create", response_model=StrategyInfo, status_code=status.HTTP_201_CREATED)
def create_Strategy(strategy_create: StrategyCreate, db: Session = Depends(get_db)):
    db_user = db.query(Strategy).filter(Strategy.name == strategy_create.name).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Strategy that has same name, already registered")
    return create_strategy(db, strategy_create)

