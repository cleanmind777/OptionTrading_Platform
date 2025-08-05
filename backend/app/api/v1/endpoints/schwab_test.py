from fastapi import APIRouter, Depends, HTTPException, status
from app.api.v1.endpoints.schwab import SchwabAccountAPI
from datetime import datetime

router = APIRouter()
schwab_account = SchwabAccountAPI()
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

# @router.get("/accounts/account_number/transactions", status_code=status.HTTP_201_CREATED)
# def get_accounts_accountnumber_transactions(account_number: str, start_date: datetime, end_date : datetime, symbol: str, types: str):
#     return schwab_account.get_accounts_accountnumber_transactions(account_number, start_date, end_date, symbol, types)

@router.get("/accounts/account_number/transactions/transaction_id", status_code=status.HTTP_201_CREATED)
def get_accounts_accountnumber_transactions_transactionid(account_number: str, transaction_id: str):
    return schwab_account.get_accounts_accountnumber_transactions_transactionid(account_number, transaction_id)

@router.get("/user_preference", status_code=status.HTTP_201_CREATED)
def get_userpreference():
    return schwab_account.get_userpreference()