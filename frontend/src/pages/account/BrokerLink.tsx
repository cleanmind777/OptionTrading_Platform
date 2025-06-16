import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface LinkedAccount {
  id: string
  enabled: boolean
  broker: string
  accountNumber: string
  accountName: string
  buyingPowerUsed: number
  leveragePercent: number
  balance: number
  linkStatus: 'connected' | 'disconnected' | 'pending'
  accountStatus: 'active' | 'inactive'
  trackedTrades: number
  dateAdded: string
}

interface TooltipProps {
  text: string
  children: React.ReactNode
}

function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <div className="relative inline-block">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600 shadow-lg max-w-xs"
          style={{ left: position.x + 10, top: position.y - 10 }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

export function BrokerLink() {
  const [showModal, setShowModal] = useState(false)
  const [hasAccounts, setHasAccounts] = useState(false) // Toggle for demo purposes

  const [linkedAccounts] = useState<LinkedAccount[]>([
    {
      id: '1',
      enabled: true,
      broker: 'Schwab Trading',
      accountNumber: '****1234',
      accountName: 'Main Trading Account',
      buyingPowerUsed: 75,
      leveragePercent: 50,
      balance: 125430.50,
      linkStatus: 'connected',
      accountStatus: 'active',
      trackedTrades: 142,
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      enabled: true,
      broker: 'TastyTrade',
      accountNumber: '****5678',
      accountName: 'IRA Account',
      buyingPowerUsed: 45,
      leveragePercent: 30,
      balance: 89250.00,
      linkStatus: 'connected',
      accountStatus: 'active',
      trackedTrades: 98,
      dateAdded: '2024-02-03'
    },
    {
      id: '3',
      enabled: false,
      broker: 'Tradier',
      accountNumber: '****9012',
      accountName: 'Practice Account',
      buyingPowerUsed: 0,
      leveragePercent: 25,
      balance: 15000.00,
      linkStatus: 'disconnected',
      accountStatus: 'inactive',
      trackedTrades: 23,
      dateAdded: '2024-03-10'
    }
  ])

  const displayAccounts = hasAccounts ? linkedAccounts : []

  const [brokerageStats] = useState({
    totalAccounts: displayAccounts.length,
    accountsEnabled: displayAccounts.filter(acc => acc.enabled).length,
    authenticationUpdated: hasAccounts ? 'Jan 06, 2025 9:30 AM' : 'Never',
    actions: displayAccounts.length
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Authorization Notice */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 md:p-4 mb-6 md:mb-8 flex items-start space-x-2 md:space-x-3">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs md:text-sm font-bold">i</span>
          </div>
          <p className="text-blue-800 text-sm md:text-base">
            Before you can use tradeSteward's services, you must{' '}
            <Link to="/broker-auth" className="text-blue-600 hover:text-blue-700 underline font-medium">
              authorize the link to your brokerage account
            </Link>
            .
          </p>
        </div>

        {/* Demo Toggle (for testing purposes) */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setHasAccounts(!hasAccounts)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {hasAccounts ? 'Show Empty State' : 'Show Connected Accounts'}
          </button>
        </div>

        {/* Manage Linked Brokerages Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">
            Manage Linked Brokerages
          </h1>

          {/* Summary Table - Mobile Responsive */}
          <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 overflow-hidden mb-6">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Total<br />Accounts
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Accounts<br />Enabled
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Authentication Updated
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-700">
                    <td className="px-6 py-8 text-center text-gray-400">-</td>
                    <td className="px-6 py-8 text-center text-white">{brokerageStats.totalAccounts}</td>
                    <td className="px-6 py-8 text-center text-white">{brokerageStats.accountsEnabled}</td>
                    <td className="px-6 py-8 text-center text-gray-400">{brokerageStats.authenticationUpdated}</td>
                    <td className="px-6 py-8 text-center text-white">{brokerageStats.actions}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-gray-300 text-xs mb-1">Total Accounts</div>
                  <div className="text-white font-medium">{brokerageStats.totalAccounts}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-xs mb-1">Enabled</div>
                  <div className="text-white font-medium">{brokerageStats.accountsEnabled}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-300 text-xs mb-1">Authentication Updated</div>
                  <div className="text-gray-400 text-sm">{brokerageStats.authenticationUpdated}</div>
                </div>
              </div>
            </div>

            {/* Add/Update Button */}
            <div className="p-4 md:p-6 text-center border-t border-slate-700">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 md:px-6 rounded transition-colors text-sm md:text-base"
              >
                ADD/UPDATE BROKERAGE LINK
              </button>
            </div>
          </div>
        </div>

        {/* Manage Linked Accounts Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">
            Manage Linked Accounts
          </h2>

          {/* Accounts Table - Responsive */}
          <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 overflow-hidden">
            {displayAccounts.length === 0 ? (
              <div className="p-6 md:p-12 text-center">
                <div className="text-gray-300 mb-4 text-sm md:text-base">
                  You must first connect your tradeSteward account to your brokerage account to see account details.{' '}
                  <Link to="/broker-auth" className="text-blue-400 hover:text-blue-300 underline">
                    Authorize the link to your brokerage account
                  </Link>{' '}
                  to complete setup.
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Enabled</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Broker</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Account Number</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Account Name</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">
                          Bots Max Buying Power<br />Used{' '}
                          <Tooltip text="Maximum percentage of buying power that can be used by trading bots">
                            <span className="inline-block w-4 h-4 bg-gray-500 rounded-full text-xs text-white leading-4 cursor-help">?</span>
                          </Tooltip>
                        </th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">
                          Account % for<br />Leverage{' '}
                          <Tooltip text="Percentage of account value that can be used for leveraged positions">
                            <span className="inline-block w-4 h-4 bg-gray-500 rounded-full text-xs text-white leading-4 cursor-help">?</span>
                          </Tooltip>
                        </th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Balance</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Link Status</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Acct Status</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Tracked Trades</th>
                        <th className="px-3 py-4 text-center text-xs font-medium text-gray-300">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayAccounts.map((account) => (
                        <tr key={account.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={account.enabled}
                              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.broker}</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.accountNumber}</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.accountName}</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.buyingPowerUsed}%</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.leveragePercent}%</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{formatCurrency(account.balance)}</td>
                          <td className="px-3 py-4 text-center">
                            <span className={`text-xs px-2 py-1 rounded ${
                              account.linkStatus === 'connected'
                                ? 'bg-green-400/10 text-green-400'
                                : account.linkStatus === 'pending'
                                ? 'bg-yellow-400/10 text-yellow-400'
                                : 'bg-red-400/10 text-red-400'
                            }`}>
                              {account.linkStatus}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-center">
                            <span className={`text-xs px-2 py-1 rounded ${
                              account.accountStatus === 'active'
                                ? 'bg-green-400/10 text-green-400'
                                : 'bg-gray-400/10 text-gray-400'
                            }`}>
                              {account.accountStatus}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.trackedTrades}</td>
                          <td className="px-3 py-4 text-center text-white text-xs">{account.dateAdded}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  {displayAccounts.map((account) => (
                    <div key={account.id} className="border-b border-slate-700 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-white font-medium text-sm">{account.accountName}</div>
                          <div className="text-gray-400 text-xs">{account.broker} • {account.accountNumber}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            account.linkStatus === 'connected'
                              ? 'bg-green-400/10 text-green-400'
                              : account.linkStatus === 'pending'
                              ? 'bg-yellow-400/10 text-yellow-400'
                              : 'bg-red-400/10 text-red-400'
                          }`}>
                            {account.linkStatus}
                          </span>
                          <input
                            type="checkbox"
                            checked={account.enabled}
                            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-gray-400">Balance</div>
                          <div className="text-white font-medium">{formatCurrency(account.balance)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Tracked Trades</div>
                          <div className="text-white font-medium">{account.trackedTrades}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Max Buying Power</div>
                          <div className="text-white font-medium">{account.buyingPowerUsed}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Leverage %</div>
                          <div className="text-white font-medium">{account.leveragePercent}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Back to Dashboard Link */}
        <div className="mt-6 md:mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm md:text-base"
          >
            ← Return to Trading Dashboard
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Add/Update Brokerage Link</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Brokerage</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white">
                  <option value="">Choose your brokerage...</option>
                  <option value="schwab">Charles Schwab</option>
                  <option value="tastytrade">TastyTrade</option>
                  <option value="tradier">Tradier</option>
                  <option value="tradestation">TradeStation (Coming Soon)</option>
                </select>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-400 text-sm mb-1">Secure Connection</h4>
                    <p className="text-blue-300 text-xs">
                      Your credentials are encrypted and stored securely. tradeSteward only accesses your account for authorized trading activities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <Link
                  to="/broker-auth"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-center"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
