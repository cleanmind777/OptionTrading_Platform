export interface Strategy {
  id: string;
  name: string;
  description: string;
  symbol: string;
  parameters: Record<string, any>; // Or a more specific params type if you know the keys
  trade_type: string;
  skip_am_expirations: boolean;
  sell_bidless_longs_on_trade_exit: boolean;
  efficient_spreads: boolean;
  legs: Leg[];
  number_of_legs: number;
}

export interface Leg {
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

export interface StrategyPerformance {
  strategy_id: string;
  name: string;
  symbol: string;
  total_profit?: number;
  total_loss?: number;
  total_wins?: BigInt;
  total_losses?: BigInt;
  win_rate?: number;
}

export interface StrategySimplePerformance {
  id: string;
  name: string;
  pnl: number;
  win_rate: number;
}
