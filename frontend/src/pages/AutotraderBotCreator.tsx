import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface BotConfig {
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
  legs: {
    strikeTarget: string
    optionType: 'PUT' | 'CALL'
    longOrShort: 'LONG' | 'SHORT'
    sizeRatio: number
    daysToExpiration: number
    conflictResolution: string
  }[]

  // Trade Entry
  entryBy: 'PRICE/CHART' | 'LIVE TRADE' | string
  positionSizing: string
  quantity: number
  includeCrypto: boolean
  autoSizeDown: boolean
  entryTimeWindow: {
    start: string
    end: string
  }
  daysOfWeek: string[]
  openNewPosition: boolean
  entrySpeed: string
  sequentialEntryDelay: number

  // Trade Exit
  timedExit: boolean
  exitTime: string
  profitTargetType: string
  disableProfitAfterStop: boolean

  // Trade Stop
  stopLossType: string
  trailingStops: string

  // Trade Conditions
  entryFilters: boolean
  maxTradesPerDay: number
  maxConcurrentTrades: number
  minPriceToEnter: number
  maxPriceToEnter: number
  checkClosingsBefore: boolean
  onlyCreditOrDebit: 'ANY' | 'CREDIT' | 'DEBIT'
  openingQuote: boolean

  // Bot Dependencies
  enableBotDependencies: boolean

  // Bot Notes
  notes: string

  // Webhook Remote Control
  webhooksEnabled: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface BotTemplate {
  id: string
  name: string
  description: string
  config: BotConfig
  createdAt: string
  author: string
  category: string
  downloads: number
  rating: number
}

interface SimulationResult {
  isValid: boolean
  profitLoss: number
  winRate: number
  maxDrawdown: number
  trades: number
  warnings: string[]
  errors: string[]
}

export function AutotraderBotCreator() {
  const [config, setConfig] = useState<BotConfig>({
    botName: '',
    tradingAccount: '',
    strategyAssignment: '',
    botStatus: 'ENABLED',
    underlyingSymbol: '',
    tradeType: '',
    numLegs: 'One',
    amExpansions: '',
    sellBefore: '',
    efficientSpreads: '',
    legs: [{
      strikeTarget: '',
      optionType: 'PUT',
      longOrShort: 'LONG',
      sizeRatio: 1,
      daysToExpiration: 45,
      conflictResolution: ''
    }],
    entryBy: 'PRICE/CHART',
    positionSizing: '',
    quantity: 1,
    includeCrypto: false,
    autoSizeDown: false,
    entryTimeWindow: {
      start: '09:30',
      end: '15:00'
    },
    daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    openNewPosition: false,
    entrySpeed: '',
    sequentialEntryDelay: 0,
    timedExit: false,
    exitTime: '',
    profitTargetType: '',
    disableProfitAfterStop: false,
    stopLossType: '',
    trailingStops: '',
    entryFilters: false,
    maxTradesPerDay: 1,
    maxConcurrentTrades: 1,
    minPriceToEnter: 0,
    maxPriceToEnter: 0,
    checkClosingsBefore: false,
    onlyCreditOrDebit: 'ANY',
    openingQuote: false,
    enableBotDependencies: false,
    notes: '',
    webhooksEnabled: false
  })

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [templates, setTemplates] = useState<BotTemplate[]>([])
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSimulationModal, setShowSimulationModal] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [importData, setImportData] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved templates on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('botTemplates')
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
  }, [])

  const updateConfig = (field: keyof BotConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    // Real-time validation
    validateField(field, value)
  }

  // Real-time field validation
  const validateField = (field: keyof BotConfig, value: any) => {
    const newErrors = validationErrors.filter(error => error.field !== field)

    switch (field) {
      case 'botName':
        if (!value.trim()) {
          newErrors.push({ field, message: 'Bot name is required' })
        } else if (value.length < 3) {
          newErrors.push({ field, message: 'Bot name must be at least 3 characters' })
        }
        break
      case 'tradingAccount':
        if (!value) {
          newErrors.push({ field, message: 'Trading account selection is required' })
        }
        break
      case 'strategyAssignment':
        if (!value) {
          newErrors.push({ field, message: 'Strategy assignment is required' })
        }
        break
      case 'underlyingSymbol':
        if (!value) {
          newErrors.push({ field, message: 'Underlying symbol is required' })
        }
        break
      case 'quantity':
        if (value < 1) {
          newErrors.push({ field, message: 'Quantity must be at least 1' })
        } else if (value > 100) {
          newErrors.push({ field, message: 'Quantity cannot exceed 100 for safety' })
        }
        break
      case 'maxTradesPerDay':
        if (value < 1) {
          newErrors.push({ field, message: 'Must allow at least 1 trade per day' })
        } else if (value > 10) {
          newErrors.push({ field, message: 'Maximum 10 trades per day recommended' })
        }
        break
    }

    setValidationErrors(newErrors)
  }

  // Comprehensive form validation
  const validateForm = (): boolean => {
    const errors: ValidationError[] = []

    // Required fields validation
    if (!config.botName.trim()) errors.push({ field: 'botName', message: 'Bot name is required' })
    if (!config.tradingAccount) errors.push({ field: 'tradingAccount', message: 'Trading account is required' })
    if (!config.strategyAssignment) errors.push({ field: 'strategyAssignment', message: 'Strategy assignment is required' })
    if (!config.underlyingSymbol) errors.push({ field: 'underlyingSymbol', message: 'Underlying symbol is required' })

    // Business logic validation
    if (config.quantity < 1) errors.push({ field: 'quantity', message: 'Quantity must be positive' })
    if (config.maxTradesPerDay < 1) errors.push({ field: 'maxTradesPerDay', message: 'Must allow at least 1 trade per day' })

    // Time validation
    if (config.entryTimeWindow.start >= config.entryTimeWindow.end) {
      errors.push({ field: 'entryTimeWindow', message: 'Start time must be before end time' })
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  // Template management
  const saveAsTemplate = async () => {
    if (!templateName.trim()) return

    setIsSavingTemplate(true)

    const newTemplate: BotTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      config: { ...config },
      createdAt: new Date().toISOString(),
      author: 'Current User',
      category: config.strategyAssignment || 'Custom',
      downloads: 0,
      rating: 5.0
    }

    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)
    localStorage.setItem('botTemplates', JSON.stringify(updatedTemplates))

    setTimeout(() => {
      setIsSavingTemplate(false)
      setShowTemplateModal(false)
      setTemplateName('')
      setTemplateDescription('')
    }, 1000)
  }

  const loadTemplate = (template: BotTemplate) => {
    setConfig(template.config)
    setShowTemplateModal(false)
  }

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(updatedTemplates)
    localStorage.setItem('botTemplates', JSON.stringify(updatedTemplates))
  }

  // Import/Export functionality
  const exportConfiguration = () => {
    const exportData = {
      config,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `bot-config-${config.botName || 'unnamed'}-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    setShowExportModal(false)
  }

  const importConfiguration = () => {
    try {
      const parsedData = JSON.parse(importData)
      if (parsedData.config) {
        setConfig(parsedData.config)
        setShowImportModal(false)
        setImportData('')
      } else {
        alert('Invalid configuration file format')
      }
    } catch (error) {
      alert('Error parsing configuration file')
    }
  }

  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setImportData(content)
      }
      reader.readAsText(file)
    }
  }

  // Bot simulation
  const runSimulation = async () => {
    if (!validateForm()) {
      alert('Please fix validation errors before running simulation')
      return
    }

    setIsSimulating(true)
    setShowSimulationModal(true)

    // Simulate API call for backtesting
    setTimeout(() => {
      const mockResult: SimulationResult = {
        isValid: Math.random() > 0.2,
        profitLoss: (Math.random() - 0.5) * 10000,
        winRate: Math.random() * 100,
        maxDrawdown: Math.random() * 5000,
        trades: Math.floor(Math.random() * 100) + 10,
        warnings: [
          'High volatility detected in selected timeframe',
          'Limited liquidity for selected strikes'
        ],
        errors: Math.random() > 0.7 ? ['Insufficient margin for position size'] : []
      }

      setSimulationResult(mockResult)
      setIsSimulating(false)
    }, 3000)
  }

  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field)?.message
  }

  const hasFieldError = (field: string) => {
    return validationErrors.some(error => error.field === field)
  }

  const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false }: {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'purple'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    onClick?: () => void
    disabled?: boolean
  }) => {
    const baseClasses = 'font-medium transition-colors rounded'
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white'
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {children}
      </button>
    )
  }

  const Tooltip = ({ content, field }: { content: string; field: string }) => (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(field)}
        onMouseLeave={() => setShowTooltip(null)}
        className="ml-1 text-blue-400 hover:text-blue-300"
      >
        ⓘ
      </button>
      {showTooltip === field && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 border border-gray-700">
          {content}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Action Buttons */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Create Autotrader Bot</h1>
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="secondary" onClick={() => setShowTemplateModal(true)}>
              📋 Templates
            </Button>
            <Button variant="secondary" onClick={() => setShowImportModal(true)}>
              📥 Import
            </Button>
            <Button variant="secondary" onClick={() => setShowExportModal(true)}>
              📤 Export
            </Button>
            <Button variant="warning" onClick={runSimulation}>
              🧪 Test & Simulate
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Bot Identification */}
          <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Bot Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Name
                  <Tooltip
                    content="Give your bot a unique, descriptive name. This will help you identify it in your bot list and trading logs."
                    field="botName"
                  />
                </label>
                <input
                  type="text"
                  value={config.botName}
                  onChange={(e) => updateConfig('botName', e.target.value)}
                  placeholder="e.g., SPY Iron Condor Weekly"
                  className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm placeholder-gray-500 ${
                    hasFieldError('botName') ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                {hasFieldError('botName') && (
                  <p className="text-red-400 text-xs mt-1">{getFieldError('botName')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trading Account
                  <Tooltip
                    content="Select which trading account this bot should use. Ensure the account has sufficient funds and permissions for options trading."
                    field="tradingAccount"
                  />
                </label>
                <select
                  value={config.tradingAccount}
                  onChange={(e) => updateConfig('tradingAccount', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm ${
                    hasFieldError('tradingAccount') ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select account...</option>
                  <option value="main">Main Trading Account ($125,430)</option>
                  <option value="paper">Paper Trading Account ($100,000)</option>
                  <option value="ira">IRA Account ($89,250)</option>
                </select>
                {hasFieldError('tradingAccount') && (
                  <p className="text-red-400 text-xs mt-1">{getFieldError('tradingAccount')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strategy Assignment
                  <Tooltip
                    content="Choose the base strategy template this bot will execute. Each strategy has different risk/reward characteristics."
                    field="strategyAssignment"
                  />
                </label>
                <select
                  value={config.strategyAssignment}
                  onChange={(e) => updateConfig('strategyAssignment', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm ${
                    hasFieldError('strategyAssignment') ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select Strategy</option>
                  <option value="iron-condor">Iron Condor</option>
                  <option value="put-credit-spread">Put Credit Spread</option>
                  <option value="call-credit-spread">Call Credit Spread</option>
                  <option value="short-strangle">Short Strangle</option>
                </select>
                {hasFieldError('strategyAssignment') && (
                  <p className="text-red-400 text-xs mt-1">{getFieldError('strategyAssignment')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bot Status</label>
                <div className="flex gap-2">
                  <Button
                    variant={config.botStatus === 'ENABLED' ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => updateConfig('botStatus', 'ENABLED')}
                  >
                    ENABLED
                  </Button>
                  <Button
                    variant={config.botStatus === 'DISABLED' ? 'danger' : 'secondary'}
                    size="sm"
                    onClick={() => updateConfig('botStatus', 'DISABLED')}
                  >
                    DISABLED
                  </Button>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => validateForm()}>
                    📄 CREATE
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => setShowTemplateModal(true)}>
                    💾 SAVE TEMPLATE
                  </Button>
                  <Button variant="danger" size="sm">
                    ❌ CANCEL
                  </Button>
                  <Button variant="purple" size="sm" onClick={runSimulation}>
                    📊 TEST RUN
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Strategy */}
          <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Trading Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Underlying Symbol
                  <Tooltip
                    content="The stock or ETF symbol this bot will trade options on. Popular choices include SPY, QQQ, and IWM."
                    field="underlyingSymbol"
                  />
                </label>
                <select
                  value={config.underlyingSymbol}
                  onChange={(e) => updateConfig('underlyingSymbol', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm ${
                    hasFieldError('underlyingSymbol') ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select symbol</option>
                  <option value="SPY">SPY - SPDR S&P 500 ETF</option>
                  <option value="QQQ">QQQ - Invesco QQQ Trust</option>
                  <option value="IWM">IWM - iShares Russell 2000 ETF</option>
                  <option value="TLT">TLT - iShares 20+ Year Treasury</option>
                </select>
                {hasFieldError('underlyingSymbol') && (
                  <p className="text-red-400 text-xs mt-1">{getFieldError('underlyingSymbol')}</p>
                )}
              </div>

              {/* Continue with other fields... */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trade Type
                  <Tooltip
                    content="The specific options strategy structure. Different types have varying complexity and risk profiles."
                    field="tradeType"
                  />
                </label>
                <select
                  value={config.tradeType}
                  onChange={(e) => updateConfig('tradeType', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                >
                  <option value="">Select Trade Type</option>
                  <option value="vertical">Vertical Spread</option>
                  <option value="iron-condor">Iron Condor</option>
                  <option value="butterfly">Butterfly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                  <Tooltip
                    content="Number of contracts to trade. Start small while learning. Each contract represents 100 shares."
                    field="quantity"
                  />
                </label>
                <input
                  type="number"
                  value={config.quantity}
                  onChange={(e) => updateConfig('quantity', Number.parseInt(e.target.value) || 1)}
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm ${
                    hasFieldError('quantity') ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                {hasFieldError('quantity') && (
                  <p className="text-red-400 text-xs mt-1">{getFieldError('quantity')}</p>
                )}
              </div>

              {/* Add remaining fields with similar validation structure... */}
            </div>
          </div>

          {/* Validation Summary */}
          {validationErrors.length > 0 && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4">
              <h3 className="font-bold text-red-200 mb-2">Configuration Issues:</h3>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-300 text-sm">{error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Bot Templates</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                <h3 className="font-medium text-white mb-3">Save Current Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Template name..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description..."
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                </div>
                <Button
                  onClick={saveAsTemplate}
                  disabled={!templateName.trim() || isSavingTemplate}
                  variant="success"
                >
                  {isSavingTemplate ? 'Saving...' : '💾 Save Template'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{template.category}</span>
                      <Button size="sm" onClick={() => loadTemplate(template)}>
                        Load
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Import Configuration</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    📁 Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={importFromFile}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Or paste configuration JSON:
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your bot configuration here..."
                    rows={10}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={importConfiguration} disabled={!importData.trim()}>
                    📥 Import
                  </Button>
                  <Button variant="secondary" onClick={() => setShowImportModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Export Configuration</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">
                  Export your current bot configuration as a JSON file that can be shared
                  with other users or imported later as a backup.
                </p>

                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Configuration Summary:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Bot Name: {config.botName || 'Unnamed'}</li>
                    <li>• Strategy: {config.strategyAssignment || 'Not selected'}</li>
                    <li>• Symbol: {config.underlyingSymbol || 'Not selected'}</li>
                    <li>• Status: {config.botStatus}</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button onClick={exportConfiguration}>
                    📤 Download JSON
                  </Button>
                  <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Modal */}
        {showSimulationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Bot Simulation Results</h2>
                <button
                  onClick={() => setShowSimulationModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {isSimulating ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Running simulation against historical data...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
                </div>
              ) : simulationResult && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${simulationResult.isValid ? 'bg-green-900 border border-green-700' : 'bg-red-900 border border-red-700'}`}>
                    <h3 className="font-bold text-white mb-2">
                      {simulationResult.isValid ? '✅ Configuration Valid' : '❌ Configuration Issues Found'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-700 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        ${simulationResult.profitLoss.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-400">Total P&L</div>
                    </div>

                    <div className="p-4 bg-slate-700 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {simulationResult.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>

                    <div className="p-4 bg-slate-700 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        ${simulationResult.maxDrawdown.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-400">Max Drawdown</div>
                    </div>

                    <div className="p-4 bg-slate-700 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {simulationResult.trades}
                      </div>
                      <div className="text-sm text-gray-400">Total Trades</div>
                    </div>
                  </div>

                  {simulationResult.warnings.length > 0 && (
                    <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                      <h4 className="font-medium text-yellow-200 mb-2">⚠️ Warnings:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {simulationResult.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-300 text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {simulationResult.errors.length > 0 && (
                    <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                      <h4 className="font-medium text-red-200 mb-2">❌ Errors:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {simulationResult.errors.map((error, index) => (
                          <li key={index} className="text-red-300 text-sm">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
