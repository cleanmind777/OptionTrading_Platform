import { useState, useEffect } from 'react'

interface MarketplaceBot {
  id: string
  name: string
  description: string
  author: string
  authorAvatar: string
  category: 'iron-condor' | 'credit-spread' | 'strangle' | 'butterfly' | 'custom'
  strategy: string
  symbol: string
  price: number
  isFree: boolean
  rating: number
  reviewCount: number
  downloads: number
  createdAt: string
  lastUpdated: string
  performance: {
    totalReturn: number
    winRate: number
    maxDrawdown: number
    sharpeRatio: number
    totalTrades: number
  }
  tags: string[]
  images: string[]
  isVerified: boolean
  isPremium: boolean
  isFeatured: boolean
}

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
  isVerified: boolean
  performance?: {
    return: number
    trades: number
  }
}

interface Filter {
  category: string
  priceRange: 'all' | 'free' | 'premium'
  rating: number
  sortBy: 'featured' | 'popular' | 'newest' | 'rating' | 'price'
  strategy: string
  symbol: string
}

export function BotMarketplace() {
  const [bots, setBots] = useState<MarketplaceBot[]>([])
  const [filteredBots, setFilteredBots] = useState<MarketplaceBot[]>([])
  const [selectedBot, setSelectedBot] = useState<MarketplaceBot | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filter>({
    category: 'all',
    priceRange: 'all',
    rating: 0,
    sortBy: 'featured',
    strategy: 'all',
    symbol: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMarketplaceBots()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [bots, filters, searchQuery])

  const loadMarketplaceBots = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockBots: MarketplaceBot[] = [
      {
        id: '1',
        name: 'SPY Iron Condor Master',
        description: 'High-performance iron condor strategy for SPY with adaptive delta targeting and volatility-based position sizing. Includes built-in risk management and profit-taking algorithms.',
        author: 'OptionsMaster_Pro',
        authorAvatar: '👨‍💼',
        category: 'iron-condor',
        strategy: 'Iron Condor',
        symbol: 'SPY',
        price: 49.99,
        isFree: false,
        rating: 4.8,
        reviewCount: 127,
        downloads: 1543,
        createdAt: '2024-01-15',
        lastUpdated: '2024-01-28',
        performance: {
          totalReturn: 23.5,
          winRate: 78.3,
          maxDrawdown: -4.2,
          sharpeRatio: 1.95,
          totalTrades: 234
        },
        tags: ['SPY', 'Weekly', 'High-Frequency', 'Risk-Managed'],
        images: ['chart1.png', 'chart2.png'],
        isVerified: true,
        isPremium: true,
        isFeatured: true
      },
      {
        id: '2',
        name: 'QQQ Momentum Spreads',
        description: 'Dynamic credit spread system that adapts to QQQ momentum patterns. Uses machine learning signals for entry timing and position management.',
        author: 'AlgoTrader_AI',
        authorAvatar: '🤖',
        category: 'credit-spread',
        strategy: 'Put Credit Spread',
        symbol: 'QQQ',
        price: 0,
        isFree: true,
        rating: 4.6,
        reviewCount: 89,
        downloads: 2156,
        createdAt: '2024-01-10',
        lastUpdated: '2024-01-25',
        performance: {
          totalReturn: 18.7,
          winRate: 71.5,
          maxDrawdown: -6.1,
          sharpeRatio: 1.68,
          totalTrades: 156
        },
        tags: ['QQQ', 'AI-Powered', 'Momentum', 'Free'],
        images: ['chart3.png'],
        isVerified: true,
        isPremium: false,
        isFeatured: true
      },
      {
        id: '3',
        name: 'IWM Volatility Hunter',
        description: 'Specialized small-cap volatility strategy targeting IWM with short strangles during high IV periods. Includes earnings calendar integration.',
        author: 'VolatilityKing',
        authorAvatar: '👑',
        category: 'strangle',
        strategy: 'Short Strangle',
        symbol: 'IWM',
        price: 79.99,
        isFree: false,
        rating: 4.4,
        reviewCount: 45,
        downloads: 678,
        createdAt: '2024-01-05',
        lastUpdated: '2024-01-20',
        performance: {
          totalReturn: 31.2,
          winRate: 65.8,
          maxDrawdown: -8.9,
          sharpeRatio: 1.42,
          totalTrades: 89
        },
        tags: ['IWM', 'Volatility', 'Earnings', 'Advanced'],
        images: ['chart4.png', 'chart5.png'],
        isVerified: true,
        isPremium: true,
        isFeatured: false
      },
      {
        id: '4',
        name: 'TLT Bond Butterfly',
        description: 'Long butterfly spreads on TLT optimized for range-bound bond markets. Perfect for low volatility environments with tight risk control.',
        author: 'BondWizard',
        authorAvatar: '🧙‍♂️',
        category: 'butterfly',
        strategy: 'Long Butterfly',
        symbol: 'TLT',
        price: 29.99,
        isFree: false,
        rating: 4.2,
        reviewCount: 23,
        downloads: 312,
        createdAt: '2023-12-28',
        lastUpdated: '2024-01-18',
        performance: {
          totalReturn: 12.8,
          winRate: 82.1,
          maxDrawdown: -2.3,
          sharpeRatio: 1.78,
          totalTrades: 67
        },
        tags: ['TLT', 'Bonds', 'Low-Risk', 'Conservative'],
        images: ['chart6.png'],
        isVerified: false,
        isPremium: true,
        isFeatured: false
      },
      {
        id: '5',
        name: 'Multi-Asset Diversified',
        description: 'Free community bot that trades multiple ETFs with automatic rebalancing. Great for beginners learning options trading.',
        author: 'CommunityTrader',
        authorAvatar: '👥',
        category: 'custom',
        strategy: 'Multi-Strategy',
        symbol: 'Multiple',
        price: 0,
        isFree: true,
        rating: 4.0,
        reviewCount: 156,
        downloads: 3421,
        createdAt: '2023-12-15',
        lastUpdated: '2024-01-22',
        performance: {
          totalReturn: 15.4,
          winRate: 69.3,
          maxDrawdown: -5.7,
          sharpeRatio: 1.33,
          totalTrades: 445
        },
        tags: ['Multi-Asset', 'Beginner', 'Diversified', 'Free'],
        images: ['chart7.png', 'chart8.png'],
        isVerified: false,
        isPremium: false,
        isFeatured: true
      }
    ]

    setBots(mockBots)
    setIsLoading(false)
  }

  const loadReviews = (botId: string) => {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: '1',
        userName: 'ProTrader99',
        userAvatar: '⭐',
        rating: 5,
        comment: 'Excellent bot! Consistent returns and great risk management. Has been running smoothly for 3 months.',
        createdAt: '2024-01-25',
        isVerified: true,
        performance: {
          return: 18.5,
          trades: 47
        }
      },
      {
        id: '2',
        userId: '2',
        userName: 'OptionsLearner',
        userAvatar: '📚',
        rating: 4,
        comment: 'Good strategy but requires some tweaking for my risk tolerance. Documentation could be better.',
        createdAt: '2024-01-20',
        isVerified: false,
        performance: {
          return: 12.3,
          trades: 23
        }
      },
      {
        id: '3',
        userId: '3',
        userName: 'MarketMaker2024',
        userAvatar: '💼',
        rating: 5,
        comment: 'Outstanding performance during volatile markets. The adaptive features really work well.',
        createdAt: '2024-01-18',
        isVerified: true,
        performance: {
          return: 25.7,
          trades: 89
        }
      }
    ]
    setReviews(mockReviews)
  }

  const applyFilters = () => {
    let filtered = [...bots]

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(bot =>
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(bot => bot.category === filters.category)
    }

    // Price filter
    if (filters.priceRange === 'free') {
      filtered = filtered.filter(bot => bot.isFree)
    } else if (filters.priceRange === 'premium') {
      filtered = filtered.filter(bot => !bot.isFree)
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(bot => bot.rating >= filters.rating)
    }

    // Symbol filter
    if (filters.symbol !== 'all') {
      filtered = filtered.filter(bot => bot.symbol === filters.symbol)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'featured':
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return b.rating - a.rating
        case 'popular':
          return b.downloads - a.downloads
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return a.price - b.price
        default:
          return 0
      }
    })

    setFilteredBots(filtered)
  }

  const handleBotSelect = (bot: MarketplaceBot) => {
    setSelectedBot(bot)
    loadReviews(bot.id)
  }

  const handleDownload = (bot: MarketplaceBot) => {
    // In real app, this would handle purchase/download logic
    alert(`${bot.isFree ? 'Downloaded' : 'Purchased'} "${bot.name}" successfully!`)
    setBots(prev => prev.map(b =>
      b.id === bot.id ? { ...b, downloads: b.downloads + 1 } : b
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'iron-condor': return '🔷'
      case 'credit-spread': return '📊'
      case 'strangle': return '🎯'
      case 'butterfly': return '🦋'
      default: return '⚙️'
    }
  }

  const getStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 !== 0 ? '⭐' : '')
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bot Marketplace</h1>
          <p className="text-gray-300">Discover, share, and download trading bot strategies from the community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search bots, strategies, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
            >
              🔧 Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-600">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="iron-condor">Iron Condor</option>
                <option value="credit-spread">Credit Spreads</option>
                <option value="strangle">Strangles</option>
                <option value="butterfly">Butterflies</option>
                <option value="custom">Custom</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value as any }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="premium">Premium Only</option>
              </select>

              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="0">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>

              <select
                value={filters.symbol}
                onChange={(e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="all">All Symbols</option>
                <option value="SPY">SPY</option>
                <option value="QQQ">QQQ</option>
                <option value="IWM">IWM</option>
                <option value="TLT">TLT</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-300">Loading marketplace bots...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.map((bot) => (
              <div
                key={bot.id}
                className={`bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors cursor-pointer ${
                  bot.isFeatured ? 'ring-2 ring-blue-500/20' : ''
                }`}
                onClick={() => handleBotSelect(bot)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(bot.category)}</span>
                    <div>
                      <h3 className="font-bold text-white">{bot.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-400">by {bot.author}</span>
                        {bot.isVerified && <span className="text-blue-400">✓</span>}
                      </div>
                    </div>
                  </div>
                  {bot.isFeatured && (
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-slate-700 rounded">
                    <div className="text-green-400 font-medium">+{bot.performance.totalReturn}%</div>
                    <div className="text-gray-400">Return</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700 rounded">
                    <div className="text-blue-400 font-medium">{bot.performance.winRate}%</div>
                    <div className="text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700 rounded">
                    <div className="text-purple-400 font-medium">{bot.performance.sharpeRatio}</div>
                    <div className="text-gray-400">Sharpe</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700 rounded">
                    <div className="text-orange-400 font-medium">{bot.performance.totalTrades}</div>
                    <div className="text-gray-400">Trades</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{bot.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {bot.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {bot.tags.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{bot.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">{getStars(bot.rating)}</span>
                      <span className="text-sm text-gray-400">({bot.reviewCount})</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {bot.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                  <div className="text-right">
                    {bot.isFree ? (
                      <div className="text-green-400 font-medium">FREE</div>
                    ) : (
                      <div className="text-white font-medium">${bot.price}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bot Details Modal */}
        {selectedBot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedBot.name}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">by {selectedBot.author}</span>
                    {selectedBot.isVerified && <span className="text-blue-400">✓ Verified</span>}
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">{getStars(selectedBot.rating)}</span>
                      <span className="text-gray-400">({selectedBot.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-white mb-3">Description</h3>
                    <p className="text-gray-300">{selectedBot.description}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-green-400">+{selectedBot.performance.totalReturn}%</div>
                        <div className="text-gray-400">Total Return</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-blue-400">{selectedBot.performance.winRate}%</div>
                        <div className="text-gray-400">Win Rate</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-red-400">{selectedBot.performance.maxDrawdown}%</div>
                        <div className="text-gray-400">Max Drawdown</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-purple-400">{selectedBot.performance.sharpeRatio}</div>
                        <div className="text-gray-400">Sharpe Ratio</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-orange-400">{selectedBot.performance.totalTrades}</div>
                        <div className="text-gray-400">Total Trades</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBot.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-700 text-gray-300 px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-3">Reviews</h3>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-slate-700 p-4 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{review.userAvatar}</span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-white">{review.userName}</span>
                                  {review.isVerified && <span className="text-blue-400 text-sm">✓</span>}
                                </div>
                                <div className="text-yellow-400">{getStars(review.rating)}</div>
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">{review.createdAt}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{review.comment}</p>
                          {review.performance && (
                            <div className="flex space-x-4 text-sm">
                              <span className="text-green-400">Return: +{review.performance.return}%</span>
                              <span className="text-blue-400">Trades: {review.performance.trades}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-slate-700 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      {selectedBot.isFree ? (
                        <div className="text-3xl font-bold text-green-400">FREE</div>
                      ) : (
                        <div className="text-3xl font-bold text-white">${selectedBot.price}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDownload(selectedBot)}
                      className={`w-full py-3 rounded font-medium transition-colors ${
                        selectedBot.isFree
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {selectedBot.isFree ? '📥 Download Free' : '💳 Purchase & Download'}
                    </button>
                  </div>

                  <div className="bg-slate-700 p-4 rounded">
                    <h4 className="font-medium text-white mb-3">Bot Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strategy:</span>
                        <span className="text-white">{selectedBot.strategy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Symbol:</span>
                        <span className="text-white">{selectedBot.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Downloads:</span>
                        <span className="text-white">{selectedBot.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{selectedBot.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Updated:</span>
                        <span className="text-white">{selectedBot.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredBots.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🤖</div>
            <h3 className="text-xl text-white mb-2">No bots found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
