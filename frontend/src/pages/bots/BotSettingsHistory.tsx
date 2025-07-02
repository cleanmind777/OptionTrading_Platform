import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper interfaces for nested objects
interface TradeExit {
  timed_exit: boolean;
  exit_days_in_trade_or_days_to_expiration: string;
  exit_at_set_time: [number, number, number];
  profit_target_type: string;
  profit_target_value: number;
  disable_profit_target_after_stop: boolean;
}

interface TradeCondition {
  entry_filters: boolean;
  max_trades_per_day: boolean;
  max_trades_per_day_value: number;
  max_concurrent_trades: boolean;
  max_concurrent_trades_value: number;
  max_profit_targets_per_day: boolean;
  max_profit_targets_per_day_value: number;
  max_stops_per_day: boolean;
  max_stops_per_day_value: number;
  minimum_price_to_enter: boolean;
  minimum_price_to_enter_value: number;
  maximum_price_to_enter: boolean;
  maximum_price_to_enter_value: number;
  check_closings_before_opening: boolean;
  only_credit_or_debit: string;
  opening_quote: string;
  trade_on_event_days: boolean;
  trade_on_special_days: {
    all_other_days: boolean;
    fomc_press_conferences: [boolean, boolean, boolean];
    monthly_cpi_report: [boolean, boolean, boolean];
    monthly_opex: [boolean, boolean, boolean];
    last_trading_day_of_the: [boolean, boolean];
  };
  underlying_entry_filters: any; // You can further expand this based on your needs
  volatility_index_entry_filters: any;
}

interface TradeEntry {
  enter_by: string;
  auto_size_down: boolean;
  entry_speed: string;
  position_sizing: string;
  position_sizing_value: number;
  include_credit: boolean;
  entry_time_window_start: [number, number, number];
  entry_time_window_end: [number, number, number];
  days_of_week_to_enter: [boolean, boolean, boolean, boolean, boolean, boolean];
  open_if_no_position_or_staggered_days: string;
  entry_day_literval: number;
  entry_time_randomization: number;
  sequential_entry_delay: number;
}

interface TradeStop {
  stop_loss_type: string;
  stop_controller_type: string;
  stop_order_type: string;
  stop_based_on: string;
  stop_value: number;
  side_to_stop: string;
  close_remaining_legs_after_stop: boolean;
  stop_when_ITM_or_OTM: string;
  stop_adjustments: boolean;
  stop_adjustments_settings: any;
  stop_speed: string;
  custom_stop_speed_settings: any;
  partial_trade_stops: string;
  entire_trade_stops: string;
  trailing_stop_configuration: any;
}

interface BotDependencies {
  do_not_open_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
    bots_have_been_in_trade_today: string;
  };
  only_open_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
    bots_have_been_in_trade_today: string;
  };
  immediately_close_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
  };
  disabled_bots_shouldbe_ignored: boolean;
}

interface StrategyLeg {
  strike_target_type: string;
  strike_target_value: [number, number, number];
  option_type: string;
  long_or_short: string;
  size_ratio: number;
  days_to_expiration_type: string;
  days_to_expiration_value: [number, number, number];
  conflict_resolution: boolean;
  conflict_resolution_value: [number, number];
}

interface Strategy {
  user_id: string;
  description: string | null;
  updated_at: string;
  symbol: string;
  trade_type: string;
  skip_am_expirations: boolean;
  efficient_spreads: boolean;
  name: string;
  id: string;
  created_at: string;
  parameters: any;
  number_of_legs: number;
  sell_bidless_longs_on_trade_exit: boolean;
  legs: StrategyLeg[];
}

// Main TradingBot interface
export interface TradingBot {
  id: string;
  is_active: boolean;
  updated_at: string;
  strategy_id: string;
  trade_exit: TradeExit;
  trade_condition: TradeCondition;
  name: string;
  user_id: string;
  description: string;
  created_at: string;
  trading_account: string;
  trade_entry: TradeEntry;
  trade_stop: TradeStop;
  bot_dependencies: BotDependencies;
  strategy: Strategy;
}

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

interface Filter {
  user_id: string
  bot_id: string
  from_time: Date
  to_time: Date
}

interface History {
  id: string
  user_id: string
  bot_id: string
  bot_name: string
  change_info: JSON
  changed_at: Date
}

export function BotSettingsHistory() {
  const [selectedBot, setSelectedBot] = useState('All')
  const [history, setHistory] = useState<History[]>([])
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!)
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
    "trade_stop": {
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
        "stop_adjustments_by_time":
        {
          "days": 1,
          "adjustment_time": "",
          "stop_adjustment": 0.0,
          "disable_stops": false,
        }

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
          "send_market_order_after": 0,
        },

      },
      "partial_trade_stops": "VERTICALS",
      "entire_trade_stops": "ENTIRE TRADE ON SHORT",
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
      "maximum_price_to_enter": false,
      "maximum_price_to_enter_value": 0.0,
      "check_closings_before_opening": false,
      "only_credit_or_debit": "ANY",
      "opening_quote": "9:30:05",
      "trade_on_event_days": false,
      "user_hosted_entry_filters": false,
      "user_hosted_entry_filters_endpoint": "",
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
          "moving_average_type": "",
          "period_type": "",
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
          "moving_average_type": "",
          "period_type": "",
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
          "moving_average_type": "",
          "period_type": "",
          "period_length": 0.0,
          "periods_in_moving_average1": 0.0,
          "periods_in_moving_average2": 0.0,
          "open_trade_when": "Greater Than",
        },
      },
    },
    "bot_dependencies": {
      "enabled": false,
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
  const [filter, setFilter] = useState<Filter>({
    user_id: userInfo.id,
    bot_id: "",
    from_time: new Date(),
    to_time: new Date(),
  });
  // const [bot, setBot] = useState<TradingBot>()
  const [bots, setBots] = useState<TradingBot[]>([
    // Sample data - in real app this would come from API
  ])

  const getBots = () => {
    const params = {
      user_id: userInfo.id,
      name: "",
      trading_account: "",
      is_active: "All",
      strategy: "All",
      entryDay: "Any",
      symbol: "All",
      webhookPartial: "All",
    }
    axios.post(`${BACKEND_URL}/bot/get_bots`, params)
      .then(response => {
        setBots(response.data);
        localStorage.setItem('bots', response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  const getHistory = () => {
    axios.post(`${BACKEND_URL}/bot/get_setting_history`, filter)
      .then(response => {
        console.log(response.data)
        setHistory(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    setFilter({
      user_id: userInfo.id,
      bot_id: selectedBot,
      from_time: new Date(),
      to_time: new Date(),
    })
    getBots();
  }, [])
  useEffect(() => {

  }, [bots, history])
  useEffect(() => {
    setFilter(
      {
        ...filter,
        bot_id: selectedBot
      }
    )
  }, [selectedBot])
  useEffect(() => {
    console.log("Filter: ", filter)
  }, [filter])
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bot Settings History</h1>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-2xl mx-auto">
          {/* Select Bot to View */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Bot to View
            </label>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
            >
              <option value="All">All Bots</option>
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Settings As Of */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              View Settings As Of
            </label>
            <div className="flex gap-4">
              <input
                type="date"
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
                value={filter.from_time ? filter.from_time.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setFilter({ ...filter, from_time: new Date(e.target.value) })
                }
              />
              <input
                type="date"
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
                value={filter.to_time ? filter.to_time.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setFilter({ ...filter, to_time: new Date(e.target.value) })
                }
              />
              <button
                onClick={getHistory}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                GET SETTINGS
              </button>
            </div>
          </div>

          {/* History Display */}
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700 p-4 rounded-lg border border-slate-600"
                >
                  <h3 className="font-bold text-lg">
                    Bot: {item.bot_name} ({item.bot_id})
                  </h3>
                  <p className="text-sm text-gray-400">
                    Changed at: {format(new Date(item.changed_at), 'yyyy-MM-dd HH:mm:ss')}
                  </p>
                  <div className="mt-2">
                    <h4 className="font-medium">Changes:</h4>
                    <ul className="list-disc pl-5">
                      {item.change_info.map((change: any, index: number) => {
                        const key = Object.keys(change)[0]
                        const [oldValue, newValue] = change[key]
                        return (
                          <li key={index}>
                            <span className="font-semibold">{key}:</span> {oldValue} → {newValue}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No settings history found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
