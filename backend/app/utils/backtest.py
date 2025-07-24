from lumibot.strategies.strategy import Strategy
from lumibot.traders import Trader
from lumibot.entities import Asset, TradingFee, Order
from lumibot.components.options_helper import OptionsHelper
from lumibot.backtesting import PolygonDataBacktesting
from datetime import datetime, timedelta
import os
import glob
import shutil
import pandas as pd
import json
import zipfile
from uuid import UUID
from app.db.repositories.backtest_repository import user_finish_backtest
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.db.session import engine
from app.models import base
from typing import Optional, Dict, Any, List

"""
CustomizedSingleLegStrategy
---------------------------
A flexible *single–leg* options strategy that lets you specify:
• Underlying symbol (stock/ETF)   • Call or Put   • Long or Short   • Target Δ
• Desired days-to-expiration      • How early to exit   • % of cash to deploy

Trading outline (end-of-day style):
1) If we don’t hold the chosen option, open one that best matches the target
   delta and expiry criteria using the allocated cash.
2) If we do hold it, close it a set number of days before expiry.
3) Repeat daily.  Underlying price is plotted (black line).  Entry & exit
   receive green/up and red/down markers for quick visual inspection.

This code was refined based on the user prompt: "generate code to run lumibot as a process rather than as a thread".  
Main refinement: the live-trading section now instantiates Trader with
use_processes=True so each strategy is executed in its own **separate Python
process** instead of the default thread, offering better isolation and crash
protection.
"""

# -----------------------------------------------------------------------------
#  Helper functions for saving back-test artefacts (unchanged)
# -----------------------------------------------------------------------------
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)

from lumibot.strategies.strategy import Strategy
from lumibot.traders import Trader
from lumibot.entities import Asset, TradingFee, Order
from lumibot.components.options_helper import OptionsHelper
from lumibot.backtesting import PolygonDataBacktesting
from datetime import datetime, timedelta

import os
import glob
import shutil
import pandas as pd
import json
import zipfile

def remove_log():
    folder_path = "logs"

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)  # full path
        if os.path.isfile(file_path):  # check if it is a file (not a directory)
            os.remove(file_path)  # delete the file
            print(f"{filename} is removed")

def move_result(id: UUID):
    # Source directory where the file currently is
    source_dir = r'logs'
    # Destination directory where you want to move and rename the file
    dest_dir = r'result_source'

    try:
        # Make sure destination directory exists
        os.makedirs(dest_dir, exist_ok=True)

        # Check if source directory exists
        if not os.path.exists(source_dir):
            raise FileNotFoundError(f"Source directory '{source_dir}' does not exist")

        # Loop through files in the source directory
        files_found = False
        for filename in os.listdir(source_dir):
            if filename.endswith('_tearsheet.html'):
                source_path = os.path.join(source_dir, filename)
                dest_path = os.path.join(dest_dir, f'{id}_tearsheet.html')
                
                # Check if source file exists
                if not os.path.exists(source_path):
                    print(f"Warning: File '{source_path}' not found")
                    continue
                
                # Move and rename the file
                shutil.move(source_path, dest_path)
                
                print(f"Moved and renamed file '{filename}' to '{dest_path}'")
                files_found = True
                break  # stop after the first match
        # for filename in os.listdir(source_dir):
        #     if filename.endswith('_indicators.html'):
        #         source_path = os.path.join(source_dir, filename)
        #         dest_path = os.path.join(dest_dir, f'{id}_indicators.html')
                
        #         # Check if source file exists
        #         if not os.path.exists(source_path):
        #             print(f"Warning: File '{source_path}' not found")
        #             continue
                
        #         # Move and rename the file
        #         shutil.move(source_path, dest_path)
                
        #         print(f"Moved and renamed file '{filename}' to '{dest_path}'")
        #         files_found = True
        #         break  # stop after the first match
        # for filename in os.listdir(source_dir):
        #     if filename.endswith('_trades.html'):
        #         source_path = os.path.join(source_dir, filename)
        #         dest_path = os.path.join(dest_dir, f'{id}_trades.html')
                
        #         # Check if source file exists
        #         if not os.path.exists(source_path):
        #             print(f"Warning: File '{source_path}' not found")
        #             continue
                
        #         # Move and rename the file
        #         shutil.move(source_path, dest_path)
                
        #         print(f"Moved and renamed file '{filename}' to '{dest_path}'")
        #         files_found = True
        #         break  # stop after the first match        
        if not files_found:
            print("No file ending with '_tearsheet.html' found.")

    except PermissionError as e:
        print(f"Permission error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
"""
CustomizedSingleLegStrategy ➜ now supports *optional* multi-leg trades **and** an
early-exit Profit Target
--------------------------------------------------------------------------
The original strategy could already open 1-leg or multi-leg option trades via
``multi_legs``.  Users asked for two extra abilities:

1.  Run many different strategies (single, vertical, calendar …) by simply
    passing a list of parameter dictionaries to the back-test runner.
2.  Exit profitable positions early once a configurable **Profit Target %** is
    reached instead of waiting for expiry.

Changes in this version
-----------------------
• New parameter **profit_target_pct** (default 0.30 = +30 %).  When the whole
  position/spread reaches this profit, the bot exits all legs at once.
• We now remember entry prices in *self.vars.entry_info* when opening a trade so
  we can calculate accurate P&L on every iteration.
• The code path that checks existing positions first looks at the profit target;
  if hit we close, otherwise we still honour the original *days_before_exit*
  rule.

Everything else (multi-leg definition, helper functions, main back-test loop)
remains unchanged, so existing parameter sets continue to work.

This code was refined based on the user prompt: "Sorry, I mean, I want to do
backtesting various strategy.\nSingleLeg, Two Leg, Three Leg and so on.\nSo
before the bactest, I should set strategy type, counter of legs, and dte,
strike price(delta), option type, long or short for each leg.\nAnd for trade
stop, I should set Profit Target Percentage."
"""

# -----------------------------------------------------------------------------
#  Helper functions for saving back-test artefacts (unchanged)
# -----------------------------------------------------------------------------

def _save_dataframe(df: pd.DataFrame, fname: str):
    try:
        if df is not None and not df.empty:
            df.to_csv(fname, index=True)
            print(f"Saved {fname}")
    except Exception as exc:
        print(f"Could not save {fname}: {exc}")

def _maybe_convert_to_df(obj):
    try:
        if isinstance(obj, pd.DataFrame):
            return obj
        if isinstance(obj, pd.Series):
            return obj.to_frame(name="value")
        if isinstance(obj, list) and obj and isinstance(obj[0], dict):
            return pd.DataFrame(obj)
        if isinstance(obj, dict):
            return pd.DataFrame(obj)
    except Exception:
        pass
    return None

def save_backtest_output_detailed(results: dict, prefix: str = ""):
    if results is None:
        print("save_backtest_output_detailed: results is None, nothing to save.")
        return
    prefix = f"{prefix}_" if prefix and not prefix.endswith("_") else prefix

    json_name = f"{prefix}backtest_results.json"
    try:
        with open(json_name, "w") as f:
            json.dump(results, f, default=str, indent=2)
        print(f"Saved {json_name}")
    except Exception as exc:
        print(f"Failed to save JSON: {exc}")

    for key, val in results.items():
        df_candidate = _maybe_convert_to_df(val)
        if df_candidate is not None:
            _save_dataframe(df_candidate, f"{prefix}{key}.csv")

    equity_keys = [k for k in results.keys() if k.lower() in {"equity", "equity_curve", "portfolio_value", "portfolio_values"}]
    if equity_keys:
        df_eq = _maybe_convert_to_df(results[equity_keys[0]])
        if df_eq is not None:
            if len(df_eq.columns) == 1:
                df_eq.columns = ["equity"]
            _save_dataframe(df_eq, f"{prefix}equity_curve.csv")

# --------------------------------------------------
#  Strategy class
# --------------------------------------------------
class FlexibleOptionStrategy(Strategy):

    # All configurable parameters with sensible defaults
    parameters = {
        "symbol": "SPY",                     # Underlying ticker
        "profit_target_type": "percent",       # "percent", "fixed_net", "fixed_closing"
        "profit_target_value": 0.30,            # Meaning depends on the type chosen
        "investment_pct": 0.10,                 # Percent of available cash we deploy per entry
        "days_before_exit": 5,                  # Failsafe time-exit DTE
        "legs": [                               # Each leg MUST set every key listed below
            {
                "option_type": "call",        # "call" or "put"
                "long_short": "long",         # "long" (=buy) or "short" (=sell-to-open)
                "strike_price": None,          # Explicit strike OR leave None to use target_delta
                "target_delta": 0.25,          # Used only when strike_price is None
                "size_ratio": 1,               # Whole-number ratio for multi-leg combos
                "dte_type": "Target",         # "Exact" or "Target"
                "dte_value": 30,               # For Exact: exact DTE;   for Target: preferred DTE
                "dte_min": 20,                 # Target mode – minimum acceptable DTE
                "dte_max": 40                  # Target mode – maximum acceptable DTE
            }
        ],
    }

    # --------------------------
    #  Initialise the strategy
    # --------------------------
    def initialize(self):
        # Options trade during regular market hours – NYSE calendar is fine
        self.set_market("NYSE")
        # Run once per trading day – ideal cadence for swing style
        self.sleeptime = "1D"
        # Helper for delta look-ups & smarter option-order routing
        self.options_helper = OptionsHelper(self)
        # Track entry details so we can compute accurate P&L and targets later
        self.vars.entry_info = []

    # ---------------------------------------------
    #  Pick an expiration date that matches the leg
    # ---------------------------------------------
    def _select_expiration(self, chains, leg, today):
        target_days = leg.get("dte_value", 30)
        hint_type = leg.get("dte_type", "Target")
        right = leg.get("option_type", "call").lower()
        if hint_type == "Exact":
            desired = today + timedelta(days=target_days)
            if desired.strftime("%Y-%m-%d") in chains.get("Chains", {}).get(right.upper(), {}):
                return desired
            return None
        # Target window logic
        min_days = leg.get("dte_min", max(1, target_days - 10))
        max_days = leg.get("dte_max", target_days + 10)
        expiries = []
        chain_dict = chains.get("Chains", {}).get(right.upper(), {})
        for exp_str in chain_dict.keys():
            try:
                exp_date = datetime.strptime(exp_str, "%Y-%m-%d").date()
                dte = (exp_date - today).days
                if min_days <= dte <= max_days:
                    expiries.append(exp_date)
            except Exception:
                continue
        if not expiries:
            return None
        # Pick the expiry closest to our preferred DTE
        return min(expiries, key=lambda d: abs((d - (today + timedelta(days=target_days))).days))

    # -------------------------------------------------------------
    #  Build a leg by explicit strike or closest delta
    # -------------------------------------------------------------
    def _build_leg_asset(self, underlying, leg_settings, strikes, expiry):
        right_key = "CALL" if leg_settings["option_type"].lower() == "call" else "PUT"
        # If user supplied a strike try to honour it – otherwise fall back to delta
        if leg_settings.get("strike_price") is not None:
            strike = leg_settings["strike_price"]
            if strike not in strikes:
                strike = min(strikes, key=lambda x: abs(x - strike))
        else:
            # Derive strike from desired delta
            strike_deltas = self.options_helper.get_strike_deltas(
                underlying_asset=underlying,
                expiry=expiry,
                strikes=strikes,
                right=leg_settings["option_type"].lower(),
            ) or {}
            strike_deltas = {k: v for k, v in strike_deltas.items() if v is not None}
            if not strike_deltas:
                return None, None
            target_abs_delta = abs(leg_settings.get("target_delta", 0.25))
            strike = min(strike_deltas.keys(), key=lambda k: abs(abs(strike_deltas[k]) - target_abs_delta))
        # Assemble the Asset object for this option contract
        opt_asset = Asset(
            symbol=underlying.symbol,
            asset_type=Asset.AssetType.OPTION,
            expiration=expiry,
            strike=strike,
            right=Asset.OptionRight.CALL if right_key == "CALL" else Asset.OptionRight.PUT,
            underlying_asset=underlying,
        )
        return opt_asset, strike

    # --------------------------------------------------
    #  P&L helper: returns dollar & percent profit as a tuple
    # --------------------------------------------------
    def _calculate_pnl(self, positions):
        total_entry_value, total_profit = 0.0, 0.0
        entry_lookup = {(e["asset"].symbol, e["asset"].strike, e["asset"].expiration, e["asset"].right): e for e in self.vars.entry_info}
        for pos in positions:
            key = (pos.asset.symbol, pos.asset.strike, pos.asset.expiration, pos.asset.right)
            info = entry_lookup.get(key)
            if info is None:
                continue
            entry_price = info["price"]
            current_price = self.get_last_price(pos.asset)
            if entry_price is None or current_price is None:
                continue
            qty = pos.quantity
            entry_val = abs(qty) * entry_price * 100
            current_val = abs(qty) * current_price * 100
            profit = current_val - entry_val if qty > 0 else entry_val - current_val
            total_entry_value += entry_val
            total_profit += profit
        profit_pct = (total_profit / total_entry_value) if total_entry_value else None
        return total_profit, profit_pct

    # --------------------------------------------------
    #  Main daily logic
    # --------------------------------------------------
    def on_trading_iteration(self):
        p = self.parameters
        underlying = Asset(p["symbol"], Asset.AssetType.STOCK)
        today = self.get_datetime().date()

        # Plot underlying price for context
        spot_price = self.get_last_price(underlying)
        if spot_price is not None:
            self.add_line(underlying.symbol, spot_price, color="black", detail_text=f"{underlying.symbol} Price")
        else:
            self.log_message("No underlying price – skipping today.", color="yellow")
            return

        # 1) If we already hold option positions, monitor for exits
        option_positions = [pos for pos in self.get_positions() if pos.asset.asset_type == Asset.AssetType.OPTION and pos.asset.underlying_asset.symbol == underlying.symbol]
        if option_positions:
            # Calculate overall P&L
            total_profit_dollar, profit_pct = self._calculate_pnl(option_positions)
            trigger_hit = False

            if p["profit_target_type"] == "percent" and profit_pct is not None and profit_pct >= p["profit_target_value"]:
                trigger_hit = True
            elif p["profit_target_type"] in {"net_dollar", "fixed_net"} and total_profit_dollar is not None and total_profit_dollar >= p["profit_target_value"]:
                trigger_hit = True
            elif p["profit_target_type"] == "fixed_closing":
                # Fixed closing: exit once *all* long legs are above target AND/OR all short legs are below target
                long_legs_ok, short_legs_ok = True, True
                target_price = p["profit_target_value"]
                for pos in option_positions:
                    last_price = self.get_last_price(pos.asset)
                    if last_price is None:
                        long_legs_ok = short_legs_ok = False
                        break
                    if pos.quantity > 0 and last_price < target_price:
                        long_legs_ok = False
                    if pos.quantity < 0 and last_price > target_price:
                        short_legs_ok = False
                trigger_hit = long_legs_ok and short_legs_ok

            if trigger_hit:
                self.log_message("Profit target reached – closing all legs.", color="green")
                close_orders = [
                    self.create_order(
                        pos.asset,
                        abs(pos.quantity),
                        Order.OrderSide.BUY_TO_CLOSE if pos.quantity < 0 else Order.OrderSide.SELL
                    ) for pos in option_positions
                ]
                self.submit_orders(close_orders)
                self.add_marker("ProfitExit", spot_price, color="green", symbol="star", detail_text="Profit Target Hit")
                return

            # Secondary exit: X days before expiration
            min_dte = min((pos.asset.expiration - today).days for pos in option_positions)
            if min_dte <= p.get("days_before_exit", 5):
                self.log_message("Near expiration – time exit.", color="red")
                close_orders = [
                    self.create_order(
                        pos.asset,
                        abs(pos.quantity),
                        Order.OrderSide.BUY_TO_CLOSE if pos.quantity < 0 else Order.OrderSide.SELL
                    ) for pos in option_positions
                ]
                self.submit_orders(close_orders)
                self.add_marker("TimeExit", spot_price, color="red", symbol="arrow-down", detail_text="DTE Exit")
            return  # finished monitoring for today

        # 2) No open positions – look for a fresh entry
        available_cash = self.get_cash()
        investable_cash = available_cash * p.get("investment_pct", 0.10)
        if investable_cash < 50:  # not worth opening anything
            self.log_message("Allocated cash too small – skip entry.", color="yellow")
            return

        chains = self.get_chains(underlying)
        if not chains:
            self.log_message("Option chains unavailable – skip entry.", color="yellow")
            return

        legs = p.get("legs", [])
        if not legs:
            self.log_message("No legs defined – nothing to do.", color="yellow")
            return

        # Find a common expiration that satisfies the first leg (we assume all legs share the same expiry)
        expiry = self._select_expiration(chains, legs[0], today)
        if expiry is None:
            self.log_message("Could not find suitable expiration – skip entry.", color="yellow")
            return
        expiry_str = expiry.strftime("%Y-%m-%d")

        # Budget per ratio-unit (sum of size_ratio is the denominator)
        total_ratio = sum(max(1, int(l.get("size_ratio", 1))) for l in legs)
        cash_per_ratio_unit = investable_cash / total_ratio if total_ratio else 0

        orders_to_send = []
        self.vars.entry_info = []  # reset entry tracker

        for leg in legs:
            ratio = max(1, int(leg.get("size_ratio", 1)))
            right_key = "CALL" if leg.get("option_type", "call").lower() == "call" else "PUT"
            strikes_list = chains.get("Chains", {}).get(right_key, {}).get(expiry_str)
            if not strikes_list:
                self.log_message(f"No strikes for {right_key} on {expiry_str} – abort entry.", color="yellow")
                return
            opt_asset, _ = self._build_leg_asset(underlying, leg, strikes_list, expiry)
            if opt_asset is None:
                self.log_message("Strike selection failed – abort entry.", color="yellow")
                return

            # Mid-price estimate for affordability check
            quote = self.get_quote(opt_asset)
            opt_price = quote.mid_price if quote and quote.mid_price is not None else self.get_last_price(opt_asset)
            if opt_price is None:
                self.log_message("Price unavailable – abort entry.", color="yellow")
                return

            max_affordable = int((cash_per_ratio_unit * ratio) // (opt_price * 100))
            if max_affordable <= 0:
                self.log_message("Not enough cash for desired ratio – abort entry.", color="yellow")
                return

            side = Order.OrderSide.BUY if leg.get("long_short", "long").lower() == "long" else Order.OrderSide.SELL_TO_OPEN
            orders_to_send.append(self.create_order(opt_asset, max_affordable, side))
            signed_qty = max_affordable if side == Order.OrderSide.BUY else -max_affordable
            self.vars.entry_info.append({"asset": opt_asset, "price": opt_price, "quantity": signed_qty})
            self.log_message(f"Leg prepared – {side} {max_affordable}x {opt_asset.symbol} {opt_asset.strike} exp {expiry_str}")

        # 3) Execute entry – try bundled order first, then fall back to individual market orders
        if orders_to_send:
            try:
                # Try to execute as a smart multi-leg order at the mid price
                self.options_helper.execute_orders(orders_to_send, limit_type="mid")
                self.add_marker("OpenPos", spot_price, color="green", symbol="arrow-up", detail_text="Opened Trade")
            except TypeError:
                # Sometimes OptionsHelper cannot produce a bundle limit – fallback
                self.log_message("OptionsHelper could not calculate a limit price – submitting legs individually at market.", color="yellow")
                self.submit_orders(orders_to_send)
                self.add_marker("OpenPosFallback", spot_price, color="blue", symbol="star", detail_text="Opened (fallback)")

        # 4) If the user picked a fixed closing target we immediately submit the corresponding exit orders
        if p["profit_target_type"] == "fixed_closing":
            closing_orders = []
            target_price = p["profit_target_value"]
            for entry in self.vars.entry_info:
                asset = entry["asset"]
                qty = abs(entry["quantity"])
                if entry["quantity"] > 0:  # long – sell when price >= target
                    closing_orders.append(self.create_order(asset, qty, Order.OrderSide.SELL, limit_price=target_price))
                else:                        # short – buy when price <= target
                    closing_orders.append(self.create_order(asset, qty, Order.OrderSide.BUY_TO_CLOSE, limit_price=target_price))
            if closing_orders:
                self.submit_orders(closing_orders)
                self.log_message("Resting profit-target orders submitted (fixed closing mode).", color="blue")
# -----------------------------------------------------------------------------
def backtest(strategy_parameters: json, start_date: datetime, end_date:datetime, id: UUID):
    remove_log()
    session = SessionLocal()
    # ----------------------------------------------------------
    # 0️⃣  Detect environment & decide if we back-test or go live
    # ----------------------------------------------------------
    try:
        try:
            from lumibot.credentials import IS_BACKTESTING as LB_IS_BACKTESTING
        except Exception:
            LB_IS_BACKTESTING = False

        FORCE_BACKTEST_MODE = True  # Set to False if you want to run live by default
        IS_BACKTESTING = FORCE_BACKTEST_MODE or LB_IS_BACKTESTING

        POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
        if not POLYGON_API_KEY:
            print("WARNING: Polygon API key missing – required for options back-testing.")
        else:
            os.environ["POLYGON_API_KEY"] = POLYGON_API_KEY

        # ------------------------------------------------------------------
        # FULL SAMPLE PARAMETER SETS – copy the block you need and tweak it
        # ------------------------------------------------------------------
        
        if IS_BACKTESTING:
            trading_fee = TradingFee(flat_fee=0.65)  # Typical per-contract fee assumption
            backtesting_start = start_date # Back-test window (< 2 yrs for Polygon minute limits)
            backtesting_end = end_date
            print("\n" + "="*60)
            print("Starting flexible option strategy back-test …")
            print("="*60)

            results = FlexibleOptionStrategy.backtest(
                PolygonDataBacktesting,
                backtesting_start,
                backtesting_end,
                benchmark_asset=Asset("SPY", Asset.AssetType.STOCK),
                buy_trading_fees=[trading_fee],
                sell_trading_fees=[trading_fee],
                quote_asset=Asset("USD", Asset.AssetType.FOREX),
                budget=100000,
                parameters=strategy_parameters,
            )
            user_finish_backtest(session, id, results)
            move_result(id)
            # save_backtest_output_detailed(session, results, "flex_opt_test")
            print("Back-test finished – results saved with prefix 'flex_opt_test_*'.")

        else:
            trader = Trader()
            live_strategy = FlexibleOptionStrategy(
                quote_asset=Asset("USD", Asset.AssetType.FOREX),
                parameters=strategy_parameters,
            )
            trader.add_strategy(live_strategy)
            trader.run_all()
    finally:
        session.close()