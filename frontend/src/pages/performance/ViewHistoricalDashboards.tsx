import { useState } from 'react'

interface HistoricalData {
  date: string
  account: string
  balance: number
  dayPL: number
  dayPLPercent: number
  trades: number
  winningTrades: number
  topPerformingBot: string
  topBotPL: number
  positions: {
    open: number
    closed: number
  }
  sectors: {
    name: string
    allocation: number
    pl: number
  }[]
  riskMetrics: {
    maxDrawdown: number
    volatility: number
    sharpeRatio: number
  }
}

export function ViewHistoricalDashboards() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('All Accounts')
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetIt = () => {
    if (!selectedDate) return

    setIsLoading(true)
    console.log('Getting historical dashboard for:', { selectedDate, selectedAccount })

    // Simulate API call with realistic historical data
    setTimeout(() => {
      const mockHistoricalData: HistoricalData = {
        date: selectedDate,
        account: selectedAccount,
        balance: 48750 + (Math.random() * 4000), // Random balance around 50k
        dayPL: (Math.random() - 0.5) * 800, // Random daily P/L
        dayPLPercent: 0,
        trades: Math.floor(Math.random() * 15) + 3,
        winningTrades: 0,
        topPerformingBot: ['Iron Condor Bot', 'Credit Spread Bot', 'Covered Call Bot', 'Momentum Bot'][Math.floor(Math.random() * 4)],
        topBotPL: (Math.random() - 0.3) * 500,
        positions: {
          open: Math.floor(Math.random() * 8) + 2,
          closed: Math.floor(Math.random() * 12) + 5
        },
        sectors: [
          { name: 'Technology', allocation: 35 + Math.random() * 10, pl: (Math.random() - 0.5) * 300 },
          { name: 'Finance', allocation: 25 + Math.random() * 10, pl: (Math.random() - 0.5) * 200 },
          { name: 'Healthcare', allocation: 20 + Math.random() * 10, pl: (Math.random() - 0.5) * 150 },
          { name: 'Energy', allocation: 15 + Math.random() * 5, pl: (Math.random() - 0.5) * 100 }
        ],
        riskMetrics: {
          maxDrawdown: -(Math.random() * 5 + 1),
          volatility: Math.random() * 10 + 5,
          sharpeRatio: Math.random() * 2 + 0.5
        }
      }

      // Calculate derived values
      mockHistoricalData.dayPLPercent = (mockHistoricalData.dayPL / mockHistoricalData.balance) * 100
      mockHistoricalData.winningTrades = Math.floor(mockHistoricalData.trades * (0.6 + Math.random() * 0.3))

      setHistoricalData(mockHistoricalData)
      setIsLoading(false)
    }, 1500)
  }

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Helper function to format percentage
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-12">
          View Historical Dashboards
        </h1>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Select Date */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
              Select Date:
            </label>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 min-w-[150px]"
              >
                <option value="">Select Date</option>
                <option value="2025-06-09">June 9, 2025</option>
                <option value="2025-06-08">June 8, 2025</option>
                <option value="2025-06-07">June 7, 2025</option>
                <option value="2025-06-06">June 6, 2025</option>
                <option value="2025-06-05">June 5, 2025</option>
                <option value="2025-06-04">June 4, 2025</option>
                <option value="2025-06-03">June 3, 2025</option>
                <option value="2025-05-30">May 30, 2025</option>
                <option value="2025-05-29">May 29, 2025</option>
                <option value="2025-05-28">May 28, 2025</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Select Account */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
              Select Account:
            </label>
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 min-w-[150px]"
              >
                <option value="All Accounts">All Accounts</option>
                <option value="Account 1">Account 1</option>
                <option value="Account 2">Account 2</option>
                <option value="Account 3">Account 3</option>
                <option value="Paper Trading">Paper Trading</option>
                <option value="Live Trading">Live Trading</option>
                <option value="IRA Account">IRA Account</option>
                <option value="Roth IRA">Roth IRA</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* GET IT Button */}
          <button
            onClick={handleGetIt}
            disabled={!selectedDate || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? 'LOADING...' : 'GET IT'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-300">Loading historical dashboard data...</span>
              </div>
            </div>
          )}

          {/* Historical Dashboard Display */}
          {historicalData && !isLoading && (
            <>
              {/* Dashboard Header */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Historical Dashboard - {new Date(historicalData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    <p className="text-gray-400">{historicalData.account}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(historicalData.balance)}
                    </div>
                    <div className="text-sm text-gray-400">Account Balance</div>
                  </div>
                </div>

                {/* Key Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className={`text-xl font-bold ${historicalData.dayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(historicalData.dayPL)}
                    </div>
                    <div className="text-sm text-gray-400">Daily P/L</div>
                    <div className={`text-xs ${historicalData.dayPLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercent(historicalData.dayPLPercent)}
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-white">{historicalData.trades}</div>
                    <div className="text-sm text-gray-400">Total Trades</div>
                    <div className="text-xs text-blue-400">
                      {historicalData.winningTrades} winners
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-white">{historicalData.positions.open}</div>
                    <div className="text-sm text-gray-400">Open Positions</div>
                    <div className="text-xs text-gray-500">
                      {historicalData.positions.closed} closed
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-400">
                      {((historicalData.winningTrades / historicalData.trades) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-xs text-gray-500">
                      {historicalData.winningTrades}/{historicalData.trades}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Performance Section */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Bot Performance</h3>
                <div className="flex items-center justify-between bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">{historicalData.topPerformingBot}</div>
                      <div className="text-sm text-gray-400">Best performing bot</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${historicalData.topBotPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(historicalData.topBotPL)}
                    </div>
                    <div className="text-sm text-gray-400">Daily P/L</div>
                  </div>
                </div>
              </div>

              {/* Sector Allocation & Performance */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sector Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {historicalData.sectors.map((sector, index) => (
                    <div key={sector.name} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{sector.name}</span>
                        <span className={`text-sm font-semibold ${sector.pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(sector.pl)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(sector.allocation, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {sector.allocation.toFixed(1)}% allocation
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-red-400">
                      {historicalData.riskMetrics.maxDrawdown.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Max Drawdown</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-yellow-400">
                      {historicalData.riskMetrics.volatility.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Volatility</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-400">
                      {historicalData.riskMetrics.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Sharpe Ratio</div>
                  </div>
                </div>
              </div>

              {/* Historical Performance Chart Placeholder */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Historical Performance Trend</h3>
                <div className="h-32 bg-slate-700 rounded-lg flex items-end justify-between px-4 py-4">
                  {/* Simple bar chart visualization */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const height = Math.random() * 80 + 10
                    const isPositive = Math.random() > 0.4
                    return (
                      <div
                        key={i}
                        className={`w-4 rounded-t ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>
                <div className="text-sm text-gray-400 mt-2 text-center">
                  10-day performance trend leading up to {new Date(historicalData.date).toLocaleDateString()}
                </div>
              </div>
            </>
          )}

          {/* Initial State */}
          {!historicalData && !isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="text-gray-400">
                {selectedDate
                  ? 'Click "GET IT" to load historical dashboard data'
                  : 'Select a date and account to view historical dashboard data'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
