Option Trading Platform
mkdir logs

celery -A celery_app.celery_app worker --pool=eventlet --concurrency=10 --loglevel=INFO