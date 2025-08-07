from celery_app import celery_app
import time

@celery_app.task
def trading(bot_id):
    # Simulate a long-running task
    time.sleep(10)  # sleep 10 seconds to simulate work
    return bot_id
