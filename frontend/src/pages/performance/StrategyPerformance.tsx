import { useState } from 'react'

interface StrategyStats {
  strategy: string
  symbol: string
  dateRange: string
  account: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  totalPnLPercent: number
  avgWinAmount: number
  avgLossAmount: number
  maxWin: number
  maxLoss: number
  profitFactor: number
  avgDaysInTrade: number
  sharpeRatio: number
  maxDrawdown: number
  monthlyBreakdown: {
    month: string
    trades: number
    pnl: number
    winRate: number
  }[]
  tradeHistory: {
    date: string
    symbol: string
    entryPrice: number
    exitPrice: number
    pnl: number
    daysHeld: number
    outcome: 'win' | 'loss'
  }[]
}

export function StrategyPerformance() {
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('All')
  const [selectedDates, setSelectedDates] = useState('06/09/2024 - 06/09/2025')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [strategyStats, setStrategyStats] = useState<StrategyStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleShowStats = () => {
    if (!selectedStrategy) {
      alert('Please select a strategy first')
      return
    }

    setIsLoading(true)
    console.log('Showing strategy stats for:', {
      selectedStrategy,
      selectedSymbol,
      selectedDates,
      selectedAccount
    })

    // Simulate API call with mock data
    setTimeout(() => {
      const mockStats: StrategyStats = {
        strategy: selectedStrategy,
        symbol: selectedSymbol,
        dateRange: selectedDates,
        account: selectedAccount || 'All Accounts',
        totalTrades: Math.floor(Math.random() * 100) + 50,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: (Math.random() - 0.3) * 10000, // Slight positive bias
        totalPnLPercent: 0,
        avgWinAmount: Math.random() * 300 + 100,
        avgLossAmount: -(Math.random() * 200 + 50),
        maxWin: Math.random() * 800 + 200,
        maxLoss: -(Math.random() * 400 + 100),
        profitFactor: 0,
        avgDaysInTrade: Math.random() * 10 + 3,
        sharpeRatio: Math.random() * 2 + 0.5,
        maxDrawdown: -(Math.random() * 8 + 2),
        monthlyBreakdown: generateMonthlyBreakdown(),
        tradeHistory: generateTradeHistory()
      }

      // Calculate derived values
      mockStats.winningTrades = Math.floor(mockStats.totalTrades * (0.6 + Math.random() * 0.25))
      mockStats.losingTrades = mockStats.totalTrades - mockStats.winningTrades
      mockStats.winRate = (mockStats.winningTrades / mockStats.totalTrades) * 100
      mockStats.totalPnLPercent = (mockStats.totalPnL / 50000) * 100
      mockStats.profitFactor = Math.abs(mockStats.avgWinAmount * mockStats.winningTrades) /
                                Math.abs(mockStats.avgLossAmount * mockStats.losingTrades)

      setStrategyStats(mockStats)
      setIsLoading(false)
    }, 1500)
  }

  const generateMonthlyBreakdown = () => {
    const months = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025']
    return months.map(month => ({
      month,
      trades: Math.floor(Math.random() * 20) + 5,
      pnl: (Math.random() - 0.4) * 2000,
      winRate: Math.random() * 40 + 50
    }))
  }

  const generateTradeHistory = () => {
    const symbols = ['SPY', 'QQQ', 'IWM', 'AAPL', 'TSLA', 'NVDA']
    const history = []
    for (let i = 0; i < 15; i++) {
      const entryPrice = Math.random() * 500 + 100
      const exitMultiplier = 0.9 + Math.random() * 0.2
      const exitPrice = entryPrice * exitMultiplier
      const pnl = (exitPrice - entryPrice) * 100
      history.push({
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        entryPrice,
        exitPrice,
        pnl,
        daysHeld: Math.floor(Math.random() * 30) + 1,
        outcome: pnl > 0 ? 'win' : 'loss' as 'win' | 'loss'
      })
    }
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const strategies = [
    'Iron Condor',
    'Credit Spread',
    'Covered Call',
    'Cash Secured Put',
    'Protective Put',
    'Collar',
    'Straddle',
    'Strangle',
    'Butterfly',
    'Calendar Spread'
  ]

  const symbols = [
    'All',
    'SPY',
    'QQQ',
    'IWM',
    'AAPL',
    'TSLA',
    'NVDA',
    'AMZN',
    'MSFT',
    'GOOGL'
  ]

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Export functionality
  const exportToCSV = () => {
    if (!strategyStats) return

    const csvData = [
      ['Strategy Performance Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Strategy:', strategyStats.strategy],
      ['Symbol:', strategyStats.symbol],
      ['Date Range:', strategyStats.dateRange],
      ['Account:', strategyStats.account],
      [''],
      ['Performance Metrics'],
      ['Total Trades', strategyStats.totalTrades],
      ['Winning Trades', strategyStats.winningTrades],
      ['Losing Trades', strategyStats.losingTrades],
      ['Win Rate (%)', strategyStats.winRate.toFixed(2)],
      ['Total P&L', strategyStats.totalPnL.toFixed(2)],
      ['Total P&L (%)', strategyStats.totalPnLPercent.toFixed(2)],
      ['Profit Factor', strategyStats.profitFactor.toFixed(2)],
      [''],
      ['Trade Statistics'],
      ['Average Win', strategyStats.avgWinAmount.toFixed(2)],
      ['Average Loss', strategyStats.avgLossAmount.toFixed(2)],
      ['Largest Win', strategyStats.maxWin.toFixed(2)],
      ['Largest Loss', strategyStats.maxLoss.toFixed(2)],
      ['Average Days in Trade', strategyStats.avgDaysInTrade.toFixed(1)],
      [''],
      ['Risk Metrics'],
      ['Sharpe Ratio', strategyStats.sharpeRatio.toFixed(2)],
      ['Max Drawdown (%)', strategyStats.maxDrawdown.toFixed(2)],
      [''],
      ['Monthly Breakdown'],
      ['Month', 'Trades', 'P&L', 'Win Rate (%)'],
      ...strategyStats.monthlyBreakdown.map(month => [
        month.month,
        month.trades,
        month.pnl.toFixed(2),
        month.winRate.toFixed(1)
      ]),
      [''],
      ['Trade History'],
      ['Date', 'Symbol', 'Entry Price', 'Exit Price', 'P&L', 'Days Held', 'Outcome'],
      ...strategyStats.tradeHistory.map(trade => [
        trade.date,
        trade.symbol,
        trade.entryPrice.toFixed(2),
        trade.exitPrice.toFixed(2),
        trade.pnl.toFixed(2),
        trade.daysHeld,
        trade.outcome.toUpperCase()
      ])
    ]

    const csvContent = csvData.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `strategy-performance-${strategyStats.strategy.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    if (!strategyStats) return

    const exportData = {
      reportInfo: {
        title: 'Strategy Performance Report',
        generatedOn: new Date().toISOString(),
        strategy: strategyStats.strategy,
        symbol: strategyStats.symbol,
        dateRange: strategyStats.dateRange,
        account: strategyStats.account
      },
      performanceMetrics: {
        totalTrades: strategyStats.totalTrades,
        winningTrades: strategyStats.winningTrades,
        losingTrades: strategyStats.losingTrades,
        winRate: strategyStats.winRate,
        totalPnL: strategyStats.totalPnL,
        totalPnLPercent: strategyStats.totalPnLPercent,
        profitFactor: strategyStats.profitFactor
      },
      tradeStatistics: {
        avgWinAmount: strategyStats.avgWinAmount,
        avgLossAmount: strategyStats.avgLossAmount,
        maxWin: strategyStats.maxWin,
        maxLoss: strategyStats.maxLoss,
        avgDaysInTrade: strategyStats.avgDaysInTrade
      },
      riskMetrics: {
        sharpeRatio: strategyStats.sharpeRatio,
        maxDrawdown: strategyStats.maxDrawdown
      },
      monthlyBreakdown: strategyStats.monthlyBreakdown,
      tradeHistory: strategyStats.tradeHistory
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `strategy-performance-${strategyStats.strategy.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const printReport = () => {
    if (!strategyStats) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strategy Performance Report - ${strategyStats.strategy}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .metric-value { font-size: 1.2em; font-weight: bold; color: #059669; }
            .negative { color: #dc2626; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .summary { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Strategy Performance Report</h1>
            <p><strong>${strategyStats.strategy}</strong> | ${strategyStats.symbol} | ${strategyStats.dateRange}</p>
            <p>Account: ${strategyStats.account} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="summary">
            <h2>Executive Summary</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div>Total P&L</div>
                <div class="metric-value ${strategyStats.totalPnL >= 0 ? '' : 'negative'}">${formatCurrency(strategyStats.totalPnL)}</div>
              </div>
              <div class="metric-card">
                <div>Win Rate</div>
                <div class="metric-value">${strategyStats.winRate.toFixed(1)}%</div>
              </div>
              <div class="metric-card">
                <div>Total Trades</div>
                <div class="metric-value">${strategyStats.totalTrades}</div>
              </div>
              <div class="metric-card">
                <div>Profit Factor</div>
                <div class="metric-value">${strategyStats.profitFactor.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Performance Metrics</h2>
            <table>
              <tr><td>Total Trades</td><td>${strategyStats.totalTrades}</td></tr>
              <tr><td>Winning Trades</td><td>${strategyStats.winningTrades}</td></tr>
              <tr><td>Losing Trades</td><td>${strategyStats.losingTrades}</td></tr>
              <tr><td>Win Rate</td><td>${strategyStats.winRate.toFixed(2)}%</td></tr>
              <tr><td>Total P&L</td><td>${formatCurrency(strategyStats.totalPnL)}</td></tr>
              <tr><td>Return %</td><td>${strategyStats.totalPnLPercent.toFixed(2)}%</td></tr>
            </table>
          </div>

          <div class="section">
            <h2>Trade Statistics</h2>
            <table>
              <tr><td>Average Win</td><td>${formatCurrency(strategyStats.avgWinAmount)}</td></tr>
              <tr><td>Average Loss</td><td>${formatCurrency(strategyStats.avgLossAmount)}</td></tr>
              <tr><td>Largest Win</td><td>${formatCurrency(strategyStats.maxWin)}</td></tr>
              <tr><td>Largest Loss</td><td>${formatCurrency(strategyStats.maxLoss)}</td></tr>
              <tr><td>Avg Days in Trade</td><td>${strategyStats.avgDaysInTrade.toFixed(1)} days</td></tr>
            </table>
          </div>

          <div class="section">
            <h2>Monthly Performance</h2>
            <table>
              <thead>
                <tr><th>Month</th><th>Trades</th><th>P&L</th><th>Win Rate</th></tr>
              </thead>
              <tbody>
                ${strategyStats.monthlyBreakdown.map(month => `
                  <tr>
                    <td>${month.month}</td>
                    <td>${month.trades}</td>
                    <td class="${month.pnl >= 0 ? '' : 'negative'}">${formatCurrency(month.pnl)}</td>
                    <td>${month.winRate.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Recent Trade History</h2>
            <table>
              <thead>
                <tr><th>Date</th><th>Symbol</th><th>Entry</th><th>Exit</th><th>P&L</th><th>Days</th><th>Result</th></tr>
              </thead>
              <tbody>
                ${strategyStats.tradeHistory.map(trade => `
                  <tr>
                    <td>${trade.date}</td>
                    <td>${trade.symbol}</td>
                    <td>${trade.entryPrice.toFixed(2)}</td>
                    <td>${trade.exitPrice.toFixed(2)}</td>
                    <td class="${trade.pnl >= 0 ? '' : 'negative'}">${formatCurrency(trade.pnl)}</td>
                    <td>${trade.daysHeld}</td>
                    <td>${trade.outcome.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-12">
          Strategy Performance
        </h1>

        {/* Controls Section */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Select Strategy */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Strategy
              </label>
              <input
                type="text"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                placeholder="Select Strategies"
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                list="strategies"
              />
              <datalist id="strategies">
                {strategies.map((strategy) => (
                  <option key={strategy} value={strategy} />
                ))}
              </datalist>
            </div>

            {/* Select Symbol */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Symbol
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Opening Dates */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Opening Dates
              </label>
              <input
                type="text"
                value={selectedDates}
                onChange={(e) => setSelectedDates(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
              />
            </div>
          </div>

          {/* By Account Section */}
          <div className="mt-8">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              By Account
            </label>
            <input
              type="text"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter account name or select from dropdown"
            />
          </div>

          {/* Show Me The Stats Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowStats}
              disabled={!selectedStrategy || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-md transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isLoading ? 'ANALYZING...' : 'SHOW ME THE STATS'}</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="mt-8 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-300">Analyzing strategy performance...</span>
              </div>
            </div>
          )}

          {/* Strategy Performance Results */}
          {strategyStats && !isLoading && (
            <>
              {/* Summary Header */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {strategyStats.strategy} Strategy Analysis
                    </h2>
                    <p className="text-gray-400">
                      {strategyStats.symbol} • {strategyStats.dateRange} • {strategyStats.account}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <div className={`text-2xl font-bold ${strategyStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(strategyStats.totalPnL)}
                    </div>
                    <div className="text-sm text-gray-400 mb-3">Total P&L</div>

                    {/* Export Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={exportToCSV}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded transition-colors flex items-center space-x-1"
                        title="Export to CSV"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>CSV</span>
                      </button>
                      <button
                        onClick={exportToJSON}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded transition-colors flex items-center space-x-1"
                        title="Export to JSON"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={printReport}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1 rounded transition-colors flex items-center space-x-1"
                        title="Print Report"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-white">{strategyStats.totalTrades}</div>
                    <div className="text-sm text-gray-400">Total Trades</div>
                    <div className="text-xs text-blue-400">
                      {strategyStats.winningTrades}W / {strategyStats.losingTrades}L
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-400">{strategyStats.winRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-xs text-gray-500">
                      {strategyStats.winningTrades}/{strategyStats.totalTrades}
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className={`text-xl font-bold ${strategyStats.totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {strategyStats.totalPnLPercent >= 0 ? '+' : ''}{strategyStats.totalPnLPercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">Return %</div>
                    <div className="text-xs text-gray-500">Account return</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-xl font-bold text-yellow-400">{strategyStats.profitFactor.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">Profit Factor</div>
                    <div className="text-xs text-gray-500">Win/Loss ratio</div>
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trade Statistics */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Trade Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Win</span>
                      <span className="text-green-400 font-medium">{formatCurrency(strategyStats.avgWinAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Loss</span>
                      <span className="text-red-400 font-medium">{formatCurrency(strategyStats.avgLossAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Largest Win</span>
                      <span className="text-green-400 font-medium">{formatCurrency(strategyStats.maxWin)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Largest Loss</span>
                      <span className="text-red-400 font-medium">{formatCurrency(strategyStats.maxLoss)}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Days in Trade</span>
                        <span className="text-white font-medium">{strategyStats.avgDaysInTrade.toFixed(1)} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Metrics */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sharpe Ratio</span>
                      <span className="text-blue-400 font-medium">{strategyStats.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Max Drawdown</span>
                      <span className="text-red-400 font-medium">{strategyStats.maxDrawdown.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Profit Factor</span>
                      <span className="text-yellow-400 font-medium">{strategyStats.profitFactor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Win/Loss Ratio</span>
                      <span className="text-white font-medium">
                        {(Math.abs(strategyStats.avgWinAmount) / Math.abs(strategyStats.avgLossAmount)).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-slate-600 pt-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${strategyStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {strategyStats.totalPnL >= 0 ? 'PROFITABLE' : 'LOSING'}
                        </div>
                        <div className="text-sm text-gray-400">Strategy Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Performance Breakdown */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {strategyStats.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-white mb-2">{month.month}</div>
                      <div className={`text-lg font-bold mb-1 ${month.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(month.pnl)}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{month.trades} trades</div>
                      <div className="text-xs text-purple-400">{month.winRate.toFixed(1)}% win</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Trade History */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Trade History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Entry
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Exit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          P&L
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Days
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {strategyStats.tradeHistory.map((trade, index) => (
                        <tr key={index} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {trade.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                            {trade.symbol}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            ${trade.entryPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            ${trade.exitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {trade.daysHeld}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              trade.outcome === 'win'
                                ? 'text-green-400 bg-green-400/10'
                                : 'text-red-400 bg-red-400/10'
                            }`}>
                              {trade.outcome.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Initial State */}
          {!strategyStats && !isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="text-gray-400">
                {selectedStrategy
                  ? 'Click "SHOW ME THE STATS" to analyze strategy performance'
                  : 'Select a strategy to view performance analysis'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
