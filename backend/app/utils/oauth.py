from fastapi import FastAPI, HTTPException
import httpx
from app.core.config import settings
async def verify_token(token: str):
    # Call Google's tokeninfo endpoint to verify JWT
    async with httpx.AsyncClient() as client:
        response = await client.get("https://oauth2.googleapis.com/tokeninfo", params={"id_token": token})
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")
    data = response.json()
    if data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Invalid audience")
    return data