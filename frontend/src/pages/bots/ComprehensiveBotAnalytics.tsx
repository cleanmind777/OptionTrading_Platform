import { useState, useEffect } from 'react'

interface BotMetrics {
  botId: string
  botName: string
  strategy: string
  status: 'active' | 'paused' | 'stopped'
  performance: {
    totalPnL: number
    totalPnLPercent: number
    winRate: number
    totalTrades: number
    avgTradeSize: number
    maxDrawdown: number
    sharpeRatio: number
    profitFactor: number
    avgDaysPerTrade: number
  }
  riskMetrics: {
    valueAtRisk: number
    beta: number
    alpha: number
    volatility: number
    correlationToMarket: number
  }
  optimization: {
    recommendedActions: string[]
    riskLevel: 'low' | 'medium' | 'high'
    performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F'
    optimizationScore: number
  }
  recentActivity: {
    date: string
    action: string
    result: string
    pnl: number
  }[]
}

interface MarketConditions {
  vix: number
  trend: 'bullish' | 'bearish' | 'sideways'
  volatility: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export function ComprehensiveBotAnalytics() {
  const [selectedBot, setSelectedBot] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<string>('30d')
  const [botMetrics, setBotMetrics] = useState<BotMetrics[]>([])
  const [marketConditions, setMarketConditions] = useState<MarketConditions | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadBotAnalytics()
    loadMarketConditions()
  }, [selectedBot, timeframe])

  const loadBotAnalytics = () => {
    setIsLoading(true)

    // Simulate API call with comprehensive bot data
    setTimeout(() => {
      const mockBots: BotMetrics[] = [
        {
          botId: 'bot-1',
          botName: 'Iron Condor Master',
          strategy: 'Iron Condor',
          status: 'active',
          performance: {
            totalPnL: 5420.30,
            totalPnLPercent: 12.4,
            winRate: 78.5,
            totalTrades: 124,
            avgTradeSize: 2500,
            maxDrawdown: -8.2,
            sharpeRatio: 1.85,
            profitFactor: 2.3,
            avgDaysPerTrade: 21
          },
          riskMetrics: {
            valueAtRisk: -2.4,
            beta: 0.85,
            alpha: 4.2,
            volatility: 15.3,
            correlationToMarket: 0.72
          },
          optimization: {
            recommendedActions: [
              'Increase position sizing by 15%',
              'Optimize strike selection for current volatility',
              'Consider adding Put spreads to portfolio'
            ],
            riskLevel: 'medium',
            performanceGrade: 'A',
            optimizationScore: 87
          },
          recentActivity: [
            { date: '2025-06-09', action: 'Opened IC', result: 'Active', pnl: 0 },
            { date: '2025-06-08', action: 'Closed CC', result: 'Profit', pnl: 125 },
            { date: '2025-06-07', action: 'Opened CC', result: 'Active', pnl: 0 }
          ]
        },
        {
          botId: 'bot-2',
          botName: 'QQQ Credit Spreads',
          strategy: 'Put Credit Spread',
          status: 'active',
          performance: {
            totalPnL: 2830.75,
            totalPnLPercent: 8.2,
            winRate: 82.1,
            totalTrades: 89,
            avgTradeSize: 1800,
            maxDrawdown: -5.1,
            sharpeRatio: 2.1,
            profitFactor: 3.1,
            avgDaysPerTrade: 14
          },
          riskMetrics: {
            valueAtRisk: -1.8,
            beta: 1.1,
            alpha: 6.1,
            volatility: 12.8,
            correlationToMarket: 0.85
          },
          optimization: {
            recommendedActions: [
              'Excellent performance - maintain current parameters',
              'Consider expanding to IWM for diversification',
              'Monitor for volatility expansion opportunities'
            ],
            riskLevel: 'low',
            performanceGrade: 'A',
            optimizationScore: 92
          },
          recentActivity: [
            { date: '2025-06-09', action: 'Closed PCS', result: 'Profit', pnl: 85 },
            { date: '2025-06-08', action: 'Opened PCS', result: 'Active', pnl: 0 },
            { date: '2025-06-07', action: 'Closed PCS', result: 'Profit', pnl: 95 }
          ]
        },
        {
          botId: 'bot-3',
          botName: 'Momentum Scalper',
          strategy: 'Short Strangle',
          status: 'paused',
          performance: {
            totalPnL: -640.25,
            totalPnLPercent: -4.1,
            winRate: 58.3,
            totalTrades: 156,
            avgTradeSize: 1200,
            maxDrawdown: -15.6,
            sharpeRatio: -0.3,
            profitFactor: 0.8,
            avgDaysPerTrade: 8
          },
          riskMetrics: {
            valueAtRisk: -4.2,
            beta: 1.35,
            alpha: -8.1,
            volatility: 28.4,
            correlationToMarket: 0.91
          },
          optimization: {
            recommendedActions: [
              'Pause bot immediately - poor risk-adjusted returns',
              'Reduce position sizing by 50%',
              'Consider switching to credit spreads strategy',
              'Review entry/exit criteria'
            ],
            riskLevel: 'high',
            performanceGrade: 'D',
            optimizationScore: 23
          },
          recentActivity: [
            { date: '2025-06-09', action: 'Bot Paused', result: 'Manual', pnl: 0 },
            { date: '2025-06-08', action: 'Closed SS', result: 'Loss', pnl: -180 },
            { date: '2025-06-07', action: 'Closed SS', result: 'Loss', pnl: -95 }
          ]
        }
      ]

      setBotMetrics(mockBots)
      setIsLoading(false)
    }, 1000)
  }

  const loadMarketConditions = () => {
    const mockMarket: MarketConditions = {
      vix: 18.5,
      trend: 'sideways',
      volatility: 'medium',
      recommendations: [
        'Good environment for selling premium strategies',
        'Consider iron condors and credit spreads',
        'Avoid momentum-based strategies in current conditions',
        'Monitor for volatility expansion signals'
      ]
    }
    setMarketConditions(mockMarket)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400'
      case 'B': return 'text-blue-400'
      case 'C': return 'text-yellow-400'
      case 'D': return 'text-orange-400'
      case 'F': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'high': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const portfolioMetrics = botMetrics.reduce((acc, bot) => {
    acc.totalPnL += bot.performance.totalPnL
    acc.totalTrades += bot.performance.totalTrades
    acc.avgWinRate += bot.performance.winRate
    return acc
  }, { totalPnL: 0, totalTrades: 0, avgWinRate: 0 })

  if (botMetrics.length > 0) {
    portfolioMetrics.avgWinRate = portfolioMetrics.avgWinRate / botMetrics.length
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Bot Analytics Dashboard</h1>
            <p className="text-gray-300 mt-1">Advanced performance metrics and strategy optimization</p>
          </div>

          {/* Controls */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bots</option>
              {botMetrics.map((bot) => (
                <option key={bot.botId} value={bot.botId}>
                  {bot.botName}
                </option>
              ))}
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-300">Loading bot analytics...</span>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && botMetrics.length > 0 && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${portfolioMetrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(portfolioMetrics.totalPnL)}
                  </div>
                  <div className="text-sm text-gray-400">Total P&L</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{botMetrics.length}</div>
                  <div className="text-sm text-gray-400">Active Bots</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{portfolioMetrics.totalTrades}</div>
                  <div className="text-sm text-gray-400">Total Trades</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{portfolioMetrics.avgWinRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-400">Avg Win Rate</div>
                </div>
              </div>
            </div>

            {/* Market Conditions */}
            {marketConditions && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Market Conditions & Strategy Recommendations</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Current Market State</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">VIX Level</span>
                        <span className={`font-medium ${marketConditions.vix > 20 ? 'text-red-400' : marketConditions.vix > 15 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {marketConditions.vix}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Market Trend</span>
                        <span className="text-blue-400 capitalize">{marketConditions.trend}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Volatility</span>
                        <span className="text-purple-400 capitalize">{marketConditions.volatility}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Strategy Recommendations</h3>
                    <div className="space-y-2">
                      {marketConditions.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Bot Performance */}
            <div className="space-y-4">
              {botMetrics.map((bot) => (
                <div key={bot.botId} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className={`w-3 h-3 rounded-full ${bot.status === 'active' ? 'bg-green-400' : bot.status === 'paused' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{bot.botName}</h3>
                        <p className="text-gray-400">{bot.strategy} • {bot.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getGradeColor(bot.optimization.performanceGrade)}`}>
                          {bot.optimization.performanceGrade}
                        </div>
                        <div className="text-xs text-gray-400">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">{bot.optimization.optimizationScore}</div>
                        <div className="text-xs text-gray-400">Optimization</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(bot.optimization.riskLevel)}`}>
                        {bot.optimization.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Metrics */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total P&L</span>
                          <span className={`font-medium ${bot.performance.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(bot.performance.totalPnL)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate</span>
                          <span className="text-white">{bot.performance.winRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sharpe Ratio</span>
                          <span className="text-blue-400">{bot.performance.sharpeRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Drawdown</span>
                          <span className="text-red-400">{bot.performance.maxDrawdown.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit Factor</span>
                          <span className="text-purple-400">{bot.performance.profitFactor.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Risk Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">VaR (95%)</span>
                          <span className="text-red-400">{bot.riskMetrics.valueAtRisk.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beta</span>
                          <span className="text-yellow-400">{bot.riskMetrics.beta.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Alpha</span>
                          <span className={`${bot.riskMetrics.alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {bot.riskMetrics.alpha.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volatility</span>
                          <span className="text-orange-400">{bot.riskMetrics.volatility.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Correlation</span>
                          <span className="text-blue-400">{bot.riskMetrics.correlationToMarket.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Optimization Recommendations */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Optimization</h4>
                      <div className="space-y-2">
                        {bot.optimization.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-6 pt-6 border-t border-slate-600">
                    <h4 className="text-lg font-medium text-white mb-3">Recent Activity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {bot.recentActivity.map((activity, index) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-3">
                          <div className="text-sm text-gray-400">{activity.date}</div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">{activity.result}</span>
                            {activity.pnl !== 0 && (
                              <span className={`text-xs font-medium ${activity.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {activity.pnl >= 0 ? '+' : ''}{formatCurrency(activity.pnl)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
