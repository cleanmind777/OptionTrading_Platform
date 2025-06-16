import { useState, useEffect } from 'react'

interface BacktestConfig {
  symbol: string
  strategy: string
  startDate: string
  endDate: string
  initialCapital: number
  commissions: number
  slippage: number
  timeframe: '1min' | '5min' | '15min' | '1hour' | '1day'
  parameters: {
    [key: string]: number | string | boolean
  }
}

interface BacktestResult {
  id: string
  config: BacktestConfig
  performance: {
    totalReturn: number
    annualizedReturn: number
    volatility: number
    sharpeRatio: number
    sortinoRatio: number
    maxDrawdown: number
    calmarRatio: number
    winRate: number
    profitFactor: number
    avgWin: number
    avgLoss: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
  }
  equity: Array<{ date: string; value: number }>
  trades: Array<{
    entryDate: string
    exitDate: string
    symbol: string
    side: 'long' | 'short'
    quantity: number
    entryPrice: number
    exitPrice: number
    pnl: number
    commission: number
    duration: number
  }>
  drawdowns: Array<{ date: string; drawdown: number }>
  monthlyReturns: Array<{ month: string; return: number }>
  riskMetrics: {
    var95: number
    var99: number
    expectedShortfall: number
    beta: number
    alpha: number
    informationRatio: number
  }
  status: 'running' | 'completed' | 'error'
  createdAt: string
  duration: number
}

interface MarketData {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  iv: number
}

export function AdvancedBacktesting() {
  const [config, setConfig] = useState<BacktestConfig>({
    symbol: 'SPY',
    strategy: 'iron-condor',
    startDate: '2023-01-01',
    endDate: '2024-01-31',
    initialCapital: 100000,
    commissions: 1.0,
    slippage: 0.05,
    timeframe: '1day',
    parameters: {
      shortDelta: 0.15,
      longDelta: 0.05,
      daysToExpiration: 45,
      profitTarget: 0.5,
      stopLoss: 2.0,
      maxPositions: 5
    }
  })

  const [results, setResults] = useState<BacktestResult[]>([])
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'analysis'>('setup')
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedResults, setSelectedResults] = useState<string[]>([])

  useEffect(() => {
    loadMarketData()
    loadSavedResults()
  }, [])

  const loadMarketData = async () => {
    // In real app, this would fetch actual market data
    const mockData: MarketData[] = []
    const startDate = new Date('2023-01-01')
    const endDate = new Date('2024-01-31')

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const randomWalk = Math.random() * 0.02 - 0.01
      const basePrice = 400 + Math.sin(d.getTime() / (1000 * 60 * 60 * 24 * 30)) * 50

      mockData.push({
        symbol: 'SPY',
        date: d.toISOString().split('T')[0],
        open: basePrice + randomWalk * basePrice,
        high: basePrice + (randomWalk + 0.01) * basePrice,
        low: basePrice + (randomWalk - 0.01) * basePrice,
        close: basePrice + randomWalk * basePrice,
        volume: Math.floor(Math.random() * 100000000) + 50000000,
        iv: 0.15 + Math.random() * 0.2
      })
    }

    setMarketData(mockData)
  }

  const loadSavedResults = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('backtestResults')
    if (saved) {
      setResults(JSON.parse(saved))
    }
  }

  const runBacktest = async () => {
    setIsRunning(true)
    setProgress(0)

    const newResult: BacktestResult = {
      id: Date.now().toString(),
      config: { ...config },
      performance: {
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        sortinoRatio: 0,
        maxDrawdown: 0,
        calmarRatio: 0,
        winRate: 0,
        profitFactor: 0,
        avgWin: 0,
        avgLoss: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0
      },
      equity: [],
      trades: [],
      drawdowns: [],
      monthlyReturns: [],
      riskMetrics: {
        var95: 0,
        var99: 0,
        expectedShortfall: 0,
        beta: 0,
        alpha: 0,
        informationRatio: 0
      },
      status: 'running',
      createdAt: new Date().toISOString(),
      duration: 0
    }

    // Simulate backtest progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Generate mock results
    const mockResult = await generateMockBacktestResult(newResult)

    setResults(prev => [mockResult, ...prev])
    setSelectedResult(mockResult)
    setIsRunning(false)
    setActiveTab('results')

    // Save to localStorage
    localStorage.setItem('backtestResults', JSON.stringify([mockResult, ...results]))
  }

  const generateMockBacktestResult = async (result: BacktestResult): Promise<BacktestResult> => {
    const startDate = new Date(config.startDate)
    const endDate = new Date(config.endDate)
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Generate equity curve
    const equity: Array<{ date: string; value: number }> = []
    let currentValue = config.initialCapital

    for (let i = 0; i <= daysDiff; i += 7) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const randomReturn = (Math.random() - 0.45) * 0.02 // Slight positive bias
      currentValue *= (1 + randomReturn)

      equity.push({
        date: date.toISOString().split('T')[0],
        value: currentValue
      })
    }

    // Generate trades
    const trades = []
    const numTrades = Math.floor(Math.random() * 100) + 50

    for (let i = 0; i < numTrades; i++) {
      const entryDate = new Date(startDate)
      entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * daysDiff))

      const exitDate = new Date(entryDate)
      exitDate.setDate(exitDate.getDate() + Math.floor(Math.random() * 30) + 1)

      const entryPrice = 400 + Math.random() * 100
      const pnlPercent = (Math.random() - 0.3) * 0.1 // Slight positive bias
      const exitPrice = entryPrice * (1 + pnlPercent)
      const quantity = Math.floor(Math.random() * 10) + 1
      const pnl = (exitPrice - entryPrice) * quantity

      trades.push({
        entryDate: entryDate.toISOString().split('T')[0],
        exitDate: exitDate.toISOString().split('T')[0],
        symbol: config.symbol,
        side: Math.random() > 0.5 ? 'long' : 'short' as 'long' | 'short',
        quantity,
        entryPrice,
        exitPrice,
        pnl,
        commission: config.commissions * 2, // Entry + exit
        duration: Math.floor((exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      })
    }

    // Calculate performance metrics
    const totalReturn = ((currentValue - config.initialCapital) / config.initialCapital) * 100
    const annualizedReturn = (Math.pow(currentValue / config.initialCapital, 365 / daysDiff) - 1) * 100

    const returns = equity.slice(1).map((point, i) =>
      (point.value - equity[i].value) / equity[i].value
    )

    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length) * Math.sqrt(252) * 100
    const sharpeRatio = (annualizedReturn - 3) / volatility // Assuming 3% risk-free rate

    const winningTrades = trades.filter(t => t.pnl > 0).length
    const losingTrades = trades.filter(t => t.pnl < 0).length
    const winRate = (winningTrades / trades.length) * 100

    const grossWins = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
    const grossLosses = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))
    const profitFactor = grossWins / grossLosses

    const avgWin = winningTrades > 0 ? grossWins / winningTrades : 0
    const avgLoss = losingTrades > 0 ? grossLosses / losingTrades : 0

    // Calculate drawdowns
    const drawdowns = []
    let peak = config.initialCapital
    let maxDrawdown = 0

    for (const point of equity) {
      if (point.value > peak) {
        peak = point.value
      }
      const drawdown = ((peak - point.value) / peak) * 100
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
      drawdowns.push({ date: point.date, drawdown })
    }

    return {
      ...result,
      performance: {
        totalReturn,
        annualizedReturn,
        volatility,
        sharpeRatio,
        sortinoRatio: sharpeRatio * 1.2, // Approximation
        maxDrawdown,
        calmarRatio: annualizedReturn / maxDrawdown,
        winRate,
        profitFactor,
        avgWin,
        avgLoss,
        totalTrades: trades.length,
        winningTrades,
        losingTrades
      },
      equity,
      trades,
      drawdowns,
      monthlyReturns: [], // Would calculate monthly returns
      riskMetrics: {
        var95: volatility * 1.65,
        var99: volatility * 2.33,
        expectedShortfall: volatility * 2.5,
        beta: 0.8 + Math.random() * 0.4,
        alpha: annualizedReturn - (0.8 * 12), // Assuming 12% market return
        informationRatio: sharpeRatio * 0.8
      },
      status: 'completed',
      duration: 5000 // 5 seconds
    }
  }

  const updateParameter = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }))
  }

  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  const getStrategyParameters = () => {
    switch (config.strategy) {
      case 'iron-condor':
        return [
          { key: 'shortDelta', label: 'Short Delta', type: 'number', step: 0.01, min: 0.05, max: 0.3 },
          { key: 'longDelta', label: 'Long Delta', type: 'number', step: 0.01, min: 0.01, max: 0.1 },
          { key: 'daysToExpiration', label: 'Days to Expiration', type: 'number', step: 1, min: 7, max: 90 },
          { key: 'profitTarget', label: 'Profit Target (%)', type: 'number', step: 0.1, min: 0.1, max: 1.0 },
          { key: 'stopLoss', label: 'Stop Loss (%)', type: 'number', step: 0.1, min: 1.0, max: 5.0 },
          { key: 'maxPositions', label: 'Max Positions', type: 'number', step: 1, min: 1, max: 10 }
        ]
      case 'put-credit-spread':
        return [
          { key: 'shortDelta', label: 'Short Put Delta', type: 'number', step: 0.01, min: 0.1, max: 0.4 },
          { key: 'spreadWidth', label: 'Spread Width ($)', type: 'number', step: 1, min: 5, max: 50 },
          { key: 'daysToExpiration', label: 'Days to Expiration', type: 'number', step: 1, min: 7, max: 60 },
          { key: 'profitTarget', label: 'Profit Target (%)', type: 'number', step: 0.1, min: 0.2, max: 0.8 },
          { key: 'stopLoss', label: 'Stop Loss (%)', type: 'number', step: 0.1, min: 1.5, max: 4.0 }
        ]
      default:
        return []
    }
  }

  const tabs = [
    { id: 'setup', name: 'Backtest Setup', icon: '⚙️' },
    { id: 'results', name: 'Results', icon: '📊' },
    { id: 'analysis', name: 'Analysis', icon: '🔍' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Backtesting</h1>
          <p className="text-gray-300">Test your trading strategies against historical market data</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Backtest Setup Tab */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Backtest Configuration</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                    <select
                      value={config.symbol}
                      onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="SPY">SPY</option>
                      <option value="QQQ">QQQ</option>
                      <option value="IWM">IWM</option>
                      <option value="TLT">TLT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                    <select
                      value={config.strategy}
                      onChange={(e) => setConfig(prev => ({ ...prev, strategy: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="iron-condor">Iron Condor</option>
                      <option value="put-credit-spread">Put Credit Spread</option>
                      <option value="call-credit-spread">Call Credit Spread</option>
                      <option value="short-strangle">Short Strangle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={config.startDate}
                      onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Initial Capital</label>
                    <input
                      type="number"
                      value={config.initialCapital}
                      onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Commissions ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.commissions}
                      onChange={(e) => setConfig(prev => ({ ...prev, commissions: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Parameters */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Strategy Parameters</h2>

              <div className="space-y-4">
                {getStrategyParameters().map((param) => (
                  <div key={param.key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {param.label}
                    </label>
                    <input
                      type="number"
                      step={param.step}
                      min={param.min}
                      max={param.max}
                      value={config.parameters[param.key] as number}
                      onChange={(e) => updateParameter(param.key, Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={runBacktest}
                  disabled={isRunning}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Running Backtest...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Run Backtest</span>
                    </>
                  )}
                </button>

                {isRunning && (
                  <div className="mt-4">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-2">
                      {progress}% Complete
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            {/* Results List */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Backtest Results</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      comparisonMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {comparisonMode ? 'Exit Comparison' : 'Compare Results'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedResult?.id === result.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-600'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-4">
                        {comparisonMode && (
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(result.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedResults(prev => [...prev, result.id])
                              } else {
                                setSelectedResults(prev => prev.filter(id => id !== result.id))
                              }
                            }}
                            className="rounded bg-slate-600 border-slate-500"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-white">
                            {result.config.symbol} {result.config.strategy}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {result.config.startDate} to {result.config.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          result.performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.performance.totalReturn >= 0 ? '+' : ''}{formatNumber(result.performance.totalReturn)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Sharpe: {formatNumber(result.performance.sharpeRatio)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-blue-400 ml-2">{formatNumber(result.performance.winRate)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max DD:</span>
                        <span className="text-red-400 ml-2">{formatNumber(result.performance.maxDrawdown)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trades:</span>
                        <span className="text-white ml-2">{result.performance.totalTrades}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Profit Factor:</span>
                        <span className="text-purple-400 ml-2">{formatNumber(result.performance.profitFactor)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-xl text-white mb-2">No backtest results</h3>
                  <p className="text-gray-400">Run your first backtest to see results here</p>
                </div>
              )}
            </div>

            {/* Selected Result Details */}
            {selectedResult && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Performance Analysis</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      selectedResult.performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedResult.performance.totalReturn >= 0 ? '+' : ''}{formatNumber(selectedResult.performance.totalReturn)}%
                    </div>
                    <div className="text-gray-400">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {formatNumber(selectedResult.performance.sharpeRatio)}
                    </div>
                    <div className="text-gray-400">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {formatNumber(selectedResult.performance.maxDrawdown)}%
                    </div>
                    <div className="text-gray-400">Max Drawdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {formatNumber(selectedResult.performance.winRate)}%
                    </div>
                    <div className="text-gray-400">Win Rate</div>
                  </div>
                </div>

                {/* Equity Curve Chart */}
                <div className="bg-slate-700 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-white mb-4">Equity Curve</h3>
                  <div className="h-64 bg-slate-600 rounded relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        points={selectedResult.equity.map((point, index) => {
                          const x = (index / (selectedResult.equity.length - 1)) * 100
                          const minValue = Math.min(...selectedResult.equity.map(p => p.value))
                          const maxValue = Math.max(...selectedResult.equity.map(p => p.value))
                          const y = 100 - ((point.value - minValue) / (maxValue - minValue)) * 100
                          return `${x},${y}`
                        }).join(' ')}
                      />
                    </svg>
                  </div>
                </div>

                {/* Trade Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Trade Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Trades:</span>
                        <span className="text-white">{selectedResult.performance.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Winning Trades:</span>
                        <span className="text-green-400">{selectedResult.performance.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losing Trades:</span>
                        <span className="text-red-400">{selectedResult.performance.losingTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Win:</span>
                        <span className="text-green-400">{formatCurrency(selectedResult.performance.avgWin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Loss:</span>
                        <span className="text-red-400">{formatCurrency(selectedResult.performance.avgLoss)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Profit Factor:</span>
                        <span className="text-purple-400">{formatNumber(selectedResult.performance.profitFactor)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Risk Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volatility:</span>
                        <span className="text-white">{formatNumber(selectedResult.performance.volatility)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">VaR (95%):</span>
                        <span className="text-yellow-400">{formatNumber(selectedResult.riskMetrics.var95)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Beta:</span>
                        <span className="text-blue-400">{formatNumber(selectedResult.riskMetrics.beta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Alpha:</span>
                        <span className="text-green-400">{formatNumber(selectedResult.riskMetrics.alpha)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Calmar Ratio:</span>
                        <span className="text-purple-400">{formatNumber(selectedResult.performance.calmarRatio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sortino Ratio:</span>
                        <span className="text-orange-400">{formatNumber(selectedResult.performance.sortinoRatio)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Advanced Analysis</h2>
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">Advanced analysis features including Monte Carlo simulation, parameter optimization, and walk-forward analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
