import { useState } from 'react'

interface TradingBot {
  id: string
  botName: string
  enabled: boolean
  status: 'Running' | 'Stopped' | 'Paused' | 'Error'
  symbol: string
  account: string
  legSpecs: string
  quantity: number
  entry: string
  exit: string
  lastTrade: string
  trades: number
  ytdPL: string
  allTimePL: string
  qty1xPL: string
  winRate: string
  strategy: string
}

export function BotManagement() {
  const [bots] = useState<TradingBot[]>([
    // Sample data - in real app this would come from API
  ])

  const [filters, setFilters] = useState({
    account: 'All',
    strategy: 'All',
    botStatus: 'All',
    entryDay: 'Any',
    symbol: 'All',
    webhookPartial: 'No'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBots, setSelectedBots] = useState<string[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(30)

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleSelectMultiple = () => {
    if (selectedBots.length > 0) {
      setSelectedBots([])
    } else {
      // In real app, this would select all visible bots
      setSelectedBots(['select-all'])
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-8">View Trading Bots</h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            {/* View by Account */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Account</label>
              <div className="relative">
                <select
                  value={filters.account}
                  onChange={(e) => handleFilterChange('account', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  <option value="Account1">Account 1</option>
                  <option value="Account2">Account 2</option>
                  <option value="Account3">Account 3</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Strategy */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Strategy</label>
              <div className="relative">
                <select
                  value={filters.strategy}
                  onChange={(e) => handleFilterChange('strategy', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  <option value="Iron Condor">Iron Condor</option>
                  <option value="Credit Spread">Credit Spread</option>
                  <option value="Straddle">Straddle</option>
                  <option value="Strangle">Strangle</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Bot Status */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Bot Status</label>
              <div className="relative">
                <select
                  value={filters.botStatus}
                  onChange={(e) => handleFilterChange('botStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  <option value="Running">Running</option>
                  <option value="Stopped">Stopped</option>
                  <option value="Paused">Paused</option>
                  <option value="Error">Error</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Entry Day */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Entry Day</label>
              <div className="relative">
                <select
                  value={filters.entryDay}
                  onChange={(e) => handleFilterChange('entryDay', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="Any">Any</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Symbol */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Symbol</label>
              <div className="relative">
                <select
                  value={filters.symbol}
                  onChange={(e) => handleFilterChange('symbol', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  <option value="SPY">SPY</option>
                  <option value="QQQ">QQQ</option>
                  <option value="IWM">IWM</option>
                  <option value="TLT">TLT</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Include Webhook/Partial Finish/One-Offs */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Include Webhook/Partial Finish/One-Offs in Stats</label>
              <div className="relative">
                <select
                  value={filters.webhookPartial}
                  onChange={(e) => handleFilterChange('webhookPartial', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSelectMultiple}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                ✓ SELECT MULTIPLE
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Search by Bot Name</label>
                <input
                  type="text"
                  placeholder="Bot Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mt-6">
                GET BOTS
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bot Name ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Enabled ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Leg Specs ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Entry ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Exit ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Trade ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trades ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    YTD P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    All Time P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Qty 1x P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Win Rate ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Strategy ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions ↕
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800">
                <tr>
                  <td colSpan={17} className="px-4 py-12 text-center text-gray-400">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="text-sm text-gray-400">
            Showing 0 to 0 of 0 entries
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
