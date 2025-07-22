import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Select, Card, Space, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { SearchOutlined, CalendarOutlined, ExperimentOutlined } from '@ant-design/icons';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const BacktestPlay: React.FC = () => {
    const [bots, setBots] = useState<any[]>([]);
    const [selectedBot, setSelectedBot] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingBots, setFetchingBots] = useState(false);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userinfo")!);

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
    useEffect(() => {
        const fetchBots = async () => {
            setFetchingBots(true);
            try {
                const params = {
                    user_id: userInfo.id,
                    name: "",
                    trading_account: "",
                    is_active: "All",
                    strategy: "All",
                    entryDay: "Any",
                    symbol: "All",
                    webhookPartial: "All",
                };
                const response = await axios.post(`${BACKEND_URL}/bot/get_bots`, params);
                setBots(response.data);
                if (response.data.length === 0) {
                    message.info("You don't have any bots. Please create a new bot.");
                }
            } catch (error) {
                console.error('Error fetching bots:', error);
                message.error('Failed to load bots');
            } finally {
                setFetchingBots(false);
            }
        };
        fetchBots();
    }, []);
    useEffect(() => {
        getBot()
    }, [selectedBot])
    const getBot = () => {
        const params = {
            id: selectedBot
        }
        if (selectedBot == "") {
            return 0
        }
        else {
            axios.get(`${BACKEND_URL}/bot/get_bot`, { params })
                .then(response => {
                    setBot(response.data);
                    localStorage.setItem('bots', response.data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

    }
    const handleRunBacktest = async () => {
        if (!selectedBot || !dateRange) {
            message.warning('Please select a bot and date range');
            return;
        }

        setLoading(true);
        try {
            const [startDate, endDate] = dateRange;
            const params = {
                user_id: userInfo.id,
                bot_id: selectedBot,
                strategy_id: bot.strategy_id,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD')
            };
            await axios.post(`${BACKEND_URL}/backtest/start`, params);
            message.success('Backtest completed successfully');
            navigate("/backtest/list");
        } catch (error) {
            console.error('Error running backtest:', error);
            message.error('Backtest failed');
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current: Dayjs) => {
        return current && current > dayjs().endOf('day');
    };

    const handleDateChange = (
        dates: [Dayjs | null, Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
        } else {
            setDateRange(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 px-6 animate-fade-in">
            <Title level={2} className="text-center mb-8 text-white font-semibold tracking-tight">
                Backtest Playground
            </Title>

            <Card className="rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 mb-6">
                <Space direction="vertical" size="middle" className="w-full">
                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">
                            Select Trading Bot
                        </label>
                        <Select
                            className="w-full"
                            placeholder="Search and select a bot..."
                            onChange={setSelectedBot}
                            options={bots.map(bot => ({
                                label: bot.name,
                                value: bot.id
                            }))}
                            loading={fetchingBots}
                            size="large"
                            showSearch
                            optionFilterProp="label"
                            notFoundContent={fetchingBots ? 'Loading bots...' : 'No bots available'}
                            suffixIcon={<SearchOutlined className="text-blue-600" />}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">
                            Select Date Range
                        </label>
                        <RangePicker
                            className="w-full"
                            onChange={handleDateChange}
                            size="large"
                            disabledDate={disabledDate}
                            presets={[
                                { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
                                { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
                                { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
                            ]}
                            allowClear={false}
                            placeholder={['Start Date', 'End Date']}
                            suffixIcon={<CalendarOutlined className="text-blue-600" />}
                        />
                    </div>

                    <Button
                        type="primary"
                        onClick={handleRunBacktest}
                        loading={loading}
                        disabled={!selectedBot || !dateRange}
                        size="large"
                        block
                        className="h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Running Backtest...' : 'Run Backtest'}
                    </Button>
                </Space>
            </Card>

            {/* <Card
                className="rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 mt-8 min-h-[300px]"
                title={
                    <span className="text-blue-600 font-medium">
                        Backtest Results
                    </span>
                }
                loading={loading}
            >
                <div className="text-center text-gray-500 py-10 text-lg">
                    <ExperimentOutlined className="text-5xl text-gray-300" />
                    <p className="mt-4">
                        Run a backtest to see detailed results and analytics
                    </p>
                </div>
            </Card> */}
        </div>
    );
};

export default BacktestPlay;