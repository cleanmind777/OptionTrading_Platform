import { useState } from 'react'

interface SharedBot {
  id: string
  name: string
  strategy: string
  owner: string
  sharedBy: string
  performance: string
  status: 'Active' | 'Paused' | 'Stopped'
  lastUpdate: string
  permissions: 'View' | 'Edit' | 'Full Access'
}

export function BotSharedBots() {
  const [sharedBots] = useState<SharedBot[]>([
    {
      id: 'SB001',
      name: 'Iron Condor Pro',
      strategy: 'Iron Condor',
      owner: 'john.doe@example.com',
      sharedBy: 'Team Alpha',
      performance: '+12.5%',
      status: 'Active',
      lastUpdate: '2 hours ago',
      permissions: 'View'
    },
    {
      id: 'SB002',
      name: 'Credit Spread Master',
      strategy: 'Credit Spreads',
      owner: 'sarah.smith@example.com',
      sharedBy: 'Team Beta',
      performance: '+8.3%',
      status: 'Active',
      lastUpdate: '1 day ago',
      permissions: 'Edit'
    },
    {
      id: 'SB003',
      name: 'Volatility Harvester',
      strategy: 'Straddle/Strangle',
      owner: 'mike.jones@example.com',
      sharedBy: 'Premium Group',
      performance: '+15.7%',
      status: 'Paused',
      lastUpdate: '3 hours ago',
      permissions: 'Full Access'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const filteredBots = sharedBots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || bot.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400'
      case 'Paused': return 'text-yellow-400'
      case 'Stopped': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getPermissionBadgeColor = (permission: string) => {
    switch (permission) {
      case 'View': return 'bg-blue-600'
      case 'Edit': return 'bg-orange-600'
      case 'Full Access': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Group Shared Bots</h1>
          <p className="text-gray-400">View and manage bots shared with your groups</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Search Bots</label>
              <input
                type="text"
                placeholder="Search by name, strategy, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Stopped">Stopped</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Shared Bots Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bot Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Owner / Shared By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {filteredBots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{bot.name}</div>
                        <div className="text-sm text-gray-400">{bot.strategy}</div>
                        <div className="text-xs text-gray-500">ID: {bot.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{bot.owner}</div>
                        <div className="text-sm text-gray-400">via {bot.sharedBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-400">{bot.performance}</div>
                      <div className="text-xs text-gray-500">Updated {bot.lastUpdate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(bot.status)}`}>
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getPermissionBadgeColor(bot.permissions)}`}>
                        {bot.permissions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          View
                        </button>
                        {(bot.permissions === 'Edit' || bot.permissions === 'Full Access') && (
                          <button className="text-green-400 hover:text-green-300 transition-colors">
                            Copy
                          </button>
                        )}
                        {bot.permissions === 'Full Access' && (
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No shared bots found</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Total Shared Bots</h3>
            <div className="text-3xl font-bold text-blue-400">{sharedBots.length}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Active Bots</h3>
            <div className="text-3xl font-bold text-green-400">
              {sharedBots.filter(bot => bot.status === 'Active').length}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Full Access Bots</h3>
            <div className="text-3xl font-bold text-purple-400">
              {sharedBots.filter(bot => bot.permissions === 'Full Access').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
