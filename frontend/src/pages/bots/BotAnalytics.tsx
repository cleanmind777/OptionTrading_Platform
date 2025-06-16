import { useState } from 'react'
import { PerformanceChart } from '../../components/PerformanceChart'
import { BacktestEngine } from '../../components/BacktestEngine'

export function BotAnalytics() {
  const [activeTab, setActiveTab] = useState<'performance' | 'backtest' | 'comparison'>('performance')
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M')

  // Mock performance data
  const generatePerformanceData = () => {
    const data = []
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 6)

    let equity = 10000

    for (let i = 0; i < 180; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const dailyReturn = (Math.random() - 0.48) * 0.02 // Slightly positive bias
      equity *= (1 + dailyReturn)

      data.push({
        date: date.toISOString().split('T')[0],
        equity: equity,
        profit: equity - 10000,
        trades: Math.floor(Math.random() * 5) + 1,
        winRate: Math.random() * 20 + 60, // 60-80%
        drawdown: Math.min(0, (equity - 10000) / 10000 * 100)
      })
    }

    return data
  }

  const performanceData = generatePerformanceData()

  const tabs = [
    { key: 'performance', label: 'Performance Analytics', icon: '📊' },
    { key: 'backtest', label: 'Strategy Backtesting', icon: '🔬' },
    { key: 'comparison', label: 'Bot Comparison', icon: '⚖️' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bot Analytics & Backtesting</h1>
          <p className="text-gray-400">Analyze performance, backtest strategies, and optimize your trading bots</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 mb-8">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <PerformanceChart
              data={performanceData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            {/* Additional Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Analysis */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Value at Risk (95%)</span>
                    <span className="text-red-400 font-medium">-2.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Beta (vs S&P 500)</span>
                    <span className="text-blue-400 font-medium">0.85</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Alpha</span>
                    <span className="text-green-400 font-medium">+1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volatility</span>
                    <span className="text-yellow-400 font-medium">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Correlation to Market</span>
                    <span className="text-purple-400 font-medium">0.72</span>
                  </div>
                </div>
              </div>

              {/* Trading Statistics */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Trading Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Trade Duration</span>
                    <span className="text-white font-medium">2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Trades per Day</span>
                    <span className="text-white font-medium">8.7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Largest Win</span>
                    <span className="text-green-400 font-medium">+$456.78</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Largest Loss</span>
                    <span className="text-red-400 font-medium">-$123.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Consecutive Wins (Max)</span>
                    <span className="text-green-400 font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Consecutive Losses (Max)</span>
                    <span className="text-red-400 font-medium">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Breakdown by Asset */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Performance by Asset</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-slate-600">
                      <th className="text-left py-3">Symbol</th>
                      <th className="text-left py-3">Trades</th>
                      <th className="text-left py-3">Win Rate</th>
                      <th className="text-left py-3">Total P&L</th>
                      <th className="text-left py-3">Avg Return</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'].map((symbol, index) => (
                      <tr key={symbol} className="border-b border-slate-600 last:border-0">
                        <td className="py-3 font-medium text-white">{symbol}</td>
                        <td className="py-3 text-gray-300">{Math.floor(Math.random() * 50) + 20}</td>
                        <td className="py-3 text-gray-300">{(Math.random() * 20 + 60).toFixed(1)}%</td>
                        <td className={`py-3 font-medium ${Math.random() > 0.3 ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.random() > 0.3 ? '+' : '-'}${(Math.random() * 500 + 100).toFixed(2)}
                        </td>
                        <td className={`py-3 font-medium ${Math.random() > 0.3 ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.random() > 0.3 ? '+' : ''}{(Math.random() * 10 - 2).toFixed(2)}%
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            index % 3 === 0 ? 'bg-green-100 text-green-800' :
                            index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Paused' : 'Stopped'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backtest' && (
          <div>
            <BacktestEngine />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Bot Performance Comparison</h3>

            {/* Bot Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bot A</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>Autotrader Bot #1</option>
                  <option>Momentum Bot</option>
                  <option>Scalping Bot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bot B</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>Momentum Bot</option>
                  <option>Autotrader Bot #1</option>
                  <option>Scalping Bot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bot C (Optional)</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>None</option>
                  <option>Scalping Bot</option>
                  <option>Swing Trading Bot</option>
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-slate-600">
                    <th className="text-left py-3">Metric</th>
                    <th className="text-left py-3">Autotrader Bot #1</th>
                    <th className="text-left py-3">Momentum Bot</th>
                    <th className="text-left py-3">Best</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-600">
                    <td className="py-3 text-white font-medium">Total Return</td>
                    <td className="py-3 text-green-400">+12.5%</td>
                    <td className="py-3 text-green-400">+8.7%</td>
                    <td className="py-3 text-yellow-400">Bot #1</td>
                  </tr>
                  <tr className="border-b border-slate-600">
                    <td className="py-3 text-white font-medium">Win Rate</td>
                    <td className="py-3 text-gray-300">67.3%</td>
                    <td className="py-3 text-gray-300">72.1%</td>
                    <td className="py-3 text-yellow-400">Momentum</td>
                  </tr>
                  <tr className="border-b border-slate-600">
                    <td className="py-3 text-white font-medium">Max Drawdown</td>
                    <td className="py-3 text-red-400">-5.2%</td>
                    <td className="py-3 text-red-400">-3.8%</td>
                    <td className="py-3 text-yellow-400">Momentum</td>
                  </tr>
                  <tr className="border-b border-slate-600">
                    <td className="py-3 text-white font-medium">Sharpe Ratio</td>
                    <td className="py-3 text-gray-300">1.42</td>
                    <td className="py-3 text-gray-300">1.67</td>
                    <td className="py-3 text-yellow-400">Momentum</td>
                  </tr>
                  <tr className="border-b border-slate-600">
                    <td className="py-3 text-white font-medium">Total Trades</td>
                    <td className="py-3 text-gray-300">234</td>
                    <td className="py-3 text-gray-300">189</td>
                    <td className="py-3 text-yellow-400">Bot #1</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-white font-medium">Avg Trade Duration</td>
                    <td className="py-3 text-gray-300">2.1 hours</td>
                    <td className="py-3 text-gray-300">4.7 hours</td>
                    <td className="py-3 text-yellow-400">Bot #1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-blue-200 font-medium">Recommendation</h4>
                  <p className="text-blue-100 text-sm mt-1">
                    While Autotrader Bot #1 shows higher returns, Momentum Bot demonstrates better risk management with lower drawdown and higher Sharpe ratio.
                    Consider running both bots with different allocation percentages to optimize risk-adjusted returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
