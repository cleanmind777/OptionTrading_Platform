import time
from uuid import UUID
from celery.contrib.abortable import AbortableTask
from celery_app import celery_app
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.services.trading_task_serivce import add_win_trade, get_trading_task_status
from app.utils.live_trade import bullish_signal, build_multi_leg_order, find_option
from app.api.v1.endpoints.schwab import SchwabAccountAPI, SchwabMarketAPI

schwab_account = SchwabAccountAPI()
schwab_market = SchwabMarketAPI()
# Create a session factory bound to your DB engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery_app.task(bind=True, base=AbortableTask)
def trading(self, bot_id: str, trading_task_id: str):
    """
    Long-running trading task that checks if it should continue by querying DB.
    Supports cooperative abort via self.is_aborted().

    Args:
        bot_id: str UUID of the bot (as string)
        trading_task_id: str ID of the trading task in DB

    """
    db = SessionLocal()
    account_info = schwab_account.get_accounts_accountnumbers()
    account_number = account_info[0]['accountNumber']
    try:
        while True:
            # Check if task has been requested to abort
            if self.is_aborted():
                print(f"Task {self.request.id} aborted!")
                break

            trading_task = get_trading_task_status(db, trading_task_id)
            if not trading_task or not trading_task.is_active:
                print(f"TradingTask {trading_task_id} inactive or not found, stopping task.")
                break

            # Your task logic here, e.g. logging the task id and active state
            print(f"Running trading task {trading_task.id}, active status: {trading_task.is_active}")
            price_hist_resp = schwab_market.get_pricehistory(trading_task.symbol, "day", 10, "daily", 1, None, None, None, None)
            price_history = [candle['close'] for candle in price_hist_resp['candles']]
            current_price = price_history[-1]
            is_bullish, ma5 = bullish_signal(price_history)
            
            print(f"Current Price for {trading_task.symbol}: {current_price}")
            print(f"5-day Moving Average: {ma5}")
            print(f"Bullish Signal: is_bullish" )

            if not is_bullish:
                print("No bullish signal - skipping order.")
                continue
            
            
            # Fetch option chain - calls and puts
            option_chain = schwab_market.get_chains(trading_task.symbol, "ALL", 20, "True", None, None, None, None, None, None, None, None, None, None, None, None, None)

            call_map = option_chain.get("callExpDateMap", {})
            put_map = option_chain.get("putExpDateMap", {})
            
            # Example Multi-leg Strategies:
            # 1. Single Leg (just buy 1 call ATM)
            # 2. Vertical Spread (buy 1 call ATM, sell 1 call slightly OTM)
            # 3. Iron Condor (4 legs: vertical put spread + vertical call spread)

            # === Example 1: Single Leg ===
            single_leg_call = find_option(call_map, current_price, option_type="CALL", strike_offset=0)
            if single_leg_call:
                print("Single Leg Call Option chosen:", single_leg_call['symbol'])

            # === Example 2: Vertical Spread (Call) ===
            vertical_buy = find_option(call_map, current_price, option_type="CALL", strike_offset=0)
            vertical_sell = find_option(call_map, current_price, option_type="CALL", strike_offset=1)
            if vertical_buy and vertical_sell:
                print("Vertical Spread Legs:")
                print("Buy Call:", vertical_buy['symbol'])
                print("Sell Call:", vertical_sell['symbol'])

            # === Example 3: Iron Condor ===
            # Put spread: Sell put ATM, Buy put lower strike
            iron_put_sell = find_option(put_map, current_price, option_type="PUT", strike_offset=0)
            iron_put_buy = find_option(put_map, current_price, option_type="PUT", strike_offset=-1)
            # Call spread: Sell call ATM, Buy call higher strike
            iron_call_sell = find_option(call_map, current_price, option_type="CALL", strike_offset=0)
            iron_call_buy = find_option(call_map, current_price, option_type="CALL", strike_offset=1)

            iron_condor_legs = []
            if iron_put_sell and iron_put_buy and iron_call_sell and iron_call_buy:
                iron_condor_legs = [
                    {"instruction": "SELL_TO_OPEN", "quantity": 1, "symbol": iron_put_sell['symbol']},
                    {"instruction": "BUY_TO_OPEN",  "quantity": 1, "symbol": iron_put_buy['symbol']},
                    {"instruction": "SELL_TO_OPEN", "quantity": 1, "symbol": iron_call_sell['symbol']},
                    {"instruction": "BUY_TO_OPEN",  "quantity": 1, "symbol": iron_call_buy['symbol']},
                ]

                print("Iron Condor Legs:")
                for leg in iron_condor_legs:
                    print(f"{leg['instruction']} {leg['symbol']}")

            # === Select which strategy you want ===
            # Uncomment one of the below strategies to place the order:

            # --- Single Leg Order ---
            if single_leg_call:
                order_payload = build_multi_leg_order([
                    {"instruction": "BUY_TO_OPEN", "quantity":1, "symbol": single_leg_call['symbol']}
                ])
                confirmation = schwab_account.post_accounts_accountnumber_orders(account_number, order_payload)
                print("Order confirmation:", confirmation)

            # --- Vertical Spread Order ---
            if vertical_buy and vertical_sell:
                order_payload = build_multi_leg_order([
                    {"instruction": "BUY_TO_OPEN",  "quantity":1, "symbol": vertical_buy['symbol']},
                    {"instruction": "SELL_TO_OPEN", "quantity":1, "symbol": vertical_sell['symbol']}
                ])
                confirmation = schwab_account.post_accounts_accountnumber_orders(account_number, order_payload)
                print("Order confirmation:", confirmation)

            # --- Iron Condor Order ---
            if iron_condor_legs:
                order_payload = build_multi_leg_order(iron_condor_legs)
                confirmation = schwab_account.post_accounts_accountnumber_orders(account_number, order_payload)
                print("Iron Condor Order confirmation:", confirmation)
            else:
                print("No valid iron condor legs found.")
            
            
            time.sleep(10)  # simulate work

        return bot_id
    finally:
        db.close()
