users table
sql


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR,
    phone_number VARCHAR,
    hashed_password VARCHAR NOT NULL,
    user_level INTEGER NOT NULL DEFAULT 0,
    social_account JSON DEFAULT '{"Discord": "cleanmind777"}',
    two_factor BOOLEAN NOT NULL DEFAULT FALSE,
    account_access_settings JSON NOT NULL DEFAULT '{"log_me_out_after_no_activity_for": 0.5, "pause_bots_if_no_activity_for": 2}',
    email_preferences JSON NOT NULL DEFAULT '{"bot_trading_alerts": true, "service_alerts": true, "feature_announcements": true, "promotional_emails": true}',
    user_preferences JSON NOT NULL DEFAULT '{"main_dashboard_settings": {"default_to_privacy_mode_on": false, "hide_closed_trades_on_bots_table": false, "show_todays_bot_trade_profit_card": false, "show_all_bot_trades_profit_card": false, "show_strategy_profits_on_profit_cards": false, "show_intraday_chart": false, "show_trade_counts_card": false, "show_recent_bot_activity": false}, "number_of_recent_bot_activities_to_show": 3, "intraday_chart_settings": {"display_buying_power": false, "display_trades": false, "delay_chart_start_until": false}, "chart_comparison_index": "SPY"}',
    bot_preferences JSON NOT NULL DEFAULT '{"percent_sizing_uses_minimum_quantity_of_1": true, "leverage_sizing_uses_minimum_quantity_of_1": true, "wide_spread_patience_window": 3, "profit_target_trigger": 5, "enable_bot_webhook_controls": false}',
    created_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_website_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
    trades_logged INTEGER NOT NULL DEFAULT 0,
    strategies_created INTEGER NOT NULL DEFAULT 0,
    bots_created INTEGER NOT NULL DEFAULT 0,
    disabled BOOLEAN NOT NULL DEFAULT FALSE,
    group_id UUID,
    group_display_name VARCHAR,
    group_admin BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);



strategies table
sql


CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description VARCHAR,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    symbol VARCHAR,
    parameters JSON,
    trade_type VARCHAR,
    number_of_legs INTEGER,
    skip_am_expirations BOOLEAN NOT NULL DEFAULT FALSE,
    sell_bidless_longs_on_trade_exit BOOLEAN NOT NULL DEFAULT FALSE,
    efficient_spreads BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_strategies_user_id ON strategies(user_id);


legs table
sql


CREATE TABLE legs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    leg_order INTEGER NOT NULL,
    strike_target_type VARCHAR,
    strike_target_value FLOAT,
    strike_target_min_value FLOAT,
    strike_target_max_value FLOAT,
    option_type VARCHAR,
    long_or_short VARCHAR,
    size_ratio INTEGER NOT NULL DEFAULT 1,
    days_to_expiration_type VARCHAR,
    days_to_expiration_value INTEGER,
    days_to_expiration_min_value INTEGER,
    days_to_expiration_max_value INTEGER,
    conflict_resolution BOOLEAN NOT NULL DEFAULT FALSE,
    conflict_resolution_towards_underlying_mark INTEGER,
    conflict_resolution_awayfrom_underlying_mark INTEGER
);

CREATE INDEX idx_legs_strategy_id ON legs(strategy_id);