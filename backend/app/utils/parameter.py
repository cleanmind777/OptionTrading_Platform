from app.schemas.bot import BotInfo
from app.schemas.strategy import StrategyInfo, Leg
from typing import List, Dict
def convert_params(bot: BotInfo, strategy: StrategyInfo):
    params = {}
    params["investment_pct"] = 0.10
    try:
        params["symbol"] = strategy.symbol
    except:
        pass
    
    try:
        if bot.trade_exit['profit_target_type'] == "DISABLED" or bot.trade_exit['profit_target_type'] == None:
            params["profit_target_type"] = None
            params['profit_target_value'] = None
        elif bot.trade_exit['profit_target_type'] == "FIXED CLOSING CREDIT TARGET":
            params['profit_target_type'] = "fixed_closing"
            params["profit_target_value"] = bot.trade_exit['profit_target_value']
        elif bot.trade_exit['profit_target_type'] == "FIXED NET PROFIT TARGET":
            params["profit_target_type"] = "fixed_net"
            params["profit_target_value"] = bot.trade_exit['profit_target_value']
        elif bot.trade_exit['profit_target_type'] == "PERCENT PROFIT TARGET":
            params["profit_target_type"] = "percent"
            params["profit_target_value"] = bot.trade_exit['profit_target_value']
    except:
        params["profit_target_type"] = None
        params['profit_target_value'] = None
        pass
    
    try:
        params["days_before_exit"] = bot.trade_exit['exit_at_set_time'][0]
    except:
        pass
    
    try:
        if bot.trade_exit['stop_loss_type'] == "DISABLED" or bot.trade_exit['stop_loss_type'] == None:
            params["stop_type"] = None
            params['stop_value'] = None
        elif bot.trade_exit['stop_loss_type'] == "PERCENT LOSS":
            params['profit_target_type'] = "percent_loss"
            params["stop_value"] = bot.trade_exit['stop_value']
        elif bot.trade_exit['stop_loss_type'] == "DOLLAR LOSS":
            params["stop_type"] = "dollar_loss"
            params["stop_value"] = bot.trade_exit['stop_value']
        elif bot.trade_exit['stop_loss_type'] == "UNDERLYING POINTS":
            params["stop_type"] = "underlying_points"
            params["stop_value"] = bot.trade_exit['stop_value']
        elif bot.trade_exit['stop_loss_type'] == "UNDERLYING PERCENT":
            params["stop_type"] = "underlying_percent"
            params["stop_value"] = bot.trade_exit['stop_value']
        elif bot.trade_exit['stop_loss_type'] == "FIXED DELTA":
            params["stop_type"] = "delta"
            params["stop_value"] = bot.trade_exit['stop_value']
        elif bot.trade_exit['stop_loss_type'] == "RELATIVE DELTA":
            params["stop_type"] = "relative_delta"
            params["stop_value"] = bot.trade_exit['stop_value']
    except:
        pass
    
    params["legs"] = []
    for leg in strategy.legs:
        new_leg = {}
        if leg["strike_target_type"] == "Delta":
            new_leg["strike_target_type"] = "delta"
            new_leg['target_delta'] = leg['strike_target_value'][1]
            new_leg['min_delta'] = leg['strike_target_value'][0]
            new_leg['max_delta'] = leg['strike_target_value'][2]
            
        elif leg['strike_target_type'] == "Premium":
            new_leg["strike_target_type"] = "premium"
            new_leg['target_premium'] = leg['strike_target_value'][0]
            if leg['strike_target_value'][2] == 0 or leg['strike_target_value'][2] == None:
                new_leg['max_width'] = leg['strike_target_value'][2]
                
        elif leg['strike_target_type'] == "Premium as % of Underlying":
            new_leg["strike_target_type"] = "premium_pct_underlying"
            new_leg['target_premium_pct'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Minium Premium":
            new_leg["strike_target_type"] = "minimum_premium"
            new_leg['target_premium'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Percent ITM":
            new_leg["strike_target_type"] = "percent_itm"
            new_leg["target_percent"] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Percent OTM":
            new_leg["strike_target_type"] = "percent_otm"
            new_leg["target_percent"] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Points ITM":
            new_leg["strike_target_type"] = "points_itm"
            new_leg['target_points'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Points OTM":
            new_leg["strike_target_type"] = "points_otm"
            new_leg['target_points'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Points ITM from Open":
            new_leg["strike_target_type"] = "points_itm_from_open"
            new_leg['target_points'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Points OTM from Open":
            new_leg["strike_target_type"] = "points_otm_from_open"
            new_leg['target_points'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Percent ITM from Open":
            new_leg["strike_target_type"] = "percent_itm_from_open"
            new_leg['target_percent'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Percent OTM from Open":
            new_leg["strike_target_type"] = "percent_otm_from_open"
            new_leg['target_percent'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Vertical Width":
            new_leg["strike_target_type"] = "vertical_width"
            new_leg['vertical_width'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Vertical Width (Exact)":
            new_leg["strike_target_type"] = "vertical_width_exact"
            new_leg['vertical_width'] = leg['strike_target_value'][0]
            
        elif leg['strike_target_type'] == "Vertical Width (Underlying %)":
            new_leg["strike_target_type"] = "vertical_width_underlying_pct"
            new_leg['vertical_width_pct'] = leg['strike_target_value'][0]
        elif leg['strike_target_type'] == "Exact":
            new_leg["strike_target_type"] = "exact"
            new_leg['exact_strike'] = leg['strike_target_value'][0]
            
        
        if leg["option_type"] == "PUT":
            new_leg["option_type"] = "put"
        else:
            new_leg["option_type"] = "call"
            
        if leg['long_or_short'] == "LONG":
            new_leg["long_short"] = "long"
        else:
            new_leg["long_short"] = "short"
            
        new_leg["size_ratio"] = leg['size_ratio']
        
        if leg['days_to_expiration_type'] == "Exact":
            new_leg['dte_type'] = "Exact"
            new_leg["dte_value"] = leg['days_to_expiration_value'][0]
        else:
            new_leg['dte_type'] = "Target"
            new_leg["dte_value"] = leg['days_to_expiration_value'][0]
            new_leg["dte_min"] = leg['days_to_expiration_value'][1]
            new_leg["dte_max"] = leg['days_to_expiration_value'][2]
        
        params["legs"].append(new_leg)
        
    return params
            