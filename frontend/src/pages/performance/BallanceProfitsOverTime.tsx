import { useState } from 'react'
import { PerformanceChart } from '../../components/PerformanceChart'
import { DatePicker } from '../../components/DatePicker'

export function BalanceProfitsOverTime() {
  const [selectedAccount, setSelectedAccount] = useState('All Accounts')
  const [selectedInterval, setSelectedInterval] = useState('Daily')
  const [dateRange, setDateRange] = useState('01/01/2025 - 06/09/2025')
  const [showChart, setShowChart] = useState(false)

  const handleChartIt = () => {
    console.log('Generating chart with:', { selectedAccount, selectedInterval, dateRange })
    setShowChart(true)
  }

  const handleExport = (format: 'csv' | 'json' | 'png') => {
    console.log(`Exporting chart as ${format}`)
    // In a real app, this would handle the export functionality
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          Account Balance and Profits by Day
        </h1>

        {/* Controls Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Select Account */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Account:
              </label>
              <div className="relative">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="All Accounts">All Accounts</option>
                  {/* <option value="Account 1">Account 1</option>
                  <option value="Account 2">Account 2</option>
                  <option value="Account 3">Account 3</option> */}
                  <option value="Paper Trading">Paper Trading</option>
                  <option value="Live Trading">Live Trading</option>
                </select>
                {/* Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Select Interval Period */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Interval Period:
              </label>
              <div className="relative">
                <select
                  value={selectedInterval}
                  onChange={(e) => setSelectedInterval(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                {/* Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Select Date Range */}
            <div>
              <DatePicker
                label="Select Date Range:"
                value={dateRange}
                onChange={setDateRange}
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
              />
            </div>
          </div>

          {/* Chart It Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleChartIt}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md transition-colors"
            >
              CHART IT
            </button>
          </div>
        </div>

        {/* Chart Section */}
        {showChart ? (
          <PerformanceChart
            account={selectedAccount}
            interval={selectedInterval}
            dateRange={dateRange}
            onExport={handleExport}
          />
        ) : (
          <div className="bg-slate-200 text-slate-800 rounded-lg p-6 text-center">
            <p className="text-blue-600 font-medium">
              Click "CHART IT" to generate your balance and profits chart.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
