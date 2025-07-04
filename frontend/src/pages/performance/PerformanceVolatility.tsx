import { useState } from 'react'

interface VolatilityData {
  account: string
  dateRange: string
  dailyReturns: { date: string; return: number; balance: number }[]
  volatilityMetrics: {
    dailyVolatility: number
    annualizedVolatility: number
    sharpeRatio: number
    maxDrawdown: number
    calmarRatio: number
    sortinoRatio: number
    skewness: number
    kurtosis: number
    var95: number
    var99: number
    beta: number
    alpha: number
  }
  riskMetrics: {
    averageReturn: number
    standardDeviation: number
    downside_deviation: number
    upside_capture: number
    downside_capture: number
    correlation_market: number
  }
  rollingVolatility: { date: string; volatility: number }[]
  drawdownSeries: { date: string; drawdown: number }[]
}

export function PerformanceVolatility() {
  const [selectedAccount, setSelectedAccount] = useState('All Accounts')
  const [selectedDateRange, setSelectedDateRange] = useState('03/11/2025 - 06/09/2025')
  const [volatilityData, setVolatilityData] = useState<VolatilityData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChartIt = () => {
    setIsLoading(true)
    console.log('Charting volatility for:', { selectedAccount, selectedDateRange })

    // Simulate volatility calculations with realistic data
    setTimeout(() => {
      const mockVolatilityData = generateVolatilityData(selectedAccount, selectedDateRange)
      setVolatilityData(mockVolatilityData)
      setIsLoading(false)
    }, 2000)
  }

  const generateVolatilityData = (account: string, dateRange: string): VolatilityData => {
    // Generate daily returns for the date range
    const startDate = new Date('2025-03-11')
    const endDate = new Date('2025-06-09')
    const dailyReturns = []
    const rollingVolatility = []
    const drawdownSeries = []

    let currentBalance = 50000
    let peak = currentBalance

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue

      // Generate realistic daily returns (normal distribution with slight positive bias)
      const dailyReturn = (Math.random() - 0.45) * 0.04 // -2% to +2% daily range with slight positive bias
      const newBalance = currentBalance * (1 + dailyReturn)

      dailyReturns.push({
        date: d.toISOString().split('T')[0],
        return: dailyReturn * 100,
        balance: newBalance
      })

      // Update peak and calculate drawdown
      if (newBalance > peak) peak = newBalance
      const drawdown = ((newBalance - peak) / peak) * 100

      drawdownSeries.push({
        date: d.toISOString().split('T')[0],
        drawdown
      })

      // Calculate 30-day rolling volatility
      if (dailyReturns.length >= 30) {
        const recentReturns = dailyReturns.slice(-30).map(r => r.return / 100)
        const volatility = calculateVolatility(recentReturns) * Math.sqrt(252) * 100
        rollingVolatility.push({
          date: d.toISOString().split('T')[0],
          volatility
        })
      }

      currentBalance = newBalance
    }

    // Calculate comprehensive volatility metrics
    const returns = dailyReturns.map(r => r.return / 100)
    const dailyVol = calculateVolatility(returns)
    const annualizedVol = dailyVol * Math.sqrt(252)
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const annualizedReturn = avgReturn * 252
    const riskFreeRate = 0.045 // 4.5% risk-free rate

    const maxDD = Math.min(...drawdownSeries.map(d => d.drawdown))
    const sharpeRatio = (annualizedReturn - riskFreeRate) / annualizedVol
    const calmarRatio = annualizedReturn / Math.abs(maxDD / 100)

    // Calculate downside deviation for Sortino ratio
    const downsideReturns = returns.filter(r => r < 0)
    const downsideDeviation = downsideReturns.length > 0 ?
      Math.sqrt(downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length) : 0
    const sortinoRatio = downsideDeviation > 0 ? (annualizedReturn - riskFreeRate) / (downsideDeviation * Math.sqrt(252)) : 0

    // Calculate skewness and kurtosis
    const skewness = calculateSkewness(returns)
    const kurtosis = calculateKurtosis(returns)

    // Calculate VaR (Value at Risk)
    const sortedReturns = [...returns].sort((a, b) => a - b)
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)] * 100
    const var99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)] * 100

    // Mock market correlation metrics
    const beta = 0.8 + Math.random() * 0.4 // Beta between 0.8 and 1.2
    const alpha = (annualizedReturn - riskFreeRate - beta * 0.10) * 100 // Assuming 10% market return

    return {
      account,
      dateRange,
      dailyReturns,
      volatilityMetrics: {
        dailyVolatility: dailyVol * 100,
        annualizedVolatility: annualizedVol * 100,
        sharpeRatio,
        maxDrawdown: maxDD,
        calmarRatio,
        sortinoRatio,
        skewness,
        kurtosis,
        var95,
        var99,
        beta,
        alpha
      },
      riskMetrics: {
        averageReturn: avgReturn * 252 * 100,
        standardDeviation: annualizedVol * 100,
        downside_deviation: downsideDeviation * Math.sqrt(252) * 100,
        upside_capture: 95 + Math.random() * 10,
        downside_capture: 85 + Math.random() * 10,
        correlation_market: 0.7 + Math.random() * 0.25
      },
      rollingVolatility,
      drawdownSeries
    }
  }

  const calculateVolatility = (returns: number[]): number => {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1)
    return Math.sqrt(variance)
  }

  const calculateSkewness = (returns: number[]): number => {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)
    const skew = returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 3), 0) / returns.length
    return skew
  }

  const calculateKurtosis = (returns: number[]): number => {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)
    const kurt = returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 4), 0) / returns.length
    return kurt - 3 // Excess kurtosis
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-12">
          Daily Account Performance Volatility
        </h1>

        {/* Controls Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
                  {/* <option value="Account 1">Account 1</option>
                  <option value="Account 2">Account 2</option>
                  <option value="Account 3">Account 3</option> */}
                  <option value="Paper Trading">Paper Trading</option>
                  <option value="Live Trading">Live Trading</option>
                  <option value="IRA Account">IRA Account</option>
                  <option value="Roth IRA">Roth IRA</option>
                  <option value="Main Trading Account">Main Trading Account</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Select Date Range */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
                Select Date Range
              </label>
              <input
                type="text"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
              />
            </div>

            {/* CHART IT Button */}
            <button
              onClick={handleChartIt}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isLoading ? 'CALCULATING...' : 'CHART IT'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-300">Calculating volatility and risk metrics...</span>
              </div>
            </div>
          )}

          {/* Volatility Analysis Results */}
          {volatilityData && !isLoading && (
            <>
              {/* Summary Header */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Volatility Analysis</h2>
                    <p className="text-gray-400">
                      {volatilityData.account} • {volatilityData.dateRange}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="text-2xl font-bold text-yellow-400">
                      {volatilityData.volatilityMetrics.annualizedVolatility.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Annualized Volatility</div>
                  </div>
                </div>

                {/* Key Volatility Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-white">
                      {volatilityData.volatilityMetrics.dailyVolatility.toFixed(3)}%
                    </div>
                    <div className="text-sm text-gray-400">Daily Volatility</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-blue-400">
                      {volatilityData.volatilityMetrics.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Sharpe Ratio</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-red-400">
                      {volatilityData.volatilityMetrics.maxDrawdown.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Max Drawdown</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-400">
                      {volatilityData.volatilityMetrics.sortinoRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Sortino Ratio</div>
                  </div>
                </div>
              </div>

              {/* Risk Metrics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Advanced Risk Metrics */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Advanced Risk Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Value at Risk (95%)</span>
                      <span className="text-red-400 font-medium">
                        {volatilityData.volatilityMetrics.var95.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Value at Risk (99%)</span>
                      <span className="text-red-400 font-medium">
                        {volatilityData.volatilityMetrics.var99.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Calmar Ratio</span>
                      <span className="text-green-400 font-medium">
                        {volatilityData.volatilityMetrics.calmarRatio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Skewness</span>
                      <span className={`font-medium ${volatilityData.volatilityMetrics.skewness >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {volatilityData.volatilityMetrics.skewness.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Excess Kurtosis</span>
                      <span className="text-yellow-400 font-medium">
                        {volatilityData.volatilityMetrics.kurtosis.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Market Correlation */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Market Correlation</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Beta</span>
                      <span className="text-blue-400 font-medium">
                        {volatilityData.volatilityMetrics.beta.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Alpha</span>
                      <span className={`font-medium ${volatilityData.volatilityMetrics.alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {volatilityData.volatilityMetrics.alpha.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Market Correlation</span>
                      <span className="text-purple-400 font-medium">
                        {volatilityData.riskMetrics.correlation_market.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Upside Capture</span>
                      <span className="text-green-400 font-medium">
                        {volatilityData.riskMetrics.upside_capture.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Downside Capture</span>
                      <span className="text-red-400 font-medium">
                        {volatilityData.riskMetrics.downside_capture.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Distribution Analysis */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Return Distribution Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {volatilityData.riskMetrics.averageReturn.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Annualized Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">
                      {volatilityData.riskMetrics.standardDeviation.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Standard Deviation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">
                      {volatilityData.riskMetrics.downside_deviation.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Downside Deviation</div>
                  </div>
                </div>
              </div>

              {/* Rolling Volatility Chart */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">30-Day Rolling Volatility</h3>
                <div className="h-64 bg-slate-700 rounded-lg flex items-end justify-between px-4 py-4">
                  {volatilityData.rollingVolatility.slice(-60).map((point, index) => {
                    const height = Math.min((point.volatility / 50) * 100, 100)
                    const color = point.volatility > 25 ? 'bg-red-400' :
                      point.volatility > 15 ? 'bg-yellow-400' : 'bg-green-400'
                    return (
                      <div
                        key={index}
                        className={`w-1 rounded-t ${color}`}
                        style={{ height: `${height}%` }}
                        title={`${point.date}: ${point.volatility.toFixed(1)}%`}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Lower Volatility</span>
                  <span>Higher Risk</span>
                </div>
              </div>

              {/* Drawdown Chart */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Drawdown Analysis</h3>
                <div className="h-32 bg-slate-700 rounded-lg flex items-end justify-between px-2 py-2">
                  {volatilityData.drawdownSeries.slice(-90).map((point, index) => {
                    const height = Math.max(Math.abs(point.drawdown) * 2, 2)
                    return (
                      <div
                        key={index}
                        className={`w-1 ${point.drawdown < 0 ? 'bg-red-400' : 'bg-gray-600'}`}
                        style={{ height: `${Math.min(height, 100)}%` }}
                        title={`${point.date}: ${point.drawdown.toFixed(2)}%`}
                      />
                    )
                  })}
                </div>
                <div className="text-sm text-gray-400 mt-2 text-center">
                  Peak-to-trough decline over time (Red = Drawdown periods)
                </div>
              </div>

              {/* Risk Assessment Summary */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-white mb-3">Volatility Profile</h4>
                    <div className={`p-3 rounded-lg ${volatilityData.volatilityMetrics.annualizedVolatility < 15 ? 'bg-green-900/30 border border-green-500/30' :
                        volatilityData.volatilityMetrics.annualizedVolatility < 25 ? 'bg-yellow-900/30 border border-yellow-500/30' :
                          'bg-red-900/30 border border-red-500/30'
                      }`}>
                      <div className={`font-medium ${volatilityData.volatilityMetrics.annualizedVolatility < 15 ? 'text-green-400' :
                          volatilityData.volatilityMetrics.annualizedVolatility < 25 ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                        {volatilityData.volatilityMetrics.annualizedVolatility < 15 ? 'Low Risk' :
                          volatilityData.volatilityMetrics.annualizedVolatility < 25 ? 'Moderate Risk' :
                            'High Risk'}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        Based on {volatilityData.volatilityMetrics.annualizedVolatility.toFixed(1)}% annualized volatility
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-white mb-3">Performance Quality</h4>
                    <div className={`p-3 rounded-lg ${volatilityData.volatilityMetrics.sharpeRatio > 1.5 ? 'bg-green-900/30 border border-green-500/30' :
                        volatilityData.volatilityMetrics.sharpeRatio > 1.0 ? 'bg-yellow-900/30 border border-yellow-500/30' :
                          'bg-red-900/30 border border-red-500/30'
                      }`}>
                      <div className={`font-medium ${volatilityData.volatilityMetrics.sharpeRatio > 1.5 ? 'text-green-400' :
                          volatilityData.volatilityMetrics.sharpeRatio > 1.0 ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                        {volatilityData.volatilityMetrics.sharpeRatio > 1.5 ? 'Excellent' :
                          volatilityData.volatilityMetrics.sharpeRatio > 1.0 ? 'Good' :
                            'Poor'} Risk-Adjusted Returns
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        Sharpe Ratio: {volatilityData.volatilityMetrics.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Initial State */}
          {!volatilityData && !isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="text-gray-400">
                Select an account and date range, then click "CHART IT" to analyze performance volatility and risk metrics
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
