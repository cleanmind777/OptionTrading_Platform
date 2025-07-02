import { useState } from 'react'
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

interface StrategyConfig {

}

export function BotSettingsHistory() {
  const [selectedBot, setSelectedBot] = useState('All Bots')
  const [viewAs, setViewAs] = useState('Settings Time')

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bot Settings History</h1>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Select Bot to View */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Bot to View
              </label>
              <div className="relative">
                <select
                  value={selectedBot}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white appearance-none"
                >
                  <option value="All Bots">All Bots</option>
                  <option value="Bot 1">Bot 1</option>
                  <option value="Bot 2">Bot 2</option>
                  <option value="Bot 3">Bot 3</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Settings As Of */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                View Settings As Of
              </label>
              <select
                value={viewAs}
                onChange={(e) => setViewAs(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value="Settings Time">Settings Time</option>
                <option value="Current Time">Current Time</option>
                <option value="Custom Date">Custom Date</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                GET SETTINGS
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                COPY TO NEW BOT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
