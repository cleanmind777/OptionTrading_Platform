from fastapi import APIRouter
from app.api.v1.endpoints import auth, user,strategy, bot, backtest

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(strategy.router, prefix="/strategy", tags=["strategy"])
api_router.include_router(bot.router, prefix="/bot", tags=["bot"])
api_router.include_router(backtest.router, prefix="/backtest", tags=["backtest"])