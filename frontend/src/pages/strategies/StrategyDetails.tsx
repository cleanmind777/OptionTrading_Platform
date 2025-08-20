import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TradingLogForStrategy } from '../../types/trading';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Strategy {
    id: string;
    user_id: string;
    name: string;
    is_active: boolean;
    description: string;
    symbol: string;
    parameters: JSON;
    trade_type: string;
    number_of_legs: number;
    skip_am_expirations: boolean;
    sell_bidless_longs_on_trade_exit: boolean;
    efficient_spreads: boolean;
    legs: JSON;
    created_at: Date;
    updated_at: Date;
    total_profit: number;
    total_loss: number;
    total_wins: BigInt;
    total_losses: BigInt
}

export function StrategyDetails() {
    const { strategy_id } = useParams<{ strategy_id: string }>();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [tradingLogs, setTradingLogs] = useState<TradingLogForStrategy[]>([]);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userinfo")!);

    const getTradingLogs = () => {
        const params = { user_id: userInfo.id, strategy_id: strategy_id };
        axios
            .get(`${BACKEND_URL}/live-trade/trading-logs/strategy`, { params })
            .then((response) => {
                setTradingLogs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        const fetchStrategy = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/strategy/get_strategy`, {
                    params: { strategy_id },
                });
                setStrategy(response.data);
            } catch (error) {
                console.error('Error fetching strategy:', error);
            }
        };

        fetchStrategy();
        getTradingLogs();
    }, [strategy_id]);

    if (!strategy) {
        return <div className="min-h-screen bg-slate-900 text-white p-6">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    &larr; Back to Strategies
                </button>

                <h1 className="text-3xl font-bold mb-6">{strategy.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strategy Information */}
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-semibold mb-4">Strategy Information</h2>
                        <div className="space-y-4">
                            <div>
                                <span className="text-gray-300">ID:</span>
                                <span className="text-white ml-2">{strategy.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-300">Symbol:</span>
                                <span className="text-white ml-2">{strategy.symbol}</span>
                            </div>
                            <div>
                                <span className="text-gray-300">Trade Type:</span>
                                <span className="text-white ml-2">{strategy.trade_type}</span>
                            </div>
                            <div>
                                <span className="text-gray-300">Number of Legs:</span>
                                <span className="text-white ml-2">{strategy.number_of_legs}</span>
                            </div>
                            <div>
                                <span className="text-gray-300">Created At:</span>
                                <span className="text-white ml-2">
                                    {new Date(strategy.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-300">Updated At:</span>
                                <span className="text-white ml-2">
                                    {new Date(strategy.updated_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Strategy Performance */}
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-semibold mb-4">Strategy Performance</h2>
                        <div className="space-y-4">
                            <div>
                                <span className="text-gray-300">All-Time Net P/L:</span>
                                {strategy ? (<span className="text-white ml-2">{strategy.total_profit + strategy.total_loss}</span>) : <span className="text-white ml-2">$---</span>}

                            </div>
                            <div>
                                <span className="text-gray-300">YTD Net P/L:</span>
                                <span className="text-white ml-2">$---</span>
                            </div>
                            <div>
                                <span className="text-gray-300">Trade Count:</span>
                                {tradingLogs.length ? (<span className="text-white ml-2">{tradingLogs.length}</span>) : <span className="text-white ml-2">---</span>}

                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Strategy Performance Over Time</h2>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={tradingLogs}
                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: '#CBD5E1' }}
                                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fill: '#CBD5E1' }}
                                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fill: '#CBD5E1' }}
                                    tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        borderColor: '#475569',
                                        borderRadius: '8px',
                                    }}
                                    formatter={(value: number, name: string) => { // Explicitly type 'value' as number
                                        if (name === 'Win Rate') {
                                            return `${(value * 100).toFixed(2)}%`;
                                        }
                                        return `$${value.toFixed(2)}`;
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleString()}
                                />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="current_total_profit_for_strategy"
                                    name="Total Profit"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#3B82F6' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="current_total_loss_for_strategy"
                                    name="Total Loss"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#EF4444' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey={(log) => log.current_total_profit_for_strategy + log.current_total_loss_for_strategy}
                                    name="Net P/L"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#10B981' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="current_win_rate_for_strategy"
                                    name="Win Rate"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#F59E0B' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}