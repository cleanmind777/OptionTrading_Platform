import { useState } from 'react'
import { Link } from 'react-router-dom'

export function EditMultipleBots() {
  const [selectedBots, setSelectedBots] = useState<string[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [disabledStrategy, setDisabledStrategy] = useState('')

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Edit Multiple Bots</h1>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="space-y-6">
            {/* Select Individual Bots */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Individual Bots to Edit
              </label>
              <input
                type="text"
                placeholder="Select Bots to Edit"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                value={selectedBots.join(', ')}
                readOnly
              />
            </div>

            {/* Select Enabled Bots by Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Enabled Bots by Strategy to Edit
              </label>
              <input
                type="text"
                placeholder="Select Strategy to Edit"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              />
            </div>

            {/* Select Disabled Bots by Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Disabled Bots by Strategy to Edit
              </label>
              <input
                type="text"
                placeholder="Select Strategy to Edit"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                value={disabledStrategy}
                onChange={(e) => setDisabledStrategy(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                EDIT BOTS
              </button>
              <Link
                to="/bots/create"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                CREATE NEW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
