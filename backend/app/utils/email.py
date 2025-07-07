import requests
import os
from app.core.config import settings
def send_reset_email(to_email, reset_link):
    print(settings.EMAILJS_RESET_TEMPLATE_ID)
    print(settings.EMAILJS_SERVICE_ID)
    print(settings.EMAILJS_PUBLIC_KEY)
    print(reset_link)
    print(to_email)
    data = {
        "service_id": settings.EMAILJS_SERVICE_ID,
        "template_id": settings.EMAILJS_RESET_TEMPLATE_ID,
        "user_id": settings.EMAILJS_PUBLIC_KEY,
        "template_params": {
            "email": to_email,
            "link": reset_link
        },
        "accessToken": settings.EMAILJS_RRIVATE_KEY
    }
    header = {
        'content-type' : "application/json"
    }
    response = requests.post('https://api.emailjs.com/api/v1.0/email/send',headers=header, json=data)
    response.raise_for_status()
