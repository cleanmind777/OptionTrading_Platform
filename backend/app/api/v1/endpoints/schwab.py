import requests
from app.core.config import settings

SCHWAB_API_BASE_URL = settings.SCHWAB_API_BASE_URL
SCHWAB_API_MARKET_URL = settings.SCHWAB_API_MARKET_URL
SCHWAB_CLIENT_ID = settings.SCHWAB_CLIENT_ID
SCHWAB_CLIENT_SECRET = settings.SCHWAB_CLIENT_SECRET
SCHWAB_ACCESS_TOKEN = settings.SCHWAB_ACCESS_TOKEN

class SchwabAccountAPI:
    BASE_URL = SCHWAB_API_BASE_URL
    def __init__(self):
        self.access_token = SCHWAB_ACCESS_TOKEN

    def get_headers(self):
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

    def get_account_info(self):
        url = f'{self.BASE_URL}/accounts'
        resp = requests.get(url, headers=self.get_headers())
        resp.raise_for_status()
        return resp.json()