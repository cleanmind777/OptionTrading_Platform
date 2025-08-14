Option Trading Platform
mkdir logs

celery -A celery_app.celery_app worker --pool=eventlet --concurrency=10 --loglevel=INFO

uvicorn main:app --host 0.0.0.0 --port 8000