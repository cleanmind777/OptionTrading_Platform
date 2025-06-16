import { useState } from 'react'

interface BotActivity {
  id: string
  timestamp: string
  botName: string
  action: string
  details: string
  result: 'Success' | 'Failed' | 'Warning' | 'Info'
  symbol?: string
  amount?: string
}

export function BotActivity() {
  const [activities] = useState<BotActivity[]>([
    {
      id: 'ACT001',
      timestamp: '2024-06-05 14:23:15',
      botName: 'Iron Condor Pro',
      action: 'Order Placed',
      details: 'Opened new Iron Condor position',
      result: 'Success',
      symbol: 'SPY',
      amount: '$2,450'
    },
    {
      id: 'ACT002',
      timestamp: '2024-06-05 14:20:32',
      botName: 'Credit Spread Master',
      action: 'Position Closed',
      details: 'Closed credit spread for profit target',
      result: 'Success',
      symbol: 'QQQ',
      amount: '$1,200'
    },
    {
      id: 'ACT003',
      timestamp: '2024-06-05 14:18:45',
      botName: 'Volatility Harvester',
      action: 'Risk Check',
      details: 'Portfolio delta exceeded threshold',
      result: 'Warning',
      symbol: 'IWM'
    },
    {
      id: 'ACT004',
      timestamp: '2024-06-05 14:15:20',
      botName: 'Iron Condor Pro',
      action: 'Market Scan',
      details: 'Scanned 150 symbols for opportunities',
      result: 'Info'
    },
    {
      id: 'ACT005',
      timestamp: '2024-06-05 14:12:10',
      botName: 'Credit Spread Master',
      action: 'Order Failed',
      details: 'Insufficient buying power for new position',
      result: 'Failed',
      symbol: 'SPY',
      amount: '$3,200'
    },
    {
      id: 'ACT006',
      timestamp: '2024-06-05 14:10:33',
      botName: 'Scalping Bot Alpha',
      action: 'Position Adjustment',
      details: 'Rolled short strike for better premium',
      result: 'Success',
      symbol: 'TSLA',
      amount: '$850'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [resultFilter, setResultFilter] = useState<string>('All')
  const [actionFilter, setActionFilter] = useState<string>('All')

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.symbol && activity.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesResult = resultFilter === 'All' || activity.result === resultFilter
    const matchesAction = actionFilter === 'All' || activity.action === actionFilter
    return matchesSearch && matchesResult && matchesAction
  })

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Success': return 'text-green-400'
      case 'Failed': return 'text-red-400'
      case 'Warning': return 'text-yellow-400'
      case 'Info': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case 'Success': return 'bg-green-600'
      case 'Failed': return 'bg-red-600'
      case 'Warning': return 'bg-yellow-600'
      case 'Info': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  const uniqueActions = [...new Set(activities.map(a => a.action))]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bot Activity Monitor</h1>
          <p className="text-gray-400">Real-time tracking of all bot actions and events</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Activities</h3>
            <div className="text-2xl font-bold text-white">{activities.length}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Successful Actions</h3>
            <div className="text-2xl font-bold text-green-400">
              {activities.filter(a => a.result === 'Success').length}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Failed Actions</h3>
            <div className="text-2xl font-bold text-red-400">
              {activities.filter(a => a.result === 'Failed').length}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Warnings</h3>
            <div className="text-2xl font-bold text-yellow-400">
              {activities.filter(a => a.result === 'Warning').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Search Activity</label>
              <input
                type="text"
                placeholder="Search bots, actions, symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Result</label>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Results</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Apply
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {activity.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {activity.botName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                      {activity.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {activity.symbol || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {activity.amount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getResultBadgeColor(activity.result)}`}>
                        {activity.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No activities found</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</div>
          </div>
        )}

        {/* Real-time Updates Banner */}
        <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-blue-200 text-sm">Live monitoring active - Activities update automatically</span>
          </div>
        </div>
      </div>
    </div>
  )
}
