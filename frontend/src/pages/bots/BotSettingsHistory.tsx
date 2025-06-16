import { useState } from 'react'

export function BotSettingsHistory() {
  const [selectedBot, setSelectedBot] = useState('All Bots')
  const [viewAs, setViewAs] = useState('Settings Time')

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bot Settings History</h1>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Select Bot to View */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Bot to View
              </label>
              <div className="relative">
                <select
                  value={selectedBot}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white appearance-none"
                >
                  <option value="All Bots">All Bots</option>
                  <option value="Bot 1">Bot 1</option>
                  <option value="Bot 2">Bot 2</option>
                  <option value="Bot 3">Bot 3</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Settings As Of */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                View Settings As Of
              </label>
              <select
                value={viewAs}
                onChange={(e) => setViewAs(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value="Settings Time">Settings Time</option>
                <option value="Current Time">Current Time</option>
                <option value="Custom Date">Custom Date</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                GET SETTINGS
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                COPY TO NEW BOT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
