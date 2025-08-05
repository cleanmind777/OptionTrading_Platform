import requests
from app.core.config import settings
import json
from datetime import datetime, date
from typing import Optional
from fastapi import HTTPException
from app.models.enums import TransactionTypeEnum, OptionStrategyEnum, SortEnum, SymbolIdEnum, ContractTypeEnum, EntitlementEnum, PeriodTypeEnum, FrequencyTypeEnum, FrequencyEnum, MarketsEnum, MarketIDEnum, ProjectionEnum, ExpMonthEnum
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
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    def get_accounts(self, fields: Optional[str] = None):
        url = f'{self.BASE_URL}/accounts'
        parameter = {}
        if fields:
            parameter['fields'] = fields
        
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_accounts_from_accountnumber(self, account_number : str, fields: Optional[str] = None):
        url = f'{self.BASE_URL}/accounts/{account_number}'
        parameter = {}
        if fields:
            parameter['fields'] = fields
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_accounts_accountnumber_orders(self, account_number : str, from_entered_time: datetime, to_entered_time : datetime, max_results: Optional[int] = None):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders'
        parameter = {
            'fromEnteredTime' : from_entered_time,
            'toEnteredTime' : to_entered_time
        }
        if max_results:
            parameter['maxResults'] = max_results
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def post_accounts_accountnumber_orders(self, account_number: str, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def delete_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        resp = requests.delete(url, headers=self.get_headers())
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def put_accounts_accountnumber_orders_orderid(self, account_number : str, order_id: int, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/orders/{order_id}'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_orders(self, from_entered_time: datetime, to_entered_time : datetime, max_results: Optional[int] = None):
        url = f'{self.BASE_URL}/orders'
        parameter = {
            'fromEnteredTime' : from_entered_time,
            'toEnteredTime' : to_entered_time
        }
        if max_results:
            parameter['maxResults'] = max_results
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def post_accounts_accountnumber_previeworder(self, account_number: str, order: dict):
        url = f'{self.BASE_URL}/accounts/{account_number}/previewOrder'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
            
    def get_accounts_accountnumber_transactions(self, account_number: str, start_date: datetime, end_date : datetime, types: TransactionTypeEnum, symbol: Optional[str] = None):
        url = f'{self.BASE_URL}/accounts/{account_number}/transactions'
        print(types)
        parameter = {
            'startDate' : start_date,
            'endDate' : end_date,
            'types' : types
        }
        if symbol:
            parameter['symbol'] = symbol
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_accounts_accountnumber_transactions_transactionid(self, account_number: str, transaction_id: int):
        url = f'{self.BASE_URL}/accounts/{account_number}/transactions/{transaction_id}'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_userpreference(self):
        url = f'{self.BASE_URL}/userPreference'
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    
    
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
    
    def get_quotes(self, symbols = None, fields = None, indicative = None):
        url = f'{self.BASE_URL}/quotes'
        
        params = {}
        if symbols:
            params['symbols'] = symbols
        if fields:
            params['fields'] = fields
        if indicative:
            params["indicative"] = str(indicative).lower()
            
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_symbolid_quotes(self, symbol_id : SymbolIdEnum, fields : Optional[str] = None):
        url = f'{self.BASE_URL}/{symbol_id}/quotes'
        
        params = {}
        if fields:
            params['fields'] = fields
            
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_chains(
        self, 
        symbol : str, 
        contract_type : Optional[ContractTypeEnum] = None,  
        strike_count : Optional[int] = None, 
        include_underlying_quote : Optional[bool] = None, 
        strategy : Optional[OptionStrategyEnum] = None,
        interval : Optional[float] = None,
        strike : Optional[float] = None,
        range : Optional[str] = None,
        from_date : Optional[date] = None,
        to_date : Optional[date] = None,
        volatility : Optional[float]  = None,
        underlying_price : Optional[float]  = None,
        interest_rate : Optional[float]  = None,
        days_to_expiration : Optional[int] = None,
        exp_month : Optional[ExpMonthEnum] = None,
        option_type : Optional[str] = None,
        entitlement : Optional[EntitlementEnum] = None
        ):
        url = f'{self.BASE_URL}/chains'
        
        params = {
            'symbol' : symbol
        }
        if contract_type:
            params['contractType'] = contract_type
        if strike_count:
            params['strikeCount'] = strike_count
        if include_underlying_quote:
            params['includeUnderlyingQuote'] = str(include_underlying_quote).lower()
        if strategy:
            params['strategy'] = strategy
        if interval:
            params['interval'] = interval
        if strike:
            params['strike'] = strike
        if range:
            params['range'] = range
        if from_date:
            params['fromDate'] = from_date
        if to_date:
            params['toDate'] = to_date
        if volatility:
            params['volatility'] = volatility
        if underlying_price:
            params['underlyingPrice'] = underlying_price
        if interest_rate:
            params['interestRate'] = interest_rate
        if days_to_expiration:
            params['daysToExpiration'] = days_to_expiration
        if exp_month:
            params['expMonth'] = exp_month 
        if option_type:
            params['optionType'] = option_type 
        if entitlement:
            params['entitlement'] = entitlement
            
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_expirationchain(self, symbol : str):
        url = f'{self.BASE_URL}/expirationchain'
        params = {
            'symbol' : symbol
        }
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_pricehistory(
        self,
        symbol : str,
        period_type : Optional[PeriodTypeEnum] = None,
        period : Optional[int] = None,
        frequency_type : Optional[FrequencyTypeEnum] = None,
        frequency : Optional[FrequencyEnum] = None,
        start_date : Optional[int] = None,
        end_date : Optional[int] = None,
        need_extended_hours_data : Optional[bool] = None,
        need_previous_close : Optional[bool] = None
        ):
        url = f'{self.BASE_URL}/pricehistory'
        params = {
            'symbol' : symbol
        }
        if period_type:
            params['periodType'] = period_type
        if period:
            params['period'] = period
        if period_type:
            params['periodType'] = period_type
        if frequency_type:
            params['frequencyType'] = frequency_type
        if frequency:
            params['frequency'] = frequency
        if start_date:
            params['startDate'] = start_date
        if end_date:
            params['endDate'] = end_date
        if need_extended_hours_data:
            params['needExtendedHoursData'] = str(need_extended_hours_data).lower()
        if need_previous_close:
            params['needPreviousClose'] = str(need_previous_close).lower()
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_movers_symbolid(
        self,
        symbol_id : SymbolIdEnum,
        sort : Optional[SortEnum] = None,
        frequency : Optional[FrequencyEnum] = None
    ):  
        url = f'{self.BASE_URL}/movers/{symbol_id.value}'
        params = {}
        if sort:
            params['sort'] = sort
        if frequency:
            params['frequency'] = frequency
        
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_markets(
        self,
        markets : MarketsEnum,
        date : Optional[str] = None
    ):
        url = f'{self.BASE_URL}/markets'
        params = {
            'markets' : markets
        }
        if date:
            params['date'] = date
        
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_markets_marketid(
        self,
        market_id : MarketIDEnum,
        date : Optional[str] = None,
    ):
        url = f'{self.BASE_URL}/markets/{market_id.value}'
        print(url)
        params = {}
        if date:
            params['date'] = date
        
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
    
    def get_instruments(
        self,
        symbol : str,
        projection : ProjectionEnum,
    ):
        url = f'{self.BASE_URL}/instruments'
        params = {
            'symbol' : symbol,
            'projection' : projection
        }
                
        try:
            resp = requests.get(url, headers=self.get_headers(), params=params)
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")
        
    def get_instruments_cusipid(
        self,
        cusip_id : str,
    ):
        url = f'{self.BASE_URL}/instruments/{cusip_id}'  
        try:
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
        except requests.exceptions.HTTPError as e:
            raise HTTPException(status_code=resp.status_code, detail=f"Downstream API error: {resp.text}")