import { useState, useEffect } from 'react'

interface BotTemplate {
  id: string
  name: string
  description: string
  category: 'Iron Condor' | 'Credit Spread' | 'Strangle' | 'Butterfly' | 'Custom'
  author: string
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  lastModified: string
  downloads: number
  rating: number
  reviewCount: number
  tags: string[]
  config: BotConfiguration
  performance?: {
    backtestReturn: number
    winRate: number
    maxDrawdown: number
    sharpeRatio: number
    totalTrades: number
  }
  image?: string
}

interface BotConfiguration {
  // Bot Identification
  botName: string
  tradingAccount: string
  strategyAssignment: string
  botStatus: 'ENABLED' | 'DISABLED'

  // Trading Strategy
  underlyingSymbol: string
  tradeType: string
  numLegs: string
  amExpansions: string
  sellBefore: string
  efficientSpreads: string

  // Position Legs
  legs: Array<{
    strikeTarget: string
    optionType: 'PUT' | 'CALL'
    longOrShort: 'LONG' | 'SHORT'
    sizeRatio: number
    daysToExpiration: number
    conflictResolution: string
  }>

  // Trade Entry & Exit Settings
  entryBy: string
  positionSizing: string
  quantity: number
  includeCrypto: boolean
  autoSizeDown: boolean
  entryTimeWindow: { start: string; end: string }
  daysOfWeek: string[]
  profitTarget: number
  stopLoss: number
  maxTradesPerDay: number
  notes: string
}

interface BotTemplateSystemProps {
  onLoadTemplate: (config: BotConfiguration) => void
  currentConfig?: BotConfiguration
  onClose: () => void
}

export function BotTemplateSystem({ onLoadTemplate, currentConfig, onClose }: BotTemplateSystemProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'save' | 'my-templates'>('browse')
  const [templates, setTemplates] = useState<BotTemplate[]>([])
  const [myTemplates, setMyTemplates] = useState<BotTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)

  // Save template form state
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCategory, setTemplateCategory] = useState<BotTemplate['category']>('Custom')
  const [templateTags, setTemplateTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)

    // Simulate API call - load from localStorage and mock data
    await new Promise(resolve => setTimeout(resolve, 1000))

    const savedTemplates = localStorage.getItem('botTemplates')
    const userTemplates = savedTemplates ? JSON.parse(savedTemplates) : []

    const mockPublicTemplates: BotTemplate[] = [
      {
        id: 'template_1',
        name: 'SPY Weekly Iron Condor',
        description: 'Conservative iron condor strategy for SPY with 45 DTE targeting 0.15 delta on short strikes. Designed for consistent income generation in low volatility environments.',
        category: 'Iron Condor',
        author: 'TradeBot_Pro',
        isPublic: true,
        isFeatured: true,
        createdAt: '2024-01-15',
        lastModified: '2024-01-28',
        downloads: 1247,
        rating: 4.8,
        reviewCount: 89,
        tags: ['SPY', 'Weekly', 'Conservative', 'Income'],
        config: {
          botName: 'SPY_Weekly_IC',
          tradingAccount: '',
          strategyAssignment: 'iron-condor',
          botStatus: 'ENABLED',
          underlyingSymbol: 'SPY',
          tradeType: 'iron-condor',
          numLegs: 'Four',
          amExpansions: 'ENABLED',
          sellBefore: 'ENABLED',
          efficientSpreads: 'ENABLED',
          legs: [
            {
              strikeTarget: 'delta',
              optionType: 'PUT',
              longOrShort: 'SHORT',
              sizeRatio: 1,
              daysToExpiration: 45,
              conflictResolution: 'LONGEST'
            }
          ],
          entryBy: 'PRICE/CHART',
          positionSizing: 'ENABLED',
          quantity: 1,
          includeCrypto: false,
          autoSizeDown: true,
          entryTimeWindow: { start: '10:00', end: '14:00' },
          daysOfWeek: ['MON', 'TUE', 'WED', 'THU'],
          profitTarget: 25,
          stopLoss: 200,
          maxTradesPerDay: 1,
          notes: 'Weekly iron condor on SPY targeting 25% profit with 2x stop loss'
        },
        performance: {
          backtestReturn: 18.5,
          winRate: 73.2,
          maxDrawdown: -4.8,
          sharpeRatio: 1.85,
          totalTrades: 156
        }
      },
      {
        id: 'template_2',
        name: 'QQQ Put Credit Spread',
        description: 'Bullish put credit spread strategy on QQQ with mechanical rules for entry and exit. Perfect for trending markets with moderate volatility.',
        category: 'Credit Spread',
        author: 'OptionsAlgo',
        isPublic: true,
        isFeatured: true,
        createdAt: '2024-01-10',
        lastModified: '2024-01-25',
        downloads: 856,
        rating: 4.6,
        reviewCount: 67,
        tags: ['QQQ', 'Bullish', 'Credit Spread', 'Trending'],
        config: {
          botName: 'QQQ_Put_Credit',
          tradingAccount: '',
          strategyAssignment: 'put-credit-spread',
          botStatus: 'ENABLED',
          underlyingSymbol: 'QQQ',
          tradeType: 'vertical',
          numLegs: 'Two',
          amExpansions: 'DISABLED',
          sellBefore: 'ENABLED',
          efficientSpreads: 'ENABLED',
          legs: [
            {
              strikeTarget: 'delta',
              optionType: 'PUT',
              longOrShort: 'SHORT',
              sizeRatio: 1,
              daysToExpiration: 30,
              conflictResolution: 'LONGEST'
            }
          ],
          entryBy: 'PRICE/CHART',
          positionSizing: 'ENABLED',
          quantity: 2,
          includeCrypto: false,
          autoSizeDown: true,
          entryTimeWindow: { start: '09:45', end: '15:30' },
          daysOfWeek: ['TUE', 'WED', 'THU'],
          profitTarget: 50,
          stopLoss: 150,
          maxTradesPerDay: 2,
          notes: 'Put credit spreads on QQQ during uptrends'
        },
        performance: {
          backtestReturn: 22.1,
          winRate: 68.9,
          maxDrawdown: -6.2,
          sharpeRatio: 1.92,
          totalTrades: 89
        }
      },
      {
        id: 'template_3',
        name: 'IWM High IV Strangle',
        description: 'Short strangle strategy targeting high implied volatility periods on IWM. Designed for range-bound markets with volatility mean reversion.',
        category: 'Strangle',
        author: 'VolTrader',
        isPublic: true,
        isFeatured: false,
        createdAt: '2024-01-05',
        lastModified: '2024-01-20',
        downloads: 423,
        rating: 4.2,
        reviewCount: 34,
        tags: ['IWM', 'High IV', 'Strangle', 'Mean Reversion'],
        config: {
          botName: 'IWM_Short_Strangle',
          tradingAccount: '',
          strategyAssignment: 'short-strangle',
          botStatus: 'ENABLED',
          underlyingSymbol: 'IWM',
          tradeType: 'strangle',
          numLegs: 'Two',
          amExpansions: 'ENABLED',
          sellBefore: 'DISABLED',
          efficientSpreads: 'DISABLED',
          legs: [
            {
              strikeTarget: 'delta',
              optionType: 'PUT',
              longOrShort: 'SHORT',
              sizeRatio: 1,
              daysToExpiration: 21,
              conflictResolution: 'LONGEST'
            }
          ],
          entryBy: 'LIVE TRADE',
          positionSizing: 'ADVANCED',
          quantity: 1,
          includeCrypto: false,
          autoSizeDown: false,
          entryTimeWindow: { start: '10:00', end: '14:00' },
          daysOfWeek: ['MON', 'WED', 'FRI'],
          profitTarget: 30,
          stopLoss: 300,
          maxTradesPerDay: 1,
          notes: 'High IV short strangles on IWM with volatility filters'
        },
        performance: {
          backtestReturn: 15.7,
          winRate: 61.3,
          maxDrawdown: -8.9,
          sharpeRatio: 1.34,
          totalTrades: 67
        }
      }
    ]

    setTemplates(mockPublicTemplates)
    setMyTemplates(userTemplates)
    setIsLoading(false)
  }

  const saveTemplate = async () => {
    if (!currentConfig || !templateName.trim()) return

    setIsSaving(true)

    const newTemplate: BotTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      author: 'Current User',
      isPublic,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      downloads: 0,
      rating: 5.0,
      reviewCount: 0,
      tags: templateTags,
      config: { ...currentConfig }
    }

    // Save to localStorage (in real app, would save to API)
    const updatedTemplates = [...myTemplates, newTemplate]
    setMyTemplates(updatedTemplates)
    localStorage.setItem('botTemplates', JSON.stringify(updatedTemplates))

    // Reset form
    setTemplateName('')
    setTemplateDescription('')
    setTemplateCategory('Custom')
    setTemplateTags([])
    setIsPublic(false)

    setTimeout(() => {
      setIsSaving(false)
      setActiveTab('my-templates')
    }, 1000)
  }

  const loadTemplate = (template: BotTemplate) => {
    onLoadTemplate(template.config)
    onClose()
  }

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = myTemplates.filter(t => t.id !== templateId)
    setMyTemplates(updatedTemplates)
    localStorage.setItem('botTemplates', JSON.stringify(updatedTemplates))
  }

  const addTag = () => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove))
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Iron Condor', 'Credit Spread', 'Strangle', 'Butterfly', 'Custom']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Bot Template Library</h2>
            <p className="text-gray-300">Save, share, and discover trading bot configurations</p>
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
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🌐 Browse Templates
          </button>
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'save'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            disabled={!currentConfig}
          >
            💾 Save Template
          </button>
          <button
            onClick={() => setActiveTab('my-templates')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === 'my-templates'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            📁 My Templates ({myTemplates.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Browse Templates Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                  <p className="text-gray-300">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors ${
                        template.isFeatured ? 'ring-2 ring-blue-500/20' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {/* Template Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate">{template.name}</h3>
                          <p className="text-sm text-gray-400">by {template.author}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {template.isFeatured && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                          <div className="text-xs text-yellow-400">
                            ⭐ {template.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      {/* Template Description */}
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Performance Metrics */}
                      {template.performance && (
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div>
                            <span className="text-gray-400">Return:</span>
                            <span className="text-green-400 ml-1">+{template.performance.backtestReturn}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Win Rate:</span>
                            <span className="text-blue-400 ml-1">{template.performance.winRate}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Sharpe:</span>
                            <span className="text-purple-400 ml-1">{template.performance.sharpeRatio}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Trades:</span>
                            <span className="text-white ml-1">{template.performance.totalTrades}</span>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-600 text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{template.downloads} downloads</span>
                        <span>{template.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredTemplates.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🔍</div>
                  <h3 className="text-xl text-white mb-2">No templates found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {/* Save Template Tab */}
          {activeTab === 'save' && (
            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Save Current Configuration as Template</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Template Name *</label>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., SPY Weekly Iron Condor"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value as BotTemplate['category'])}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                      >
                        <option value="Iron Condor">Iron Condor</option>
                        <option value="Credit Spread">Credit Spread</option>
                        <option value="Strangle">Strangle</option>
                        <option value="Butterfly">Butterfly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="Describe this strategy and when to use it..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {templateTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400"
                      />
                      <button
                        onClick={addTag}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded bg-slate-600 border-slate-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-300">
                      Share this template publicly (others can discover and use it)
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveTemplate}
                      disabled={!templateName.trim() || isSaving}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded transition-colors flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          <span>Save Template</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Templates Tab */}
          {activeTab === 'my-templates' && (
            <div className="space-y-6">
              {myTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📁</div>
                  <h3 className="text-xl text-white mb-2">No saved templates</h3>
                  <p className="text-gray-400">Save your first bot configuration to get started</p>
                  <button
                    onClick={() => setActiveTab('save')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                    disabled={!currentConfig}
                  >
                    Save Current Config
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-white">{template.name}</h3>
                          <p className="text-sm text-gray-400">{template.category}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => loadTemplate(template)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 mb-3">{template.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-600 text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs text-gray-400">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedTemplate.name}</h2>
                  <p className="text-gray-300">by {selectedTemplate.author}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-300">{selectedTemplate.description}</p>

                {selectedTemplate.performance && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">Backtest Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          +{selectedTemplate.performance.backtestReturn}%
                        </div>
                        <div className="text-xs text-gray-400">Total Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          {selectedTemplate.performance.winRate}%
                        </div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">
                          {selectedTemplate.performance.maxDrawdown}%
                        </div>
                        <div className="text-xs text-gray-400">Max Drawdown</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {selectedTemplate.performance.sharpeRatio}
                        </div>
                        <div className="text-xs text-gray-400">Sharpe Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {selectedTemplate.performance.totalTrades}
                        </div>
                        <div className="text-xs text-gray-400">Total Trades</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Configuration Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Symbol:</span>
                      <span className="text-white ml-2">{selectedTemplate.config.underlyingSymbol}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Strategy:</span>
                      <span className="text-white ml-2">{selectedTemplate.config.strategyAssignment}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Profit Target:</span>
                      <span className="text-green-400 ml-2">{selectedTemplate.config.profitTarget}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Stop Loss:</span>
                      <span className="text-red-400 ml-2">{selectedTemplate.config.stopLoss}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => loadTemplate(selectedTemplate)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    Load Template
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

export default BotTemplateSystem
