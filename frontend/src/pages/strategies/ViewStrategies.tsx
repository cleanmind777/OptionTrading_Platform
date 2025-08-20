import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { roundTo } from '../../utils/NumberProcess';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Strategy {
  id: string
  user_id: string
  name: string
  is_active: boolean
  description: string
  symbol: string
  parameters: JSON
  trade_type: string
  number_of_legs: number
  skip_am_expirations: boolean
  sell_bidless_longs_on_trade_exit: boolean
  efficient_spreads: boolean
  legs: JSON
  total_profit: number
  total_loss: number
  total_wins: number
  total_losses: number
  // lastTraded: string
  // allTimeCommissions: number
  // ytdCommissions: number
  // allTimeNetPL: number
  // ytdNetPL: number,
  created_at: Date,
  updated_at: Date,

}

export function ViewStrategies() {
  const navigate = useNavigate();
  const [hideDisabled, setHideDisabled] = useState(false)
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // const strategies: Strategy[] = [
  //   {
  //     id: 'iron-condor',
  //     name: 'Iron Condor Strategy',
  //     user_id: "",
  //     is_active: true,
  //     description: 'A neutral options strategy that profits from low volatility by selling both put and call spreads',
  //     lastTraded: '2025-06-09',
  //     tradeCount: 124,
  //     allTimeCommissions: 1240.50,
  //     ytdCommissions: 580.25,
  //     allTimeNetPL: 5420.30,
  //     ytdNetPL: 2150.75
  //   },
  //   {
  //     id: 'credit-spread',
  //     name: 'Put Credit Spread',
  //     user_id: "",
  //     is_active: true,
  //     description: 'Bullish options strategy that profits from time decay and upward price movement',
  //     lastTraded: '2025-06-08',
  //     tradeCount: 89,
  //     allTimeCommissions: 890.00,
  //     ytdCommissions: 445.00,
  //     allTimeNetPL: 2830.75,
  //     ytdNetPL: 1425.35
  //   },
  //   {
  //     id: 'covered-call',
  //     name: 'Covered Call Strategy',
  //     user_id: "",
  //     is_active: true,
  //     description: 'Conservative income strategy for existing stock positions',
  //     lastTraded: '2025-06-07',
  //     tradeCount: 156,
  //     allTimeCommissions: 780.00,
  //     ytdCommissions: 390.00,
  //     allTimeNetPL: 3250.40,
  //     ytdNetPL: 1625.20
  //   },
  //   {
  //     id: 'short-strangle',
  //     name: 'Short Strangle',
  //     user_id: "",
  //     is_active: false,
  //     description: 'High-risk strategy that profits from very low volatility',
  //     lastTraded: '2025-05-15',
  //     tradeCount: 67,
  //     allTimeCommissions: 670.00,
  //     ytdCommissions: 335.00,
  //     allTimeNetPL: -640.25,
  //     ytdNetPL: -320.15
  //   },
  //   {
  //     id: 'butterfly-spread',
  //     name: 'Butterfly Spread',
  //     user_id: "",
  //     is_active: true,
  //     description: 'Neutral strategy with limited risk that profits from specific price targets',
  //     lastTraded: '2025-06-05',
  //     tradeCount: 45,
  //     allTimeCommissions: 450.00,
  //     ytdCommissions: 225.00,
  //     allTimeNetPL: 1580.60,
  //     ytdNetPL: 790.30
  //   },
  //   {
  //     id: 'calendar-spread',
  //     name: 'Calendar Spread',
  //     user_id: "",
  //     is_active: true,
  //     description: 'Time-based strategy that profits from time decay differential',
  //     lastTraded: '2025-06-01',
  //     tradeCount: 78,
  //     allTimeCommissions: 390.00,
  //     ytdCommissions: 195.00,
  //     allTimeNetPL: 2240.85,
  //     ytdNetPL: 1120.45
  //   },
  //   {
  //     id: 'momentum-scalp',
  //     name: 'Momentum Scalping',
  //     user_id: "",
  //     is_active: false,
  //     description: 'High-frequency trading strategy for quick profits',
  //     lastTraded: '2025-04-20',
  //     tradeCount: 234,
  //     allTimeCommissions: 2340.00,
  //     ytdCommissions: 1170.00,
  //     allTimeNetPL: -1250.75,
  //     ytdNetPL: -625.40
  //   }
  // ]

  const userInfo = JSON.parse(localStorage.getItem("userinfo")!)

  const [strategies, setStrategies] = useState<Strategy[]>([])

  const filteredStrategies = strategies.filter(strategy => {
    const name = strategy.name || ''; // Fallback to empty string if null/undefined
    const description = strategy.description || ''; // Fallback to empty string if null/undefined

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHideDisabled = !hideDisabled || strategy.is_active;

    return matchesSearch && matchesHideDisabled;
  });

  const totalPages = Math.ceil(filteredStrategies.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentStrategies = filteredStrategies.slice(startIndex, endIndex)

  const formatCurrency = (value: number) => {
    const isNegative = value < 0
    const absValue = Math.abs(value)
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(absValue)

    return isNegative ? `-${formatted}` : formatted
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getAllStrategies = () => {
    console.log("Type of userinfo", typeof (userInfo))
    const params = {
      user_id: userInfo.id
    };
    console.log("Param", params)
    axios.get(`${BACKEND_URL}/strategy/get_all_strategies`, { params })
      .then(response => {
        setStrategies(response.data);
        localStorage.setItem('strategies', response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    getAllStrategies();
  }, [])

  useEffect(() => {
    console.log(strategies)
  }, [strategies])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hideDisabled}
                onChange={(e) => setHideDisabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">Hide Disabled Strategies</span>
            </label>
          </div>

          <h1 className="text-2xl font-bold text-white">Strategies</h1>
        </div>

        {/* Create Strategy Button */}
        {/* <div className="mb-6">
          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create new strategy...</span>
          </button>
        </div> */}

        {/* Data Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Strategy Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Enabled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Traded
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Trade Count
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    All-Time<br />Commissions
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    YTD Commissions
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    All-Time Net P/L
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    YTD Net P/L
                  </th>
                  {/* <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {currentStrategies.length > 0 ? (
                  currentStrategies.map((strategy) => (
                    <tr
                      key={strategy.id}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/strategies/view/${strategy.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{strategy.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${strategy.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
                          {strategy.is_active && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {strategy.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                        {new Date(strategy.updated_at).toLocaleString()} {/* Convert Date to string */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white">
                        {strategy.total_losses + strategy.total_wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-orange-400">
                        {/* {formatCurrency(strategy.allTimeCommissions)} */}
                        ---
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-orange-400">
                        {/* {formatCurrency(strategy.ytdCommissions)} */}
                        ---
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${strategy.total_profit >= 0 - strategy.total_loss ? "text-green-500" : "text-red-500"}`}>
                        {roundTo(strategy.total_profit + strategy.total_loss, 2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        {/* <span className={strategy.ytdNetPL >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatCurrency(strategy.ytdNetPL)}
                        </span> */}
                        ---
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                          <button className="text-green-400 hover:text-green-300 text-xs">Clone</button>
                          <button className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="text-gray-400">No data available in table</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-300">entries</span>
            </div>

            <div className="text-sm text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredStrategies.length)} of {filteredStrategies.length} entries
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search strategies..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
