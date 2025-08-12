import statistics
import datetime

def moving_average(prices, window=5):
    return statistics.mean(prices[-window:])

def bullish_signal(price_history):
    ma5 = moving_average(price_history, 5)
    return price_history[-1] > ma5, ma5

def find_option(contract_map, underlying_price, option_type, strike_offset=0, max_days=30):
    """
    Finds option matching the criteria:
    - Call or Put (option_type)
    - ATM strike + offset (offset in strikes)
    - Expiry within max_days

    """
    leg_option = None
    today = datetime.date.today()

    # Schwab API option chain keys are like '2024-08-16:5' — date:expiration type, first split date
    # contract_map structure: {expiry: {strike: [contracts]}}
    
    for expiry_key, strikes in contract_map.items():
        expiry_str = expiry_key.split(':')[0]
        try:
            expiry_date = datetime.datetime.strptime(expiry_str, "%Y-%m-%d").date()
        except ValueError:
            continue
        days_to_exp = (expiry_date - today).days
        if days_to_exp > max_days or days_to_exp < 0:
            continue
        
        # Sort strikes numeric
        sorted_strikes = sorted([float(k) for k in strikes.keys()])
        
        # Find index of underlying_price nearest strike
        idx = min(range(len(sorted_strikes)), key=lambda i: abs(sorted_strikes[i] - underlying_price))
        target_idx = idx + strike_offset
        if target_idx < 0 or target_idx >= len(sorted_strikes):
            continue
        target_strike = sorted_strikes[target_idx]
        
        contracts = strikes.get(str(target_strike), [])
        for contract in contracts:
            if contract['putCall'].lower() == option_type.lower():
                if leg_option is None or contract['mark'] < leg_option['mark']:
                    leg_option = contract
    return leg_option


# ============ Build Multi-Leg Order ============

def build_multi_leg_order(legs):
    """
    legs: list of dicts with keys:
      - symbol: option symbol string
      - instruction: BUY_TO_OPEN, SELL_TO_OPEN, BUY_TO_CLOSE, SELL_TO_CLOSE (string)
      - quantity: int
    """
    order_legs = []
    for leg in legs:
        order_legs.append({
            "instruction": leg["instruction"],
            "quantity": leg["quantity"],
            "instrument": {
                "symbol": leg["symbol"],
                "assetType": "OPTION"
            }
        })
    order_payload = {
        "orderType": "MARKET",       # Could be LIMIT, etc.
        "session": "NORMAL",
        "duration": "DAY",
        "orderStrategyType": "MULTI_LEG",
        "orderLegCollection": order_legs
    }
    return order_payload