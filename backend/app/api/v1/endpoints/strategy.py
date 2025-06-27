from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.strategy import Strategy
from app.models.user import User
from uuid import UUID
from app.services.strategy_service import create_strategy, get_all_strategies, get_strategy
from app.schemas.strategy import StrategyInfo, StrategyCreate
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_Strategy(strategy_create: StrategyCreate, db: Session = Depends(get_db)):
    db_strategy = db.query(Strategy).filter(Strategy.name == strategy_create.name).first()
    db_user = db.query(User).filter(User.id == strategy_create.user_id).first()
    if db_strategy and db_user:
        raise HTTPException(status_code=400, detail="Strategy that has same name, already registered")
    db_user = db.query(User).filter(User.id == strategy_create.user_id).first()
    if db_user == None:
        raise HTTPException(status_code=400, detail="Incorrect UserID")
    return create_strategy(db, strategy_create)

@router.get("/get_all_strategies", status_code=status.HTTP_201_CREATED)
def get_All_strategies(user_id: str, db: Session = Depends(get_db)):
    return get_all_strategies(db, user_id)

@router.get("/get_strategy", status_code=status.HTTP_201_CREATED)
def get_Strategy(strategy_id: str, db: Session = Depends(get_db)):
    return get_strategy(db, strategy_id)
