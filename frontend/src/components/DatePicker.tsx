import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

export function DatePicker({ value, onChange, placeholder, label, className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })
  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse existing value on mount
  useEffect(() => {
    if (value && value.includes(' - ')) {
      const [start, end] = value.split(' - ')
      const startDate = new Date(start)
      const endDate = new Date(end)
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setDateRange({ startDate, endDate })
      }
    }
  }, [value])

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return ''
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const handleDateClick = (date: Date) => {
    if (!dateRange.startDate || selectingEndDate) {
      if (!dateRange.startDate) {
        setDateRange({ startDate: date, endDate: null })
        setSelectingEndDate(true)
      } else {
        if (date < dateRange.startDate) {
          setDateRange({ startDate: date, endDate: dateRange.startDate })
        } else {
          setDateRange({ ...dateRange, endDate: date })
        }
        setSelectingEndDate(false)
        const newValue = formatDateRange(dateRange.startDate, date)
        onChange(newValue)
        setIsOpen(false)
      }
    }
  }

  const handleQuickSelect = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    setDateRange({ startDate, endDate })
    const newValue = formatDateRange(startDate, endDate)
    onChange(newValue)
    setIsOpen(false)
  }

  const handleClear = () => {
    setDateRange({ startDate: null, endDate: null })
    setSelectingEndDate(false)
    onChange('')
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateInRange = (date: Date) => {
    if (!dateRange.startDate || !dateRange.endDate) return false
    return date >= dateRange.startDate && date <= dateRange.endDate
  }

  const isDateSelected = (date: Date) => {
    return (dateRange.startDate && date.getTime() === dateRange.startDate.getTime()) ||
           (dateRange.endDate && date.getTime() === dateRange.endDate.getTime())
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = isDateSelected(date)
      const isInRange = isDateInRange(date)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`w-8 h-8 text-sm rounded transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : isInRange
              ? 'bg-blue-100 text-blue-600'
              : isToday
              ? 'bg-slate-600 text-white'
              : 'text-gray-300 hover:bg-slate-600 hover:text-white'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-3">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder || 'MM/DD/YYYY - MM/DD/YYYY'}
          className={`w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${className}`}
          readOnly
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 w-80">
          {/* Quick Select Options */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Quick Select:</div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickSelect(7)}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded"
              >
                7 Days
              </button>
              <button
                onClick={() => handleQuickSelect(30)}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded"
              >
                30 Days
              </button>
              <button
                onClick={() => handleQuickSelect(90)}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded"
              >
                90 Days
              </button>
              <button
                onClick={() => handleQuickSelect(365)}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded"
              >
                1 Year
              </button>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-slate-700 rounded"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-white font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-slate-700 rounded"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs text-gray-400 font-medium p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {renderCalendar()}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-600">
            <div className="text-xs text-gray-400">
              {selectingEndDate ? 'Select end date' : 'Select start date'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleClear}
                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
