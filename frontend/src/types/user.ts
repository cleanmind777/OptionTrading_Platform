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
}
