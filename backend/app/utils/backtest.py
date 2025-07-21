import time
from app.services.backtest_service import finish_backtest
from sqlalchemy.orm import Session
from uuid import UUID
def backtest(id: UUID, db: Session):
    # Simulate long computation
    time.sleep(10)
    result = {"result":"Hello, your task is complete!"}
    x = finish_backtest(db, id, result)
    print(result)
    return 1