export interface TradingLog {
  id: string;
  user_id: string;
  trading_account_id: string;
  bot_id: string;
  trading_task_id: string;
  symbol: string;
  win_loss: boolean;
  profit: number;
  time: Date;
  current_total_balance: number;
  current_account_balance: number;
  current_win_rate: number;
  current_total_profit: number;
  current_total_loss: number;
  current_total_wins: BigInt;
  current_total_losses: BigInt;
  current_win_rate_for_user: number;
  current_total_profit_for_user: number;
  current_total_loss_for_user: number;
  current_total_wins_for_user: BigInt;
  current_total_losses_for_user: BigInt;
  current_win_rate_for_account: number;
  current_total_profit_for_account: number;
  current_total_loss_for_account: number;
  current_total_wins_for_account: BigInt;
  current_total_losses_for_account: BigInt;
}

export interface TradingAccount {
  id: string;
  name: string;
  description: string;
  type: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  current_balance: number;
  total_profit: number;
  total_loss: number;
  total_wins: BigInt;
  total_losses: BigInt;
  win_rate: number;
}

export interface TradingLogFilter {
  id?: string;
  user_id: string;
  bot_id?: string;
  type?: string;
  trading_task_id?: string;
  trading_account_id?: string;
  symbol?: string; // Optional property marked with ?
  win_loss?: boolean; // Optional property marked with ?
}

export interface TradingChartData {
  time: string | Date; // Accept either string or Date
  current_total_balance: number;
  current_total_profit: number;
  current_total_loss: number;
  current_total_wins: number;
  current_total_losses: number;
}
