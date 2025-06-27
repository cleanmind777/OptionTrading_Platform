import { useState, useEffect } from "react";
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning" | "info";
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
}

interface BotConfig {
  // Bot Identification
  botName: string;
  tradingAccount: string;
  strategyAssignment: string;
  botStatus: string;

  // Trading Strategy
  underlyingSymbol: string;
  tradeType: string;
  numberOfLegs: string;
  skipAMExpirations: boolean;
  sellBidlessLongs: boolean;
  efficientSpreads: boolean;

  // Position Legs
  legs: Array<{
    targetType: string;
    strikeTarget: number;
    optionType: string;
    longOrShort: string;
    sizeRatio: number;
    daysToExpiration: string;
    conflictResolution: string;
  }>;

  // Trade Entry
  enterBy: string;
  positionSizing: string;
  quantity: number;
  includeCredit: boolean;
  autoSizeDown: boolean;
  entryTimeWindow: {
    start: string;
    end: string;
  };
  daysOfWeekToEnter: string[];
  openIfNoPosition: boolean;
  entrySpeed: string;
  entryTimeRandomization: string;
  sequentialEntryDelay: string;

  // Trade Exit
  timedExit: boolean;
  profitTargetType: string;
  disableProfitTargetAfterStop: boolean;

  // Trade Stop
  stopLossType: string;
  trailingStops: boolean;

  // Trade Conditions
  entryFilters: {
    maxTradesPerDay: number;
    isMaxTradesPerDayEnabled: boolean;
    maxConcurrentTrades: number;
    isMaxConcurrentTradesEnabled: boolean;
    minimumPriceToEnter: number;
    isMinimumPriceToEnterEnabled: boolean;
    maximumPriceToEnter: number;
    isMaximumPriceToEnterEnabled: boolean;
    checkClosingsBeforeOpening: boolean;
    isEntryFiltersEnabled: boolean;
    isCheckClosingsEnabled: boolean;
    isAnyEnabled: boolean;
    isCreditEnabled: boolean;
    isDebitEnabled: boolean;
    onlyCreditOrDebit: string;
    isFirstFridayEnabled: boolean;
    isSkipEventDaysEnabled: boolean;
    isTimeEnabled: boolean;
    isFirstTickerEnabled: boolean;
    isToExpirationEnabled: boolean;
    isInTradeEnabled: boolean;
  };
  openingQuote: boolean;
  skipEventDays: boolean;

  // Bot Dependencies
  enableBotDependencies: boolean;

  // Bot Notes
  notes: string;

  // Webhook
  webhookEnabled: boolean;
}

interface StrategyConfig {

}
export function BotCreateWizard() {
  const sampleLeg = {
    "strike_target_type": "",
    "strike_target_value": [0.0, 0.0, 0.0], // value, min, max
    "option_type": null,
    "long_or_short": null,
    "size_ratio": 1,
    "days_to_expiration_type": "Exact",
    "days_to_expiration_value": [0.0, 0.0, 0.0], //[Target, min, max]
    "conflict_resolution": false,
    "conflict_resolution_value": [0, 0], // [Towards Underlying Mark, Away From Underlying Mark]
  }
  const time = [
    "0s", "10s", "20s", "30s", "40s", "50s",
    "1m", "1m 10s", "1m 20s", "1m 30s", "1m 40s", "1m 50s",
    "2m", "2m 10s", "2m 20s", "2m 30s", "2m 40s", "2m 50s",
    "3m", "3m 10s", "3m 20s", "3m 30s", "3m 40s", "3m 50s",
    "4m", "4m 10s", "4m 20s", "4m 30s", "4m 40s", "4m 50s",
    "5m", "5m 10s", "5m 20s", "5m 30s", "5m 40s", "5m 50s",
    "6m", "6m 10s", "6m 20s", "6m 30s", "6m 40s", "6m 50s",
    "7m", "7m 10s", "7m 20s", "7m 30s", "7m 40s", "7m 50s",
    "8m", "8m 10s", "8m 20s", "8m 30s", "8m 40s", "8m 50s",
    "9m", "9m 10s", "9m 20s", "9m 30s", "9m 40s", "9m 50s",
    "10m", "10m 10s", "10m 20s", "10m 30s", "10m 40s", "10m 50s",
    "11m", "11m 10s", "11m 20s", "11m 30s", "11m 40s", "11m 50s",
    "12m", "12m 10s", "12m 20s", "12m 30s", "12m 40s", "12m 50s",
    "13m", "13m 10s", "13m 20s", "13m 30s", "13m 40s", "13m 50s",
    "14m", "14m 10s", "14m 20s", "14m 30s", "14m 40s", "14m 50s",
    "15m", "15m 10s", "15m 20s", "15m 30s", "15m 40s", "15m 50s",
    "16m", "16m 10s", "16m 20s", "16m 30s", "16m 40s", "16m 50s",
    "17m", "17m 10s", "17m 20s", "17m 30s", "17m 40s", "17m 50s",
    "18m", "18m 10s", "18m 20s", "18m 30s", "18m 40s", "18m 50s",
    "19m", "19m 10s", "19m 20s", "19m 30s", "19m 40s", "19m 50s",
    "20m", "20m 10s", "20m 20s", "20m 30s", "20m 40s", "20m 50s",
    "21m", "21m 10s", "21m 20s", "21m 30s", "21m 40s", "21m 50s",
    "22m", "22m 10s", "22m 20s", "22m 30s", "22m 40s", "22m 50s",
    "23m", "23m 10s", "23m 20s", "23m 30s", "23m 40s", "23m 50s",
    "24m", "24m 10s", "24m 20s", "24m 30s", "24m 40s", "24m 50s",
    "25m", "25m 10s", "25m 20s", "25m 30s", "25m 40s", "25m 50s",
    "26m", "26m 10s", "26m 20s", "26m 30s", "26m 40s", "26m 50s",
    "27m", "27m 10s", "27m 20s", "27m 30s", "27m 40s", "27m 50s",
    "28m", "28m 10s", "28m 20s", "28m 30s", "28m 40s", "28m 50s",
    "29m", "29m 10s", "29m 20s", "29m 30s", "29m 40s", "29m 50s",
    "30m", "30m 10s", "30m 20s", "30m 30s", "30m 40s", "30m 50s",
    "31m", "31m 10s", "31m 20s", "31m 30s", "31m 40s", "31m 50s",
    "32m", "32m 10s", "32m 20s", "32m 30s", "32m 40s", "32m 50s",
    "33m", "33m 10s", "33m 20s", "33m 30s", "33m 40s", "33m 50s",
    "34m", "34m 10s", "34m 20s", "34m 30s", "34m 40s", "34m 50s",
    "35m", "35m 10s", "35m 20s", "35m 30s", "35m 40s", "35m 50s",
    "36m", "36m 10s", "36m 20s", "36m 30s", "36m 40s", "36m 50s",
    "37m", "37m 10s", "37m 20s", "37m 30s", "37m 40s", "37m 50s",
    "38m", "38m 10s", "38m 20s", "38m 30s", "38m 40s", "38m 50s",
    "39m", "39m 10s", "39m 20s", "39m 30s", "39m 40s", "39m 50s",
    "40m", "40m 10s", "40m 20s", "40m 30s", "40m 40s", "40m 50s",
    "41m", "41m 10s", "41m 20s", "41m 30s", "41m 40s", "41m 50s",
    "42m", "42m 10s", "42m 20s", "42m 30s", "42m 40s", "42m 50s",
    "43m", "43m 10s", "43m 20s", "43m 30s", "43m 40s", "43m 50s",
    "44m", "44m 10s", "44m 20s", "44m 30s", "44m 40s", "44m 50s",
    "45m", "45m 10s", "45m 20s", "45m 30s", "45m 40s", "45m 50s",
    "46m", "46m 10s", "46m 20s", "46m 30s", "46m 40s", "46m 50s",
    "47m", "47m 10s", "47m 20s", "47m 30s", "47m 40s", "47m 50s",
    "48m", "48m 10s", "48m 20s", "48m 30s", "48m 40s", "48m 50s",
    "49m", "49m 10s", "49m 20s", "49m 30s", "49m 40s", "49m 50s",
    "50m", "50m 10s", "50m 20s", "50m 30s", "50m 40s", "50m 50s",
    "51m", "51m 10s", "51m 20s", "51m 30s", "51m 40s", "51m 50s",
    "52m", "52m 10s", "52m 20s", "52m 30s", "52m 40s", "52m 50s",
    "53m", "53m 10s", "53m 20s", "53m 30s", "53m 40s", "53m 50s",
    "54m", "54m 10s", "54m 20s", "54m 30s", "54m 40s", "54m 50s",
    "55m", "55m 10s", "55m 20s", "55m 30s", "55m 40s", "55m 50s",
    "56m", "56m 10s", "56m 20s", "56m 30s", "56m 40s", "56m 50s",
    "57m", "57m 10s", "57m 20s", "57m 30s", "57m 40s", "57m 50s",
    "58m", "58m 10s", "58m 20s", "58m 30s", "58m 40s", "58m 50s",
    "59m", "59m 10s", "59m 20s", "59m 30s", "59m 40s", "59m 50s",
    "60m"
  ]
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!)
  const [config, setConfig] = useState<BotConfig>({
    // Bot Identification
    botName: "",
    tradingAccount: "",
    strategyAssignment: "",
    botStatus: "ENABLED",

    // Trading Strategy
    underlyingSymbol: "",
    tradeType: "",
    numberOfLegs: "One",
    skipAMExpirations: false,
    sellBidlessLongs: false,
    efficientSpreads: false,

    // Position Legs
    legs: [
      {
        targetType: "Target Type",
        strikeTarget: 0,
        optionType: "PUT",
        longOrShort: "LONG",
        sizeRatio: 1,
        daysToExpiration: "Exact",
        conflictResolution: "",
      },
    ],

    // Trade Entry
    enterBy: "",
    positionSizing: "QUANTITY",
    quantity: 1,
    includeCredit: false,
    autoSizeDown: false,
    entryTimeWindow: {
      start: "16",
      end: "00",
    },
    daysOfWeekToEnter: ["ALL"],
    openIfNoPosition: false,
    entrySpeed: "URGENT",
    entryTimeRandomization: "No Randomization",
    sequentialEntryDelay: "0s",

    // Trade Exit
    timedExit: false,
    profitTargetType: "DISABLED",
    disableProfitTargetAfterStop: false,

    // Trade Stop
    stopLossType: "DISABLED",
    trailingStops: false,

    // Trade Conditions
    entryFilters: {
      maxTradesPerDay: 1,
      isMaxTradesPerDayEnabled: false,
      maxConcurrentTrades: 1,
      isMaxConcurrentTradesEnabled: false,
      minimumPriceToEnter: 0,
      isMinimumPriceToEnterEnabled: false,
      maximumPriceToEnter: 0,
      isMaximumPriceToEnterEnabled: false,
      checkClosingsBeforeOpening: false,
      isEntryFiltersEnabled: false,
      isCheckClosingsEnabled: false,
      isAnyEnabled: false,
      isCreditEnabled: false,
      isDebitEnabled: false,
      onlyCreditOrDebit: "",
      isFirstFridayEnabled: false,
      isSkipEventDaysEnabled: false,
      isTimeEnabled: false,
      isFirstTickerEnabled: false,
      isToExpirationEnabled: false,
      isInTradeEnabled: false,
    },
    openingQuote: false,
    skipEventDays: false,

    // Bot Dependencies
    enableBotDependencies: false,

    // Bot Notes
    notes: "",

    // Webhook
    webhookEnabled: false,
  });
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [strategy, setStrategy] = useState({
    "id": "",
    "name": "",
    "description": "",
    "symbol": "",
    "parameters": {},
    "trade_type": "",
    "skip_am_expirations": false,
    "sell_bidless_longs_on_trade_exit": false,
    "efficient_spreads": false,
    "legs": [{
      "strike_target_type": "",
      "strike_target_value": [0.0, 0.0, 0.0],
      "option_type": null,
      "long_or_short": null,
      "size_ratio": 1,
      "days_to_expiration_type": "Exact",
      "days_to_expiration_value": [0.0, 0.0, 0.0],
      "conflict_resolution": false,
      "conflict_resolution_value": [0, 0],
    },],
    "number_of_legs": 0,
  });
  const [bot, setBot] = useState({
    "user_id": "",
    "name": "",
    "description": "",
    "is_active": false,
    "trading_account": "",
    "strategy_id": "",
    "trade_entry": {
      "enter_by": "BOT SETTINGS",
      "auto_size_down": false,
      "entry_speed": "NORMAL",
      "position_sizing": "QUANTITY",
      "position_sizing_value": 0.0,
      "include_credit": false,
      "entry_time_window_start": [0, 0, 0],
      "entry_time_window_end": [0, 0, 0],
      "days_of_week_to_enter": [true, false, false, false, false, false],
      "open_if_no_position_or_staggered_days": "NO POSITION",
      "entry_day_literval": 0,
      "entry_time_randomization": 0,
      "sequential_entry_delay": 60,
    },
    "trade_exit": {
      "timed_exit": true,
      "exit_days_in_trade_or_days_to_expiration": "TO EXPIRATION",
      "exit_at_set_time": [0, 0, 0],
      "profit_target_type": 'DISABLED',
      "profit_target_value": 0.0,
      "disable_profit_target_after_stop": false,
    },
    "trad_stop": {
      "stop_loss_type": "DISABLED",
      "stop_controller_type": "BOT ALGO",
      "stop_order_type": "BID/ASK",
      "stop_based_on": "stop_leg_only",
      "stop_value": 0.0,
      "side_to_stop": "Long ONLY",
      "close_remaining_legs_after_stop": false,
      "stop_when_ITM_or_OTM": "IN THE MONEY",
      "stop_adjustments": false,
      "stop_adjustments_settings": {
        "stop_adjustments_on_days_in_trade_or_days_to_expiration": "TO EXPIRATION",
        "stop_adjustments_by_time": [
          {
            "days": 1,
            "adjustment_time": 0,
            "stop_adjustment": 0.0
          }
        ]
      },
      "stop_speed": "CUSTOM",
      "custom_stop_speed_settings": {
        "stop_trigger_settings": {
          "stop_after": 0,
          "out_of": 0,
          "check_interval_after_first_hit": 0,
        },
        "stop_order_settings": {
          "first_attempt_slippage": 0.0,
          "replace_order_after": 0,
          "add_slippage_order": 0.0,
        },
        "send_market_order_after": 0,
      },
      "stop_groupings_and_triggers": "VERTICALS",
      "trailing_stop_configuration": {
        "trailing_stop": false,
        "trail_calculated_by": "percentage",
        "profit_trigger_for_trailing_stop": 0.0,
        "trailing_stop_allowance": 0.0,
        "trailing_stop_speed": "CUSTOM",
        "custom_trailing_stop_speed_settings": {
          "trailing_stop_trigger_settings": {
            "stop_after": 0,
            "out_of": 0,
            "check_interval_after_first_hit": 0.0,
          },
          "trailing_stop_order_settings": {
            "first_attempt_slippage": 0,
            "replace_order_after": 0.0,
            "add_slippage_order": 0.0,
            "send_market_attemps": 0,
          }
        },

      },
    },
    "trade_condition": {
      "entry_filters": false,
      "max_trades_per_day": false,
      "max_trades_per_day_value": 1,
      "max_concurrent_trades": false,
      "max_concurrent_trades_value": 15,
      "max_profit_targets_per_day": false,
      "max_profit_targets_per_day_value": 50,
      "max_stops_per_day": false,
      "max_stops_per_day_value": 50,
      "minimum_price_to_enter": false,
      "minimum_price_to_enter_value": 0.0,
      "maximum_price_to_enter": 0.0,
      "check_closings_before_opening": false,
      "only_credit_or_debit": "ANY",
      "opening_quote": "9:30:05",
      "trade_on_event_days": false,
      "trade_on_special_days": {
        "all_other_days": false,
        "fomc_press_conferences": [false, false, false],
        "monthly_cpi_report": [false, false, false],
        "monthly_opex": [false, false, false],
        "last_trading_day_of_the": [false, false]
      },
      "underlying_entry_filters": {
        "open_when_underlying_intraday_change": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_underlying_oneday_change": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_underlying_overnight_gap": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_underlying_market_value_between": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_underlying_moving_average_range": {
          "enabled": false,
          "moving_average_type": "Simple",
          "period_type": "Hour",
          "periods": 0.0,
          "period_length": 0.0,
          "open_trade_when_underlying_market_price_is": {
            "greater_than": {
              "on": false,
              "value": 0.0,
            },
            "lower_than": {
              "on": false,
              "value": 0.0,
            },
          }
        },
        "open_when_underlying_moving_average_crossover": {
          "enabled": true,
          "moving_average_type": "Simple",
          "period_type": "Hour",
          "period_length": 0.0,
          "periods_in_moving_average1": 0.0,
          "periods_in_moving_average2": 0.0,
          "open_trade_when": "below",
        },
      },
      "volatility_index_entry_filters": {
        "open_when_volatility_index_intraday_change": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_volatility_index_oneday_change": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_volatility_index_overnight_gap": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_volatility_index_between": {
          "enabled": false,
          "greater_than": {
            "on": false,
            "value": 0.0,
          },
          "lower_than": {
            "on": false,
            "value": 0.0,
          },
        },
        "open_when_volatility_index_moving_average_range": {
          "enabled": false,
          "moving_average_type": "Simple",
          "period_type": "Hour",
          "periods": 0.0,
          "period_length": 0.0,
          "open_trade_when_underlying_market_price_is": {
            "greater_than": {
              "on": false,
              "value": 0.0,
            },
            "lower_than": {
              "on": false,
              "value": 0.0,
            },
          }
        },
        "open_when_volatility_index_moving_average_crossover": {
          "enabled": false,
          "moving_average_type": "Simple",
          "period_type": "Hour",
          "period_length": 0.0,
          "periods_in_moving_average1": 0.0,
          "periods_in_moving_average2": 0.0,
          "open_trade_when": "Greater Than",
        },
      },
    },
    "bot_dependencies": {
      "do_not_open_trades_when": {
        "bots_are_in_trade": "",
        "bots_are_not_in_trade": "",
        "bots_have_been_in_trade_today": "",
      },
      "only_open_trades_when": {
        "bots_are_in_trade": "",
        "bots_are_not_in_trade": "",
        "bots_have_been_in_trade_today": "",
      },
      "immediately_close_trades_when": {
        "bots_are_in_trade": "",
        "bots_are_not_in_trade": "",
      },
      "disabled_bots_shouldbe_ignored": true,
    }
  });
  // Validation state
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    completionPercentage: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [fieldWarnings, setFieldWarnings] = useState<{ [key: string]: string }>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [strategies, setStrategies] = useState([{}]);
  // Validation rules
  const validateField = (
    field: string,
    value: any,
    config: BotConfig
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    switch (field) {
      case "botName":
        if (!value || value.trim().length === 0) {
          errors.push({
            field,
            message: "Bot name is required",
            type: "error",
          });
        } else if (value.trim().length < 3) {
          errors.push({
            field,
            message: "Bot name must be at least 3 characters",
            type: "error",
          });
        } else if (value.trim().length > 50) {
          errors.push({
            field,
            message: "Bot name cannot exceed 50 characters",
            type: "error",
          });
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          errors.push({
            field,
            message:
              "Bot name can only contain letters, numbers, spaces, hyphens, and underscores",
            type: "error",
          });
        }
        break;

      case "tradingAccount":
        if (!value) {
          errors.push({
            field,
            message: "Trading account selection is required",
            type: "error",
          });
        }
        break;

      case "strategyAssignment":
        if (!value) {
          errors.push({
            field,
            message: "Strategy assignment is required",
            type: "error",
          });
        }
        break;

      case "underlyingSymbol":
        if (!value) {
          errors.push({
            field,
            message: "Underlying symbol is required",
            type: "error",
          });
        } else if (!/^[A-Z]{1,5}$/.test(value)) {
          errors.push({
            field,
            message: "Symbol must be 1-5 uppercase letters",
            type: "error",
          });
        }
        break;

      case "tradeType":
        if (!value) {
          errors.push({
            field,
            message: "Trade type selection is required",
            type: "error",
          });
        }
        break;

      case "quantity":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Quantity must be greater than 0",
            type: "error",
          });
        } else if (value > 1000) {
          errors.push({
            field,
            message: "Quantity cannot exceed 1000 for safety",
            type: "warning",
          });
        } else if (value > 100) {
          errors.push({
            field,
            message: "Large quantities may impact liquidity",
            type: "warning",
          });
        }
        break;

      case "maxTradesPerDay":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Must allow at least 1 trade per day",
            type: "error",
          });
        } else if (value > 20) {
          errors.push({
            field,
            message: "More than 20 trades per day is not recommended",
            type: "warning",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "High frequency trading increases risk",
            type: "info",
          });
        }
        break;

      case "maxConcurrentTrades":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Must allow at least 1 concurrent trade",
            type: "error",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "Too many concurrent trades increases risk",
            type: "warning",
          });
        }
        break;

      case "minimumPriceToEnter":
        if (value < 0) {
          errors.push({
            field,
            message: "Minimum price cannot be negative",
            type: "error",
          });
        } else if (
          value > config.entryFilters.maximumPriceToEnter &&
          config.entryFilters.maximumPriceToEnter > 0
        ) {
          errors.push({
            field,
            message: "Minimum price cannot exceed maximum price",
            type: "error",
          });
        }
        break;

      case "maximumPriceToEnter":
        if (value < 0) {
          errors.push({
            field,
            message: "Maximum price cannot be negative",
            type: "error",
          });
        } else if (
          value < config.entryFilters.minimumPriceToEnter &&
          value > 0
        ) {
          errors.push({
            field,
            message: "Maximum price cannot be less than minimum price",
            type: "error",
          });
        } else if (value > 10000) {
          errors.push({
            field,
            message: "Very high price limits may not be practical",
            type: "warning",
          });
        }
        break;

      case "strikeTarget":
        if (value < 0) {
          errors.push({
            field,
            message: "Strike target cannot be negative",
            type: "error",
          });
        }
        break;

      case "sizeRatio":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Size ratio must be greater than 0",
            type: "error",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "Large size ratios may impact execution",
            type: "warning",
          });
        }
        break;
    }

    return errors;
  };

  // Comprehensive form validation
  const validateForm = (config: BotConfig): ValidationResult => {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Required fields validation
    const requiredFields = [
      "botName",
      "tradingAccount",
      "strategyAssignment",
      "underlyingSymbol",
      "tradeType",
      "quantity",
    ];

    requiredFields.forEach((field) => {
      const fieldValue = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key], config as any)
        : (config as any)[field];

      const errors = validateField(field, fieldValue, config);
      errors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push(error);
        } else if (error.type === "warning") {
          allWarnings.push(error);
        }
      });
    });

    // Validate nested fields
    const nestedValidations = [
      {
        field: "entryFilters.maxTradesPerDay",
        value: config.entryFilters.maxTradesPerDay,
      },
      {
        field: "entryFilters.maxConcurrentTrades",
        value: config.entryFilters.maxConcurrentTrades,
      },
      {
        field: "entryFilters.minimumPriceToEnter",
        value: config.entryFilters.minimumPriceToEnter,
      },
      {
        field: "entryFilters.maximumPriceToEnter",
        value: config.entryFilters.maximumPriceToEnter,
      },
    ];

    nestedValidations.forEach(({ field, value }) => {
      const fieldName = field.split(".").pop() || field;
      const errors = validateField(fieldName, value, config);
      errors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push({ ...error, field });
        } else if (error.type === "warning") {
          allWarnings.push({ ...error, field });
        }
      });
    });

    // Validate legs
    config.legs.forEach((leg, index) => {
      const legErrors = [
        ...validateField("strikeTarget", leg.strikeTarget, config),
        ...validateField("sizeRatio", leg.sizeRatio, config),
      ].map((error) => ({ ...error, field: `leg${index + 1}_${error.field}` }));

      legErrors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push(error);
        } else if (error.type === "warning") {
          allWarnings.push(error);
        }
      });
    });

    // Calculate completion percentage
    const totalFields = requiredFields.length + nestedValidations.length;
    const completedFields =
      requiredFields.filter((field) => {
        const value = field.includes(".")
          ? field.split(".").reduce((obj, key) => obj?.[key], config as any)
          : (config as any)[field];
        return value && value !== "";
      }).length + nestedValidations.filter(({ value }) => value > 0).length;

    const completionPercentage = Math.round(
      (completedFields / totalFields) * 100
    );

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      completionPercentage,
    };
  };

  // Auto-save effect
  useEffect(() => {
    const autoSaveKey = "botCreateWizard_autoSave";
    const savedConfig = localStorage.getItem(autoSaveKey);
    getAllStrategies();
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        console.log("Auto-saved configuration loaded");
      } catch (error) {
        console.error("Failed to load auto-saved configuration:", error);
      }
    }
    console.log("Strategy Name:", strategy.name);
  }, []);

  // Real-time validation and auto-save effect
  useEffect(() => {
    const result = validateForm(config);
    setValidationResult(result);

    // Update field-specific errors and warnings
    const newFieldErrors: { [key: string]: string } = {};
    const newFieldWarnings: { [key: string]: string } = {};

    result.errors.forEach((error) => {
      newFieldErrors[error.field] = error.message;
    });

    result.warnings.forEach((warning) => {
      newFieldWarnings[warning.field] = warning.message;
    });

    setFieldErrors(newFieldErrors);
    setFieldWarnings(newFieldWarnings);

    // Auto-save configuration to localStorage
    const autoSaveKey = "botCreateWizard_autoSave";
    try {
      localStorage.setItem(autoSaveKey, JSON.stringify(config));
    } catch (error) {
      console.error("Failed to auto-save configuration:", error);
    }
  }, [config]);

  const handleInputChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => new Set([...prev, field]));
  };

  const handleNestedInputChange = (
    section: string,
    field: string,
    value: any
  ) => {
    setConfig((prev) => {
      const sectionValue = prev[section as keyof BotConfig];
      if (typeof sectionValue !== "object" || sectionValue === null) {
        return prev;
      }
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: value },
      };
    });
    setTouchedFields((prev) => new Set([...prev, `${section}.${field}`]));
  };

  const handleDayToggle = (day: string) => {
    setConfig((prev) => {
      let newDays = [...prev.daysOfWeekToEnter];

      if (day === "ALL") {
        // If ALL is selected, clear others and set ALL
        newDays = ["ALL"];
      } else {
        // Remove ALL if selecting specific day
        newDays = newDays.filter((d) => d !== "ALL");

        if (newDays.includes(day)) {
          // Remove day if already selected
          newDays = newDays.filter((d) => d !== day);
        } else {
          // Add day if not selected
          newDays.push(day);
        }

        // If no days selected, default to ALL
        if (newDays.length === 0) {
          newDays = ["ALL"];
        }
      }

      return { ...prev, daysOfWeekToEnter: newDays };
    });
    setTouchedFields((prev) => new Set([...prev, "daysOfWeekToEnter"]));
  };

  const addLeg = () => {
    setConfig((prev) => ({
      ...prev,
      legs: [
        ...prev.legs,
        {
          targetType: "Target Type",
          strikeTarget: 0,
          optionType: "PUT",
          longOrShort: "LONG",
          sizeRatio: 1,
          daysToExpiration: "Exact",
          conflictResolution: "",
        },
      ],
    }));
  };

  const removeLeg = (index: number) => {
    if (config.legs.length > 1) {
      setConfig((prev) => ({
        ...prev,
        legs: prev.legs.filter((_, i) => i !== index),
      }));
    }
  };

  // Helper functions for validation display
  const getFieldError = (field: string): string | undefined => {
    return fieldErrors[field];
  };

  const getFieldWarning = (field: string): string | undefined => {
    return fieldWarnings[field];
  };

  const hasFieldError = (field: string): boolean => {
    return !!fieldErrors[field] && touchedFields.has(field);
  };

  const hasFieldWarning = (field: string): boolean => {
    return !!fieldWarnings[field] && touchedFields.has(field);
  };

  const getFieldClassName = (field: string, baseClassName: string): string => {
    if (hasFieldError(field)) {
      return `${baseClassName} border-red-500 bg-red-50/10`;
    }
    if (hasFieldWarning(field)) {
      return `${baseClassName} border-yellow-500 bg-yellow-50/10`;
    }
    if (
      touchedFields.has(field) &&
      !fieldErrors[field] &&
      !fieldWarnings[field]
    ) {
      return `${baseClassName} border-green-500 bg-green-50/10`;
    }
    return baseClassName;
  };

  const handleCreate = () => {
    if (
      !validationResult.isValid ||
      validationResult.completionPercentage < 100
    ) {
      alert(
        "Please complete all required fields and fix validation errors before creating the bot."
      );
      return;
    }

    console.log("Creating bot with config:", config);

    // Show success message
    alert(`Bot "${config.botName}" has been created successfully!`);

    // Clear auto-saved data after successful creation
    const autoSaveKey = "botCreateWizard_autoSave";
    localStorage.removeItem(autoSaveKey);

    // You would typically make an API call here to save the bot
    // Example: await createBot(config)
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all form data? This action cannot be undone."
      )
    ) {
      // Reset to initial state
      setConfig({
        // Bot Identification
        botName: "",
        tradingAccount: "",
        strategyAssignment: "",
        botStatus: "ENABLED",

        // Trading Strategy
        underlyingSymbol: "",
        tradeType: "",
        numberOfLegs: "One",
        skipAMExpirations: false,
        sellBidlessLongs: false,
        efficientSpreads: false,

        // Position Legs
        legs: [
          {
            targetType: "Target Type",
            strikeTarget: 0,
            optionType: "PUT",
            longOrShort: "LONG",
            sizeRatio: 1,
            daysToExpiration: "Exact",
            conflictResolution: "",
          },
        ],

        // Trade Entry
        enterBy: "",
        positionSizing: "QUANTITY",
        quantity: 1,
        includeCredit: false,
        autoSizeDown: false,
        entryTimeWindow: {
          start: "16",
          end: "00",
        },
        daysOfWeekToEnter: ["ALL"],
        openIfNoPosition: false,
        entrySpeed: "URGENT",
        entryTimeRandomization: "No Randomization",
        sequentialEntryDelay: "0s",

        // Trade Exit
        timedExit: false,
        profitTargetType: "DISABLED",
        disableProfitTargetAfterStop: false,

        // Trade Stop
        stopLossType: "DISABLED",
        trailingStops: false,

        // Trade Conditions
        entryFilters: {
          maxTradesPerDay: 1,
          isMaxTradesPerDayEnabled: false,
          maxConcurrentTrades: 1,
          isMaxConcurrentTradesEnabled: false,
          minimumPriceToEnter: 0,
          isMinimumPriceToEnterEnabled: false,
          maximumPriceToEnter: 0,
          isMaximumPriceToEnterEnabled: false,
          checkClosingsBeforeOpening: false,
          isEntryFiltersEnabled: false,
          isCheckClosingsEnabled: false,
          isAnyEnabled: false,
          isCreditEnabled: false,
          isDebitEnabled: false,
          onlyCreditOrDebit: "",
          isFirstFridayEnabled: false,
          isSkipEventDaysEnabled: false,
          isTimeEnabled: false,
          isFirstTickerEnabled: false,
          isToExpirationEnabled: false,
          isInTradeEnabled: false,
        },
        openingQuote: false,
        skipEventDays: false,

        // Bot Dependencies
        enableBotDependencies: false,

        // Bot Notes
        notes: "",

        // Webhook
        webhookEnabled: false,
      });

      // Clear validation state
      setTouchedFields(new Set());
      setFieldErrors({});
      setFieldWarnings({});

      // Clear auto-saved data
      const autoSaveKey = "botCreateWizard_autoSave";
      localStorage.removeItem(autoSaveKey);

      console.log("Form has been reset");
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      // Navigate back or close modal
      window.history.back();
      console.log("Bot creation cancelled");
    }
  };

  const handleTestRun = () => {
    if (validationResult.errors.length > 0) {
      alert("Please fix all validation errors before running a test.");
      return;
    }

    console.log("Running test with config:", config);

    // Simulate test run
    alert(
      `Test run started for bot "${config.botName || "Unnamed Bot"}". Check the logs for results.`
    );

    // You would typically make an API call here to run the test
    // Example: await testBotStrategy(config)
  };

  const getAllStrategies = () => {
    console.log("Type of userinfo", typeof (userInfo))
    const params = {
      user_id: userInfo.id
    };
    console.log("Param", params)
    axios.get(`${BACKEND_URL}/strategy/get_all_strategies`, { params })
      .then(response => {
        setStrategies(response.data);
        localStorage.setItem('strategies', response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  const createStrategy = (name: String) => {
    const params = {
      user_id: userInfo.id,
      name: name,
    };
    axios.post(`${BACKEND_URL}/strategy/create`, params)
      .then(response => {
        setStrategies(response.data);
        localStorage.setItem('strategies', response.data);
        setShowCreateStrategyModal(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert(error.response.data.detail);
      });
  }
  const getStrategy = async (strategy_id: String) => {
    const params = {
      strategy_id: strategy_id
    };
    console.log("Param", params)
    axios.get(`${BACKEND_URL}/strategy/get_strategy`, { params })
      .then(response => {
        setStrategy(response.data);
        localStorage.setItem('strategy', response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  useEffect(() => {
    // console.log(strategy)
    console.log(bot)
    // console.log("Strategy Name:", strategy.name)
  }, [strategies, showCreateStrategyModal, newStrategyName, strategy, bot])
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="px-3 mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Autotrader Bot
          </h1>
        </div>
        {showCreateStrategyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0f172a] rounded-lg p-6 max-w-md w-full mx-4 relative">
              <button
                onClick={() => setShowCreateStrategyModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h3 className="text-xl font-semibold text-white mb-4 pr-8">
                Create New Strategy
              </h3>

              <p className="text-sm text-gray-400 mb-6">
                You can create a new strategy and assign it to a bot.
                Please enter the strategy name you'd like to create.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    New Strategy Name
                  </label>
                  <input
                    type="text"
                    // value={verifyPassword}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    placeholder="New Strategy Name"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    // onClick={() => setShowEmailModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      // Handle password verification
                      console.log("NewStrategyName", newStrategyName)
                      if (newStrategyName != "") {
                        createStrategy(newStrategyName);
                      }

                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    CREATE STRATEGY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Validation Summary */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Configuration Status
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      {validationResult.completionPercentage}% Complete
                    </span>
                  </div>
                  {validationResult.isValid &&
                    validationResult.completionPercentage === 100 && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Ready to Create
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${validationResult.completionPercentage === 100 &&
                    validationResult.isValid
                    ? "bg-green-500"
                    : validationResult.completionPercentage > 80
                      ? "bg-blue-500"
                      : validationResult.completionPercentage > 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  style={{ width: `${validationResult.completionPercentage}%` }}
                />
              </div>

              {/* Validation Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validationResult.errors.length > 0 && (
                  <div className="bg-red-900/20 border border-red-500 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-400 font-medium text-sm">
                        {validationResult.errors.length} Error
                        {validationResult.errors.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="text-red-300 text-xs space-y-1">
                      {validationResult.errors
                        .slice(0, 3)
                        .map((error, index) => (
                          <li key={index}>• {error.message}</li>
                        ))}
                      {validationResult.errors.length > 3 && (
                        <li className="text-red-400">
                          ... and {validationResult.errors.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-yellow-400 font-medium text-sm">
                        {validationResult.warnings.length} Warning
                        {validationResult.warnings.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="text-yellow-300 text-xs space-y-1">
                      {validationResult.warnings
                        .slice(0, 3)
                        .map((warning, index) => (
                          <li key={index}>• {warning.message}</li>
                        ))}
                      {validationResult.warnings.length > 3 && (
                        <li className="text-yellow-400">
                          ... and {validationResult.warnings.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Identification Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Bot Identification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bot Name
                    {hasFieldError("botName") && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={config.botName}
                    onChange={(e) =>
                      handleInputChange("botName", e.target.value)
                    }
                    onBlur={() =>
                      setTouchedFields((prev) => new Set([...prev, "botName"]))
                    }
                    placeholder="Give your bot a name or use choice. This is how the bot will be labeled."
                    className={getFieldClassName(
                      "botName",
                      "w-full bg-slate-700 border rounded px-3 py-2 text-white text-sm"
                    )}
                  />
                  {hasFieldError("botName") && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldError("botName")}
                    </p>
                  )}
                  {hasFieldWarning("botName") && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldWarning("botName")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Trading Account ⓘ
                    {hasFieldError("tradingAccount") && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <select
                    value={config.tradingAccount}
                    onChange={(e) =>
                      handleInputChange("tradingAccount", e.target.value)
                    }
                    onBlur={() =>
                      setTouchedFields(
                        (prev) => new Set([...prev, "tradingAccount"])
                      )
                    }
                    className={getFieldClassName(
                      "tradingAccount",
                      "w-full bg-slate-700 border rounded px-3 py-2 text-white text-sm"
                    )}
                  >
                    <option value="">
                      Select the account this bot should use for trading
                    </option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                  {hasFieldError("tradingAccount") && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldError("tradingAccount")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Strategy Assignment ⓘ
                  </label>
                  <select
                    value={strategy.id ? strategy.id : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "create") {
                        setShowCreateStrategyModal(true);
                        // Optionally reset selection:
                        handleInputChange("strategyAssignment", "");
                      }
                      else {
                        // const response = getStrategy(value);
                        console.log("value", value)
                        getStrategy(value);
                      }
                    }
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="" disabled>Select Strategy</option>
                    <option value={"create"}>Create New Strategy</option>
                    {strategies.map((item, key) => (
                      <option key={key} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bot Status
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setBot({ ...bot, is_active: true, })}
                      className={`px-4 py-2 rounded text-sm font-medium ${bot.is_active === true
                        ? "bg-green-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      ENABLED
                    </button>
                    <button
                      onClick={() => setBot({ ...bot, is_active: false, })}
                      className={`px-4 py-2 rounded text-sm font-medium ${bot.is_active === false
                        ? "bg-red-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      DISABLED
                    </button>
                  </div>
                </div>
              </div>
              {/*Action Buttons */}
              <div className="flex space-x-3 w-full">
                <button
                  onClick={handleCreate}
                  disabled={
                    !validationResult.isValid ||
                    validationResult.completionPercentage < 100
                  }
                  className={`flex-1 px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${validationResult.isValid &&
                    validationResult.completionPercentage === 100
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  <span>📄</span>
                  <span>CREATE</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>🔄</span>
                  <span>RESET</span>
                </button>

                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>✖</span>
                  <span>CANCEL</span>
                </button>

                <button
                  onClick={handleTestRun}
                  disabled={validationResult.errors.length > 0}
                  className={`flex-1 px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${validationResult.errors.length === 0
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  <span>🧪</span>
                  <span>TEST RUN</span>
                </button>
              </div>
            </div>

            {/* Trading Strategy Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Trading Strategy
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Underlying Symbol
                  </label>
                  <select
                    value={strategy.symbol ? strategy.symbol : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStrategy({
                        ...strategy,
                        symbol: value
                      });
                      handleInputChange("underlyingSymbol", e.target.value)
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="" disabled>Select Symbol</option>
                    <option value="SPY">SPY</option>
                    <option value="QQQ">QQQ</option>
                    <option value="IWM">IWM</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Symbol to trade</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Trade Type
                  </label>
                  <select
                    value={strategy.trade_type ? strategy.trade_type : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value == "Single Leg") {
                        setStrategy(prev => ({ ...prev, number_of_legs: 1 }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg] }));
                        setStrategy(prev => ({ ...prev, trade_type: value }));
                      }
                      else if (value == "Vertical Spread") {
                        setStrategy(prev => ({ ...prev, number_of_legs: 2 }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg, sampleLeg] }));
                        setStrategy(prev => ({ ...prev, trade_type: value }));
                      }
                      else if (value == "Condor") {
                        setStrategy(prev => ({ ...prev, number_of_legs: 4 }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg, sampleLeg, sampleLeg, sampleLeg] }));
                        setStrategy(prev => ({ ...prev, trade_type: value }));
                      }
                      else if (value == "Custom") {
                        setStrategy({
                          ...strategy,
                          trade_type: value,
                        });
                      }

                      handleInputChange("tradeType", e.target.value);
                    }
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="" disabled>Select Trade Type</option>
                    <option value="Single Leg">Single Leg</option>
                    <option value="Vertical Spread">Vertical Spread</option>
                    <option value="Condor">Condor</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Trade template design for options legs
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Number of Legs
                  </label>
                  <select
                    value={strategy.number_of_legs}
                    onChange={(e) => {
                      // const value = e.target.value;
                      const value: number = parseInt(e.target.value, 10);
                      console.log("11111111111", value)

                      if (value == 1 && (strategy.trade_type == "Single Leg" || strategy.trade_type == "Custom")) {
                        setStrategy(prev => ({ ...prev, number_of_legs: value }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg] }));
                      }
                      else if (value == 2 && (strategy.trade_type == "Vertical Spread" || strategy.trade_type == "Custom")) {
                        setStrategy(prev => ({ ...prev, number_of_legs: value }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg, sampleLeg] }));
                      }
                      else if (value == 3 && strategy.trade_type == "Custom") {
                        setStrategy(prev => ({ ...prev, number_of_legs: value }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg, sampleLeg, sampleLeg] }));
                      }
                      else if (value == 4 && (strategy.trade_type == "Condor" || strategy.trade_type == "Custom")) {
                        setStrategy(prev => ({ ...prev, number_of_legs: value }));
                        setStrategy(prev => ({ ...prev, legs: [sampleLeg, sampleLeg, sampleLeg, sampleLeg] }));
                      }
                      handleInputChange("numberOfLegs", e.target.value);
                    }
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value={0} disabled>Select Leg Count</option>
                    <option value={"1"}>One</option>
                    <option value={"2"}>Two</option>
                    <option value={"3"}>Three</option>
                    <option value={"4"}>Four</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Number of legs for the position
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Skip AM Expirations ⓘ
                  </label>
                  <button
                    onClick={() => {
                      console.log(strategy.skip_am_expirations);
                      setStrategy({
                        ...strategy,
                        skip_am_expirations: !strategy.skip_am_expirations,
                      })
                      handleInputChange(
                        "skipAMExpirations",
                        !config.skipAMExpirations
                      );
                    }
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${strategy.skip_am_expirations
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                      }`}
                  >
                    {strategy.skip_am_expirations ? "ENABLED" : "DISABLED"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Ignores AM expirations for index options
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sell Bidless Longs on Trade Exitⓘ
                  </label>
                  <button
                    onClick={() => {
                      setStrategy({
                        ...strategy,
                        sell_bidless_longs_on_trade_exit: !strategy.sell_bidless_longs_on_trade_exit,
                      })
                      handleInputChange(
                        "sellBidlessLongs",
                        !config.sellBidlessLongs
                      )
                    }
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${strategy.sell_bidless_longs_on_trade_exit
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                      }`}
                  >
                    {strategy.sell_bidless_longs_on_trade_exit ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Efficient Spreads ⓘ
                  </label>
                  <button
                    onClick={() => {
                      setStrategy({
                        ...strategy,
                        efficient_spreads: !strategy.efficient_spreads,
                      })
                      handleInputChange(
                        "efficientSpreads",
                        !config.efficientSpreads
                      );
                    }
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${strategy.efficient_spreads
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                      }`}
                  >
                    {strategy.efficient_spreads ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            {/* Position Legs Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Position Legs
              </h2>

              <div className="flex justify-between items-center mb-4">
                <div className="grid grid-cols-[5%_15%_15%_7%_9%_5%_15%_9%_10%_5%] gap-2 text-sm text-gray-400 flex-1 justify-items-start">
                  <div></div>
                  <div>Strike Target ⓘ</div>
                  <div></div>
                  <div>Option Type</div>
                  <div>Long/Short</div>
                  <div>Size Ratio</div>
                  <div>Days to Expiration</div>
                  {/* <div>Days to Expiration</div> */}
                  <div>Conflict Resolution</div>
                  <div></div>
                </div>
              </div>
              {strategy.legs?.map((item, index) => (
                <div
                  className="grid grid-cols-[5%_15%_15%_7%_9%_5%_15%_9%_10%_5%] gap-2 text-sm text-gray-400 flex-1 h-[50px] items-center"
                >
                  <div className="flex items-center">
                    <span className="text-white font-medium">
                      Leg #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <select
                      value={item.strike_target_type ? item.strike_target_type : "Target Type"}
                      onChange={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, strike_target_type: e.target.value }
                              : leg
                          ),
                        });
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-sm"
                    >
                      <option value="Target Type" disabled>Target Type</option>
                      <option value="Delta">Delta</option>
                      <option value="Premium">Premium</option>
                      <option value="Premium as % of Underlying">Premium as % of Underlying</option>
                      <option value="Minium Premium">Minimum Premium</option>
                      <option value="Percent ITM">Percent ITM</option>
                      <option value="Percent OTM">Percent OTM</option>
                      <option value="Points ITM">Points ITM</option>
                      <option value="Points OTM">Points OTM</option>
                      <option value="Points ITM from Open">Points ITM from Open</option>
                      <option value="Points OTM from Open">Points OTM from Open</option>
                      <option value="Percent ITM from Open">Percent ITM from Open</option>
                      <option value="Percent OTM from Open">Percent OTM from Open</option>
                      <option value="Vertical Width">Vertical Width</option>
                      <option value="Vertical Width (Exact)">Vertical Width (Exact)</option>
                      <option value="Vertical Width (Underlying %)">Vertical Width (Underlying %)</option>
                      <option value="Exact">Exact</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={item.strike_target_value[0]}
                        onChange={(e) => {
                          // const newLegs = [...config.legs];
                          // newLegs[index].strikeTarget = Number(e.target.value);
                          // handleInputChange("legs", newLegs);
                          setStrategy({
                            ...strategy,
                            legs: strategy.legs.map((leg, i) =>
                              i === index
                                ? { ...leg, strike_target_value: [Number(e.target.value), item.strike_target_value[1], item.strike_target_value[1]] }
                                : leg
                            ),
                          });
                        }}
                        placeholder="Strike Target"
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    {
                      (item.strike_target_type == "Delta") && (
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.strike_target_value[1]}
                            onChange={(e) => {
                              // const newLegs = [...config.legs];
                              // newLegs[index].strikeTarget = Number(e.target.value);
                              // handleInputChange("legs", newLegs);
                              setStrategy({
                                ...strategy,
                                legs: strategy.legs.map((leg, i) =>
                                  i === index
                                    ? { ...leg, strike_target_value: [item.strike_target_value[0], Number(e.target.value), item.strike_target_value[2]] }
                                    : leg
                                ),
                              });
                            }}
                            placeholder="Strike Target"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                          <input
                            type="number"
                            value={item.strike_target_value[2]}
                            onChange={(e) => {
                              // const newLegs = [...config.legs];
                              // newLegs[index].strikeTarget = Number(e.target.value);
                              // handleInputChange("legs", newLegs);
                              setStrategy({
                                ...strategy,
                                legs: strategy.legs.map((leg, i) =>
                                  i === index
                                    ? { ...leg, strike_target_value: [Number(e.target.value), item.strike_target_value[1], item.strike_target_value[2]] }
                                    : leg
                                ),
                              });
                            }}
                            placeholder="Strike Target"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>

                      )
                    }
                    {
                      (item.strike_target_type == "Premium") && (
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.strike_target_value[2]}
                            onChange={(e) => {
                              // const newLegs = [...config.legs];
                              // newLegs[index].strikeTarget = Number(e.target.value);
                              // handleInputChange("legs", newLegs);
                              setStrategy({
                                ...strategy,
                                legs: strategy.legs.map((leg, i) =>
                                  i === index
                                    ? { ...leg, strike_target_value: [Number(e.target.value), item.strike_target_value[1], item.strike_target_value[2]] }
                                    : leg
                                ),
                              });
                            }}
                            placeholder="Strike Target"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>
                      )
                    }
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, option_type: "PUT" }
                              : leg
                          ),
                        });
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${item.option_type === "PUT"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      PUT
                    </button>
                    <button
                      onClick={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, option_type: "CALL" }
                              : leg
                          ),
                        });
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${item.option_type === "CALL"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      CALL
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, long_or_short: "LONG" }
                              : leg
                          ),
                        });
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${item.long_or_short === "LONG"
                        ? "bg-green-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      LONG
                    </button>
                    <button
                      onClick={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, long_or_short: "SHORT" }
                              : leg
                          ),
                        });
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${item.long_or_short === "SHORT"
                        ? "bg-red-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        }`}
                    >
                      SHORT
                    </button>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.size_ratio}
                      onChange={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, size_ratio: Number(e.target.value) }
                              : leg
                          ),
                        });
                        // const newLegs = [...config.legs];
                        // // newLegs[index].sizeRatio = Number(e.target.value);
                        // handleInputChange("legs", newLegs);
                      }}
                      placeholder="Size Ratio"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <select
                      value={item.days_to_expiration_type}
                      onChange={(e) => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, days_to_expiration_type: e.target.value }
                              : leg
                          ),
                        });
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="Exact">Exact</option>
                      <option value="Target">Target</option>
                    </select>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={item.days_to_expiration_value[0]}
                        onChange={(e) => {
                          setStrategy({
                            ...strategy,
                            legs: strategy.legs.map((leg, i) =>
                              i === index
                                ? { ...leg, days_to_expiration_value: [Number(e.target.value), item.days_to_expiration_value[1], item.days_to_expiration_value[2]] }
                                : leg
                            ),
                          });
                          // const newLegs = [...config.legs];
                          // // newLegs[index].sizeRatio = Number(e.target.value);
                          // handleInputChange("legs", newLegs);
                        }}
                        placeholder="Size Ratio"
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    {item.days_to_expiration_type == "Target" && (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.days_to_expiration_value[1]}
                            onChange={(e) => {
                              setStrategy({
                                ...strategy,
                                legs: strategy.legs.map((leg, i) =>
                                  i === index
                                    ? { ...leg, days_to_expiration_value: [item.days_to_expiration_value[0], Number(e.target.value), item.days_to_expiration_value[2]] }
                                    : leg
                                ),
                              });
                              // const newLegs = [...config.legs];
                              // // newLegs[index].sizeRatio = Number(e.target.value);
                              // handleInputChange("legs", newLegs);
                            }}
                            placeholder="Size Ratio"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.days_to_expiration_value[2]}
                            onChange={(e) => {
                              setStrategy({
                                ...strategy,
                                legs: strategy.legs.map((leg, i) =>
                                  i === index
                                    ? { ...leg, days_to_expiration_value: [item.days_to_expiration_value[0], item.days_to_expiration_value[1], Number(e.target.value)] }
                                    : leg
                                ),
                              });
                              // const newLegs = [...config.legs];
                              // // newLegs[index].sizeRatio = Number(e.target.value);
                              // handleInputChange("legs", newLegs);
                            }}
                            placeholder="Size Ratio"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* <div className="flex items-center">
                    <select
                      // value={strategy.leg1.days_to_expiration_type}
                      // onChange={(e) => {
                      //   const newLegs = [...config.legs];
                      //   newLegs[index].conflictResolution = e.target.value;
                      //   handleInputChange("legs", newLegs);
                      // }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="Skip">Skip</option>
                      <option value="Force">Force</option>
                      <option value="Adjust">Adjust</option>
                    </select>
                  </div> */}

                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setStrategy({
                          ...strategy,
                          legs: strategy.legs.map((leg, i) =>
                            i === index
                              ? { ...leg, conflict_resolution: !item.conflict_resolution }
                              : leg
                          ),
                        });
                      }}
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-medium ${item.conflict_resolution ? `bg-blue-600` : `bg-slate-600`
                        }`}>
                      ENABLED
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    {config.legs.length > 1 && (
                      <button
                        // onClick={() => removeLeg(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs font-medium transition-colors"
                        title="Remove Leg"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* {(strategy.legs[0].conflict_resolution != null) && (
              <div>Conflict Resolution Maximum Strike Adjustment Points</div>
            )} */}
            {/* Trade Entry Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Entry</h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Enter By ⓘ
                  </label>
                  <div className="flex gap-1">
                    <label
                      onClick={() => setBot({
                        ...bot,
                        trade_entry: {
                          ...bot.trade_entry,
                          enter_by: "BOT SETTINGS"
                        }

                      })}
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${bot.trade_entry.enter_by === "BOT SETTINGS"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                        }`}
                    >
                      BOT SETTINGS
                    </label>
                    <label
                      onClick={() => setBot({
                        ...bot,
                        trade_entry: {
                          ...bot.trade_entry,
                          enter_by: "USER TRIGGER"
                        }
                      })}
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${bot.trade_entry.enter_by === "USER TRIGGER"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                        }`}
                    >
                      USER TRIGGER
                    </label>
                  </div>
                </div>


                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Auto Size Down ⓘ
                  </label>
                  <button
                    onClick={() => setBot({
                      ...bot,
                      trade_entry: {
                        ...bot.trade_entry,
                        auto_size_down: !bot.trade_entry.auto_size_down
                      }

                    })}
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${bot.trade_entry.auto_size_down
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                      }`}
                  >
                    {bot.trade_entry.auto_size_down ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Entry Speed ⓘ
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {["URGENT", "FAST", "NORMAL", "SLOW", "TURTLE"].map(
                      (speed) => (
                        <button
                          key={speed}
                          onClick={() => setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              entry_speed: speed
                            }
                          })}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${bot.trade_entry.entry_speed === speed
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                            }`}
                        >
                          {speed}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Entry price aggression and entry speed replacement speed for
                    trades and Early Speed
                  </p>
                </div>
                {
                  (bot.trade_entry.enter_by == "BOT SETTINGS") && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Position Sizing
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              position_sizing: "QUANTITY"
                            }
                          })}
                          className={`py-2 px-4 rounded text-sm font-medium transition-colors ${bot.trade_entry.position_sizing === "QUANTITY"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                            }`}
                        >
                          QUANTITY
                        </button>
                        <button
                          onClick={() => setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              position_sizing: "PERCENT"
                            }
                          })}
                          className={`py-2 px-4 rounded text-sm font-medium transition-colors ${bot.trade_entry.position_sizing === "PERCENT"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                            }`}
                        >
                          PERCENT
                        </button>
                        <button
                          onClick={() => setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              position_sizing: "LEVERAGE"
                            }
                          })}
                          className={`py-2 px-4 rounded text-sm font-medium transition-colors ${bot.trade_entry.position_sizing === "LEVERAGE"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                            }`}
                        >
                          LEVERAGE
                        </button>

                      </div>

                    </div>
                  )}
                {
                  (bot.trade_entry.enter_by == "BOT SETTINGS") && (
                    <div className="px-3">
                      <label className="block text-sm text-gray-400 mb-2">
                        {bot.trade_entry.position_sizing}
                      </label>
                      <input
                        type="number"
                        value={bot.trade_entry.position_sizing_value}
                        onChange={(e) => setBot({
                          ...bot,
                          trade_entry: {
                            ...bot.trade_entry,
                            position_sizing_value: Number(e.target.value)
                          }
                        })}
                        placeholder="Strike Target"
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      />

                      {(bot.trade_entry.position_sizing == "PERCENT") && (
                        <>
                          <label className="block text-sm text-gray-400 mb-2 py-2">
                            Include Credit
                          </label>
                          <button
                            onClick={() => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                include_credit: !bot.trade_entry.include_credit
                              }

                            })}
                            className={`w-full py-2 px-4 rounded text-sm font-medium ${bot.trade_entry.include_credit
                              ? "bg-blue-600 text-white"
                              : "bg-slate-600 text-gray-300"
                              }`}
                          >
                            {bot.trade_entry.include_credit ? "ENABLED" : "DISABLED"}
                          </button></>
                      )}

                    </div>
                  )
                }
              </div>
              {(bot.trade_entry.enter_by == "BOT SETTINGS") && (
                <div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Entry Time Window ⓘ
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">Start:</span>
                          {/* <input
                      type="text"
                      value={config.entryTimeWindow.start}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "entryTimeWindow",
                          "start",
                          e.target.value
                        )
                      }
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_start[0] ? bot.trade_entry.entry_time_window_start[0] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_start: [Number(e.target.value), bot.trade_entry.entry_time_window_start[1], bot.trade_entry.entry_time_window_start[2]]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Hr</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                          </select>
                          {/* <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_start[1] ? bot.trade_entry.entry_time_window_start[1] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_start: [bot.trade_entry.entry_time_window_start[0], Number(e.target.value), bot.trade_entry.entry_time_window_start[2]]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Min</option>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((min) => (
                              <option value={min}>{min}</option>
                            ))}
                          </select>
                          {/* <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_start[2] ? bot.trade_entry.entry_time_window_start[2] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_start: [bot.trade_entry.entry_time_window_start[0], bot.trade_entry.entry_time_window_start[1], Number(e.target.value)]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Sec</option>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((sec) => (
                              <option value={sec}>{sec}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">End:</span>
                          {/* <input
                      type="text"
                      value={config.entryTimeWindow.start}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "entryTimeWindow",
                          "start",
                          e.target.value
                        )
                      }
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_end[0] ? bot.trade_entry.entry_time_window_end[0] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_end: [Number(e.target.value), bot.trade_entry.entry_time_window_end[1], bot.trade_entry.entry_time_window_end[2]]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Hr</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={3}>3</option>
                          </select>
                          {/* <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_end[1] ? bot.trade_entry.entry_time_window_end[1] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_end: [bot.trade_entry.entry_time_window_end[0], Number(e.target.value), bot.trade_entry.entry_time_window_end[2]]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Min</option>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((min) => (
                              <option value={min}>{min}</option>
                            ))}
                          </select>
                          {/* <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    /> */}
                          <select
                            value={bot.trade_entry.entry_time_window_end[2] ? bot.trade_entry.entry_time_window_end[2] : ""}
                            onChange={(e) => setBot({
                              ...bot,
                              trade_entry: {
                                ...bot.trade_entry,
                                entry_time_window_start: [bot.trade_entry.entry_time_window_end[0], bot.trade_entry.entry_time_window_end[1], Number(e.target.value)]
                              }
                            })
                            }
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="" disabled>Sec</option>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((sec) => (
                              <option value={sec}>{sec}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Days of Week to Enter
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "ALL",
                          "MON",
                          "TUE",
                          "WED",
                          "THU",
                          "FRI",
                        ].map((day, index) => (
                          <button
                            key={day}
                            //   setStrategy({
                            //   ...strategy,
                            //   legs: strategy.legs.map((leg, i) =>
                            //     i === index
                            //       ? { ...leg, strike_target_type: e.target.value }
                            //       : leg
                            //   ),
                            // });
                            onClick={() => {
                              if (day != "ALL") {
                                setBot({
                                  ...bot,
                                  trade_entry: {
                                    ...bot.trade_entry,
                                    days_of_week_to_enter: bot.trade_entry.days_of_week_to_enter.map((day, i) =>
                                      i === index
                                        ? !day
                                        : day
                                    )
                                  }
                                });
                              }
                              else if (bot.trade_entry.days_of_week_to_enter[0] == true) {
                                setBot({
                                  ...bot,
                                  trade_entry: {
                                    ...bot.trade_entry,
                                    days_of_week_to_enter: [false, false, false, false, false, false]
                                  }
                                })
                              }
                              else {
                                setBot({
                                  ...bot,
                                  trade_entry: {
                                    ...bot.trade_entry,
                                    days_of_week_to_enter: [true, true, true, true, true, true]
                                  }
                                })
                              }
                            }
                            }

                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${bot.trade_entry.days_of_week_to_enter[index]
                              ? "bg-blue-600 text-white"
                              : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                              }`}
                          >
                            {day}
                          </button>
                        ))}

                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 py-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Open if No Position or Staggered Days ⓘ
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <button onClick={(e) => {
                          setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              open_if_no_position_or_staggered_days: "NO POSITION"
                            }
                          })
                        }}
                          className={` text-white py-2 px-4 rounded text-sm font-medium 
                        ${bot.trade_entry.open_if_no_position_or_staggered_days == "NO POSITION" ? "bg-blue-600" : "bg-slate-600"}`}>
                          NO POSITION
                        </button>
                        <button onClick={(e) => {
                          setBot({
                            ...bot,
                            trade_entry: {
                              ...bot.trade_entry,
                              open_if_no_position_or_staggered_days: "STAGGERED DAYS"
                            }
                          })
                        }}
                          className={` text-white py-2 px-4 rounded text-sm font-medium 
                        ${bot.trade_entry.open_if_no_position_or_staggered_days == "STAGGERED DAYS" ? "bg-blue-600" : "bg-slate-600"}`}>
                          STAGGERED DAYS
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Sets if new positions are only opened if no position for the
                        bot is open or open new position at specified day intervals.
                      </p>
                    </div>
                    {(bot.trade_entry.open_if_no_position_or_staggered_days == "STAGGERED DAYS") && (
                      <>
                        <div>
                          <div>
                          </div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Entry Day Interval
                          </label>
                          <input
                            type="number"
                            value={bot.trade_entry.entry_day_literval}
                            placeholder="Days"
                            onChange={(e) => {
                              setBot({
                                ...bot,
                                trade_entry: {
                                  ...bot.trade_entry,
                                  entry_day_literval: Number(e.target.value)
                                }
                              })
                            }}
                            className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>
                        <div>
                          <div>
                          </div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Entry Time Randomization
                          </label>
                          <select
                            value={bot.trade_entry.entry_time_randomization}
                            onChange={(e) =>
                              setBot({
                                ...bot,
                                trade_entry: {
                                  ...bot.trade_entry,
                                  entry_time_randomization: e.target.value
                                }
                              })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm mb-2"
                          >
                            <option value={0}>No Randomization</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((random_value) => (
                              <option value={Number(random_value * 5)}>{`±${random_value * 5}s`}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Sequential Entry Delay ⓘ
                          </label>
                          <select
                            value={bot.trade_entry.sequential_entry_delay}
                            onChange={(e) =>
                              setBot({
                                ...bot,
                                trade_entry: {
                                  ...bot.trade_entry,
                                  sequential_entry_delay: Number(e.target.value)
                                }
                              })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm mb-2"
                          >
                            {time.map((item, index) => (
                              <option value={Number(index * 10)}>{item}</option>
                            ))}
                            {/* <option value=>0s</option>
                            <option value="30s">30s</option>
                            <option value="1m">1m</option> */}
                          </select>
                          <p className="text-xs text-gray-500">
                            Optional delay after of time once a trade to wait before the
                            but can make after a Trade
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  

                


                
              </div> */}
            </div>

            {/* Trade Exit Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Exit</h2>

              <div className="mb-4 flex space-x-10">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Timed Exit ⓘ
                  </label>
                  <button
                    onClick={() =>
                      setBot({
                        ...bot,
                        trade_exit: {
                          ...bot.trade_exit,
                          timed_exit: !bot.trade_exit.timed_exit
                        }
                      })
                    }
                    className={`py-2 px-4 rounded text-sm font-medium ${bot.trade_exit.timed_exit
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                      }`}
                  >
                    {bot.trade_exit.timed_exit ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {bot.trade_exit.timed_exit && (
                  <>
                    {/* Time Setting to Exit Trade */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Exit at Set Time
                      </label>
                      <div className="flex space-x-3 mb-1">
                        <label className="block text-sm font-medium text-gray-300 content-center">
                          {bot.trade_exit.exit_days_in_trade_or_days_to_expiration == "TO EXPIRATION" ? "DTE" : "Trade Day"}
                        </label>
                        <input
                          type="number"
                          value={bot.trade_exit.exit_at_set_time[0]}
                          onChange={(e) => {
                            setBot({
                              ...bot,
                              trade_exit: {
                                ...bot.trade_exit,
                                exit_at_set_time: [Number(e.target.value), bot.trade_exit.exit_at_set_time[1], bot.trade_exit.exit_at_set_time[2]]
                              }
                            })
                          }}
                          placeholder="Days"
                          className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                        />
                        <label className="block text-sm font-medium text-gray-300 content-center rounded-xl">
                          TIME
                        </label>
                        <select
                          value={bot.trade_exit.exit_at_set_time[1] ? bot.trade_exit.exit_at_set_time[1] : ""}
                          onChange={(e) => setBot({
                            ...bot,
                            trade_exit: {
                              ...bot.trade_exit,
                              exit_at_set_time: [bot.trade_exit.exit_at_set_time[0], Number(e.target.value), bot.trade_exit.exit_at_set_time[2]]
                            }
                          })
                          }
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                          <option value="" disabled>Hr</option>
                          <option value={9}>9</option>
                          <option value={10}>10</option>
                          <option value={11}>11</option>
                          <option value={12}>12</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                        {/* <label className="block text-sm font-medium text-gray-300 content-center">
                          MIN
                        </label> */}
                        <select
                          value={bot.trade_exit.exit_at_set_time[2] ? bot.trade_exit.exit_at_set_time[2] : ""}
                          onChange={(e) => setBot({
                            ...bot,
                            trade_exit: {
                              ...bot.trade_exit,
                              exit_at_set_time: [bot.trade_exit.exit_at_set_time[0], bot.trade_exit.exit_at_set_time[1], Number(e.target.value)]
                            }
                          })}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                          <option value="" disabled>Min</option>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((min) => (
                            <option value={min}>{min}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500">
                        Optional delay after of time once a trade to wait before
                        the but can make after a Trade
                      </p>
                    </div>

                    {/* Exit Days in Trade or Days to Expiration */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Exit Days in Trade or Days to Expiration ⓘ
                      </label>
                      <div className="flex gap-1">
                        <button
                          // onClick={() => {
                          //   handleNestedInputChange(
                          //     "entryFilters",
                          //     "isToExpirationEnabled",
                          //     !config.entryFilters.isToExpirationEnabled
                          //   );
                          //   if (!config.entryFilters.isToExpirationEnabled) {
                          //     handleNestedInputChange(
                          //       "entryFilters",
                          //       "isInTradeEnabled",
                          //       false
                          //     );
                          //   }
                          // }}
                          onClick={() => {
                            setBot({
                              ...bot,
                              trade_exit: {
                                ...bot.trade_exit,
                                exit_days_in_trade_or_days_to_expiration: "TO EXPIRATION"
                              }
                            })
                          }}
                          className={`py-2 px-4 rounded text-sm font-medium ${bot.trade_exit.exit_days_in_trade_or_days_to_expiration == "TO EXPIRATION"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                            }`}
                        >
                          TO EXPIRATION
                        </button>
                        <button
                          onClick={() => {
                            setBot({
                              ...bot,
                              trade_exit: {
                                ...bot.trade_exit,
                                exit_days_in_trade_or_days_to_expiration: "IN TRADE"
                              }
                            })
                          }}
                          className={`py-2 px-4 rounded text-sm font-medium ${bot.trade_exit.exit_days_in_trade_or_days_to_expiration == "IN TRADE"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                            }`}
                        >
                          IN TRADE
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Profit Target Type ⓘ
                </label>
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => {
                      setBot({
                        ...bot,
                        trade_exit: {
                          ...bot.trade_exit,
                          profit_target_type: "DISABLED"
                        }
                      })
                    }}
                    className={
                      `"text-gray-300 py-2 px-4 rounded text-sm font-medium" ${bot.trade_exit.profit_target_type == "DISABLED" ?
                        "bg-red-600"
                        : "bg-slate-600"
                      }`
                    }>
                    DISABLED
                  </button>
                  <button onClick={() => {
                    setBot({
                      ...bot,
                      trade_exit: {
                        ...bot.trade_exit,
                        profit_target_type: "FIXED CLOSING CREDIT TARGET"
                      }
                    })
                  }}
                    className={
                      `"text-gray-300 py-2 px-4 rounded text-sm font-medium" ${bot.trade_exit.profit_target_type == "FIXED CLOSING CREDIT TARGET" ?
                        "bg-blue-600"
                        : "bg-slate-600"
                      }`
                    }>
                    FIXED CLOSING CREDIT TARGET
                  </button>
                  <button onClick={() => {
                    setBot({
                      ...bot,
                      trade_exit: {
                        ...bot.trade_exit,
                        profit_target_type: "FIXED PROFIT TARGET"
                      }
                    })
                  }}
                    className={
                      `"text-gray-300 py-2 px-4 rounded text-sm font-medium" ${bot.trade_exit.profit_target_type == "FIXED NET PROFIT TARGET" ?
                        "bg-blue-600"
                        : "bg-slate-600"
                      }`
                    }>
                    FIXED NET PROFIT TARGET
                  </button>
                  <button onClick={() => {
                    setBot({
                      ...bot,
                      trade_exit: {
                        ...bot.trade_exit,
                        profit_target_type: "PERCENT PROFIT TARGET"
                      }
                    })
                  }}
                    className={
                      `"text-gray-300 py-2 px-4 rounded text-sm font-medium" ${bot.trade_exit.profit_target_type == "PERCENT PROFIT TARGET" ?
                        "bg-blue-600"
                        : "bg-slate-600"
                      }`
                    }>
                    PERCENT PROFIT TARGET
                  </button>
                </div>
                {(bot.trade_exit.profit_target_type != "DISABLED") && (
                  <div className="flex flex-wrap gap-4 py-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 content-center">
                        {bot.trade_exit.profit_target_type === "FIXED CLOSING CREDIT TARGET"
                          ? "Closing Order Target  ($)"
                          : bot.trade_exit.profit_target_type === "FIXED PROFIT TARGET"
                            ? "Net Profit Target ($)"
                            : "Profit Target Percentage (%)"}
                      </label>
                      <input
                        type="number"
                        value={bot.trade_exit.exit_at_set_time[0]}
                        onChange={(e) => {
                          setBot({
                            ...bot,
                            trade_exit: {
                              ...bot.trade_exit,
                              exit_at_set_time: [Number(e.target.value), bot.trade_exit.exit_at_set_time[1], bot.trade_exit.exit_at_set_time[2]]
                            }
                          })
                        }}
                        placeholder="Days"
                        className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    < div >
                      <label className="block text-sm text-gray-400 mb-2">
                        Disable Profit Target After Stop ⓘ
                      </label>
                      <button
                        onClick={() => {
                          setBot({
                            ...bot,
                            trade_exit: {
                              ...bot.trade_exit,
                              disable_profit_target_after_stop: !bot.trade_exit.disable_profit_target_after_stop
                            }
                          })
                        }}
                        className={
                          `"text-gray-300 py-2 px-4 rounded text-sm font-medium" ${bot.trade_exit.disable_profit_target_after_stop ?
                            "bg-blue-600"
                            : "bg-slate-600"
                          }`
                        }>
                        {bot.trade_exit.disable_profit_target_after_stop ? "ENABLED" : "DISABLED"}
                      </button>
                    </div>
                  </div>
                )}
              </div>


            </div>

            {/* Trade Stop Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Stop</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Stop Loss Type ⓘ
                </label>
                <div className="flex space-x-2 mb-4">
                  <button className="bg-red-600 text-white py-2 px-4 rounded text-sm font-medium">
                    DISABLED
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    DOLLAR LOSS
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    PERCENT PROFIT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    CLOSING PRICE PERCENT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    FIXED DEBIT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    SET STOP HELD (%)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Trailing Stop Configuration
                </label>
                <label className="block text-sm text-gray-400 mb-2">
                  Trailing Stops ⓘ
                </label>
                <button
                  onClick={() =>
                    handleInputChange("trailingStops", !config.trailingStops)
                  }
                  className={`py-2 px-4 rounded text-sm font-medium ${config.trailingStops
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600 text-gray-300"
                    }`}
                >
                  {config.trailingStops ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>

            {/* Trade Conditions Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Trade Conditions
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-3">
                  Entry Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Entry Filters
                      {hasFieldError("maxTradesPerDay") && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                    <button
                      onClick={() =>
                        handleNestedInputChange(
                          "entryFilters",
                          "isEntryFiltersEnabled",
                          !config.entryFilters.isEntryFiltersEnabled
                        )
                      }
                      className={`${config.entryFilters.isEntryFiltersEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      {config.entryFilters.isEntryFiltersEnabled
                        ? "ENABLED"
                        : "ENABLE"}
                    </button>
                    {hasFieldError("maxTradesPerDay") && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getFieldError("maxTradesPerDay")}
                      </p>
                    )}
                    {hasFieldWarning("maxTradesPerDay") && (
                      <p className="text-yellow-400 text-xs mt-1 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getFieldWarning("maxTradesPerDay")}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enables filters based on the value or change in the
                      underlying or volatility index.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Max Trades Per Day
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaxTradesPerDayEnabled",
                            !config.entryFilters.isMaxTradesPerDayEnabled
                          )
                        }
                        className={`${config.entryFilters.isMaxTradesPerDayEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                          } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaxTradesPerDayEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaxTradesPerDayEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maxTradesPerDay}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maxTradesPerDay",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Max Profit Targets Per Day
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaxConcurrentTradesEnabled",
                            !config.entryFilters.isMaxConcurrentTradesEnabled
                          )
                        }
                        className={`${config.entryFilters.isMaxConcurrentTradesEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                          } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaxConcurrentTradesEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaxConcurrentTradesEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maxConcurrentTrades}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maxConcurrentTrades",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Maximum profit target closings before the bot stops
                      opening new trades for the day.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Minimum Price to Enter
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMinimumPriceToEnterEnabled",
                            !config.entryFilters.isMinimumPriceToEnterEnabled
                          )
                        }
                        className={`${config.entryFilters.isMinimumPriceToEnterEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                          } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMinimumPriceToEnterEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMinimumPriceToEnterEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.minimumPriceToEnter}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "minimumPriceToEnter",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      The minimum price that a trade will attempt to open.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Maximum Price to Enter
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaximumPriceToEnterEnabled",
                            !config.entryFilters.isMaximumPriceToEnterEnabled
                          )
                        }
                        className={`${config.entryFilters.isMaximumPriceToEnterEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                          } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaximumPriceToEnterEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaximumPriceToEnterEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maximumPriceToEnter}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maximumPriceToEnter",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      The maximum price that a trade will attempt to open.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Check Closings Before Opening ⓘ
                    </label>
                    <button
                      onClick={() =>
                        handleNestedInputChange(
                          "entryFilters",
                          "isCheckClosingsEnabled",
                          !config.entryFilters.isCheckClosingsEnabled
                        )
                      }
                      className={`${config.entryFilters.isCheckClosingsEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      {config.entryFilters.isCheckClosingsEnabled
                        ? "ENABLED"
                        : "ENABLE"}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Disables searching closed trades and checks trades before
                      opening new trades
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Only Credit or Debit ⓘ
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isAnyEnabled",
                          !config.entryFilters.isAnyEnabled
                        );
                        // Disable other buttons when ANY is enabled
                        if (!config.entryFilters.isAnyEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isCreditEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isDebitEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isAnyEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      ANY
                    </button>
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isCreditEnabled",
                          !config.entryFilters.isCreditEnabled
                        );
                        // Disable other buttons when CREDIT is enabled
                        if (!config.entryFilters.isCreditEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isAnyEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isDebitEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isCreditEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      CREDIT
                    </button>
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isDebitEnabled",
                          !config.entryFilters.isDebitEnabled
                        );
                        // Disable other buttons when DEBIT is enabled
                        if (!config.entryFilters.isDebitEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isAnyEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isCreditEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isDebitEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      DEBIT
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use this for 15 at 9:30-14:30 AM to see the underlying's
                    opening quote and check SOX applications
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Opening Quote ⓘ
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const newTimeState = !config.entryFilters.isTimeEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isTimeEnabled",
                          newTimeState
                        );
                        if (newTimeState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isFirstTickerEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isTimeEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      9:30:20
                    </button>
                    <button
                      onClick={() => {
                        const newTickerState =
                          !config.entryFilters.isFirstTickerEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isFirstTickerEnabled",
                          newTickerState
                        );
                        if (newTickerState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isTimeEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isFirstTickerEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      First Ticker
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use this for 15 at 9:30-14:30 AM to see the underlying's
                    opening quote and check SOX applications
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Skip Event Days ⓘ
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <button
                      onClick={() => {
                        const newFirstFridayState =
                          !config.entryFilters.isFirstFridayEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isFirstFridayEnabled",
                          newFirstFridayState
                        );
                        if (newFirstFridayState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isSkipEventDaysEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isFirstFridayEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      FIRST FRI
                    </button>
                    <button
                      onClick={() => {
                        const newSkipEventDaysState =
                          !config.entryFilters.isSkipEventDaysEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isSkipEventDaysEnabled",
                          newSkipEventDaysState
                        );
                        if (newSkipEventDaysState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isFirstFridayEnabled",
                            false
                          );
                        }
                      }}
                      className={`${config.entryFilters.isSkipEventDaysEnabled
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                    >
                      ENABLED
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Skip window or opt to trade on FOMC and EOD. and the day of
                    and after a Federal Reserve FOMC meeting. and OPEX
                  </p>
                </div>
              </div>
            </div>

            {/* Bot Dependencies Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Bot Dependencies
              </h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Enable Bot Dependencies
                </label>
                <button
                  onClick={() =>
                    handleInputChange(
                      "enableBotDependencies",
                      !config.enableBotDependencies
                    )
                  }
                  className={`py-2 px-4 rounded text-sm font-medium ${config.enableBotDependencies
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600 text-gray-300"
                    }`}
                >
                  {config.enableBotDependencies ? "ENABLED" : "DISABLED"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Open or Force Stop this bot when certain bots are open and
                  open or there been in a trade today
                </p>
              </div>
            </div>

            {/* Bot Notes Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Bot Notes</h2>

              <textarea
                value={config.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add notes about this bot..."
                rows={6}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3 text-white resize-none"
              />
            </div>

            {/* Webhook Remote Control Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Webhook Remote Control
              </h2>

              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-4">
                  Webhooks are disabled for your account. To enable them, please
                  visit Account Settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Footer Note */}
        {!validationResult.isValid && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2 text-yellow-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Complete all required fields to create your bot
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Fix the validation errors above and ensure all required fields are
              filled out before creating your bot.
            </p>
          </div>
        )}
      </div>
    </div >
  );
}
