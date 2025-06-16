import { useState } from 'react'

export function BotPerformance() {
  const [selectedBots, setSelectedBots] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false)
  const [startHour, setStartHour] = useState('Hr')
  const [startMin, setStartMin] = useState('Min')
  const [endHour, setEndHour] = useState('Hr')
  const [endMin, setEndMin] = useState('Min')
  const [skipOneOffTrades, setSkipOneOffTrades] = useState(false)
  const [skipPartialFinish, setSkipPartialFinish] = useState(false)
  const [skipScheduledBot, setSkipScheduledBot] = useState(false)
  const [normalizeQuantity, setNormalizeQuantity] = useState(false)
  const [openingDates, setOpeningDates] = useState('06/09/2024 - 06/09/2025')
  const [closingDates, setClosingDates] = useState('06/09/2024 - 06/09/2025')
  const [byAccount, setByAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const strategies = [
    'Select Strategy',
    'Iron Condor',
    'Put Spread',
    'Call Spread',
    'Butterfly',
    'Strangle',
    'Straddle'
  ]

  const hours = ['Hr', ...Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'))]
  const minutes = ['Min', ...Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'))]

  const handleShowStats = async () => {
    setIsLoading(true)
    console.log('Showing bot performance stats...')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Here would be the logic to fetch and display statistics
    alert('Performance statistics generated successfully!')
    setIsLoading(false)
  }

  const handleReset = () => {
    setSelectedBots('')
    setSelectedStrategy('')
    setShowOnlyEnabled(false)
    setStartHour('Hr')
    setStartMin('Min')
    setEndHour('Hr')
    setEndMin('Min')
    setSkipOneOffTrades(false)
    setSkipPartialFinish(false)
    setSkipScheduledBot(false)
    setNormalizeQuantity(false)
    setOpeningDates('06/09/2024 - 06/09/2025')
    setClosingDates('06/09/2024 - 06/09/2025')
    setByAccount('')
  }

  const handleExport = () => {
    console.log('Exporting performance data...')
    // Logic to export data would go here
    alert('Performance data exported successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Bot Performance Analytics</h1>
              <p className="text-gray-400 mt-2">Analyze and track your trading bot performance with advanced filtering options</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors font-medium"
              >
                Reset Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Bot Selection & Filters */}
          <div className="space-y-6">
            {/* Bot Selection Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bot Selection
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Bots</label>
                  <input
                    type="text"
                    value={selectedBots}
                    onChange={(e) => setSelectedBots(e.target.value)}
                    placeholder="Type bot names or use commas to separate multiple bots..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to include all bots</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Strategy</label>
                  <div className="relative">
                    <select
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      {strategies.map(strategy => (
                        <option key={strategy} value={strategy}>{strategy}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced Toggle */}
                <div className="pt-2">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showOnlyEnabled}
                        onChange={(e) => setShowOnlyEnabled(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition-all duration-300 ${
                        showOnlyEnabled ? 'bg-blue-600 shadow-lg' : 'bg-slate-600'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${
                        showOnlyEnabled ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                    <span className="ml-3 text-gray-300 font-medium">Show Only Enabled Bots for Strategy</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Time Window Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entry Time Window
              </h2>

              <div className="space-y-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 w-12 text-sm">Start:</span>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {hours.map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <span className="text-gray-400">:</span>
                    <select
                      value={startMin}
                      onChange={(e) => setStartMin(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {minutes.map(minute => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 w-12 text-sm">End:</span>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {hours.map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <span className="text-gray-400">:</span>
                    <select
                      value={endMin}
                      onChange={(e) => setEndMin(e.target.value)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {minutes.map(minute => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Selection Options Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Trade Selection Options
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { state: skipOneOffTrades, setter: setSkipOneOffTrades, label: 'Skip One-Off Trades', description: 'Exclude manual trades from analysis' },
                  { state: skipPartialFinish, setter: setSkipPartialFinish, label: 'Skip Partial Finish Trades', description: 'Exclude trades that were manually closed' },
                  { state: skipScheduledBot, setter: setSkipScheduledBot, label: 'Skip Scheduled Bot Trades', description: 'Exclude scheduled bot executions' },
                  { state: normalizeQuantity, setter: setNormalizeQuantity, label: 'Normalize to Quantity 1 Per Trade', description: 'Standardize all trades to quantity of 1' }
                ].map((option, index) => (
                  <label key={index} className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={option.state}
                      onChange={(e) => option.setter(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                    />
                    <div className="ml-3">
                      <span className="text-gray-300 font-medium">{option.label}</span>
                      <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Date Ranges & Account */}
          <div className="space-y-6">
            {/* Date Ranges Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date Ranges
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trade Opening Dates</label>
                  <input
                    type="text"
                    value={openingDates}
                    onChange={(e) => setOpeningDates(e.target.value)}
                    placeholder="MM/DD/YYYY - MM/DD/YYYY"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Date range when trades were opened</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trade Closing Dates</label>
                  <input
                    type="text"
                    value={closingDates}
                    onChange={(e) => setClosingDates(e.target.value)}
                    placeholder="MM/DD/YYYY - MM/DD/YYYY"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Date range when trades were closed</p>
                </div>
              </div>
            </div>

            {/* Account Filter Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Filter
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Account</label>
                <input
                  type="text"
                  value={byAccount}
                  onChange={(e) => setByAccount(e.target.value)}
                  placeholder="Enter account name or leave empty for all accounts"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Analyze performance for specific trading accounts</p>
              </div>
            </div>

            {/* Quick Stats Preview */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/20">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Quick Preview
              </h2>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">87%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">$2,347</div>
                  <div className="text-xs text-gray-400">Total P&L</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">143</div>
                  <div className="text-xs text-gray-400">Total Trades</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">12</div>
                  <div className="text-xs text-gray-400">Active Bots</div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                Preview based on current filters • Click "Show Stats" for detailed analysis
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
          <button
            onClick={handleShowStats}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Stats...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>SHOW ME THE STATS</span>
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-400 text-sm">
          <p>Configure your filters above and click "Show Me The Stats" to generate comprehensive performance analytics.</p>
          <p className="mt-1">Use the export function to save your performance data for external analysis.</p>
        </div>
      </div>
    </div>
  )
}
