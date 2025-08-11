import requests
from app.core.config import settings


def current_price(symbol: str):
    url = f"https://api.polygon.io/v1/last/stocks/{symbol}?apiKey={settings.POLYGON_API_KEY}"

    response = requests.get(url)
    data = response.json()
    return data["last"]["price"]
