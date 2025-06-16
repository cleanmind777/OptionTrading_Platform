import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface MarketCondition {
  symbol: string
  trend: 'bullish' | 'bearish' | 'neutral'
  volatility: 'high' | 'medium' | 'low'
  volume: number
  sentiment: number // -1 to 1
  support: number
  resistance: number
}

interface OptimizationSuggestion {
  id: string
  botId: string
  botName: string
  type: 'performance' | 'risk' | 'market' | 'strategy'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  confidence: number
  suggestion: string
  aiReasoning: string
  marketData: any
  estimatedImprovement: {
    profitIncrease: number
    riskReduction: number
    winRateImprovement: number
  }
}

interface BotPerformance {
  botId: string
  name: string
  status: 'active' | 'paused' | 'stopped'
  totalTrades: number
  winRate: number
  profitLoss: number
  sharpeRatio: number
  maxDrawdown: number
  avgTradeTime: number
  lastOptimized: string
  riskScore: number
}

export function AIOptimizationDashboard() {
  const [marketConditions, setMarketConditions] = useState<MarketCondition[]>([])
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([])
  const [botPerformances, setBotPerformances] = useState<BotPerformance[]>([])
  const [selectedBot, setSelectedBot] = useState<string>('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null)
  const [aiInsights, setAiInsights] = useState<string>('')

  useEffect(() => {
    // Load mock data
    loadMarketConditions()
    loadBotPerformances()
    generateOptimizationSuggestions()
  }, [])

  const loadMarketConditions = () => {
    const mockConditions: MarketCondition[] = [
      {
        symbol: 'SPY',
        trend: 'bullish',
        volatility: 'medium',
        volume: 89750000,
        sentiment: 0.65,
        support: 452.50,
        resistance: 458.75
      },
      {
        symbol: 'QQQ',
        trend: 'neutral',
        volatility: 'high',
        volume: 52400000,
        sentiment: 0.23,
        support: 385.20,
        resistance: 392.80
      },
      {
        symbol: 'IWM',
        trend: 'bearish',
        volatility: 'high',
        volume: 31200000,
        sentiment: -0.42,
        support: 198.50,
        resistance: 205.75
      }
    ]
    setMarketConditions(mockConditions)
  }

  const loadBotPerformances = () => {
    const mockPerformances: BotPerformance[] = [
      {
        botId: '1',
        name: 'SPY Iron Condor Weekly',
        status: 'active',
        totalTrades: 156,
        winRate: 73.5,
        profitLoss: 12450.75,
        sharpeRatio: 1.85,
        maxDrawdown: -2340.50,
        avgTradeTime: 4.2,
        lastOptimized: '2024-01-15',
        riskScore: 6.8
      },
      {
        botId: '2',
        name: 'QQQ Put Credit Spread',
        status: 'active',
        totalTrades: 89,
        winRate: 81.2,
        profitLoss: 8950.25,
        sharpeRatio: 2.12,
        maxDrawdown: -1250.75,
        avgTradeTime: 3.8,
        lastOptimized: '2024-01-10',
        riskScore: 4.2
      },
      {
        botId: '3',
        name: 'IWM Short Strangle',
        status: 'paused',
        totalTrades: 43,
        winRate: 65.1,
        profitLoss: -1850.50,
        sharpeRatio: 0.75,
        maxDrawdown: -3450.25,
        avgTradeTime: 6.5,
        lastOptimized: '2023-12-28',
        riskScore: 8.9
      }
    ]
    setBotPerformances(mockPerformances)
  }

  const generateOptimizationSuggestions = () => {
    const mockSuggestions: OptimizationSuggestion[] = [
      {
        id: '1',
        botId: '1',
        botName: 'SPY Iron Condor Weekly',
        type: 'performance',
        priority: 'high',
        title: 'Optimize Strike Selection for Current Market Conditions',
        description: 'AI analysis suggests adjusting delta targeting based on increased implied volatility',
        impact: 'Potential 15-20% improvement in win rate',
        confidence: 87,
        suggestion: 'Reduce delta from 0.15 to 0.12 for short strikes to capture higher premiums while maintaining risk profile',
        aiReasoning: 'Current market volatility (IV rank 78%) suggests tighter strike selection will improve risk-adjusted returns. Historical backtesting shows 18% win rate improvement in similar market conditions.',
        marketData: { ivRank: 78, trend: 'bullish', volatility: 'elevated' },
        estimatedImprovement: {
          profitIncrease: 18.5,
          riskReduction: 12.3,
          winRateImprovement: 15.2
        }
      },
      {
        id: '2',
        botId: '2',
        botName: 'QQQ Put Credit Spread',
        type: 'risk',
        priority: 'medium',
        title: 'Implement Dynamic Position Sizing',
        description: 'Market volatility suggests reducing position size during uncertainty periods',
        impact: 'Reduced maximum drawdown by 25-30%',
        confidence: 92,
        suggestion: 'Implement VIX-based position sizing: reduce size by 20% when VIX > 25',
        aiReasoning: 'Analysis of 500+ similar market periods shows position size reduction during high VIX periods reduces drawdown significantly while maintaining profitability.',
        marketData: { vix: 28.5, volatility: 'high', uncertainty: 'elevated' },
        estimatedImprovement: {
          profitIncrease: 5.2,
          riskReduction: 28.7,
          winRateImprovement: 8.1
        }
      },
      {
        id: '3',
        botId: '3',
        botName: 'IWM Short Strangle',
        type: 'strategy',
        priority: 'high',
        title: 'Switch to Defensive Strategy',
        description: 'Current bearish trend suggests switching to put spreads or pausing',
        impact: 'Prevent potential 40-50% additional losses',
        confidence: 94,
        suggestion: 'Pause current strategy and switch to put credit spreads to capitalize on downtrend',
        aiReasoning: 'IWM showing strong bearish signals with breakdown below key support. Short strangles perform poorly in trending markets. Put spreads would benefit from continued decline.',
        marketData: { trend: 'bearish', support: 'broken', momentum: 'negative' },
        estimatedImprovement: {
          profitIncrease: 35.8,
          riskReduction: 45.2,
          winRateImprovement: 28.9
        }
      },
      {
        id: '4',
        botId: '1',
        botName: 'SPY Iron Condor Weekly',
        type: 'market',
        priority: 'medium',
        title: 'Adjust for Earnings Season Impact',
        description: 'Upcoming earnings announcements may increase volatility',
        impact: 'Avoid potential 15-20% performance degradation',
        confidence: 78,
        suggestion: 'Widen strikes by 10% during earnings season (next 2 weeks)',
        aiReasoning: 'Historical analysis shows earnings season increases gap risk for iron condors. Wider strikes provide better protection against overnight moves.',
        marketData: { earningsCalendar: 'heavy', gapRisk: 'elevated' },
        estimatedImprovement: {
          profitIncrease: 8.3,
          riskReduction: 22.1,
          winRateImprovement: 12.4
        }
      }
    ]
    setOptimizationSuggestions(mockSuggestions)
  }

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis progress
    const steps = [
      'Analyzing market conditions...',
      'Processing historical performance data...',
      'Evaluating risk metrics...',
      'Generating optimization suggestions...',
      'Calculating impact estimates...',
      'Finalizing recommendations...'
    ]

    for (let i = 0; i < steps.length; i++) {
      setAiInsights(steps[i])
      setAnalysisProgress((i + 1) / steps.length * 100)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Generate new suggestions
    generateOptimizationSuggestions()
    setIsAnalyzing(false)
    setAiInsights('Analysis complete! Generated new optimization recommendations.')
  }

  const applyOptimization = (suggestion: OptimizationSuggestion) => {
    // In real app, this would apply the optimization to the bot
    console.log('Applying optimization:', suggestion)
    alert(`Optimization applied to ${suggestion.botName}!\n\nChanges made:\n${suggestion.suggestion}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-700'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'low': return 'text-green-400 bg-green-900/20 border-green-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return '📈'
      case 'risk': return '🛡️'
      case 'market': return '🌍'
      case 'strategy': return '🎯'
      default: return '🤖'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '📈'
      case 'bearish': return '📉'
      case 'neutral': return '➡️'
      default: return '❓'
    }
  }

  const filteredSuggestions = selectedBot === 'all'
    ? optimizationSuggestions
    : optimizationSuggestions.filter(s => s.botId === selectedBot)

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Optimization Dashboard</h1>
            <p className="text-gray-300">AI-powered bot optimization and market analysis</p>
          </div>
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🤖</span>
                <span>Run AI Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-200 font-medium">AI Analysis Progress</span>
              <span className="text-blue-300">{Math.round(analysisProgress)}%</span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-2 mb-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-blue-300 text-sm">{aiInsights}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Conditions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Market Overview */}
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Market Conditions</h2>
              <div className="space-y-4">
                {marketConditions.map((condition) => (
                  <div key={condition.symbol} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{condition.symbol}</span>
                      <div className="flex items-center space-x-2">
                        <span>{getTrendIcon(condition.trend)}</span>
                        <span className={`text-sm ${
                          condition.trend === 'bullish' ? 'text-green-400' :
                          condition.trend === 'bearish' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {condition.trend.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Volatility:</span>
                        <span className={`ml-2 ${
                          condition.volatility === 'high' ? 'text-red-400' :
                          condition.volatility === 'medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {condition.volatility.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sentiment:</span>
                        <span className={`ml-2 ${
                          condition.sentiment > 0.3 ? 'text-green-400' :
                          condition.sentiment < -0.3 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {(condition.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Support:</span>
                        <span className="text-blue-400 ml-2">${condition.support}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Resistance:</span>
                        <span className="text-orange-400 ml-2">${condition.resistance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Performance Summary */}
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Bot Performance</h2>
              <div className="space-y-3">
                {botPerformances.map((bot) => (
                  <div key={bot.botId} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white text-sm">{bot.name}</span>
                      <div className={`px-2 py-1 rounded text-xs ${
                        bot.status === 'active' ? 'bg-green-900 text-green-300' :
                        bot.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {bot.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">P&L:</span>
                        <span className={`ml-2 ${bot.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${bot.profitLoss.toFixed(0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-blue-400 ml-2">{bot.winRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Risk Score:</span>
                        <span className={`ml-2 ${
                          bot.riskScore < 5 ? 'text-green-400' :
                          bot.riskScore < 7 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {bot.riskScore.toFixed(1)}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sharpe:</span>
                        <span className="text-purple-400 ml-2">{bot.sharpeRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Optimization Suggestions */}
          <div className="lg:col-span-2">
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">AI Optimization Suggestions</h2>
                <select
                  value={selectedBot}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Bots</option>
                  {botPerformances.map((bot) => (
                    <option key={bot.botId} value={bot.botId}>
                      {bot.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-slate-700 rounded-lg border border-slate-600 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                        <div>
                          <h3 className="font-medium text-white">{suggestion.title}</h3>
                          <p className="text-sm text-gray-400">{suggestion.botName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority.toUpperCase()}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-400">
                            {suggestion.confidence}% Confidence
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{suggestion.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-600 rounded">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">
                          +{suggestion.estimatedImprovement.profitIncrease.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Profit Increase</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-medium">
                          -{suggestion.estimatedImprovement.riskReduction.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Risk Reduction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-medium">
                          +{suggestion.estimatedImprovement.winRateImprovement.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                    </div>

                    <div className="bg-[rgb(15 23 42)] p-3 rounded mb-3">
                      <h4 className="text-sm font-medium text-white mb-2">💡 AI Recommendation:</h4>
                      <p className="text-sm text-gray-300 mb-2">{suggestion.suggestion}</p>
                      <p className="text-xs text-gray-400 italic">{suggestion.aiReasoning}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400 font-medium">{suggestion.impact}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedSuggestion(suggestion)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => applyOptimization(suggestion)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Apply Optimization
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Suggestion Modal */}
        {selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Optimization Details</h2>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-white mb-3">Optimization Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Bot:</span> <span className="text-white">{selectedSuggestion.botName}</span></div>
                      <div><span className="text-gray-400">Type:</span> <span className="text-blue-400">{selectedSuggestion.type}</span></div>
                      <div><span className="text-gray-400">Priority:</span> <span className={`${getPriorityColor(selectedSuggestion.priority).split(' ')[0]}`}>{selectedSuggestion.priority}</span></div>
                      <div><span className="text-gray-400">Confidence:</span> <span className="text-green-400">{selectedSuggestion.confidence}%</span></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-3">Expected Impact</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Profit Increase:</span> <span className="text-green-400">+{selectedSuggestion.estimatedImprovement.profitIncrease.toFixed(1)}%</span></div>
                      <div><span className="text-gray-400">Risk Reduction:</span> <span className="text-blue-400">-{selectedSuggestion.estimatedImprovement.riskReduction.toFixed(1)}%</span></div>
                      <div><span className="text-gray-400">Win Rate Improvement:</span> <span className="text-purple-400">+{selectedSuggestion.estimatedImprovement.winRateImprovement.toFixed(1)}%</span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3">AI Analysis & Reasoning</h3>
                  <div className="bg-slate-700 p-4 rounded">
                    <p className="text-gray-300">{selectedSuggestion.aiReasoning}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3">Recommended Actions</h3>
                  <div className="bg-blue-900/20 border border-blue-700 p-4 rounded">
                    <p className="text-blue-200">{selectedSuggestion.suggestion}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedSuggestion(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      applyOptimization(selectedSuggestion)
                      setSelectedSuggestion(null)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    Apply Optimization
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
