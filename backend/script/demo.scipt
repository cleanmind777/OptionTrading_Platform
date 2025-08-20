CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR,
    phone_number VARCHAR,
    hashed_password VARCHAR NOT NULL,
    user_level INTEGER NOT NULL DEFAULT 0,
    social_account JSON DEFAULT '{"Discord":""}',
    two_factor BOOLEAN NOT NULL DEFAULT FALSE,
    account_access_settings JSON NOT NULL DEFAULT '{"log_me_out_after_no_activity_for": 0.5, "pause_bots_if_no_activity_for": 2}',
    email_preferences JSON NOT NULL DEFAULT '{"bot_trading_alerts": true, "service_alerts": true, "feature_announcements": true, "promotional_emails": true}',
    user_preferences JSON NOT NULL DEFAULT '{"main_dashboard_settings": {"default_to_privacy_mode_on": false, "hide_closed_trades_on_bots_table": false, "show_todays_bot_trade_profit_card": false, "show_all_bot_trades_profit_card": false, "show_strategy_profits_on_profit_cards": false, "show_intraday_chart": false, "show_trade_counts_card": false, "show_recent_bot_activity": false}, "number_of_recent_bot_activities_to_show": 3, "intraday_chart_settings": {"display_buying_power": false, "display_trades": false, "delay_chart_start_until": false}, "chart_comparison_index": "SPY"}',
    bot_preferences JSON NOT NULL DEFAULT '{"percent_sizing_uses_minimum_quantity_of_1": true, "leverage_sizing_uses_minimum_quantity_of_1": true, "wide_spread_patience_window": 3, "profit_target_trigger": 5, "enable_bot_webhook_controls": false}',
    created_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_website_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trades_logged INTEGER NOT NULL DEFAULT 0,
    strategies_created INTEGER NOT NULL DEFAULT 0,
    bots_created INTEGER NOT NULL DEFAULT 0,
    disabled BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR,
    total_balance FLOAT,
    total_profit FLOAT DEFAULT 0,
    total_loss FLOAT DEFAULT 0,
    total_wins FLOAT DEFAULT 0,
    total_losses FLOAT DEFAULT 0,
    win_rate FLOAT DEFAULT 1,
    demo_status BOOLEAN DEFAULT FALSE
);


CREATE TABLE trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR NOT NULL,
    description VARCHAR,
    type VARCHAR NOT NULL,
    api_key VARCHAR,
    api_secret VARCHAR,
    refresh_token VARCHAR,
    access_token VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    current_balance FLOAT DEFAULT 1000000.0,
    total_profit FLOAT DEFAULT 0,
    total_loss FLOAT DEFAULT 0,
    total_wins FLOAT DEFAULT 0,
    total_losses FLOAT DEFAULT 0,
    win_rate FLOAT DEFAULT 1
);



CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR NOT NULL,
    description VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    symbol VARCHAR,
    parameters JSON,
    trade_type VARCHAR,
    number_of_legs INTEGER,
    skip_am_expirations BOOLEAN DEFAULT FALSE,
    sell_bidless_longs_on_trade_exit BOOLEAN DEFAULT FALSE,
    efficient_spreads BOOLEAN DEFAULT FALSE,
    legs JSON,
    total_profit FLOAT DEFAULT 0.0,
    total_loss FLOAT DEFAULT 0.0,
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0
);




CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR NOT NULL,
    description VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    trading_account_id VARCHAR,
    strategy_id UUID NOT NULL REFERENCES strategies(id),
    trade_entry JSON,
    trade_exit JSON,
    trade_stop JSON,
    trade_condition JSON,
    bot_dependencies JSON,
    current_status VARCHAR,
    current_trading_task_id UUID,
    total_profit FLOAT DEFAULT 0,
    total_loss FLOAT DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    win_trades_count INTEGER DEFAULT 0,
    loss_trades_count INTEGER DEFAULT 0
);




CREATE TABLE bots_setting_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES bots(id),
    user_id UUID NOT NULL REFERENCES users(id),
    change_info JSON NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);




CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR NOT NULL UNIQUE,
    img_url VARCHAR,
    admin_email VARCHAR NOT NULL,
    notification_email VARCHAR NOT NULL,
    total_users INTEGER NOT NULL DEFAULT 1,
    shared_bots INTEGER NOT NULL DEFAULT 0
);




CREATE TABLE group_users (
    group_id UUID REFERENCES groups(id),
    user_id UUID REFERENCES users(id),
    PRIMARY KEY (group_id, user_id)
);


CREATE TABLE backtests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    finished_at TIMESTAMP WITHOUT TIME ZONE,
    start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    strategy_id UUID NOT NULL REFERENCES strategies(id),
    bot_id UUID NOT NULL REFERENCES bots(id),
    result JSON DEFAULT '{}'
);

CREATE TABLE trading_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celery_id VARCHAR,
    user_id UUID NOT NULL REFERENCES users(id),
    bot_id UUID NOT NULL REFERENCES bots(id),
    trading_account_id VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    symbol VARCHAR,
    total_profit FLOAT DEFAULT 0,
    win_trades_count INTEGER DEFAULT 0,
    loss_trades_count INTEGER DEFAULT 0,
    average_win FLOAT DEFAULT 0,
    average_loss FLOAT DEFAULT 0,
    start_time TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    end_time TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE trading_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    bot_id UUID NOT NULL REFERENCES bots(id),
    strategy_id UUID NOT NULL REFERENCES strategies(id),
    trading_account_id UUID REFERENCES trading_accounts(id),
    trading_task_id UUID REFERENCES trading_tasks(id),
    symbol VARCHAR,
    status VARCHAR DEFAULT 'Open',
    profit FLOAT DEFAULT 0,
    win_loss BOOLEAN,
    time TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    closed_time TIMESTAMP WITHOUT TIME ZONE,
    current_total_balance FLOAT,
    current_account_balance FLOAT,
    current_win_rate FLOAT,
    current_total_profit FLOAT,
    current_total_loss FLOAT,
    current_total_wins INTEGER,
    current_total_losses INTEGER,
    current_win_rate_for_user FLOAT,
    current_total_profit_for_user FLOAT,
    current_total_loss_for_user FLOAT,
    current_total_wins_for_user INTEGER,
    current_total_losses_for_user INTEGER,
    current_win_rate_for_account FLOAT,
    current_total_profit_for_account FLOAT,
    current_total_loss_for_account FLOAT,
    current_total_wins_for_account INTEGER,
    current_total_losses_for_account INTEGER,
    current_win_rate_for_strategy FLOAT,
    current_total_profit_for_strategy FLOAT,
    current_total_loss_for_strategy FLOAT,
    current_total_wins_for_strategy INTEGER,
    current_total_losses_for_strategy INTEGER
);