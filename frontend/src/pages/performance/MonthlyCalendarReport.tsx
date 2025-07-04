import { useState } from 'react'

interface DayPerformance {
  date: number
  pnl: number
  pnlPercent: number
  trades: number
  isToday?: boolean
  isWeekend?: boolean
}

export function MonthlyCalendarReport() {
  const [selectedAccount, setSelectedAccount] = useState('Accounts Combined')
  const [selectedMonthYear, setSelectedMonthYear] = useState('')
  const [calendarData, setCalendarData] = useState<DayPerformance[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetCalendar = () => {
    if (!selectedMonthYear) return

    setIsLoading(true)
    console.log('Getting calendar for:', { selectedAccount, selectedMonthYear })

    // Simulate API call with mock data generation
    setTimeout(() => {
      const [year, month] = selectedMonthYear.split('-').map(Number)
      const daysInMonth = new Date(year, month, 0).getDate()
      const today = new Date()

      const mockData: DayPerformance[] = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const isToday = date.toDateString() === today.toDateString()

        // Generate realistic trading performance data (only for weekdays)
        const pnl = isWeekend ? 0 : (Math.random() - 0.45) * 1000 // Slight positive bias
        const trades = isWeekend ? 0 : Math.floor(Math.random() * 8) + 1
        const pnlPercent = pnl / 50000 * 100 // Assuming 50k account

        mockData.push({
          date: day,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
          trades,
          isToday,
          isWeekend
        })
      }

      setCalendarData(mockData)
      setIsLoading(false)
    }, 1000)
  }

  // Generate month/year options for the dropdown
  const generateMonthYearOptions = () => {
    const options = []
    const currentDate = new Date()

    // Add current month and previous 12 months
    for (let i = 0; i < 13; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'long' })
      const year = date.getFullYear()
      const value = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`
      options.push({
        value,
        label: `${monthName} ${year}`
      })
    }

    return options
  }

  const monthYearOptions = generateMonthYearOptions()

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  // Helper function to render calendar grid
  const renderCalendarGrid = () => {
    if (!calendarData || !selectedMonthYear) return null

    const [year, month] = selectedMonthYear.split('-').map(Number)
    const firstDay = getFirstDayOfMonth(year, month)
    const daysInMonth = calendarData.length

    // Create array for calendar cells (including empty cells for alignment)
    const calendarCells = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} className="h-24 border border-slate-600"></div>
      )
    }

    // Add cells for each day of the month
    calendarData.forEach((day) => {
      const bgColor = day.isWeekend
        ? 'bg-slate-700'
        : day.pnl > 0
          ? 'bg-green-900/30 border-green-500/30'
          : day.pnl < 0
            ? 'bg-red-900/30 border-red-500/30'
            : 'bg-slate-800'

      const textColor = day.pnl > 0 ? 'text-green-400' : day.pnl < 0 ? 'text-red-400' : 'text-gray-400'

      calendarCells.push(
        <div
          key={day.date}
          className={`h-24 border border-slate-600 p-2 ${bgColor} ${day.isToday ? 'ring-2 ring-blue-500' : ''} relative`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-medium ${day.isToday ? 'text-blue-400' : 'text-white'}`}>
              {day.date}
            </div>
            {!day.isWeekend && (
              <>
                <div className={`text-xs font-semibold mt-1 ${textColor}`}>
                  {day.pnl >= 0 ? '+' : ''}{formatCurrency(day.pnl)}
                </div>
                <div className={`text-xs ${textColor}`}>
                  {day.pnlPercent >= 0 ? '+' : ''}{day.pnlPercent.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-auto">
                  {day.trades} trades
                </div>
              </>
            )}
            {day.isWeekend && (
              <div className="text-xs text-gray-500 mt-auto">Weekend</div>
            )}
          </div>
        </div>
      )
    })

    return calendarCells
  }

  // Calculate month summary statistics
  const getMonthSummary = () => {
    if (!calendarData) return null

    const tradingDays = calendarData.filter(day => !day.isWeekend)
    const totalPnL = tradingDays.reduce((sum, day) => sum + day.pnl, 0)
    const totalTrades = tradingDays.reduce((sum, day) => sum + day.trades, 0)
    const winningDays = tradingDays.filter(day => day.pnl > 0).length
    const winRate = tradingDays.length > 0 ? (winningDays / tradingDays.length) * 100 : 0

    return {
      totalPnL,
      totalTrades,
      winningDays,
      tradingDays: tradingDays.length,
      winRate
    }
  }

  const monthSummary = getMonthSummary()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-12">
          Calendar Performance Report
        </h1>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Select Account */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
              Select Account
            </label>
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 min-w-[180px]"
              >
                <option value="Accounts Combined">Accounts Combined</option>
                {/* <option value="Account 1">Account 1</option>
                <option value="Account 2">Account 2</option>
                <option value="Account 3">Account 3</option> */}
                <option value="Paper Trading">Paper Trading</option>
                <option value="Live Trading">Live Trading</option>
                <option value="IRA Account">IRA Account</option>
                <option value="Roth IRA">Roth IRA</option>
                <option value="Main Trading Account">Main Trading Account</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Select Month/Year */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
              Select Month/Year
            </label>
            <div className="relative">
              <select
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 min-w-[150px]"
              >
                <option value="">Select Month</option>
                {monthYearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* GET CALENDAR Button */}
          <button
            onClick={handleGetCalendar}
            disabled={!selectedMonthYear || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? 'LOADING...' : 'GET CALENDAR'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-300">Loading calendar data...</span>
              </div>
            </div>
          )}

          {/* Calendar Display */}
          {calendarData && !isLoading && (
            <>
              {/* Calendar Header */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {monthYearOptions.find(opt => opt.value === selectedMonthYear)?.label} Performance
                    </h2>
                    <p className="text-gray-400">{selectedAccount}</p>
                  </div>

                  {/* Month Summary Stats */}
                  {monthSummary && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-0">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${monthSummary.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {monthSummary.totalPnL >= 0 ? '+' : ''}{formatCurrency(monthSummary.totalPnL)}
                        </div>
                        <div className="text-xs text-gray-400">Total P/L</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{monthSummary.totalTrades}</div>
                        <div className="text-xs text-gray-400">Total Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{monthSummary.winningDays}/{monthSummary.tradingDays}</div>
                        <div className="text-xs text-gray-400">Win Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{monthSummary.winRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="space-y-4">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-px">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="h-8 bg-slate-700 border border-slate-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-300">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-px">
                    {renderCalendarGrid()}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-900/30 border border-green-500/30 rounded"></div>
                    <span className="text-gray-300">Profitable Day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-900/30 border border-red-500/30 rounded"></div>
                    <span className="text-gray-300">Loss Day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"></div>
                    <span className="text-gray-300">Weekend</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-800 border-2 border-blue-500 rounded"></div>
                    <span className="text-gray-300">Today</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Initial State */}
          {!calendarData && !isLoading && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="text-gray-400">
                {selectedMonthYear
                  ? 'Click "GET CALENDAR" to view calendar performance report'
                  : 'Select an account and month/year to view calendar performance report'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
