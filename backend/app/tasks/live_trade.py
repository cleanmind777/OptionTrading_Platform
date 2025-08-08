import time
from uuid import UUID
from celery.contrib.abortable import AbortableTask
from celery_app import celery_app
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.db.repositories.trading_task_repository import user_get_trading_task_status

# Create a session factory bound to your DB engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery_app.task(bind=True, base=AbortableTask)
def trading(self, bot_id: str, trading_task_id: str):
    """
    Long-running trading task that checks if it should continue by querying DB.
    Supports cooperative abort via self.is_aborted().

    Args:
        bot_id: str UUID of the bot (as string)
        trading_task_id: str ID of the trading task in DB

    """
    db = SessionLocal()
    try:
        while True:
            # Check if task has been requested to abort
            if self.is_aborted():
                print(f"Task {self.request.id} aborted!")
                break

            trading_task = user_get_trading_task_status(db, trading_task_id)
            if not trading_task or not trading_task.is_active:
                print(f"TradingTask {trading_task_id} inactive or not found, stopping task.")
                break

            # Your task logic here, e.g. logging the task id and active state
            print(f"Running trading task {trading_task.id}, active status: {trading_task.is_active}")

            time.sleep(10)  # simulate work

        return bot_id
    finally:
        db.close()
