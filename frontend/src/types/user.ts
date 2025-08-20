import { LogSimple, RecenTrade } from "../types/trading";
import { StrategySimplePerformance } from "../types/strategy";
export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_account: JSON;
  user_level: BigInt;
  two_factor: Boolean;
  user_preferences: JSON;
  bot_preferences: JSON;
  account_access_settings: JSON;
  email_preferences: JSON;
  created_time: Date;
  last_login_time: Date;
  last_website_activity: Date;
  trades_logged: BigInt;
  strategies_created: BigInt;
  bots_created: BigInt;
  group_id: string;
  group_display_name: string;
  group_admin: Boolean;
  total_balance: number;
  total_profit: number;
  total_loss: number;
  total_wins: number;
  total_losses: BigInt;
  win_rate: number;
  demo_status: boolean;
}

export interface AccountInsights {
  total_balance?: number;
  today_pnl?: number;
  total_pnl?: number;
  total_return?: number;
  active_bots?: BigInt;
  win_rate?: number;
  total_trades?: BigInt;
  user_pnl_logs?: [LogSimple];
  strategies?: [StrategySimplePerformance];
  average_win?: number;
  average_loss?: number;
  risk_reward_ratio?: number;
  recent_trades?: [RecenTrade];
}
