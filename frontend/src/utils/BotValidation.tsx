export interface ValidationRule {
  field: string
  validator: (value: any, config?: any, marketData?: any) => ValidationResult
  severity: 'error' | 'warning' | 'info'
  category: 'required' | 'business' | 'risk' | 'market' | 'performance'
}

export interface ValidationResult {
  isValid: boolean
  message: string
  suggestion?: string
  code?: string
}

export interface MarketValidationData {
  currentPrice: number
  impliedVolatility: number
  earnings?: {
    nextDate: string
    confirmed: boolean
  }
  volume: number
  optionsVolume: number
  sector: string
  beta: number
}

export class BotValidationEngine {
  private static rules: ValidationRule[] = [
    // Required Field Validations
    {
      field: 'botName',
      validator: (value: string) => {
        if (!value || value.trim().length === 0) {
          return { isValid: false, message: 'Bot name is required' }
        }
        if (value.length < 3) {
          return { isValid: false, message: 'Bot name must be at least 3 characters long' }
        }
        if (value.length > 50) {
          return { isValid: false, message: 'Bot name must be less than 50 characters' }
        }
        if (!/^[a-zA-Z0-9_\s-]+$/.test(value)) {
          return { isValid: false, message: 'Bot name can only contain letters, numbers, spaces, hyphens, and underscores' }
        }
        return { isValid: true, message: 'Valid bot name' }
      },
      severity: 'error',
      category: 'required'
    },

    {
      field: 'tradingAccount',
      validator: (value: string) => {
        if (!value) {
          return { isValid: false, message: 'Trading account selection is required' }
        }
        return { isValid: true, message: 'Trading account selected' }
      },
      severity: 'error',
      category: 'required'
    },

    {
      field: 'underlyingSymbol',
      validator: (value: string, config: any, marketData?: MarketValidationData) => {
        if (!value) {
          return { isValid: false, message: 'Underlying symbol is required' }
        }
        if (!/^[A-Z]{1,5}$/.test(value)) {
          return { isValid: false, message: 'Symbol must be 1-5 uppercase letters' }
        }
        if (marketData && marketData.volume < 1000000) {
          return {
            isValid: false,
            message: 'Low volume symbol may result in poor fills',
            suggestion: 'Consider using high-volume ETFs like SPY, QQQ, or IWM'
          }
        }
        return { isValid: true, message: 'Valid symbol' }
      },
      severity: 'error',
      category: 'required'
    },

    // Strike Price Validations
    {
      field: 'strikePrice',
      validator: (value: number, config: any, marketData?: MarketValidationData) => {
        if (!value || value <= 0) {
          return { isValid: false, message: 'Strike price must be greater than 0' }
        }

        if (marketData) {
          const currentPrice = marketData.currentPrice
          const percentDiff = Math.abs((value - currentPrice) / currentPrice) * 100

          // Warning for strikes very far from current price
          if (percentDiff > 50) {
            return {
              isValid: false,
              message: 'Strike price is too far from current market price',
              suggestion: 'Consider strikes within 50% of current price for better liquidity'
            }
          }

          // Warning for very close strikes (high gamma risk)
          if (percentDiff < 2) {
            return {
              isValid: true,
              message: 'Strike very close to current price - high gamma risk',
              suggestion: 'Monitor position closely due to high gamma exposure'
            }
          }
        }

        return { isValid: true, message: 'Valid strike price' }
      },
      severity: 'warning',
      category: 'risk'
    },

    // Days to Expiration Validations
    {
      field: 'daysToExpiration',
      validator: (value: number, config: any, marketData?: MarketValidationData) => {
        if (!value || value <= 0) {
          return { isValid: false, message: 'Days to expiration must be greater than 0' }
        }

        if (value > 365) {
          return { isValid: false, message: 'Days to expiration cannot exceed 365 days' }
        }

        // Risk warnings based on DTE
        if (value < 7) {
          return {
            isValid: true,
            message: 'Very short DTE increases gamma risk significantly',
            suggestion: 'Consider using 14+ DTE for more manageable risk'
          }
        }

        if (value > 90) {
          return {
            isValid: true,
            message: 'Long DTE reduces time decay benefits',
            suggestion: 'Consider 30-60 DTE for optimal theta decay'
          }
        }

        // Check for earnings within DTE period
        if (marketData?.earnings) {
          const earningsDate = new Date(marketData.earnings.nextDate)
          const expirationDate = new Date()
          expirationDate.setDate(expirationDate.getDate() + value)

          if (earningsDate <= expirationDate && earningsDate > new Date()) {
            return {
              isValid: true,
              message: 'Earnings announcement within expiration period',
              suggestion: 'Consider adjusting expiration or strikes to account for earnings volatility'
            }
          }
        }

        return { isValid: true, message: 'Valid expiration period' }
      },
      severity: 'warning',
      category: 'risk'
    },

    // Quantity Validations
    {
      field: 'quantity',
      validator: (value: number, config: any, marketData?: MarketValidationData) => {
        if (!value || value <= 0) {
          return { isValid: false, message: 'Quantity must be greater than 0' }
        }

        if (value > 100) {
          return {
            isValid: false,
            message: 'Quantity exceeds maximum recommended limit',
            suggestion: 'Consider starting with smaller position sizes for risk management'
          }
        }

        // Check against market liquidity
        if (marketData && marketData.optionsVolume > 0) {
          const dailyVolumePercent = (value / marketData.optionsVolume) * 100
          if (dailyVolumePercent > 10) {
            return {
              isValid: false,
              message: 'Position size too large relative to daily options volume',
              suggestion: 'Reduce quantity to avoid market impact'
            }
          }
        }

        return { isValid: true, message: 'Valid quantity' }
      },
      severity: 'error',
      category: 'risk'
    },

    // Profit Target Validations
    {
      field: 'profitTarget',
      validator: (value: number, config: any) => {
        if (value <= 0) {
          return { isValid: false, message: 'Profit target must be greater than 0%' }
        }

        if (value > 100) {
          return { isValid: false, message: 'Profit target cannot exceed 100%' }
        }

        // Strategy-specific recommendations
        const strategy = config?.strategyAssignment?.toLowerCase()

        if (strategy === 'iron-condor' && value > 50) {
          return {
            isValid: true,
            message: 'High profit target for iron condor strategy',
            suggestion: 'Consider 25-50% profit target for iron condors'
          }
        }

        if (strategy?.includes('credit') && value > 75) {
          return {
            isValid: true,
            message: 'High profit target for credit spread',
            suggestion: 'Consider 50% or less for credit spreads'
          }
        }

        return { isValid: true, message: 'Valid profit target' }
      },
      severity: 'warning',
      category: 'performance'
    },

    // Stop Loss Validations
    {
      field: 'stopLoss',
      validator: (value: number, config: any) => {
        if (value <= 0) {
          return { isValid: false, message: 'Stop loss must be greater than 0%' }
        }

        if (value > 1000) {
          return { isValid: false, message: 'Stop loss percentage is too high' }
        }

        const profitTarget = config?.profitTarget || 0

        // Risk-reward ratio validation
        if (profitTarget > 0) {
          const riskRewardRatio = value / profitTarget

          if (riskRewardRatio > 5) {
            return {
              isValid: true,
              message: 'Poor risk-reward ratio',
              suggestion: 'Consider reducing stop loss or increasing profit target'
            }
          }

          if (riskRewardRatio < 1.5) {
            return {
              isValid: true,
              message: 'Aggressive risk-reward ratio',
              suggestion: 'Ensure this aligns with your risk tolerance'
            }
          }
        }

        return { isValid: true, message: 'Valid stop loss' }
      },
      severity: 'warning',
      category: 'risk'
    },

    // Time Window Validations
    {
      field: 'entryTimeWindow',
      validator: (value: { start: string; end: string }) => {
        if (!value.start || !value.end) {
          return { isValid: false, message: 'Both start and end times are required' }
        }

        const startTime = new Date(`2000-01-01T${value.start}:00`)
        const endTime = new Date(`2000-01-01T${value.end}:00`)

        if (startTime >= endTime) {
          return { isValid: false, message: 'Start time must be before end time' }
        }

        const timeDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes

        if (timeDiff < 30) {
          return {
            isValid: true,
            message: 'Very narrow time window may limit opportunities',
            suggestion: 'Consider at least 1-hour window for better execution'
          }
        }

        // Check if window includes market open/close
        const marketOpen = new Date(`2000-01-01T09:30:00`)
        const marketClose = new Date(`2000-01-01T16:00:00`)

        if (startTime < marketOpen || endTime > marketClose) {
          return {
            isValid: false,
            message: 'Time window must be within market hours (9:30 AM - 4:00 PM ET)'
          }
        }

        // Warning for early morning trading
        const earlyMorning = new Date(`2000-01-01T09:45:00`)
        if (startTime < earlyMorning) {
          return {
            isValid: true,
            message: 'Early morning trading may have wider spreads',
            suggestion: 'Consider starting after 9:45 AM for better liquidity'
          }
        }

        return { isValid: true, message: 'Valid time window' }
      },
      severity: 'warning',
      category: 'market'
    },

    // Max Trades Per Day Validation
    {
      field: 'maxTradesPerDay',
      validator: (value: number, config: any) => {
        if (value <= 0) {
          return { isValid: false, message: 'Must allow at least 1 trade per day' }
        }

        if (value > 10) {
          return {
            isValid: true,
            message: 'High number of daily trades may increase costs',
            suggestion: 'Consider commission impact with frequent trading'
          }
        }

        return { isValid: true, message: 'Valid daily trade limit' }
      },
      severity: 'warning',
      category: 'performance'
    },

    // Market Condition Validations
    {
      field: 'marketConditions',
      validator: (value: any, config: any, marketData?: MarketValidationData) => {
        if (!marketData) return { isValid: true, message: 'No market data available' }

        const strategy = config?.strategyAssignment?.toLowerCase()
        const iv = marketData.impliedVolatility

        // High IV warnings
        if (iv > 30) {
          if (strategy === 'iron-condor' || strategy?.includes('credit')) {
            return {
              isValid: true,
              message: 'High implied volatility detected - favorable for credit strategies',
              suggestion: 'Good conditions for selling premium'
            }
          } else {
            return {
              isValid: true,
              message: 'High implied volatility may increase position risk',
              suggestion: 'Consider volatility impact on your strategy'
            }
          }
        }

        // Low IV warnings
        if (iv < 15) {
          if (strategy === 'iron-condor' || strategy?.includes('credit')) {
            return {
              isValid: true,
              message: 'Low implied volatility may reduce premium collection',
              suggestion: 'Consider waiting for higher IV or adjusting strikes'
            }
          }
        }

        return { isValid: true, message: 'Market conditions reviewed' }
      },
      severity: 'info',
      category: 'market'
    },

    // Strategy-Specific Validations
    {
      field: 'strategyConsistency',
      validator: (value: any, config: any) => {
        const strategy = config?.strategyAssignment?.toLowerCase()
        const legs = config?.legs || []

        if (strategy === 'iron-condor' && legs.length !== 4) {
          return {
            isValid: false,
            message: 'Iron Condor strategy requires exactly 4 legs',
            suggestion: 'Configure 4 legs: short put, long put, short call, long call'
          }
        }

        if (strategy?.includes('credit-spread') && legs.length !== 2) {
          return {
            isValid: false,
            message: 'Credit spread strategy requires exactly 2 legs',
            suggestion: 'Configure 2 legs with same option type'
          }
        }

        return { isValid: true, message: 'Strategy configuration is consistent' }
      },
      severity: 'error',
      category: 'business'
    }
  ]

  static validateField(
    field: string,
    value: any,
    config?: any,
    marketData?: MarketValidationData
  ): ValidationResult[] {
    const fieldRules = this.rules.filter(rule => rule.field === field)
    const results: ValidationResult[] = []

    for (const rule of fieldRules) {
      try {
        const result = rule.validator(value, config, marketData)
        results.push({
          ...result,
          code: `${rule.category}_${rule.field}`
        })
      } catch (error) {
        results.push({
          isValid: false,
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: `error_${rule.field}`
        })
      }
    }

    return results
  }

  static validateConfiguration(
    config: any,
    marketData?: Record<string, MarketValidationData>
  ): {
    isValid: boolean
    errors: ValidationResult[]
    warnings: ValidationResult[]
    infos: ValidationResult[]
    score: number
  } {
    const allResults: Array<ValidationResult & { severity: string; field: string }> = []

    // Validate all fields
    for (const rule of this.rules) {
      const fieldValue = this.getFieldValue(config, rule.field)
      const symbolMarketData = marketData?.[config.underlyingSymbol]

      try {
        const results = this.validateField(rule.field, fieldValue, config, symbolMarketData)
        for (const result of results) {
          allResults.push({
            ...result,
            severity: rule.severity,
            field: rule.field
          })
        }
      } catch (error) {
        allResults.push({
          isValid: false,
          message: `Validation error for ${rule.field}`,
          severity: 'error',
          field: rule.field
        })
      }
    }

    const errors = allResults.filter(r => r.severity === 'error' && !r.isValid)
    const warnings = allResults.filter(r => r.severity === 'warning' && !r.isValid)
    const infos = allResults.filter(r => r.severity === 'info')

    // Calculate validation score (0-100)
    const totalChecks = allResults.length
    const passedChecks = allResults.filter(r => r.isValid).length
    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      infos,
      score
    }
  }

  private static getFieldValue(config: any, field: string): any {
    // Handle nested field access
    const parts = field.split('.')
    let value = config

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part]
      } else {
        return undefined
      }
    }

    return value
  }

  // Custom validation rules for specific scenarios
  static addCustomRule(rule: ValidationRule): void {
    this.rules.push(rule)
  }

  static removeRule(field: string, category?: string): void {
    this.rules = this.rules.filter(rule => {
      if (category) {
        return !(rule.field === field && rule.category === category)
      }
      return rule.field !== field
    })
  }

  // Market-aware validations
  static validateWithMarketData(
    config: any,
    realTimeData: Record<string, MarketValidationData>
  ): Promise<{ isValid: boolean; results: ValidationResult[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const validation = this.validateConfiguration(config, realTimeData)
        resolve({
          isValid: validation.isValid,
          results: [...validation.errors, ...validation.warnings, ...validation.infos]
        })
      }, 100) // Simulate API call delay
    })
  }
}

// Utility functions for specific validations
export class OptionValidationUtils {
  static validateStrikeSpread(strikes: number[]): ValidationResult {
    if (strikes.length < 2) {
      return { isValid: true, message: 'Single leg position' }
    }

    const sortedStrikes = [...strikes].sort((a, b) => a - b)
    const spreads = []

    for (let i = 1; i < sortedStrikes.length; i++) {
      spreads.push(sortedStrikes[i] - sortedStrikes[i-1])
    }

    const minSpread = Math.min(...spreads)
    const maxSpread = Math.max(...spreads)

    if (minSpread < 1) {
      return {
        isValid: false,
        message: 'Strike spread too narrow - may result in poor fills',
        suggestion: 'Use at least $1 wide spreads for better liquidity'
      }
    }

    if (maxSpread / minSpread > 3) {
      return {
        isValid: true,
        message: 'Uneven strike spacing detected',
        suggestion: 'Consider more consistent strike spacing'
      }
    }

    return { isValid: true, message: 'Valid strike configuration' }
  }

  static validateDeltaTargeting(delta: number, optionType: 'CALL' | 'PUT'): ValidationResult {
    if (Math.abs(delta) > 1) {
      return { isValid: false, message: 'Delta must be between -1 and 1' }
    }

    if (optionType === 'CALL' && delta < 0) {
      return { isValid: false, message: 'Call options should have positive delta' }
    }

    if (optionType === 'PUT' && delta > 0) {
      return { isValid: false, message: 'Put options should have negative delta' }
    }

    const absDelta = Math.abs(delta)

    if (absDelta > 0.5) {
      return {
        isValid: true,
        message: 'High delta option - significant directional exposure',
        suggestion: 'Monitor for large price movements'
      }
    }

    if (absDelta < 0.05) {
      return {
        isValid: true,
        message: 'Very low delta option - limited profit potential',
        suggestion: 'Consider higher delta for better returns'
      }
    }

    return { isValid: true, message: 'Valid delta targeting' }
  }

  static validateImpliedVolatility(iv: number, historical?: number): ValidationResult {
    if (iv < 0) {
      return { isValid: false, message: 'Implied volatility cannot be negative' }
    }

    if (iv > 200) {
      return {
        isValid: true,
        message: 'Extremely high implied volatility detected',
        suggestion: 'Consider waiting for volatility to normalize'
      }
    }

    if (historical && iv > historical * 2) {
      return {
        isValid: true,
        message: 'IV significantly elevated vs historical',
        suggestion: 'Good opportunity for premium selling strategies'
      }
    }

    if (historical && iv < historical * 0.5) {
      return {
        isValid: true,
        message: 'IV significantly below historical average',
        suggestion: 'Consider volatility expansion strategies'
      }
    }

    return { isValid: true, message: 'Normal implied volatility levels' }
  }
}

export default BotValidationEngine
