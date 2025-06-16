import { useState, useEffect } from 'react'

export interface BrokerAccount {
  id: string
  name: string
  broker: 'TD_AMERITRADE' | 'SCHWAB' | 'INTERACTIVE_BROKERS' | 'TASTYTRADE' | 'ROBINHOOD'
  accountNumber: string
  balance: number
  availableFunds: number
  marginUsed: number
  marginAvailable: number
  isOptionsEnabled: boolean
  optionsLevel: 1 | 2 | 3 | 4 | 5
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING'
  lastUpdate: string
}

export interface SymbolInfo {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  avgVolume: number
  optionsAvailable: boolean
  optionsVolume: number
  impliedVolatility: number
  earnings?: {
    nextDate: string
    confirmed: boolean
  }
  sector?: string
  exchange: string
}

export interface OptionChain {
  symbol: string
  expirationDate: string
  strikes: OptionStrike[]
}

export interface OptionStrike {
  strike: number
  call: OptionData
  put: OptionData
}

export interface OptionData {
  symbol: string
  bid: number
  ask: number
  last: number
  volume: number
  openInterest: number
  delta: number
  gamma: number
  theta: number
  vega: number
  impliedVolatility: number
}

export interface MarginRequirement {
  symbol: string
  strategy: string
  quantity: number
  estimatedMargin: number
  maxLoss: number
  buying_power_effect: number
}

class BrokerAPIService {
  private static instance: BrokerAPIService
  private accounts: BrokerAccount[] = []
  private symbolCache: Map<string, SymbolInfo> = new Map()
  private optionChainCache: Map<string, OptionChain[]> = new Map()

  static getInstance(): BrokerAPIService {
    if (!BrokerAPIService.instance) {
      BrokerAPIService.instance = new BrokerAPIService()
    }
    return BrokerAPIService.instance
  }

  // Initialize with mock data (in real app, this would connect to actual broker APIs)
  async initialize(): Promise<void> {
    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    this.accounts = [
      {
        id: 'td_001',
        name: 'TD Ameritrade Main',
        broker: 'TD_AMERITRADE',
        accountNumber: 'XXX-XXXX-1234',
        balance: 125430.50,
        availableFunds: 89250.25,
        marginUsed: 36180.25,
        marginAvailable: 150000.00,
        isOptionsEnabled: true,
        optionsLevel: 3,
        status: 'CONNECTED',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'schwab_001',
        name: 'Schwab Trading Account',
        broker: 'SCHWAB',
        accountNumber: 'XXX-XXXX-5678',
        balance: 89250.75,
        availableFunds: 65180.50,
        marginUsed: 24070.25,
        marginAvailable: 100000.00,
        isOptionsEnabled: true,
        optionsLevel: 4,
        status: 'CONNECTED',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'paper_001',
        name: 'Paper Trading Account',
        broker: 'TD_AMERITRADE',
        accountNumber: 'PAPER-001',
        balance: 100000.00,
        availableFunds: 100000.00,
        marginUsed: 0,
        marginAvailable: 200000.00,
        isOptionsEnabled: true,
        optionsLevel: 5,
        status: 'CONNECTED',
        lastUpdate: new Date().toISOString()
      }
    ]

    // Pre-populate symbol cache with common symbols
    await this.populateSymbolCache()
  }

  async populateSymbolCache(): Promise<void> {
    const symbols = ['SPY', 'QQQ', 'IWM', 'TLT', 'GLD', 'AAPL', 'MSFT', 'TSLA', 'NVDA', 'AMZN']

    for (const symbol of symbols) {
      const symbolInfo = await this.generateMockSymbolData(symbol)
      this.symbolCache.set(symbol, symbolInfo)
    }
  }

  async generateMockSymbolData(symbol: string): Promise<SymbolInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const basePrices: Record<string, number> = {
      'SPY': 450,
      'QQQ': 380,
      'IWM': 200,
      'TLT': 95,
      'GLD': 180,
      'AAPL': 175,
      'MSFT': 340,
      'TSLA': 250,
      'NVDA': 450,
      'AMZN': 140
    }

    const basePrice = basePrices[symbol] || 100
    const changePercent = (Math.random() - 0.5) * 0.06 // -3% to +3%
    const price = basePrice * (1 + changePercent)
    const change = price - basePrice

    return {
      symbol,
      name: this.getSymbolName(symbol),
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 10000) / 100,
      volume: Math.floor(Math.random() * 100000000) + 10000000,
      avgVolume: Math.floor(Math.random() * 80000000) + 20000000,
      optionsAvailable: true,
      optionsVolume: Math.floor(Math.random() * 1000000) + 100000,
      impliedVolatility: Math.round((0.15 + Math.random() * 0.4) * 10000) / 100,
      earnings: Math.random() > 0.7 ? {
        nextDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confirmed: Math.random() > 0.3
      } : undefined,
      sector: this.getSymbolSector(symbol),
      exchange: symbol.includes('ETF') || ['SPY', 'QQQ', 'IWM'].includes(symbol) ? 'ARCA' : 'NASDAQ'
    }
  }

  getSymbolName(symbol: string): string {
    const names: Record<string, string> = {
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'IWM': 'iShares Russell 2000 ETF',
      'TLT': 'iShares 20+ Year Treasury Bond ETF',
      'GLD': 'SPDR Gold Shares',
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'TSLA': 'Tesla, Inc.',
      'NVDA': 'NVIDIA Corporation',
      'AMZN': 'Amazon.com, Inc.'
    }
    return names[symbol] || `${symbol} Corporation`
  }

  getSymbolSector(symbol: string): string {
    const sectors: Record<string, string> = {
      'SPY': 'ETF',
      'QQQ': 'ETF',
      'IWM': 'ETF',
      'TLT': 'ETF',
      'GLD': 'ETF',
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'TSLA': 'Consumer Cyclical',
      'NVDA': 'Technology',
      'AMZN': 'Consumer Cyclical'
    }
    return sectors[symbol] || 'Technology'
  }

  async getAccounts(): Promise<BrokerAccount[]> {
    if (this.accounts.length === 0) {
      await this.initialize()
    }
    return this.accounts
  }

  async getAccountBalance(accountId: string): Promise<BrokerAccount | null> {
    const account = this.accounts.find(acc => acc.id === accountId)
    if (!account) return null

    // Simulate real-time balance updates
    account.lastUpdate = new Date().toISOString()
    account.balance += (Math.random() - 0.5) * 1000 // Simulate small balance changes

    return account
  }

  async validateSymbol(symbol: string): Promise<SymbolInfo | null> {
    // Check cache first
    if (this.symbolCache.has(symbol)) {
      return this.symbolCache.get(symbol)!
    }

    try {
      // Simulate API call
      const symbolInfo = await this.generateMockSymbolData(symbol)
      this.symbolCache.set(symbol, symbolInfo)
      return symbolInfo
    } catch (error) {
      console.error('Error validating symbol:', error)
      return null
    }
  }

  async searchSymbols(query: string): Promise<SymbolInfo[]> {
    // Simulate API search
    await new Promise(resolve => setTimeout(resolve, 300))

    const allSymbols = Array.from(this.symbolCache.values())
    return allSymbols.filter(symbol =>
      symbol.symbol.toLowerCase().includes(query.toLowerCase()) ||
      symbol.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10)
  }

  async getOptionChain(symbol: string, daysToExpiration?: number): Promise<OptionChain[]> {
    const cacheKey = `${symbol}_${daysToExpiration || 'all'}`

    if (this.optionChainCache.has(cacheKey)) {
      return this.optionChainCache.get(cacheKey)!
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const symbolInfo = await this.validateSymbol(symbol)
    if (!symbolInfo) return []

    const chains: OptionChain[] = []
    const currentPrice = symbolInfo.price

    // Generate option chains for next 8 weeks
    for (let week = 1; week <= 8; week++) {
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + (week * 7))

      // Skip if DTE filter is specified and doesn't match
      if (daysToExpiration) {
        const dte = Math.floor((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (Math.abs(dte - daysToExpiration) > 3) continue
      }

      const strikes: OptionStrike[] = []

      // Generate strikes around current price
      const strikeRange = currentPrice * 0.3 // 30% range
      const strikeIncrement = currentPrice > 100 ? 5 : 1

      for (let strike = currentPrice - strikeRange; strike <= currentPrice + strikeRange; strike += strikeIncrement) {
        const roundedStrike = Math.round(strike / strikeIncrement) * strikeIncrement

        strikes.push({
          strike: roundedStrike,
          call: this.generateOptionData(symbol, roundedStrike, 'CALL', currentPrice, week),
          put: this.generateOptionData(symbol, roundedStrike, 'PUT', currentPrice, week)
        })
      }

      chains.push({
        symbol,
        expirationDate: expirationDate.toISOString().split('T')[0],
        strikes
      })
    }

    this.optionChainCache.set(cacheKey, chains)
    return chains
  }

  generateOptionData(symbol: string, strike: number, type: 'CALL' | 'PUT', currentPrice: number, weeksOut: number): OptionData {
    const isITM = (type === 'CALL' && currentPrice > strike) || (type === 'PUT' && currentPrice < strike)
    const timeValue = Math.max(0.01, 0.5 / weeksOut)
    const intrinsicValue = isITM ? Math.abs(currentPrice - strike) : 0

    const mid = intrinsicValue + timeValue + (Math.random() * 2)
    const spread = mid * 0.02 // 2% spread

    const delta = this.calculateDelta(currentPrice, strike, type, weeksOut)

    return {
      symbol: `${symbol}_${strike}${type[0]}`,
      bid: Math.round((mid - spread/2) * 100) / 100,
      ask: Math.round((mid + spread/2) * 100) / 100,
      last: Math.round(mid * 100) / 100,
      volume: Math.floor(Math.random() * 5000) + 100,
      openInterest: Math.floor(Math.random() * 10000) + 500,
      delta: Math.round(delta * 10000) / 10000,
      gamma: Math.round((0.01 / weeksOut) * 10000) / 10000,
      theta: Math.round((-timeValue / (weeksOut * 7)) * 10000) / 10000,
      vega: Math.round((mid * 0.1) * 10000) / 10000,
      impliedVolatility: Math.round((0.15 + Math.random() * 0.3) * 10000) / 100
    }
  }

  calculateDelta(currentPrice: number, strike: number, type: 'CALL' | 'PUT', weeksOut: number): number {
    const moneyness = currentPrice / strike
    let delta: number

    if (type === 'CALL') {
      if (moneyness > 1.1) delta = 0.8 + Math.random() * 0.15
      else if (moneyness > 1.0) delta = 0.5 + Math.random() * 0.3
      else if (moneyness > 0.95) delta = 0.3 + Math.random() * 0.4
      else delta = 0.05 + Math.random() * 0.25
    } else {
      if (moneyness < 0.9) delta = -0.8 - Math.random() * 0.15
      else if (moneyness < 1.0) delta = -0.5 - Math.random() * 0.3
      else if (moneyness < 1.05) delta = -0.3 - Math.random() * 0.4
      else delta = -0.05 - Math.random() * 0.25
    }

    // Adjust for time to expiration
    delta *= (1 - (weeksOut - 1) * 0.1)

    return Math.max(-1, Math.min(1, delta))
  }

  async calculateMarginRequirement(
    accountId: string,
    symbol: string,
    strategy: string,
    legs: Array<{
      action: 'BUY' | 'SELL'
      type: 'CALL' | 'PUT'
      strike: number
      quantity: number
      expiration: string
    }>
  ): Promise<MarginRequirement> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))

    const account = this.accounts.find(acc => acc.id === accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    let estimatedMargin = 0
    let maxLoss = 0

    // Calculate margin based on strategy type
    switch (strategy.toLowerCase()) {
      case 'iron-condor':
        // Margin = width of wider spread
        estimatedMargin = legs.length > 0 ? Math.abs(legs[0].strike - legs[1].strike) * 100 : 0
        maxLoss = estimatedMargin
        break

      case 'put-credit-spread':
      case 'call-credit-spread':
        // Margin = strike width * 100 * quantity
        if (legs.length >= 2) {
          const strikeWidth = Math.abs(legs[0].strike - legs[1].strike)
          estimatedMargin = strikeWidth * 100 * legs[0].quantity
          maxLoss = estimatedMargin
        }
        break

      case 'short-strangle':
        // Margin = greater of put or call margin requirement
        const putMargin = legs.find(l => l.type === 'PUT')?.strike || 0 * 20 // 20% of strike
        const callMargin = 2000 // Fixed amount for call side
        estimatedMargin = Math.max(putMargin, callMargin)
        maxLoss = Infinity // Unlimited risk
        break

      default:
        estimatedMargin = 5000 // Default margin requirement
        maxLoss = estimatedMargin
    }

    return {
      symbol,
      strategy,
      quantity: legs[0]?.quantity || 1,
      estimatedMargin,
      maxLoss: maxLoss === Infinity ? -1 : maxLoss,
      buying_power_effect: estimatedMargin
    }
  }

  async testConnection(accountId: string): Promise<boolean> {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1000))

    const account = this.accounts.find(acc => acc.id === accountId)
    if (!account) return false

    // 95% success rate for testing
    const success = Math.random() > 0.05

    if (success) {
      account.status = 'CONNECTED'
      account.lastUpdate = new Date().toISOString()
    } else {
      account.status = 'ERROR'
    }

    return success
  }

  async refreshAccountData(accountId: string): Promise<BrokerAccount | null> {
    const account = await this.getAccountBalance(accountId)
    if (!account) return null

    // Simulate data refresh with small random changes
    account.availableFunds += (Math.random() - 0.5) * 1000
    account.marginUsed += (Math.random() - 0.5) * 500
    account.lastUpdate = new Date().toISOString()

    return account
  }
}

// React hook for broker API integration
export function useBrokerAPI() {
  const [accounts, setAccounts] = useState<BrokerAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const brokerAPI = BrokerAPIService.getInstance()

  useEffect(() => {
    initializeAPI()
  }, [])

  const initializeAPI = async () => {
    try {
      setIsLoading(true)
      await brokerAPI.initialize()
      const accountData = await brokerAPI.getAccounts()
      setAccounts(accountData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize broker API')
    } finally {
      setIsLoading(false)
    }
  }

  const validateSymbol = async (symbol: string): Promise<SymbolInfo | null> => {
    try {
      return await brokerAPI.validateSymbol(symbol.toUpperCase())
    } catch (err) {
      console.error('Error validating symbol:', err)
      return null
    }
  }

  const searchSymbols = async (query: string): Promise<SymbolInfo[]> => {
    try {
      return await brokerAPI.searchSymbols(query)
    } catch (err) {
      console.error('Error searching symbols:', err)
      return []
    }
  }

  const getOptionChain = async (symbol: string, dte?: number): Promise<OptionChain[]> => {
    try {
      return await brokerAPI.getOptionChain(symbol, dte)
    } catch (err) {
      console.error('Error getting option chain:', err)
      return []
    }
  }

  const calculateMargin = async (
    accountId: string,
    symbol: string,
    strategy: string,
    legs: any[]
  ): Promise<MarginRequirement | null> => {
    try {
      return await brokerAPI.calculateMarginRequirement(accountId, symbol, strategy, legs)
    } catch (err) {
      console.error('Error calculating margin:', err)
      return null
    }
  }

  const refreshAccount = async (accountId: string): Promise<void> => {
    try {
      const updatedAccount = await brokerAPI.refreshAccountData(accountId)
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc =>
          acc.id === accountId ? updatedAccount : acc
        ))
      }
    } catch (err) {
      console.error('Error refreshing account:', err)
    }
  }

  return {
    accounts,
    isLoading,
    error,
    validateSymbol,
    searchSymbols,
    getOptionChain,
    calculateMargin,
    refreshAccount,
    reinitialize: initializeAPI
  }
}

export default BrokerAPIService
