import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface RealTimeMetrics {
  activePositions: number
  dailyPnL: number
  todaysTrades: number
  riskExposure: number
  portfolioValue: number
  availableCash: number
  marginUsed: number
  winRateToday: number
}

interface Alert {
  id: string
  botId: string
  botName: string
  type: 'profit' | 'loss' | 'risk' | 'position' | 'system'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  action?: string
}

interface BotStatus {
  botId: string
  name: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  lastUpdate: string
  healthScore: number
  activePositions: number
  dailyPnL: number
  risk: number
  performance: {
    labels: string[]
    data: number[]
  }
}

interface PerformanceMetric {
  name: string
  value: number
  change: number
  changePercent: number
  target?: number
  status: 'good' | 'warning' | 'critical'
}

export function BotPerformanceDashboard() {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    activePositions: 0,
    dailyPnL: 0,
    todaysTrades: 0,
    riskExposure: 0,
    portfolioValue: 0,
    availableCash: 0,
    marginUsed: 0,
    winRateToday: 0
  })

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [botStatuses, setBotStatuses] = useState<BotStatus[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D')
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString())
  const [showAlertsPanel, setShowAlertsPanel] = useState(false)

  useEffect(() => {
    // Initialize data
    loadRealTimeMetrics()
    loadBotStatuses()
    loadPerformanceMetrics()
    loadAlerts()

    // Set up real-time updates
    const interval = setInterval(() => {
      if (isLiveMode) {
        updateRealTimeData()
        setLastUpdate(new Date().toLocaleTimeString())
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLiveMode])

  const loadRealTimeMetrics = () => {
    setRealTimeMetrics({
      activePositions: 23,
      dailyPnL: 1250.75,
      todaysTrades: 8,
      riskExposure: 15.3,
      portfolioValue: 125430.50,
      availableCash: 32150.25,
      marginUsed: 18750.00,
      winRateToday: 87.5
    })
  }

  const loadBotStatuses = () => {
    const mockStatuses: BotStatus[] = [
      {
        botId: '1',
        name: 'SPY Iron Condor Weekly',
        status: 'running',
        lastUpdate: '1 min ago',
        healthScore: 95,
        activePositions: 8,
        dailyPnL: 450.25,
        risk: 4.2,
        performance: {
          labels: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
          data: [100, 150, 125, 200, 300, 450]
        }
      },
      {
        botId: '2',
        name: 'QQQ Put Credit Spread',
        status: 'running',
        lastUpdate: '30 sec ago',
        healthScore: 88,
        activePositions: 5,
        dailyPnL: 320.50,
        risk: 6.1,
        performance: {
          labels: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
          data: [50, 80, 120, 180, 250, 320]
        }
      },
      {
        botId: '3',
        name: 'IWM Short Strangle',
        status: 'paused',
        lastUpdate: '15 min ago',
        healthScore: 65,
        activePositions: 3,
        dailyPnL: -150.75,
        risk: 8.9,
        performance: {
          labels: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
          data: [0, -50, -100, -125, -140, -150]
        }
      },
      {
        botId: '4',
        name: 'TLT Calendar Spread',
        status: 'error',
        lastUpdate: '45 min ago',
        healthScore: 25,
        activePositions: 0,
        dailyPnL: 0,
        risk: 0,
        performance: {
          labels: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
          data: [25, 30, 15, 10, 5, 0]
        }
      }
    ]
    setBotStatuses(mockStatuses)
  }

  const loadPerformanceMetrics = () => {
    const mockMetrics: PerformanceMetric[] = [
      {
        name: 'Portfolio Return',
        value: 15.8,
        change: 0.5,
        changePercent: 3.3,
        target: 12.0,
        status: 'good'
      },
      {
        name: 'Sharpe Ratio',
        value: 1.85,
        change: 0.12,
        changePercent: 6.9,
        target: 1.5,
        status: 'good'
      },
      {
        name: 'Max Drawdown',
        value: -5.2,
        change: 0.8,
        changePercent: -13.3,
        target: -10.0,
        status: 'good'
      },
      {
        name: 'Win Rate',
        value: 73.5,
        change: -2.1,
        changePercent: -2.8,
        target: 70.0,
        status: 'warning'
      },
      {
        name: 'Risk Score',
        value: 6.8,
        change: 1.2,
        changePercent: 21.4,
        target: 5.0,
        status: 'warning'
      },
      {
        name: 'Profit Factor',
        value: 1.45,
        change: -0.08,
        changePercent: -5.2,
        target: 1.2,
        status: 'good'
      }
    ]
    setPerformanceMetrics(mockMetrics)
  }

  const loadAlerts = () => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        botId: '1',
        botName: 'SPY Iron Condor Weekly',
        type: 'profit',
        severity: 'info',
        title: 'Profit Target Reached',
        message: 'Position closed at 50% profit target',
        timestamp: '11:45 AM',
        isRead: false,
        action: 'View Trade'
      },
      {
        id: '2',
        botId: '3',
        botName: 'IWM Short Strangle',
        type: 'risk',
        severity: 'warning',
        title: 'Risk Limit Approaching',
        message: 'Position risk at 85% of maximum allowed',
        timestamp: '11:30 AM',
        isRead: false,
        action: 'Adjust Position'
      },
      {
        id: '3',
        botId: '4',
        botName: 'TLT Calendar Spread',
        type: 'system',
        severity: 'critical',
        title: 'Bot Connection Error',
        message: 'Unable to connect to broker API',
        timestamp: '11:15 AM',
        isRead: false,
        action: 'Reconnect'
      },
      {
        id: '4',
        botId: '2',
        botName: 'QQQ Put Credit Spread',
        type: 'position',
        severity: 'info',
        title: 'New Position Opened',
        message: 'Opened 5 contracts at 0.12 delta',
        timestamp: '10:50 AM',
        isRead: true
      }
    ]
    setAlerts(mockAlerts)
  }

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setRealTimeMetrics(prev => ({
      ...prev,
      dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 50,
      riskExposure: Math.max(0, prev.riskExposure + (Math.random() - 0.5) * 2),
      winRateToday: Math.max(0, Math.min(100, prev.winRateToday + (Math.random() - 0.5) * 5))
    }))

    // Randomly generate new alerts
    if (Math.random() < 0.1) { // 10% chance every update
      const newAlert: Alert = {
        id: Date.now().toString(),
        botId: '1',
        botName: 'SPY Iron Condor Weekly',
        type: 'profit',
        severity: 'info',
        title: 'Market Update',
        message: `Real-time market movement detected`,
        timestamp: new Date().toLocaleTimeString(),
        isRead: false
      }
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]) // Keep last 10 alerts
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-900/20'
      case 'paused': return 'text-yellow-400 bg-yellow-900/20'
      case 'stopped': return 'text-gray-400 bg-gray-900/20'
      case 'error': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-400 bg-blue-900/20 border-blue-700'
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Bot Performance Dashboard</h1>
            <p className="text-gray-300">Real-time monitoring and performance analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-300">
                {isLiveMode ? 'Live' : 'Paused'} • Last update: {lastUpdate}
              </span>
            </div>
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isLiveMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLiveMode ? 'Pause' : 'Resume'} Live Updates
            </button>
            <button
              onClick={() => setShowAlertsPanel(!showAlertsPanel)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              🔔 Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-white">{realTimeMetrics.activePositions}</div>
            <div className="text-sm text-gray-400">Active Positions</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className={`text-2xl font-bold ${realTimeMetrics.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${realTimeMetrics.dailyPnL.toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">Daily P&L</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-white">{realTimeMetrics.todaysTrades}</div>
            <div className="text-sm text-gray-400">Today's Trades</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-yellow-400">{realTimeMetrics.riskExposure.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Risk Exposure</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">${(realTimeMetrics.portfolioValue / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-400">Portfolio Value</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">${(realTimeMetrics.availableCash / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-400">Available Cash</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-orange-400">${(realTimeMetrics.marginUsed / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-400">Margin Used</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-green-400">{realTimeMetrics.winRateToday.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Win Rate Today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bot Status Overview */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Bot Status Overview</h2>
              <div className="space-y-4">
                {botStatuses.map((bot) => (
                  <div key={bot.botId} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{bot.name}</span>
                          <span className="text-xs text-gray-400">Updated {bot.lastUpdate}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
                          {bot.status.toUpperCase()}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">Health: {bot.healthScore}%</div>
                          <div className={`text-xs ${bot.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${bot.dailyPnL.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Positions:</span>
                        <span className="text-blue-400 ml-2">{bot.activePositions}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Risk:</span>
                        <span className={`ml-2 ${
                          bot.risk < 5 ? 'text-green-400' :
                          bot.risk < 7 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {bot.risk.toFixed(1)}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Health:</span>
                        <span className={`ml-2 ${
                          bot.healthScore > 80 ? 'text-green-400' :
                          bot.healthScore > 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {bot.healthScore}%
                        </span>
                      </div>
                    </div>

                    {/* Mini Performance Chart */}
                    <div className="mt-3 h-16 bg-slate-600 rounded relative overflow-hidden">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        <polyline
                          fill="none"
                          stroke={bot.dailyPnL >= 0 ? "#10b981" : "#ef4444"}
                          strokeWidth="2"
                          points={bot.performance.data.map((value, index) => {
                            const x = (index / (bot.performance.data.length - 1)) * 100
                            const y = 100 - ((value - Math.min(...bot.performance.data)) /
                              (Math.max(...bot.performance.data) - Math.min(...bot.performance.data))) * 100
                            return `${x},${y}`
                          }).join(' ')}
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.name} className="bg-slate-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">{metric.name}</div>
                    <div className={`text-2xl font-bold mb-1 ${getMetricStatusColor(metric.status)}`}>
                      {metric.value > 0 && metric.name !== 'Max Drawdown' ? '+' : ''}{metric.value}
                      {metric.name.includes('Rate') || metric.name.includes('Return') ? '%' : ''}
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change} ({metric.changePercent >= 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%)
                      </span>
                      {metric.target && (
                        <span className="text-gray-500">
                          Target: {metric.target}{metric.name.includes('Rate') || metric.name.includes('Return') ? '%' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Alerts</h2>
                <button
                  onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${
                      !alert.isRead ? 'bg-opacity-20' : 'bg-opacity-10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-400' :
                          alert.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <span className="font-medium text-white text-sm">{alert.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{alert.botName}</span>
                      {alert.action && (
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                          {alert.action}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
