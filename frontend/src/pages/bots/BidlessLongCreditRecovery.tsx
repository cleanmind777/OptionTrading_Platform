import { useState } from 'react'

export function BidlessLongCreditRecovery() {
  const [accountSearch, setAccountSearch] = useState('')
  const [dateRange, setDateRange] = useState('06/09/2024 - 06/09/2025')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    console.log('Searching with:', { accountSearch, dateRange })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    // In a real app, this would trigger a search API call
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-center text-white mb-12">
          Bot Bidless Long Credit Recovery
        </h1>

        {/* Search Section */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            {/* Search By Account */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Search By Account
              </label>
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder=""
              />
            </div>

            {/* Search by Date */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Search by Date
              </label>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-10 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>SEARCHING...</span>
                </>
              ) : (
                <span>SEARCH</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-600 font-medium text-base">
              No bidless long sales data for this period is available.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
