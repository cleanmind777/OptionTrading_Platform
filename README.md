Option Trading Platform
mkdir logs

celery -A celery_app.celery_app worker --loglevel=info --concurrency=4 --pool=solo