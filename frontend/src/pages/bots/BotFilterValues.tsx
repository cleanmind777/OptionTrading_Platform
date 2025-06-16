import { useState } from 'react'

export function BotFilterValues() {
  const [selectedSymbol, setSelectedSymbol] = useState('Select Symbol')

  const handleGetFilterValues = () => {
    console.log('Getting filter values for:', selectedSymbol)
    // In a real app, this would trigger an API call to fetch filter values
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          Bot Filter Values
        </h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Underlying Filter Values Section */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Underlying Filter Values
              </h2>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Underlying Symbol
                </label>
                <div className="relative">
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="Select Symbol">Select Symbol</option>
                    <option value="SPY">SPY</option>
                    <option value="QQQ">QQQ</option>
                    <option value="IWM">IWM</option>
                    <option value="AAPL">AAPL</option>
                    <option value="TSLA">TSLA</option>
                    <option value="NVDA">NVDA</option>
                    <option value="AMZN">AMZN</option>
                  </select>
                  {/* Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGetFilterValues}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
              >
                GET FILTER VALUES
              </button>
            </div>
          </div>

          {/* Volatility Index Filter Values Section */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Volatility Index Filter Values
              </h2>
            </div>

            {/* Section Content */}
            <div className="p-6 space-y-4">
              {/* Market Status */}
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Today's Opening VIX Quote:</span> Markets are currently closed.
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Yesterday's Closing VIX Quote:</span> 16.77
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Current VIX Quote:</span> Markets are currently closed.
                </p>
              </div>

              {/* Volatility Index Filter Values */}
              <div className="space-y-2 pt-4">
                <h3 className="text-white font-medium">Volatility Index Filter Values:</h3>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Volatility Index (VIX) Intraday Change:</span> Markets are currently closed.
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Volatility Index (VIX) One-Day Change:</span> Markets are currently closed.
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Volatility Index (VIX) Overnight Gap:</span> Markets are currently closed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
