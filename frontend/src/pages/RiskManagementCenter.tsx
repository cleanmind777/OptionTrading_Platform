import { useState, useEffect } from 'react'

interface PortfolioMetrics {
  totalValue: number
  riskCapital: number
  maxDrawdown: number
  sharpeRatio: number
  beta: number
  correlation: number
  varDaily: number
  expectedReturn: number
}

interface RiskLimit {
  id: string
  name: string
  type: 'portfolio' | 'position' | 'strategy' | 'symbol'
  target: string
  limitType: 'absolute' | 'percentage'
  maxLoss: number
  maxRisk: number
  currentExposure: number
  status: 'safe' | 'warning' | 'breach'
  isActive: boolean
}

interface PositionSizing {
  method: 'fixed' | 'kelly' | 'varvol' | 'risk_parity'
  baseSize: number
  maxPosition: number
  volatilityTarget: number
  kellyFraction: number
  riskBudget: number
}

interface CorrelationData {
  symbol1: string
  symbol2: string
  correlation: number
  exposureSymbol1: number
  exposureSymbol2: number
  combinedRisk: number
}

interface OptimizationResult {
  currentAllocation: { [key: string]: number }
  optimizedAllocation: { [key: string]: number }
  expectedReturn: number
  expectedRisk: number
  sharpeRatio: number
  improvements: string[]
}

export function RiskManagementCenter() {
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValue: 125430.50,
    riskCapital: 25086.10,
    maxDrawdown: -5.2,
    sharpeRatio: 1.85,
    beta: 0.78,
    correlation: 0.65,
    varDaily: -2850.75,
    expectedReturn: 15.8
  })

  const [riskLimits, setRiskLimits] = useState<RiskLimit[]>([])
  const [positionSizing, setPositionSizing] = useState<PositionSizing>({
    method: 'kelly',
    baseSize: 5000,
    maxPosition: 15000,
    volatilityTarget: 15,
    kellyFraction: 0.25,
    riskBudget: 2.5
  })

  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'limits' | 'sizing' | 'optimization'>('overview')

  useEffect(() => {
    loadRiskLimits()
    loadCorrelationData()
  }, [])

  const loadRiskLimits = () => {
    const limits: RiskLimit[] = [
      {
        id: '1',
        name: 'Portfolio Max Loss',
        type: 'portfolio',
        target: 'Total Portfolio',
        limitType: 'percentage',
        maxLoss: 10,
        maxRisk: 15,
        currentExposure: 8.3,
        status: 'safe',
        isActive: true
      },
      {
        id: '2',
        name: 'SPY Position Limit',
        type: 'symbol',
        target: 'SPY',
        limitType: 'absolute',
        maxLoss: 5000,
        maxRisk: 25,
        currentExposure: 18.7,
        status: 'safe',
        isActive: true
      },
      {
        id: '3',
        name: 'Options Strategy Risk',
        type: 'strategy',
        target: 'Iron Condor',
        limitType: 'percentage',
        maxLoss: 5,
        maxRisk: 20,
        currentExposure: 22.1,
        status: 'warning',
        isActive: true
      },
      {
        id: '4',
        name: 'Single Position Max',
        type: 'position',
        target: 'Individual Positions',
        limitType: 'percentage',
        maxLoss: 2,
        maxRisk: 8,
        currentExposure: 6.5,
        status: 'safe',
        isActive: true
      }
    ]
    setRiskLimits(limits)
  }

  const loadCorrelationData = () => {
    const correlations: CorrelationData[] = [
      {
        symbol1: 'SPY',
        symbol2: 'QQQ',
        correlation: 0.85,
        exposureSymbol1: 45000,
        exposureSymbol2: 32000,
        combinedRisk: 15.8
      },
      {
        symbol1: 'SPY',
        symbol2: 'IWM',
        correlation: 0.72,
        exposureSymbol1: 45000,
        exposureSymbol2: 18000,
        combinedRisk: 12.3
      },
      {
        symbol1: 'QQQ',
        symbol2: 'IWM',
        correlation: 0.68,
        exposureSymbol1: 32000,
        exposureSymbol2: 18000,
        combinedRisk: 8.9
      }
    ]
    setCorrelationData(correlations)
  }

  const runPortfolioOptimization = async () => {
    setIsOptimizing(true)

    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))

    const result: OptimizationResult = {
      currentAllocation: {
        'SPY': 35.8,
        'QQQ': 25.5,
        'IWM': 14.3,
        'TLT': 12.2,
        'Cash': 12.2
      },
      optimizedAllocation: {
        'SPY': 32.1,
        'QQQ': 28.7,
        'IWM': 15.8,
        'TLT': 15.2,
        'Cash': 8.2
      },
      expectedReturn: 17.2,
      expectedRisk: 13.8,
      sharpeRatio: 2.15,
      improvements: [
        'Reduce SPY exposure by 3.7% to decrease concentration risk',
        'Increase QQQ allocation by 3.2% for better risk-adjusted returns',
        'Add 3% to TLT for improved diversification',
        'Reduce cash holdings to maximize expected returns'
      ]
    }

    setOptimizationResult(result)
    setIsOptimizing(false)
  }

  const calculatePositionSize = (symbol: string, entryPrice: number, stopLoss: number, confidence: number) => {
    const riskPerShare = Math.abs(entryPrice - stopLoss)
    const portfolioRisk = portfolioMetrics.totalValue * (positionSizing.riskBudget / 100)

    switch (positionSizing.method) {
      case 'fixed':
        return Math.floor(positionSizing.baseSize / entryPrice)

      case 'kelly':
        const winRate = confidence / 100
        const avgWin = riskPerShare * 2 // Assume 2:1 reward:risk
        const avgLoss = riskPerShare
        const kellyPercent = (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin
        const kellySize = (portfolioMetrics.totalValue * kellyPercent * positionSizing.kellyFraction) / entryPrice
        return Math.floor(Math.min(kellySize, positionSizing.maxPosition / entryPrice))

      case 'varvol':
        const targetVol = positionSizing.volatilityTarget / 100
        const estimatedVol = 0.25 // 25% assumed volatility
        const volAdjustedSize = (portfolioMetrics.totalValue * targetVol) / (estimatedVol * entryPrice)
        return Math.floor(Math.min(volAdjustedSize, positionSizing.maxPosition / entryPrice))

      case 'risk_parity':
        return Math.floor(portfolioRisk / riskPerShare)

      default:
        return Math.floor(positionSizing.baseSize / entryPrice)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 bg-green-900/20 border-green-700'
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'breach': return 'text-red-400 bg-red-900/20 border-red-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Risk Overview', icon: '📊' },
    { id: 'limits', name: 'Risk Limits', icon: '🚨' },
    { id: 'sizing', name: 'Position Sizing', icon: '📏' },
    { id: 'optimization', name: 'Portfolio Optimization', icon: '🎯' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Risk Management Center</h1>
          <p className="text-gray-300">Advanced portfolio risk management and optimization tools</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[rgb(15 23 42)] p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Risk Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Portfolio Metrics */}
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Portfolio Risk Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">${(portfolioMetrics.totalValue / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-gray-400">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">${(portfolioMetrics.riskCapital / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-gray-400">Risk Capital</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{portfolioMetrics.maxDrawdown}%</div>
                  <div className="text-sm text-gray-400">Max Drawdown</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{portfolioMetrics.sharpeRatio}</div>
                  <div className="text-sm text-gray-400">Sharpe Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{portfolioMetrics.beta}</div>
                  <div className="text-sm text-gray-400">Portfolio Beta</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{portfolioMetrics.correlation}</div>
                  <div className="text-sm text-gray-400">Correlation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">${(portfolioMetrics.varDaily / 1000).toFixed(1)}k</div>
                  <div className="text-sm text-gray-400">Daily VaR (95%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{portfolioMetrics.expectedReturn}%</div>
                  <div className="text-sm text-gray-400">Expected Return</div>
                </div>
              </div>
            </div>

            {/* Correlation Matrix */}
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Position Correlations</h2>
              <div className="space-y-4">
                {correlationData.map((corr, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-white">{corr.symbol1} × {corr.symbol2}</span>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          corr.correlation > 0.8 ? 'bg-red-900 text-red-300' :
                          corr.correlation > 0.6 ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {(corr.correlation * 100).toFixed(0)}% Correlation
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">Combined Risk: {corr.combinedRisk}%</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">{corr.symbol1} Exposure:</span>
                        <span className="text-blue-400 ml-2">${(corr.exposureSymbol1 / 1000).toFixed(0)}k</span>
                      </div>
                      <div>
                        <span className="text-gray-400">{corr.symbol2} Exposure:</span>
                        <span className="text-blue-400 ml-2">${(corr.exposureSymbol2 / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Risk Limits Tab */}
        {selectedTab === 'limits' && (
          <div className="space-y-8">
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Risk Limits Configuration</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                  Add New Limit
                </button>
              </div>

              <div className="space-y-4">
                {riskLimits.map((limit) => (
                  <div key={limit.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-white">{limit.name}</span>
                        <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(limit.status)}`}>
                          {limit.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={limit.isActive}
                            onChange={() => {
                              setRiskLimits(prev => prev.map(l =>
                                l.id === limit.id ? { ...l, isActive: !l.isActive } : l
                              ))
                            }}
                            className="rounded bg-slate-600 border-slate-500"
                          />
                          <span className="text-sm text-gray-300">Active</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Target:</span>
                        <span className="text-white ml-2">{limit.target}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Loss:</span>
                        <span className="text-red-400 ml-2">
                          {limit.limitType === 'percentage' ? `${limit.maxLoss}%` : `$${limit.maxLoss}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Risk:</span>
                        <span className="text-yellow-400 ml-2">{limit.maxRisk}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Exposure:</span>
                        <span className={`ml-2 ${
                          limit.currentExposure > limit.maxRisk ? 'text-red-400' :
                          limit.currentExposure > limit.maxRisk * 0.8 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {limit.currentExposure}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            limit.currentExposure > limit.maxRisk ? 'bg-red-400' :
                            limit.currentExposure > limit.maxRisk * 0.8 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${Math.min((limit.currentExposure / limit.maxRisk) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Position Sizing Tab */}
        {selectedTab === 'sizing' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration */}
              <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Position Sizing Configuration</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sizing Method</label>
                    <select
                      value={positionSizing.method}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, method: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="fixed">Fixed Dollar Amount</option>
                      <option value="kelly">Kelly Criterion</option>
                      <option value="varvol">Volatility Targeting</option>
                      <option value="risk_parity">Risk Parity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Base Position Size ($)
                    </label>
                    <input
                      type="number"
                      value={positionSizing.baseSize}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, baseSize: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Position Size ($)
                    </label>
                    <input
                      type="number"
                      value={positionSizing.maxPosition}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, maxPosition: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>

                  {positionSizing.method === 'kelly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kelly Fraction (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={positionSizing.kellyFraction}
                        onChange={(e) => setPositionSizing(prev => ({ ...prev, kellyFraction: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      />
                    </div>
                  )}

                  {positionSizing.method === 'varvol' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Volatility Target (%)
                      </label>
                      <input
                        type="number"
                        value={positionSizing.volatilityTarget}
                        onChange={(e) => setPositionSizing(prev => ({ ...prev, volatilityTarget: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Risk Budget per Trade (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={positionSizing.riskBudget}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, riskBudget: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Position Size Calculator */}
              <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Position Size Calculator</h2>

                <div className="space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">Example: SPY Trade</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Entry Price:</span>
                        <span className="text-white ml-2">$455.50</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Stop Loss:</span>
                        <span className="text-red-400 ml-2">$450.00</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-green-400 ml-2">75%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Risk per Share:</span>
                        <span className="text-yellow-400 ml-2">$5.50</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded">
                      <div className="text-blue-200 font-medium">
                        Calculated Size: {calculatePositionSize('SPY', 455.50, 450.00, 75)} shares
                      </div>
                      <div className="text-blue-300 text-sm">
                        Total Value: ${(calculatePositionSize('SPY', 455.50, 450.00, 75) * 455.50).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">Sizing Method Details</h3>
                    <div className="text-sm text-gray-300">
                      {positionSizing.method === 'fixed' && 'Uses a fixed dollar amount for all positions regardless of volatility or risk.'}
                      {positionSizing.method === 'kelly' && 'Optimizes position size based on win probability and average win/loss ratios using Kelly Criterion.'}
                      {positionSizing.method === 'varvol' && 'Adjusts position size to target a specific portfolio volatility level.'}
                      {positionSizing.method === 'risk_parity' && 'Sizes positions so each contributes equally to portfolio risk.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Optimization Tab */}
        {selectedTab === 'optimization' && (
          <div className="space-y-8">
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Portfolio Optimization</h2>
                <button
                  onClick={runPortfolioOptimization}
                  disabled={isOptimizing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded font-medium transition-colors flex items-center space-x-2"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>Run Optimization</span>
                    </>
                  )}
                </button>
              </div>

              {optimizationResult && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Current vs Optimized */}
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-4">Current Allocation</h3>
                      <div className="space-y-2">
                        {Object.entries(optimizationResult.currentAllocation).map(([symbol, percentage]) => (
                          <div key={symbol} className="flex justify-between items-center">
                            <span className="text-gray-300">{symbol}</span>
                            <span className="text-blue-400">{percentage.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-4">Optimized Allocation</h3>
                      <div className="space-y-2">
                        {Object.entries(optimizationResult.optimizedAllocation).map(([symbol, percentage]) => (
                          <div key={symbol} className="flex justify-between items-center">
                            <span className="text-gray-300">{symbol}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400">{percentage.toFixed(1)}%</span>
                              <span className={`text-xs ${
                                percentage > optimizationResult.currentAllocation[symbol] ? 'text-green-400' : 'text-red-400'
                              }`}>
                                ({percentage > optimizationResult.currentAllocation[symbol] ? '+' : ''}
                                {(percentage - optimizationResult.currentAllocation[symbol]).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Comparison */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Expected Improvements</h3>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{optimizationResult.expectedReturn.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Expected Return</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{optimizationResult.expectedRisk.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Expected Risk</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{optimizationResult.sharpeRatio.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Sharpe Ratio</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Optimization Recommendations</h3>
                    <div className="space-y-3">
                      {optimizationResult.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span className="text-gray-300 text-sm">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium transition-colors">
                      Apply Optimization
                    </button>
                  </div>
                </div>
              )}

              {!optimizationResult && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">🎯</div>
                  <p className="text-gray-300">Run portfolio optimization to get allocation recommendations</p>
                  <p className="text-sm text-gray-500 mt-2">
                    The optimizer will analyze current positions and suggest improvements based on risk-return characteristics
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
