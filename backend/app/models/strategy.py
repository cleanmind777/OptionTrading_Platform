from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
    
class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    symbol = Column(String, nullable=True)
    parameters = Column(JSON, nullable=True)
    trade_type = Column(String, nullable=True)
    number_of_legs = Column(Integer, nullable=True)
    skip_am_expirations = Column(Boolean, default=False)
    sell_bidless_longs_on_trade_exit = Column(Boolean, default=False)
    efficient_spreads = Column(Boolean, default=False)
    leg1 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg2 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg3 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg4 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    trade_entry = Column(JSON, nullable=True, default={
        "enter_by" : "BOT SETTINGS",
        "auto_size_down" : False,
        "entry_speed" : "NORMAL",
        "position_sizing" : "QUANTITY",
        "position_sizing_value" : 0.0,
        "include_credit" : False,
        "entry_time_window_start" : [0,0,0],
        "entry_time_window_end" : [0,0,0],
        "days_of_week_to_enter" : [True, True, True, True, True],
        "open_if_no_position_or_staggered_days" : "NO POSITION",
        "entry_day_literval" : 0,
        "sequential_entry_delay" : 60,
    })
    trade_exit = Column(JSON, nullable=True, default={
        "timed_exit" : True,
        "exit_days_in_trade or_days_to_expiration" : "TO EXPIRATION",
        "exit _at_set_time" : [0,0,0],
        "profit_target_type" : 'DISABLED',
        "profit_target_value" : 0.0,
        "disable_profit_target_after_stop" : False,
    })
    trad_stop = Column(JSON, nullable=True, default={
        "stop_loss_type" : "DISABLED",
        "stop_controller_type" : "BOT ALGO",
        "stop_order_type" : "BID/ASK",
        "stop_based_on" : "stop_leg_only",
        "stop_value" : 0.0,
        "side_to_stop" : "Long ONLY",
        "close_remaining_legs_after_stop" : False,
        "stop_when_ITM_or_OTM" : "IN THE MONEY",
        "stop_adjustments" : False,
        "stop_adjustments_settings" : {
            "stop_adjustments_on_days_in_trade_or_days_to_expiration" : "TO EXPIRATION",
            "stop_adjustments_by_time" : [
                {
                    "days" : 1,
                    "adjustment_time" : 0,
                    "stop_adjustment" : 0.0
                }
            ]
        },
        "stop_speed" : "CUSTOM",
        "custom_stop_speed_settings" : {
            "stop_trigger_settings" : {
                "stop_after" : 0,
                "out_of" : 0,
                "check_interval_after_first_hit" : 0,
            },
            "stop_order_settings" : {
                "first_attempt_slippage" : 0.0,
                "replace_order_after" : 0,
                "add_slippage_order" : 0.0,
            },
            "send_market_order_after" : 0,
        },
        "stop_groupings_and_triggers" : "VERTICALS",
        "trailing_stop_configuration" : {
            "trailing_stop" : True,
            "trail_calculated_by" : "percentage",
            "profit_trigger_for_trailing_stop" : 0.0,
            "trailing_stop_allowance" : 0.0,
            "trailing_stop_speed" : "CUSTOM",
            "custom_trailing_stop_speed_settings" : {
                "trailing_stop_trigger_settings" : {
                    "stop_after" : 0,
                    "out_of" : 0,
                    "check_interval_after_first_hit" : 0.0,
                },
                "trailing_stop_order_settings" : {
                    "first_attempt_slippage" : 0,
                    "replace_order_after" : 0.0,
                    "add_slippage_order" : 0.0,
                    "send_market_attemps" : 0,
                }
            },
            
        },
    })
    trade_condition = Column(JSON, nullable = True, default = {
        "entry_filters" : False,
        "max_trades_per_day" : False,
        "max_trades_per_day_value" : 1,
        "max_concurrent_trades" : False,
        "max_concurrent_trades_value" : 15,
        "max_profit_targets_per_day" : False,
        "max_profit_targets_per_day_value" : 50,
        "max_stops_per_day" : False,
        "max_stops_per_day_value" : 50,
        "minimum_price_to_enter" : False,
        "minimum_price_to_enter" : 0.0,
        "maximum_price_to_enter" : 0.0,
        "check_closings_before_opening" : False,
        "only_credit_or_debit" : "ANY",
        "opening_quote" : "9:30:05",
        "trade_on_event_days" : False,
        "trade_on_special_days" : {
            "all_other_days" : False,
            "fomc_press_conferences" : [False, False, False],
            "monthly_cpi_report" : [False, False, False],
            "monthly_opex" : [False, False, False],
            "last_trading_day_of_the" : [False, False]
        },
        "underlying_entry_filters" : {
            "open_when_underlying_intraday_change" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_underlying_oneday_change" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_underlying_overnight_gap" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_underlying_market_value_between" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_underlying_moving_average_range" : {
                "enabled" : False,
                "moving_average_type" : "Simple",
                "period_type" : "Hour",
                "periods" : 0.0,
                "period_length" : 0.0,
                "open_trade_when_underlying_market_price_is" : {
                    "greater_than" : {
                        "on" : False,
                        "value": 0.0,
                    },
                    "lower_than" : {
                        "on" : False,
                        "value": 0.0,
                    },
                }
            },
            "open_when_underlying_moving_average_crossover" : {
                "enabled" : True,
                "moving_average_type" : "Simple",
                "period_type" : "Hour",
                "period_length" : 0.0,
                "periods_in_moving_average1" : 0.0,
                "periods_in_moving_average2" : 0.0,
                "open_trade_when" : "below",
            },
        },
        "volatility_index_entry_filters" : {
            "open_when_volatility_index_intraday_change" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_volatility_index_oneday_change" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_volatility_index_overnight_gap" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_volatility_index_between" : {
                "enabled" : False,
                "greater_than" : {
                    "on" : False,
                    "value": 0.0,
                },
                "lower_than" : {
                    "on" : False,
                    "value": 0.0,
                },
            },
            "open_when_volatility_index_moving_average_range" : {
                "enabled" : False,
                "moving_average_type" : "Simple",
                "period_type" : "Hour",
                "periods" : 0.0,
                "period_length" : 0.0,
                "open_trade_when_underlying_market_price_is" : {
                    "greater_than" : {
                        "on" : False,
                        "value": 0.0,
                    },
                    "lower_than" : {
                        "on" : False,
                        "value": 0.0,
                    },
                }
            },
            "open_when_volatility_index_moving_average_crossover" : {
                "enabled" : True,
                "moving_average_type" : "Simple",
                "period_type" : "Hour",
                "period_length" : 0.0,
                "periods_in_moving_average1" : 0.0,
                "periods_in_moving_average2" : 0.0,
                "open_trade_when" : "Greater Than",
            },
        },
    })
    
    