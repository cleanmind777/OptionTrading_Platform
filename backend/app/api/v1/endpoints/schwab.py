import requests
from app.core.config import settings
import json
from datetime import datetime

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
    
    def get_accounts_accountnumbers(self):
        url = f'{self.BASE_URL}/accounts/accountNumbers'
        resp = requests.get(url, headers=self.get_headers())
        resp.raise_for_status()
        
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_accounts(self, fields : str):
        url = f'{self.BASE_URL}/accounts'
        parameter = {
            'fields' : fields
        }
        resp = requests.get(url, headers=self.get_headers(), params=parameter)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_accounts_from_accountnumber(self, account_number : str, fields : str):
        url = f'{self.BASE_URL}/accounts/{account_number}'
        parameter = {
            'fields' : fields
        }
        resp = requests.get(url, headers=self.get_headers(), params=parameter)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_accounts_accountnumber_orders(self, account_number : str, max_results: int, from_entered_time: datetime, to_entered_time : datetime):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders'
        parameter = {
            'maxResults' : max_results,
            'fromEnteredTime' : from_entered_time,
            'toEnteredTime' : to_entered_time
        }
        resp = requests.get(url, headers=self.get_headers(), params=parameter)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def post_accounts_accountnumber_orders(self, account_number: str, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders'
        resp = requests.post(url, headers=self.get_headers(), json=order)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    
    def get_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        resp = requests.get(url, headers=self.get_headers())
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def delete_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        resp = requests.delete(url, headers=self.get_headers())
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def put_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        resp = requests.put(url, headers=self.get_headers(), json=order)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_orders(self, max_results: int, from_entered_time: datetime, to_entered_time : datetime):
        url = f'{self.BASE_URL}/orders'
        parameter = {
            'maxResults' : max_results,
            'fromEnteredTime' : from_entered_time,
            'toEnteredTime' : to_entered_time
        }
        resp = requests.get(url, headers=self.get_headers(), params=parameter)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def post_accounts_accountnumber_previeworder(self, account_number: str, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/previewOrder'
        resp = requests.post(url, headers=self.get_headers(), json=order)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_accounts_accountnumber_transactions(self, account_number: str, start_date: datetime, end_date : datetime, symbol: str, types: str):
        url = f'{self.BASE_URL}/accounts/{account_number}/transactions'
        parameter = {
            'startDate' : start_date,
            'endDate' : end_date,
            'symbol' : symbol,
            'types' : types
        }
        resp = requests.get(url, headers=self.get_headers(), params=parameter)
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_accounts_accountnumber_transactions_transactionid(self, account_number: str, transaction_id: str):
        url = f'{self.BASE_URL}/accounts/{account_number}/transactions/{transaction_id}'
        resp = requests.get(url, headers=self.get_headers())
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    def get_userpreference(self):
        url = f'{self.BASE_URL}/userPreference'
        resp = requests.get(url, headers=self.get_headers())
        resp.raise_for_status()
        if resp.content:
            try:
                return resp.json()
            except ValueError:  # includes simplejson.decoder.JSONDecodeError
                # Log error, raise custom error, or return raw text
                raise ValueError(f"Response content is not valid JSON: {resp.text}")
        else:
            # No content to decode.
            return None  # or {}
    
    
    
class SchwabMarketAPI:
    BASE_URL = SCHWAB_API_MARKET_URL
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