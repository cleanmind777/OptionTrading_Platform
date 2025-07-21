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


DATABASE_URL = "postgresql://postgres:hpscks0518@localhost:5432/tradig1"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)

def _save_dataframe(df: pd.DataFrame, fname: str):
    """Utility that saves a DataFrame to CSV – catches errors for safety."""
    try:
        if df is not None and not df.empty:
            df.to_csv(fname, index=True)
            print(f"Saved {fname}")
    except Exception as exc:
        print(f"Could not save {fname}: {exc}")


def _maybe_convert_to_df(obj):
    """If *obj* is a list-of-dicts or dict-of-lists turn it into a DataFrame."""
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


def save_backtest_output_detailed(session, results: Dict[str, Any], prefix: str = "", id: UUID = ""):
    """Create **extra** CSVs & a basic HTML tear-sheet from LumiBot results."""

    if results is None:
        print("save_backtest_output_detailed: results is None, nothing to save.")
        return

    prefix = f"{prefix}_" if prefix and not prefix.endswith("_") else prefix

    json_name = f"{prefix}backtest_results.json"
    # try:
    result = results
    user_finish_backtest(session, id, result)
    with open(json_name, "w") as f:
        json.dump(results, f, default=str, indent=2)
    print(f"Saved {json_name}")
    # except Exception as exc:
    #     print(f"Failed to save JSON: {exc}")

    for key, val in results.items():
        df_candidate = _maybe_convert_to_df(val)
        if df_candidate is not None:
            _save_dataframe(df_candidate, f"{prefix}{key}.csv")

    equity_keys = [k for k in results.keys() if k.lower() in {"equity", "equity_curve", "portfolio_value", "portfolio_values"}]
    if equity_keys:
        eq = results[equity_keys[0]]
        df_eq = _maybe_convert_to_df(eq)
        if df_eq is not None:
            if len(df_eq.columns) == 1:
                df_eq.columns = ["equity"]
            _save_dataframe(df_eq, f"{prefix}equity_curve.csv")

    # if not any(name.endswith("tearsheet.html") for name in os.listdir(".")):
    #     _create_basic_tearsheet(prefix, results)


def _create_basic_tearsheet(prefix: str, results: dict):
    html_name = f"{prefix}tearsheet.html"
    try:
        metrics = results.get("metrics", {})
        lines = [
            "<html><head><title>LumiBot Back-test Tearsheet</title></head><body>",
            "<h1>Basic Tearsheet (Fallback)</h1>",
            "<table border='1' cellpadding='5'>",
            "<tr><th>Metric</th><th>Value</th></tr>",
        ]
        if metrics:
            for k, v in metrics.items():
                lines.append(f"<tr><td>{k}</td><td>{v}</td></tr>")
        lines.extend(["</table>", "</body></html>"])
        with open(html_name, "w") as f:
            f.write("\n".join(lines))
        print(f"Saved {html_name}")
    except Exception as exc:
        print(f"Failed to create fallback tearsheet: {exc}")

# -----------------------------------------------------------------------------
#  Utility helpers for moving / zipping logs (unchanged)
# -----------------------------------------------------------------------------

def _copy_with_prefix(src_path: str, prefix: str):
    if not os.path.exists(src_path):
        return
    clean_prefix = f"{prefix}_" if not prefix.endswith("_") else prefix
    dst_name = clean_prefix + os.path.basename(src_path)
    if os.path.exists(dst_name):
        return
    try:
        shutil.copy(src_path, dst_name)
        print(f"Copied {src_path} ➜ {dst_name}")
    except Exception as exc:
        print(f"Failed to copy {src_path}: {exc}")


def _gather_log_files():
    patterns = ["*.log", "logs/**/*.log"]
    found = []
    for pattern in patterns:
        found.extend(glob.glob(pattern, recursive=True))
    return list({os.path.normpath(p) for p in found})


def _zip_logs(prefix: str):
    if not prefix:
        return
    log_files = _gather_log_files()
    if not log_files:
        print("No log files found to zip.")
        return
    zip_name = f"{prefix}_logs.zip" if not prefix.endswith("_") else f"{prefix}logs.zip"
    try:
        with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zf:
            for lf in log_files:
                zf.write(lf)
        print(f"Created log archive {zip_name} with {len(log_files)} files.")
    except Exception as exc:
        print(f"Failed to create log archive: {exc}")


def ensure_prefixed_outputs(prefix: str):
    if not prefix:
        return
    candidate_sheets = sorted(glob.glob("*tearsheet.html"), key=os.path.getmtime, reverse=True)
    if candidate_sheets:
        _copy_with_prefix(candidate_sheets[0], prefix)
    for log_path in _gather_log_files():
        _copy_with_prefix(log_path, prefix)
    _zip_logs(prefix)

# -----------------------------------------------------------------------------
#  STRATEGY CLASS (unchanged trading logic)
# -----------------------------------------------------------------------------
class CustomizedSingleLegStrategy(Strategy):

    parameters = {
        "underlying_symbol": "SPY",
        "option_type": "call",  # "call" or "put"
        "long_short": "long",    # "long" for buy, "short" for sell-to-open
        "target_delta": 0.30,     # Desired option delta in absolute terms (0-1)
        "days_to_expiry": 30,
        "days_before_exit": 5,
        "investment_pct": 0.10,   # % of current cash to deploy each trade
    }

    def initialize(self):
        # Regular US equity hours – no overnight trading needed
        self.set_market("NYSE")
        # Run once per trading day after the close (end-of-day style)
        self.sleeptime = "1D"
        # Helper that simplifies option-chain work
        self.options_helper = OptionsHelper(self)
        # Persistent flag to know if we already traded today
        self.vars.traded_today = False

    def on_trading_iteration(self):
        self.vars.traded_today = False
        p = self.parameters
        underlying = Asset(p["underlying_symbol"], Asset.AssetType.STOCK)
        today = self.get_datetime().date()

        spot_price = self.get_last_price(underlying)
        if spot_price is not None:
            # Draw the underlying's closing price as a black line for context
            self.add_line(underlying.symbol, spot_price, color="black", detail_text=f"{underlying.symbol} Price")
        else:
            self.log_message("No price for underlying – skipping iteration.", color="yellow")
            return

        # --------------------------------------------------
        # 1) Check if we already hold the desired option
        # --------------------------------------------------
        existing_position = None
        for pos in self.get_positions():
            a = pos.asset
            if (
                a.asset_type == Asset.AssetType.OPTION
                and a.underlying_asset.symbol == underlying.symbol
                and (
                    (p["option_type"].lower() == "call" and a.right == Asset.OptionRight.CALL)
                    or (p["option_type"].lower() == "put" and a.right == Asset.OptionRight.PUT)
                )
            ):
                existing_position = pos
                break

        if existing_position is not None:
            # ----------------------------------------------
            # We hold something – exit X days before expiry
            # ----------------------------------------------
            opt_asset = existing_position.asset
            dte = (opt_asset.expiration - today).days
            self.log_message(f"Currently holding {opt_asset.symbol} with {dte} DTE.")

            if dte <= p["days_before_exit"]:
                close_side = Order.OrderSide.SELL if existing_position.quantity > 0 else Order.OrderSide.BUY_TO_CLOSE
                exit_order = self.create_order(opt_asset, abs(existing_position.quantity), close_side)
                self.submit_order(exit_order)
                self.add_marker("Close Pos", spot_price, color="red", symbol="arrow-down", detail_text="Position exit")
                self.vars.traded_today = True
            return

        # ----------------------------------------------
        # 2) We don't hold – open a new position
        # ----------------------------------------------
        available_cash = self.get_cash()
        investable_cash = available_cash * p["investment_pct"]
        if investable_cash < 50:  # Under $50 won't even buy 1 contract usually
            self.log_message("Allocated cash too small – skipping entry.", color="yellow")
            return

        chains = self.get_chains(underlying)
        if not chains:
            self.log_message("Option chains unavailable – skipping entry.", color="yellow")
            return

        target_date = today + timedelta(days=p["days_to_expiry"])
        expiry = self.options_helper.get_expiration_on_or_after_date(target_date, chains, p["option_type"].lower())
        if expiry is None:
            self.log_message("No suitable expiration found – skipping entry.", color="yellow")
            return

        expiry_str = expiry.strftime("%Y-%m-%d")
        right_key = "CALL" if p["option_type"].lower() == "call" else "PUT"
        strikes = chains.get("Chains", {}).get(right_key, {}).get(expiry_str)
        if not strikes:
            self.log_message("No strikes for that expiry – skipping entry.", color="yellow")
            return

        # Map every strike to its delta so we can pick the closest to target
        try:
            strike_deltas = self.options_helper.get_strike_deltas(
                underlying_asset=underlying,
                expiry=expiry,
                strikes=strikes,
                right=p["option_type"].lower(),
            ) or {}
        except Exception as exc:
            self.log_message(f"Delta lookup error: {exc}", color="yellow")
            return

        strike_deltas = {k: v for k, v in strike_deltas.items() if v is not None}
        if not strike_deltas:
            self.log_message("No delta data – skipping entry.", color="yellow")
            return

        target_abs_delta = abs(p["target_delta"])
        chosen_strike = min(strike_deltas.keys(), key=lambda k: abs(abs(strike_deltas[k]) - target_abs_delta))
        chosen_delta = strike_deltas[chosen_strike]

        option_asset = Asset(
            symbol=underlying.symbol,
            asset_type=Asset.AssetType.OPTION,
            expiration=expiry,
            strike=chosen_strike,
            right=Asset.OptionRight.CALL if right_key == "CALL" else Asset.OptionRight.PUT,
            underlying_asset=underlying,
        )

        quote = self.get_quote(option_asset)
        option_price = quote.mid_price if quote and quote.mid_price is not None else self.get_last_price(option_asset)
        if option_price is None:
            self.log_message("Price unavailable for chosen option – skipping entry.", color="yellow")
            return

        contracts = int(investable_cash // (option_price * 100))
        if contracts <= 0:
            self.log_message("Option too expensive for allocation – skipping entry.", color="yellow")
            return

        entry_side = Order.OrderSide.BUY if p["long_short"].lower() == "long" else Order.OrderSide.SELL_TO_OPEN
        entry_order = self.create_order(option_asset, contracts, entry_side, limit_price=option_price)
        self.submit_order(entry_order)

        self.add_marker("Open Pos", spot_price, color="green", symbol="arrow-up", detail_text="Opened option")
        self.log_message(
            f"{entry_side} {contracts}× {option_asset.symbol} (strike {chosen_strike}, Δ≈{chosen_delta:.2f}, exp {expiry}).",
            color="green",
        )
        self.vars.traded_today = True

# -----------------------------------------------------------------------------
#  MAIN – parameter overrides + moved ENV/BACKTEST detection
# -----------------------------------------------------------------------------
def backtest(strategy_parameters: json, start_date: datetime, end_date:datetime, id: UUID):
    session = SessionLocal()
    # ----------------------------------------------------------
    # 0️⃣  Detect environment & decide if we back-test or go live
    # ----------------------------------------------------------
    try:
        POLYGON_API_KEY = os.getenv("POLYGON_API_KEY", "REPLACE_WITH_YOUR_POLYGON_API_KEY")
        FORCE_BACKTEST_MODE = True  # Set to False when ready for live trading

        if POLYGON_API_KEY and POLYGON_API_KEY != "REPLACE_WITH_YOUR_POLYGON_API_KEY":
            os.environ["POLYGON_API_KEY"] = POLYGON_API_KEY
        else:
            print("WARNING: Polygon API key missing – please supply a real key or live data will fail.")

        try:
            from lumibot.credentials import IS_BACKTESTING as LB_IS_BACKTESTING
        except Exception:
            LB_IS_BACKTESTING = False
        IS_BACKTESTING = FORCE_BACKTEST_MODE or LB_IS_BACKTESTING

        # File-name prefix so you can easily spot results from this run
        RESULT_PREFIX = "abc"  # Feel free to change e.g. to a timestamp or strategy name

        # ----------------------------------------------------------
        # 1️⃣  Define/override strategy parameters here
        # ----------------------------------------------------------
        params = {
            # You can uncomment or edit these lines to customise behaviour
            # "underlying_symbol": "AAPL",
            # "option_type": "put",
            # "long_short": "long",
            # "target_delta": 0.25,
            # "days_to_expiry": 45,
            # "days_before_exit": 7,
            # "investment_pct": 0.20,
        }

        if IS_BACKTESTING:
            # ----------------------------------------------
            # BACK-TEST EXECUTION
            # ----------------------------------------------
            trading_fee = TradingFee(flat_fee=0.65)  # Typical per-contract fee
            backtesting_start = start_date  # Keep within last 2yrs for Polygon
            backtesting_end = end_date

            results = CustomizedSingleLegStrategy.backtest(
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

            # Save lots of outputs for later analysis
            save_backtest_output_detailed(session, results, RESULT_PREFIX, id)
            ensure_prefixed_outputs(RESULT_PREFIX)
            if RESULT_PREFIX:
                print(f"Back-test outputs saved with prefix '{RESULT_PREFIX}_*'")
        else:
            # ----------------------------------------------
            # LIVE EXECUTION
            # ----------------------------------------------
            # IMPORTANT CHANGE: use_processes=True ➜ LumiBot will launch each
            # strategy in its **own operating-system process** for better stability.
            trader = Trader(use_processes=True)  # ← key change per user request
            strategy_live = CustomizedSingleLegStrategy(
                quote_asset=Asset("USD", Asset.AssetType.FOREX),
                parameters=params
            )
            trader.add_strategy(strategy_live)
            trader.run_all()
    finally:
        session.close()