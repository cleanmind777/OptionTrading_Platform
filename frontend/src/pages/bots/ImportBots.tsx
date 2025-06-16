import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ImportBots() {
  const [selectedBot, setSelectedBot] = useState('')

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Import Bots</h1>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="space-y-6">
            {/* Select Base Settings Bot */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Select Base Settings Bot</h2>

              <div className="flex items-center space-x-4 mb-4">
                <select
                  value={selectedBot}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="">Select Base Settings Bot</option>
                  <option value="bot1">Bot 1</option>
                  <option value="bot2">Bot 2</option>
                  <option value="bot3">Bot 3</option>
                </select>

                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                  SELECT BASE SETTINGS BOT
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
                  EDIT BOT
                </button>
                <Link
                  to="/bots/create"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  CREATE NEW BOT
                </Link>
              </div>

              {/* Description Text */}
              <div className="mt-6 text-sm text-gray-400">
                <p>
                  Select the bot that contains the settings template that you want to use for settings not defined in your configuration file.
                </p>
                <p className="mt-2">
                  Learn more about the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    file format required to import bots
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
