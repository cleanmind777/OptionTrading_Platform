import { Link } from 'react-router-dom'

export function AccountStats() {
  const accountData = {
    totalValue: 214680.50,
    dayChange: 1889.50,
    dayChangePercent: 0.89,
    totalPnL: 18430.25,
    totalPnLPercent: 9.4,
    activeBots: 5,
    totalTrades: 142,
    winRate: 73.2,
    avgWin: 245.30,
    avgLoss: -98.75
  }

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
            <p className="text-3xl font-bold text-white">{formatCurrency(accountData.totalValue)}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${accountData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {accountData.dayChange >= 0 ? '+' : ''}{formatCurrency(accountData.dayChange)} ({accountData.dayChangePercent >= 0 ? '+' : ''}{accountData.dayChangePercent}%) today
              </span>
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total P&L</h3>
            <p className={`text-3xl font-bold ${accountData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(accountData.totalPnL)}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${accountData.totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {accountData.totalPnLPercent >= 0 ? '+' : ''}{accountData.totalPnLPercent}% return
              </span>
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Active Bots</h3>
            <p className="text-3xl font-bold text-white">{accountData.activeBots}</p>
            <div className="flex items-center mt-2">
              <span className="text-gray-400 text-sm">Currently trading</span>
            </div>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-green-400">{accountData.winRate}%</p>
            <div className="flex items-center mt-2">
              <span className="text-gray-400 text-sm">{accountData.totalTrades} total trades</span>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Account Performance</h3>
            <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-400">Performance chart visualization</p>
                <p className="text-gray-500 text-sm mt-2">Real-time P&L tracking over time</p>
              </div>
            </div>
          </div>

          {/* Strategy Breakdown */}
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Iron Condor</span>
                <div className="text-right">
                  <div className="text-green-400 font-medium">+$4,250.30</div>
                  <div className="text-gray-400 text-sm">68% win rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Put Credit Spread</span>
                <div className="text-right">
                  <div className="text-green-400 font-medium">+$2,830.75</div>
                  <div className="text-gray-400 text-sm">79% win rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Short Strangle</span>
                <div className="text-right">
                  <div className="text-red-400 font-medium">-$340.50</div>
                  <div className="text-gray-400 text-sm">45% win rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Call Credit Spread</span>
                <div className="text-right">
                  <div className="text-green-400 font-medium">+$1,690.20</div>
                  <div className="text-gray-400 text-sm">72% win rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Average Win</h3>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(accountData.avgWin)}</p>
            <p className="text-gray-400 text-sm mt-2">Per winning trade</p>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Average Loss</h3>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(accountData.avgLoss)}</p>
            <p className="text-gray-400 text-sm mt-2">Per losing trade</p>
          </div>

          <div className="bg-[rgb(15 23 42)] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Risk/Reward Ratio</h3>
            <p className="text-2xl font-bold text-blue-400">2.48:1</p>
            <p className="text-gray-400 text-sm mt-2">Win/Loss ratio</p>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {trade.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.strategy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        trade.status === 'Open'
                          ? 'text-blue-400 bg-blue-400/10'
                          : 'text-gray-400 bg-gray-400/10'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {trade.status === 'Open' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
