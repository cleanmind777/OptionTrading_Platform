export interface Bot {
  user_id: string;
  name: string;
  description: string;
  is_active: boolean;
  trading_account: string;
  strategy_id: string;
  trade_entry: TradeEntry;
  trade_exit: TradeExit;
  trade_stop: TradeStop;
  trade_condition: TradeCondition;
  bot_dependencies: BotDependencies;
  total_profit: number,
  win_rate: number,
  win_trades_count: number,
  loss_trades_count: number,
  average_win: number,
  average_loss: number,
  current_trading_task_id: string
}

export interface TradeEntry {
  enter_by: string;
  auto_size_down: boolean;
  entry_speed: string;
  position_sizing: string;
  position_sizing_value: number;
  include_credit: boolean;
  entry_time_window_start: [number, number, number];
  entry_time_window_end: [number, number, number];
  days_of_week_to_enter: boolean[];
  open_if_no_position_or_staggered_days: string;
  entry_day_literval: number;
  entry_time_randomization: number;
  sequential_entry_delay: number;
}

export interface TradeExit {
  timed_exit: boolean;
  exit_days_in_trade_or_days_to_expiration: string;
  exit_at_set_time: [number, number, number];
  profit_target_type: string;
  profit_target_value: number;
  disable_profit_target_after_stop: boolean;
}

export interface TradeStop {
  stop_loss_type: string;
  stop_controller_type: string;
  stop_order_type: string;
  stop_based_on: string;
  stop_value: number;
  side_to_stop: string;
  close_remaining_legs_after_stop: boolean;
  stop_when_ITM_or_OTM: string;
  stop_adjustments: boolean;
  stop_adjustments_settings: StopAdjustmentsSettings;
  stop_speed: string;
  custom_stop_speed_settings: CustomStopSpeedSettings;
  partial_trade_stops: string;
  entire_trade_stops: string;
  trailing_stop_configuration: TrailingStopConfiguration;
}

export interface StopAdjustmentsSettings {
  stop_adjustments_on_days_in_trade_or_days_to_expiration: string;
  stop_adjustments_by_time: {
    days: number;
    adjustment_time: string;
    stop_adjustment: number;
    disable_stops: boolean;
  };
}

export interface CustomStopSpeedSettings {
  stop_trigger_settings: {
    stop_after: number;
    out_of: number;
    check_interval_after_first_hit: number;
  };
  stop_order_settings: {
    first_attempt_slippage: number;
    replace_order_after: number;
    add_slippage_order: number;
    send_market_order_after: number;
  };
}

export interface TrailingStopConfiguration {
  trailing_stop: boolean;
  trail_calculated_by: string;
  profit_trigger_for_trailing_stop: number;
  trailing_stop_allowance: number;
  trailing_stop_speed: string;
  custom_trailing_stop_speed_settings: {
    trailing_stop_trigger_settings: {
      stop_after: number;
      out_of: number;
      check_interval_after_first_hit: number;
    };
    trailing_stop_order_settings: {
      first_attempt_slippage: number;
      replace_order_after: number;
      add_slippage_order: number;
      send_market_attemps: number;
    };
  };
}

export interface TradeCondition {
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
  user_hosted_entry_filters: boolean;
  user_hosted_entry_filters_endpoint: string;
  trade_on_special_days: TradeOnSpecialDays;
  underlying_entry_filters: UnderlyingEntryFilters;
  volatility_index_entry_filters: VolatilityIndexEntryFilters;
}

export interface TradeOnSpecialDays {
  all_other_days: boolean;
  fomc_press_conferences: boolean[];
  monthly_cpi_report: boolean[];
  monthly_opex: boolean[];
  last_trading_day_of_the: boolean[];
}

export interface UnderlyingEntryFilters {
  open_when_underlying_intraday_change: OpenChangeFilter;
  open_when_underlying_oneday_change: OpenChangeFilter;
  open_when_underlying_overnight_gap: OpenChangeFilter;
  open_when_underlying_market_value_between: OpenChangeFilter;
  open_when_underlying_moving_average_range: {
    enabled: boolean;
    moving_average_type: string;
    period_type: string;
    periods: number;
    period_length: number;
    open_trade_when_underlying_market_price_is: {
      greater_than: { on: boolean; value: number };
      lower_than: { on: boolean; value: number };
    };
  };
  open_when_underlying_moving_average_crossover: {
    enabled: boolean;
    moving_average_type: string;
    period_type: string;
    period_length: number;
    periods_in_moving_average1: number;
    periods_in_moving_average2: number;
    open_trade_when: string;
  };
}

export interface VolatilityIndexEntryFilters {
  open_when_volatility_index_intraday_change: OpenChangeFilter;
  open_when_volatility_index_oneday_change: OpenChangeFilter;
  open_when_volatility_index_overnight_gap: OpenChangeFilter;
  open_when_volatility_index_between: OpenChangeFilter;
  open_when_volatility_index_moving_average_range: {
    enabled: boolean;
    moving_average_type: string;
    period_type: string;
    periods: number;
    period_length: number;
    open_trade_when_underlying_market_price_is: {
      greater_than: { on: boolean; value: number };
      lower_than: { on: boolean; value: number };
    };
  };
  open_when_volatility_index_moving_average_crossover: {
    enabled: boolean;
    moving_average_type: string;
    period_type: string;
    period_length: number;
    periods_in_moving_average1: number;
    periods_in_moving_average2: number;
    open_trade_when: string;
  };
}

export interface OpenChangeFilter {
  enabled: boolean;
  greater_than: { on: boolean; value: number };
  lower_than: { on: boolean; value: number };
}

export interface BotDependencies {
  enabled: boolean;
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
