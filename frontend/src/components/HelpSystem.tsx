import { useState, useRef, useEffect } from 'react'

interface StrategyGuide {
  id: string
  name: string
  description: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  riskLevel: 'Low' | 'Medium' | 'High'
  marketCondition: string
  overview: string
  legs: Array<{
    type: 'PUT' | 'CALL'
    action: 'BUY' | 'SELL'
    strike: string
    description: string
  }>
  advantages: string[]
  disadvantages: string[]
  maxProfit: string
  maxLoss: string
  breakeven: string
  bestMarket: string
  example: {
    setup: string
    outcome: string
    profit: number
  }
}

interface TooltipContent {
  title: string
  description: string
  tips?: string[]
  warnings?: string[]
  examples?: string[]
  relatedConcepts?: string[]
}

interface HelpSystemProps {
  field?: string
  strategy?: string
  onClose: () => void
  showGuides?: boolean
}

const STRATEGY_GUIDES: StrategyGuide[] = [
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    description: 'A neutral strategy that profits from low volatility and time decay',
    complexity: 'Intermediate',
    riskLevel: 'Medium',
    marketCondition: 'Sideways/Low Volatility',
    overview: 'An Iron Condor combines a bull put spread and bear call spread to create a range-bound strategy that profits when the underlying stays within a specific price range.',
    legs: [
      {
        type: 'PUT',
        action: 'SELL',
        strike: 'Out-of-the-money',
        description: 'Short Put (collect premium)'
      },
      {
        type: 'PUT',
        action: 'BUY',
        strike: 'Further out-of-the-money',
        description: 'Long Put (protection)'
      },
      {
        type: 'CALL',
        action: 'SELL',
        strike: 'Out-of-the-money',
        description: 'Short Call (collect premium)'
      },
      {
        type: 'CALL',
        action: 'BUY',
        strike: 'Further out-of-the-money',
        description: 'Long Call (protection)'
      }
    ],
    advantages: [
      'Profits from time decay',
      'Limited risk',
      'High probability of profit',
      'Works in sideways markets'
    ],
    disadvantages: [
      'Limited profit potential',
      'Can lose quickly with large moves',
      'Multiple commissions',
      'Requires active management'
    ],
    maxProfit: 'Net premium received',
    maxLoss: 'Strike width - Net premium received',
    breakeven: 'Two breakeven points: Lower strike + net premium and Upper strike - net premium',
    bestMarket: 'Low volatility, range-bound markets',
    example: {
      setup: 'SPY at $450: Sell $440 Put, Buy $435 Put, Sell $460 Call, Buy $465 Call for $2.00 credit',
      outcome: 'If SPY stays between $442-$458 at expiration, strategy is profitable',
      profit: 200
    }
  },
  {
    id: 'put-credit-spread',
    name: 'Put Credit Spread',
    description: 'A bullish strategy that profits when the stock stays above the short strike',
    complexity: 'Beginner',
    riskLevel: 'Medium',
    marketCondition: 'Bullish/Neutral',
    overview: 'A Put Credit Spread involves selling a put option and buying a further out-of-the-money put for protection. This strategy profits from upward price movement and time decay.',
    legs: [
      {
        type: 'PUT',
        action: 'SELL',
        strike: 'Out-of-the-money',
        description: 'Short Put (collect premium)'
      },
      {
        type: 'PUT',
        action: 'BUY',
        strike: 'Further out-of-the-money',
        description: 'Long Put (protection)'
      }
    ],
    advantages: [
      'Limited risk',
      'Profits from time decay',
      'High probability of profit',
      'Defined risk/reward'
    ],
    disadvantages: [
      'Limited profit potential',
      'Assignment risk',
      'Can lose money quickly if underlying falls'
    ],
    maxProfit: 'Net premium received',
    maxLoss: 'Strike width - Net premium received',
    breakeven: 'Short strike - Net premium received',
    bestMarket: 'Bullish to neutral markets with low volatility',
    example: {
      setup: 'SPY at $450: Sell $440 Put, Buy $435 Put for $1.50 credit',
      outcome: 'If SPY stays above $438.50 at expiration, strategy is profitable',
      profit: 150
    }
  },
  {
    id: 'short-strangle',
    name: 'Short Strangle',
    description: 'A neutral strategy that profits from low volatility by selling both puts and calls',
    complexity: 'Advanced',
    riskLevel: 'High',
    marketCondition: 'Low Volatility/Sideways',
    overview: 'A Short Strangle involves selling both a put and call option with different strikes but same expiration. This strategy profits from time decay and decreasing volatility.',
    legs: [
      {
        type: 'PUT',
        action: 'SELL',
        strike: 'Out-of-the-money',
        description: 'Short Put (collect premium)'
      },
      {
        type: 'CALL',
        action: 'SELL',
        strike: 'Out-of-the-money',
        description: 'Short Call (collect premium)'
      }
    ],
    advantages: [
      'High premium collection',
      'Profits from time decay',
      'Benefits from volatility decrease',
      'Wide profit range'
    ],
    disadvantages: [
      'Unlimited risk potential',
      'Assignment risk on both sides',
      'Requires margin',
      'Can lose money quickly with big moves'
    ],
    maxProfit: 'Net premium received',
    maxLoss: 'Unlimited (but can be managed)',
    breakeven: 'Put strike - net premium and Call strike + net premium',
    bestMarket: 'Low volatility, range-bound markets',
    example: {
      setup: 'SPY at $450: Sell $440 Put, Sell $460 Call for $3.00 credit',
      outcome: 'Profitable if SPY stays between $437-$463 at expiration',
      profit: 300
    }
  }
]

const TOOLTIP_CONTENT: Record<string, TooltipContent> = {
  botName: {
    title: 'Bot Name',
    description: 'A unique identifier for your trading bot that will appear in logs and management screens.',
    tips: [
      'Use descriptive names like "SPY Weekly Iron Condor"',
      'Include the symbol and strategy for easy identification',
      'Avoid special characters that might cause issues'
    ],
    examples: [
      'SPY_Iron_Condor_45DTE',
      'QQQ_Put_Credit_Weekly',
      'IWM_Strangle_Earnings'
    ]
  },
  tradingAccount: {
    title: 'Trading Account',
    description: 'Select which brokerage account this bot should use for executing trades.',
    tips: [
      'Paper trading accounts are great for testing strategies',
      'Ensure sufficient funds for margin requirements',
      'Verify options trading permissions are enabled'
    ],
    warnings: [
      'Live accounts will use real money',
      'Check account balance before starting bot',
      'Different accounts may have different margin requirements'
    ]
  },
  strategyAssignment: {
    title: 'Strategy Assignment',
    description: 'The options trading strategy this bot will execute. Each strategy has different risk/reward characteristics.',
    tips: [
      'Iron Condors work best in low volatility',
      'Credit spreads are directional strategies',
      'Choose strategy based on market outlook'
    ],
    relatedConcepts: [
      'Implied Volatility',
      'Time Decay (Theta)',
      'Delta Neutral Strategies'
    ]
  },
  underlyingSymbol: {
    title: 'Underlying Symbol',
    description: 'The stock or ETF symbol that the bot will trade options on.',
    tips: [
      'ETFs like SPY, QQQ, IWM have high liquidity',
      'Check options volume before selecting',
      'Consider correlation with overall market'
    ],
    warnings: [
      'Low volume symbols may have poor fills',
      'Earnings announcements can cause high volatility',
      'Some symbols may have limited options chains'
    ],
    examples: [
      'SPY - S&P 500 ETF (high liquidity)',
      'QQQ - Nasdaq ETF (tech heavy)',
      'IWM - Small cap ETF (higher volatility)'
    ]
  },
  daysToExpiration: {
    title: 'Days to Expiration (DTE)',
    description: 'Number of days until options expiration when the bot enters trades.',
    tips: [
      '30-45 DTE is common for credit strategies',
      'Shorter DTE means faster time decay',
      'Longer DTE provides more time for recovery'
    ],
    warnings: [
      'Very short DTE increases gamma risk',
      'Very long DTE reduces time decay benefits',
      'Consider liquidity at different expirations'
    ]
  },
  strikeSelection: {
    title: 'Strike Selection',
    description: 'Method for selecting option strike prices relative to the underlying price.',
    tips: [
      'Delta targeting provides consistent risk exposure',
      'Percentage OTM is easier to understand',
      'Consider implied volatility when selecting strikes'
    ],
    examples: [
      'Delta 0.15 ≈ 15% probability of being ITM',
      '10% OTM = Strike 10% away from current price',
      'Premium distance = Fixed dollar amount'
    ]
  },
  quantity: {
    title: 'Quantity',
    description: 'Number of option contracts to trade per position.',
    tips: [
      'Start small while learning (1-2 contracts)',
      'Consider account size and risk tolerance',
      'Remember: 1 contract = 100 shares of exposure'
    ],
    warnings: [
      'Large quantities increase risk',
      'Consider liquidity for position size',
      'Check margin requirements'
    ]
  },
  entryTimeWindow: {
    title: 'Entry Time Window',
    description: 'Time range during market hours when the bot can enter new trades.',
    tips: [
      'Avoid first 30 minutes (high volatility)',
      'Consider volume patterns throughout day',
      'Market close can have increased activity'
    ],
    warnings: [
      'Very narrow windows may miss opportunities',
      'Early morning can have wide spreads',
      'Consider your timezone vs market hours'
    ]
  },
  profitTarget: {
    title: 'Profit Target',
    description: 'Percentage of maximum profit at which the bot will close positions.',
    tips: [
      '25-50% is common for credit strategies',
      'Higher targets increase time in market',
      'Consider strategy type when setting target'
    ],
    examples: [
      '25% of max profit = Quick, conservative exits',
      '50% of max profit = Balanced approach',
      '75% of max profit = Aggressive, higher risk'
    ]
  },
  stopLoss: {
    title: 'Stop Loss',
    description: 'Maximum loss percentage at which the bot will close losing positions.',
    tips: [
      'Typically set at 2-3x max profit for credit spreads',
      'Consider volatility of underlying',
      'Balance between too tight and too loose'
    ],
    warnings: [
      'Too tight may cause unnecessary losses',
      'Too loose may lead to large losses',
      'Market gaps can exceed stop loss levels'
    ]
  }
}

export function HelpSystem({ field, strategy, onClose, showGuides = false }: HelpSystemProps) {
  const [activeTab, setActiveTab] = useState<'tooltip' | 'guides' | 'glossary'>('tooltip')
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const tooltipContent = field ? TOOLTIP_CONTENT[field] : null
  const strategyGuide = strategy ? STRATEGY_GUIDES.find(g => g.id === strategy) : null

  const filteredGuides = STRATEGY_GUIDES.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-400 bg-green-900/20'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/20'
      case 'Advanced': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'High': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Trading Bot Help Center</h2>
            <p className="text-gray-300">Comprehensive guides and documentation</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tooltip')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'tooltip'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            📖 Field Help
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'guides'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🎯 Strategy Guides
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'glossary'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            📚 Glossary
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Field Help Tab */}
          {activeTab === 'tooltip' && tooltipContent && (
            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{tooltipContent.title}</h3>
                <p className="text-gray-300 mb-4">{tooltipContent.description}</p>

                {tooltipContent.tips && (
                  <div className="mb-4">
                    <h4 className="font-medium text-green-400 mb-2">💡 Tips:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {tooltipContent.tips.map((tip, index) => (
                        <li key={index} className="text-gray-300 text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tooltipContent.warnings && (
                  <div className="mb-4">
                    <h4 className="font-medium text-yellow-400 mb-2">⚠️ Warnings:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {tooltipContent.warnings.map((warning, index) => (
                        <li key={index} className="text-gray-300 text-sm">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tooltipContent.examples && (
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-400 mb-2">📋 Examples:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {tooltipContent.examples.map((example, index) => (
                        <li key={index} className="text-gray-300 text-sm">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tooltipContent.relatedConcepts && (
                  <div>
                    <h4 className="font-medium text-purple-400 mb-2">🔗 Related Concepts:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tooltipContent.relatedConcepts.map((concept, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-900/20 text-purple-300 rounded-full text-sm"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Strategy Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-slate-700 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400"
                />
              </div>

              {selectedGuide ? (
                /* Detailed Strategy Guide */
                (() => {
                  const guide = STRATEGY_GUIDES.find(g => g.id === selectedGuide)!
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <button
                          onClick={() => setSelectedGuide(null)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          ← Back to Strategies
                        </button>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{guide.name}</h3>
                            <p className="text-gray-300 mb-4">{guide.overview}</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${getComplexityColor(guide.complexity)}`}>
                              {guide.complexity}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm bg-slate-600 ${getRiskColor(guide.riskLevel)}`}>
                              {guide.riskLevel} Risk
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium text-white mb-3">Strategy Legs</h4>
                            <div className="space-y-2">
                              {guide.legs.map((leg, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-600 rounded">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    leg.action === 'SELL' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                                  }`}>
                                    {leg.action}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    leg.type === 'PUT' ? 'bg-orange-900 text-orange-300' : 'bg-blue-900 text-blue-300'
                                  }`}>
                                    {leg.type}
                                  </span>
                                  <span className="text-gray-300 text-sm">{leg.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-white mb-3">Key Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-400">Max Profit:</span> <span className="text-green-400">{guide.maxProfit}</span></div>
                              <div><span className="text-gray-400">Max Loss:</span> <span className="text-red-400">{guide.maxLoss}</span></div>
                              <div><span className="text-gray-400">Breakeven:</span> <span className="text-blue-400">{guide.breakeven}</span></div>
                              <div><span className="text-gray-400">Best Market:</span> <span className="text-white">{guide.bestMarket}</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium text-green-400 mb-3">✅ Advantages</h4>
                            <ul className="space-y-1">
                              {guide.advantages.map((advantage, index) => (
                                <li key={index} className="text-gray-300 text-sm">• {advantage}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-400 mb-3">❌ Disadvantages</h4>
                            <ul className="space-y-1">
                              {guide.disadvantages.map((disadvantage, index) => (
                                <li key={index} className="text-gray-300 text-sm">• {disadvantage}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-slate-600 rounded-lg p-4">
                          <h4 className="font-medium text-white mb-3">💼 Example Trade</h4>
                          <div className="space-y-2">
                            <p className="text-gray-300"><strong>Setup:</strong> {guide.example.setup}</p>
                            <p className="text-gray-300"><strong>Outcome:</strong> {guide.example.outcome}</p>
                            <p className="text-gray-300">
                              <strong>Profit:</strong>
                              <span className={`ml-2 ${guide.example.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${guide.example.profit}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                /* Strategy List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGuides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedGuide(guide.id)}
                      className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white">{guide.name}</h3>
                        <div className="flex space-x-1">
                          <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(guide.complexity)}`}>
                            {guide.complexity}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{guide.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{guide.marketCondition}</span>
                        <span className={`${getRiskColor(guide.riskLevel)}`}>{guide.riskLevel} Risk</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Glossary Tab */}
          {activeTab === 'glossary' && (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Options Trading Glossary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-400">Delta</h4>
                      <p className="text-gray-300 text-sm">Measures how much an option's price changes for each $1 move in the underlying stock.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Theta</h4>
                      <p className="text-gray-300 text-sm">Time decay - how much an option loses value each day as expiration approaches.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Implied Volatility (IV)</h4>
                      <p className="text-gray-300 text-sm">The market's forecast of how much the underlying stock will move, reflected in option prices.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Credit Spread</h4>
                      <p className="text-gray-300 text-sm">A strategy where you receive a net credit by selling a higher premium option and buying a lower premium option.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">DTE</h4>
                      <p className="text-gray-300 text-sm">Days to Expiration - the number of days until the option expires.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-400">Gamma</h4>
                      <p className="text-gray-300 text-sm">Measures how fast delta changes. High gamma means delta changes quickly with price moves.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Vega</h4>
                      <p className="text-gray-300 text-sm">Measures how much an option's price changes with volatility changes.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Strike Price</h4>
                      <p className="text-gray-300 text-sm">The price at which an option can be exercised.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Moneyness</h4>
                      <p className="text-gray-300 text-sm">Relationship between strike price and current stock price (ITM, ATM, OTM).</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-400">Assignment</h4>
                      <p className="text-gray-300 text-sm">When an option holder exercises their right and you're obligated to fulfill the contract.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
