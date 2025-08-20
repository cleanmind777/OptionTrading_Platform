import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AccountInsights } from "../../types/user"
import { roundTo } from '../../utils/NumberProcess';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function AccountStats() {
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!);
  const [accountData, setAccountData] = useState<AccountInsights | null>();
  // const accountData = {
  //   totalValue: 214680.50,
  //   dayChange: 1889.50,
  //   dayChangePercent: 0.89,
  //   totalPnL: 18430.25,
  //   totalPnLPercent: 9.4,
  //   activeBots: 5,
  //   totalTrades: 142,
  //   winRate: 73.2,
  //   avgWin: 245.30,
  //   avgLoss: -98.75
  // }
  const getAccountInsights = () => {
    const params = { user_id: userInfo.id };
    axios
      .get(`${BACKEND_URL}/user/account-insights`, { params })
      .then((response) => {
        setAccountData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const recentTrades = [
    { id: 1, symbol: 'SPY', strategy: 'Iron Condor', pnl: 325.50, status: 'Closed', date: '2025-01-05' },
    { id: 2, symbol: 'QQQ', strategy: 'Put Spread', pnl: 180.25, status: 'Closed', date: '2025-01-05' },
    { id: 3, symbol: 'IWM', strategy: 'Short Strangle', pnl: -45.75, status: 'Closed', date: '2025-01-04' },
    { id: 4, symbol: 'SPY', strategy: 'Call Spread', pnl: 0, status: 'Open', date: '2025-01-04' },
    { id: 5, symbol: 'TLT', strategy: 'Iron Condor', pnl: 215.00, status: 'Closed', date: '2025-01-03' }
  ]
  useEffect(() => {
    getAccountInsights()
  }, [])
  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Account Insights</h1>
            <p className="text-gray-300 mt-1">Track your trading performance and analytics</p>
          </div>
          <Link
            to="/useracct/brokerlink"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors font-medium"
          >
            Return To Trading Dashboard
          </Link>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total Account Value</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(accountData?.total_balance || 0)}</p>
            <div className="flex items-center mt-2">
              {accountData?.today_pnl !== undefined && (
                <span className={`text-sm ${accountData.today_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {accountData.today_pnl >= 0 ? '+' : ''}{formatCurrency(accountData.today_pnl)} today
                </span>
              )}
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total P&L</h3>
            {accountData?.total_pnl !== undefined && (<p className={`text-3xl font-bold ${accountData?.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(accountData?.total_pnl || 0)}
            </p>)}
            <div className="flex items-center mt-2">
              {accountData?.total_pnl !== undefined && accountData?.total_balance ? (
                <span className={`text-sm ${accountData.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {accountData.total_pnl >= 0 ? '+' : ''}{roundTo(accountData.total_pnl / accountData.total_balance * 100, 2)}% return
                </span>) : <span className={`text-sm`}>0% return</span>}
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Active Bots</h3>
            {accountData && (<p className="text-3xl font-bold text-white">{accountData?.active_bots?.toString()}</p>)}
            <div className="flex items-center mt-2">
              <span className="text-gray-400 text-sm">Currently trading</span>
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Win Rate</h3>
            <p className={`text-3xl font-bold ${(accountData?.total_pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {accountData?.win_rate !== undefined ? `${roundTo(accountData.win_rate * 100, 2)}%` : '0%'}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-gray-400 text-sm">{accountData?.total_trades?.toString() || '0'} total trades</span>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-blue-600/10">
            <h3 className="text-lg font-semibold text-white mb-4">Account Performance</h3>
            <div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center">
              {accountData?.user_pnl_logs && accountData.user_pnl_logs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={accountData.user_pnl_logs}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: '#CBD5E1' }}
                      tickFormatter={(time) => new Date(time).toLocaleDateString()}
                    />
                    <YAxis
                      tick={{ fill: '#CBD5E1' }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#475569',
                        borderRadius: '8px',
                      }}
                      content={({ payload, label }) => (
                        <div className="bg-slate-800 p-3 rounded-lg shadow-lg">
                          {label && ( // Check if label exists
                            <p className="text-sm text-gray-400">
                              {new Date(label).toLocaleDateString()} {/* Date */}
                              <br />
                              <span className="text-xs text-gray-500">
                                {new Date(label).toLocaleTimeString()} {/* Time */}
                              </span>
                            </p>
                          )}
                          {payload?.map((entry, index) => (
                            <p key={index} className="text-sm text-white">
                              {`$${entry.value.toFixed(2)}`} {/* P&L Value */}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#3B82F6' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <p className="text-gray-400">Performance chart visualization</p>
                  <p className="text-gray-500 text-sm mt-2">Real-time P&L tracking over time</p>
                </div>
              )}
            </div>
          </div>

          {/* Strategy Breakdown */}
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-blue-600/10">
            <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {accountData && accountData.strategies?.map((strategy, index) => (
                <div
                  key={index}
                  className="group flex justify-between items-center p-4 rounded-lg hover:bg-slate-800/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-all duration-300">
                      <span className="text-lg text-white">
                        {strategy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300 font-large">{strategy.name}</span>

                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${strategy.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                      {strategy.pnl >= 0 ? `+$${strategy.pnl.toFixed(2)}` : `-$${Math.abs(strategy.pnl).toFixed(2)}`}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {roundTo(strategy.win_rate * 100, 2)}% win rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Average Win</h3>
            <p className="text-2xl font-bold text-green-400">{accountData?.average_win ? formatCurrency(accountData.average_win) : '$0.00'}</p>
            <p className="text-gray-400 text-sm mt-2">Per winning trade</p>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Average Loss</h3>
            <p className="text-2xl font-bold text-red-400">{accountData?.average_loss ? formatCurrency(accountData.average_loss) : '$0.00'}</p>
            <p className="text-gray-400 text-sm mt-2">Per losing trade</p>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Risk/Reward Ratio</h3>
            <p className="text-2xl font-bold text-blue-400">{accountData?.risk_reward_ratio ? `${accountData.risk_reward_ratio}:1` : '0:0'}</p>
            <p className="text-gray-400 text-sm mt-2">Win/Loss ratio</p>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
          </div>
          <div className="overflow-x-auto">
            {accountData?.recent_trades && (<table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Bot
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {accountData.recent_trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {typeof trade.time === 'string' ? trade.time : new Date(trade.time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {trade.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.strategy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.bot}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${trade.status === 'Open'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-gray-400 bg-gray-400/10'
                        }`}>
                        {trade.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={(trade?.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {(trade?.pnl ?? 0) >= 0 ? '+' : ''}{formatCurrency(trade?.pnl ?? 0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>)}
          </div>
        </div>
      </div>
    </div >
  )
}
