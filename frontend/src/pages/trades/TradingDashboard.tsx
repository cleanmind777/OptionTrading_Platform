import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Bot {
  id: string
  name: string
  status: 'active' | 'paused' | 'stopped'
  strategy: string
  pnl: number
  pnlPercent: number
  trades: number
  account: string
}

interface Account {
  id: string
  name: string
  broker: string
  balance: number
  dayPnl: number
  dayPnlPercent: number
}

export function TradingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bots' | 'accounts' | 'trades'>('overview')

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Main Trading Account',
      broker: 'Schwab',
      balance: 125430.50,
      dayPnl: 2340.25,
      dayPnlPercent: 1.9
    },
    {
      id: '2',
      name: 'IRA Account',
      broker: 'TastyTrade',
      balance: 89250.00,
      dayPnl: -450.75,
      dayPnlPercent: -0.5
    }
  ]

  const bots: Bot[] = [
    {
      id: '1',
      name: 'SPY Iron Condor Bot',
      status: 'active',
      strategy: 'Iron Condor',
      pnl: 5420.30,
      pnlPercent: 12.4,
      trades: 34,
      account: 'Main Trading Account'
    },
    {
      id: '2',
      name: 'QQQ Put Spreads',
      status: 'active',
      strategy: 'Put Credit Spread',
      pnl: 1830.75,
      pnlPercent: 8.2,
      trades: 18,
      account: 'Main Trading Account'
    },
    {
      id: '3',
      name: 'IWM Strangles',
      status: 'paused',
      strategy: 'Short Strangle',
      pnl: -240.50,
      pnlPercent: -2.1,
      trades: 12,
      account: 'IRA Account'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'paused': return 'text-yellow-400 bg-yellow-400/10'
      case 'stopped': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
            <p className="text-gray-300 mt-1">Monitor your automated trading performance</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/bot/new"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Create Bot
            </Link>
            <Link
              to="/account/link"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Link Account
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'bots', label: 'Trading Bots' },
              { key: 'accounts', label: 'Accounts' },
              { key: 'trades', label: 'Trade Log' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'bots' | 'accounts' | 'trades')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-gray-300 text-sm font-medium">Total Portfolio Value</h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-sm">
                    +{formatCurrency(accounts.reduce((sum, acc) => sum + acc.dayPnl, 0))} today
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-gray-300 text-sm font-medium">Active Bots</h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {bots.filter(bot => bot.status === 'active').length}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-gray-400 text-sm">
                    {bots.length} total bots
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-gray-300 text-sm font-medium">Total P&L</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {formatCurrency(bots.reduce((sum, bot) => sum + bot.pnl, 0))}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-sm">
                    +{((bots.reduce((sum, bot) => sum + bot.pnl, 0) / 50000) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
              <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}

        {/* Bots Tab */}
        {activeTab === 'bots' && (
          <div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Trading Bots</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Bot Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Strategy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        P&L
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Trades
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {bots.map((bot) => (
                      <tr key={bot.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{bot.name}</div>
                            <div className="text-sm text-gray-400">{bot.account}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bot.status)}`}>
                            {bot.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {bot.strategy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{formatCurrency(bot.pnl)}</div>
                          <div className={`text-sm ${bot.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {bot.pnlPercent >= 0 ? '+' : ''}{bot.pnlPercent}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {bot.trades}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300">Edit</button>
                            <button className="text-yellow-400 hover:text-yellow-300">
                              {bot.status === 'active' ? 'Pause' : 'Start'}
                            </button>
                            <button className="text-red-400 hover:text-red-300">Stop</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                    <p className="text-gray-400 text-sm">{account.broker}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Settings</button>
                    <button className="text-gray-400 hover:text-gray-300 text-sm">Refresh</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Account Balance</span>
                    <span className="text-white font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Today's P&L</span>
                    <span className={`font-medium ${account.dayPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {account.dayPnl >= 0 ? '+' : ''}{formatCurrency(account.dayPnl)} ({account.dayPnlPercent >= 0 ? '+' : ''}{account.dayPnlPercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Bots</span>
                    <span className="text-white">
                      {bots.filter(bot => bot.account === account.name && bot.status === 'active').length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
            <div className="text-center text-gray-400 py-12">
              <p>Trade log functionality coming soon...</p>
              <p className="text-sm mt-2">This will show detailed trade history and performance metrics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
