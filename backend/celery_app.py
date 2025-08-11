from celery import Celery

from app.core.config import settings

redis_url = settings.REDIS_URL

celery_app = Celery(
    "option_trading_platform",
    broker=redis_url,
    backend=redis_url,
    include=["app.tasks.live_trade"],  # IMPORTANT: Include your tasks module here!
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)

# Optional: celery_app.conf.update(...) for additional configs

if __name__ == "__main__":
    # Just for debugging or running celery worker directly via python
    celery_app.start()
