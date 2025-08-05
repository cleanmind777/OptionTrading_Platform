from fastapi import APIRouter, Depends, HTTPException, status
from app.api.v1.endpoints.schwab import SchwabAccountAPI, SchwabMarketAPI
from datetime import datetime, date
from typing import Optional

router = APIRouter()
schwab_account = SchwabAccountAPI()
schwab_market = SchwabMarketAPI()
@router.get("/accounts/accountNumbers", status_code=status.HTTP_201_CREATED)
def get_account_accountnumbers():
    return schwab_account.get_accounts_accountnumbers()

@router.get("/accounts", status_code=status.HTTP_201_CREATED)
def get_accounts(fields: str):
    return schwab_account.get_accounts(fields)

@router.get("/accounts/account_number", status_code=status.HTTP_201_CREATED)
def get_accounts_from_accountnumber(account_number: str, fields: str):
    return schwab_account.get_accounts_from_accountnumber(account_number, fields)

@router.get("/accounts/account_number/orders", status_code=status.HTTP_201_CREATED)
def get_accounts_accountnumber_orders(account_number : str, max_results: int, from_entered_time: datetime, to_entered_time : datetime):
    return schwab_account.get_accounts_accountnumber_orders(account_number, max_results, from_entered_time, to_entered_time)

@router.post("/accounts/account_number/orders", status_code=status.HTTP_201_CREATED)
def post_accounts_accountnumber_orders(account_number: str, order: dict):
    return schwab_account.post_accounts_accountnumber_orders(account_number, order)

@router.get("/accounts/account_number/orders/orders_id", status_code=status.HTTP_201_CREATED)
def get_accounts_accountnumber_orders_orderid(account_number : str, order_id: int):
    return schwab_account.get_accounts_accountnumber_orders_orderid(account_number, order_id)

@router.delete("/accounts/account_number/orders/orders_id", status_code=status.HTTP_201_CREATED)
def delete_accounts_accountnumber_orders_orderid(account_number : str, order_id: int):
    return schwab_account.delete_accounts_accountnumber_orders_orderid(account_number, order_id)

@router.put("/accounts/account_number/orders/orders_id", status_code=status.HTTP_201_CREATED)
def put_accounts_accountnumber_orders_orderid(account_number : str, order_id: int, order: dict):
    return schwab_account.put_accounts_accountnumber_orders_orderid(account_number, order_id, order)

@router.get("/orders", status_code=status.HTTP_201_CREATED)
def get_orders(max_results: int, from_entered_time: datetime, to_entered_time : datetime):
    return schwab_account.get_orders(max_results, from_entered_time, to_entered_time)

@router.post("/accounts/account_number/preview_order", status_code=status.HTTP_201_CREATED)
def post_accounts_accountnumber_previeworder(account_number: str, order: dict):
    return schwab_account.post_accounts_accountnumber_previeworder(account_number, order)

@router.get("/accounts/account_number/transactions", status_code=status.HTTP_201_CREATED)
def get_accounts_accountnumber_transactions(account_number: str, start_date: datetime, end_date : datetime, symbol: str, types: str):
    return schwab_account.get_accounts_accountnumber_transactions(account_number, start_date, end_date, symbol, types)

@router.get("/accounts/account_number/transactions/transaction_id", status_code=status.HTTP_201_CREATED)
def get_accounts_accountnumber_transactions_transactionid(account_number: str, transaction_id: str):
    return schwab_account.get_accounts_accountnumber_transactions_transactionid(account_number, transaction_id)

@router.get("/user_preference", status_code=status.HTTP_201_CREATED)
def get_userpreference():
    return schwab_account.get_userpreference()



@router.get("/quotes", status_code=status.HTTP_201_CREATED)
def get_quotes(symbol: Optional[str]=None, fields: Optional[str]=None, indicative: Optional[bool]=None):
    return schwab_market.get_quotes(symbol, fields, indicative)

@router.get("/symbol_id/quotes", status_code=status.HTTP_201_CREATED)
def get_symbolid_quotes(symbol_id : str, fields : Optional[str] = None):
    return schwab_market.get_symbolid_quotes(symbol_id, fields)

@router.get("/chains", status_code=status.HTTP_201_CREATED)
def get_chains(symbol : str, 
        contract_type : Optional[str] = None,  
        strike_count : Optional[int] = None, 
        include_underlying_quote : Optional[bool] = None, 
        strategy : Optional[str] = None,
        interval : Optional[float] = None,
        strike : Optional[float] = None,
        range : Optional[str] = None,
        from_date : Optional[date] = None,
        to_date : Optional[date] = None,
        volatility : Optional[float]  = None,
        underlying_price : Optional[float]  = None,
        interest_rate : Optional[float]  = None,
        days_to_expiration : Optional[int] = None,
        exp_month : Optional[str] = None,
        option_type : Optional[str] = None,
        entitlement : Optional[str] = None):
    return schwab_market.get_chains(
        symbol,
        contract_type, 
        strike_count, 
        include_underlying_quote, 
        strategy,interval,
        strike,
        range,
        from_date,
        to_date,
        volatility,
        underlying_price,
        interest_rate,
        days_to_expiration,
        exp_month,
        option_type,
        entitlement)

@router.get("/expirationchain", status_code=status.HTTP_201_CREATED)
def get_expirationchain(symbol : str):
    return schwab_market.get_expirationchain(symbol)

@router.get("/pricehistory", status_code=status.HTTP_201_CREATED)
def get_pricehistory(symbol : str,
        period_type : Optional[str] = None,
        period : Optional[int] = None,
        frequency_type : Optional[str] = None,
        frequency : Optional[int] = None,
        start_date : Optional[int] = None,
        end_date : Optional[int] = None,
        need_extended_hours_data : Optional[bool] = None,
        need_previous_close : Optional[bool] = None):
    return schwab_market.get_pricehistory(symbol, period_type, period, frequency_type, frequency, start_date, end_date, need_extended_hours_data, need_previous_close)

@router.get("/movers/symbol_id", status_code=status.HTTP_201_CREATED)
def get_movers_symbolid(symbol_id : str, sort : Optional[str] = None, frequency : Optional[int] = None):
    return schwab_market.get_movers_symbolid(symbol_id, sort, frequency)

@router.get("/markets", status_code=status.HTTP_201_CREATED)
def get_markets(markets : str, date : Optional[str] = None):
    return schwab_market.get_markets(markets, date)

@router.get("/markets/market_id", status_code=status.HTTP_201_CREATED)
def get_markets_marketid(market_id : str, date : Optional[str] = None,):
    return schwab_market.get_markets_marketid(market_id, date)

@router.get("/instruments", status_code=status.HTTP_201_CREATED)
def get_instruments(symbol : str, projection : str):
    return schwab_market.get_instruments(symbol, projection)

@router.get("/instruments/cusip_id", status_code=status.HTTP_201_CREATED)
def get_instruments_cusipid(cusip_id : str):
    return schwab_market.get_instruments_cusipid(cusip_id)