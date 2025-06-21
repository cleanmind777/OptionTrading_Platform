from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    user_level = Column(Integer, nullable = False, default=0)
    social_account = Column(JSON, nullable = True, default={"Discord":"cleanmind777"})
    two_factor = Column(Boolean, nullable = False, default=False)
    account_access_settings = Column(JSON, nullable=False, default={
        "log_me_out_after_no_activity_for": 0.5,
        "pause_bots_if_no_activity_for" : 2,
    })
    email_preferences = Column(JSON, nullable=False, default={
        "bot_trading_alerts" : True,
        "service_alerts" : True,
        "feature_announcements" : True,
        "promotional_emails" : True
    })
    user_preferences = Column(JSON, nullable = False, default={
        "main_dashboard_settings" : {
            "default_to_privacy_mode_on" : False,
            "hide_closed_trades_on_bots_table" : False,
            "show_todays_bot_trade_profit_card" : False,
            "show_all_bot_trades_profit_card" : False,
            "show_strategy_profits_on_profit_cards" : False,
            "show_intraday_chart" : False,
            "show_trade_counts_card" : False,
            "show_recent_bot_activity" : False,
        },
        "number_of_recent_bot_activities_to_show" : 3,
        "intraday_chart_settings" : {
            "display_buying_power" : False,
            "display_trades" : False,
            "delay_chart_start_until" : False,
        },
        "chart_comparison_index" : "SPY",
    })
    bot_preferences = Column(JSON, nullable=False, default= {
        "percent_sizing_uses_minimum_quantity_of_1" : True,
        "leverage_sizing_uses_minimum_quantity_of_1" : True,
        "wide_spread_patience_window" : 3,
        "profit_target_trigger" : 5,
        "enable_bot_webhook_controls" : False,
    })
    created_time = Column(DateTime(timezone=True), nullable=False, default=func.now())
    last_login_time = Column(DateTime(timezone=True), nullable=False, default=func.now())
    last_website_activity = Column(DateTime(timezone=True), nullable=False, default=func.now())
    trades_logged = Column(Integer, nullable=False, default=0)
    strategies_created = Column(Integer, nullable=False, default=0)
    bots_created = Column(Integer, nullable=False, default=0)
    disabled = Column(Boolean, default=False)
    group_id = Column(UUID(as_uuid=True), nullable=True)
    group_display_name = Column(String, nullable=True)
    group_admin = Column(Boolean, nullable=True, default=False)
