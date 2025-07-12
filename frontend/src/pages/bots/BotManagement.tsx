import { useEffect, useState } from 'react'
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper interfaces for nested objects
interface TradeExit {
  timed_exit: boolean;
  exit_days_in_trade_or_days_to_expiration: string;
  exit_at_set_time: [number, number, number];
  profit_target_type: string;
  profit_target_value: number;
  disable_profit_target_after_stop: boolean;
}

interface TradeCondition {
  entry_filters: boolean;
  max_trades_per_day: boolean;
  max_trades_per_day_value: number;
  max_concurrent_trades: boolean;
  max_concurrent_trades_value: number;
  max_profit_targets_per_day: boolean;
  max_profit_targets_per_day_value: number;
  max_stops_per_day: boolean;
  max_stops_per_day_value: number;
  minimum_price_to_enter: boolean;
  minimum_price_to_enter_value: number;
  maximum_price_to_enter: boolean;
  maximum_price_to_enter_value: number;
  check_closings_before_opening: boolean;
  only_credit_or_debit: string;
  opening_quote: string;
  trade_on_event_days: boolean;
  trade_on_special_days: {
    all_other_days: boolean;
    fomc_press_conferences: [boolean, boolean, boolean];
    monthly_cpi_report: [boolean, boolean, boolean];
    monthly_opex: [boolean, boolean, boolean];
    last_trading_day_of_the: [boolean, boolean];
  };
  underlying_entry_filters: any; // You can further expand this based on your needs
  volatility_index_entry_filters: any;
}

interface TradeEntry {
  enter_by: string;
  auto_size_down: boolean;
  entry_speed: string;
  position_sizing: string;
  position_sizing_value: number;
  include_credit: boolean;
  entry_time_window_start: [number, number, number];
  entry_time_window_end: [number, number, number];
  days_of_week_to_enter: [boolean, boolean, boolean, boolean, boolean, boolean];
  open_if_no_position_or_staggered_days: string;
  entry_day_literval: number;
  entry_time_randomization: number;
  sequential_entry_delay: number;
}

interface TradeStop {
  stop_loss_type: string;
  stop_controller_type: string;
  stop_order_type: string;
  stop_based_on: string;
  stop_value: number;
  side_to_stop: string;
  close_remaining_legs_after_stop: boolean;
  stop_when_ITM_or_OTM: string;
  stop_adjustments: boolean;
  stop_adjustments_settings: any;
  stop_speed: string;
  custom_stop_speed_settings: any;
  partial_trade_stops: string;
  entire_trade_stops: string;
  trailing_stop_configuration: any;
}

interface BotDependencies {
  do_not_open_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
    bots_have_been_in_trade_today: string;
  };
  only_open_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
    bots_have_been_in_trade_today: string;
  };
  immediately_close_trades_when: {
    bots_are_in_trade: string;
    bots_are_not_in_trade: string;
  };
  disabled_bots_shouldbe_ignored: boolean;
}

interface StrategyLeg {
  strike_target_type: string;
  strike_target_value: [number, number, number];
  option_type: string;
  long_or_short: string;
  size_ratio: number;
  days_to_expiration_type: string;
  days_to_expiration_value: [number, number, number];
  conflict_resolution: boolean;
  conflict_resolution_value: [number, number];
}

interface Strategy {
  user_id: string;
  description: string | null;
  updated_at: string;
  symbol: string;
  trade_type: string;
  skip_am_expirations: boolean;
  efficient_spreads: boolean;
  name: string;
  id: string;
  created_at: string;
  parameters: any;
  number_of_legs: number;
  sell_bidless_longs_on_trade_exit: boolean;
  legs: StrategyLeg[];
}

// Main TradingBot interface
export interface TradingBot {
  id: string;
  is_active: boolean;
  updated_at: string;
  strategy_id: string;
  trade_exit: TradeExit;
  trade_condition: TradeCondition;
  name: string;
  user_id: string;
  description: string;
  created_at: string;
  trading_account: string;
  trade_entry: TradeEntry;
  trade_stop: TradeStop;
  bot_dependencies: BotDependencies;
  strategy: Strategy;
}


export function BotManagement() {
  const [bots, setBots] = useState<TradingBot[]>([
    // Sample data - in real app this would come from API
  ])
  const symbols = ['AI', 'AMC', 'AAPL', 'AMD', 'AMZN', 'ARM', 'AVGO', 'CMG', 'COIN', 'GLD', 'GME', 'GOOG', 'GOOGL', 'HYG', 'IBIT', 'INTC', 'IWM', 'MARA', 'META', 'MU', 'MSTR', 'NDX', 'NKE', 'NFLX', 'NVDA', 'QQQ', 'PLTR', 'RIVN', 'RUT', 'SIRI', 'SMCI', 'SPX', 'SPY', 'SVIX', 'TLT', 'TSLA', 'UVIX', 'UVXY', 'VIX', 'VXX', 'XLE', 'XSP']
  const [filters, setFilters] = useState({
    account: 'All',
    strategy: 'All',
    botStatus: 'All',
    entryDay: 'Any',
    symbol: 'All',
    webhookPartial: 'No',
    botName: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBots, setSelectedBots] = useState<string[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(30)
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!)
  const [strategies, setStrategies] = useState([{
    "id": "",
    "name": "",
    "description": "",
    "symbol": "",
    "parameters": {},
    "trade_type": "",
    "skip_am_expirations": false,
    "sell_bidless_longs_on_trade_exit": false,
    "efficient_spreads": false,
    "legs": [{
      "strike_target_type": "",
      "strike_target_value": [0.0, 0.0, 0.0],
      "option_type": null,
      "long_or_short": null,
      "size_ratio": 1,
      "days_to_expiration_type": "Exact",
      "days_to_expiration_value": [0.0, 0.0, 0.0],
      "conflict_resolution": false,
      "conflict_resolution_value": [0, 0],
    },],
    "number_of_legs": 0,
  }]);
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleSelectMultiple = () => {
    if (selectedBots.length > 0) {
      setSelectedBots([])
    } else {
      // In real app, this would select all visible bots
      setSelectedBots(['select-all'])
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
  const getBots = () => {
    const params = {
      user_id: userInfo.id,
      name: filters.botName,
      trading_account: filters.account,
      is_active: filters.botStatus,
      strategy: filters.strategy,
      entryDay: filters.entryDay,
      symbol: filters.symbol,
      webhookPartial: filters.webhookPartial,
    }
    axios.post(`${BACKEND_URL}/bot/get_bots`, params)
      .then(response => {
        setBots(response.data);
        if (response.data == 0) {
          alert("You don't have any bots. Plz create the new Bot")
        }
        localStorage.setItem('bots', response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  useEffect(() => {
    getAllStrategies();
    getBots();
  }, [])
  useEffect(() => {
    console.log(bots)
  }, [strategies, bots, filters])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-8">View Trading Bots</h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            {/* View by Account */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Account</label>
              <div className="relative">
                <select
                  value={filters.account}
                  onChange={(e) => handleFilterChange('account', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  {/* <option value="Account1">Account 1</option>
                  <option value="Account2">Account 2</option>
                  <option value="Account3">Account 3</option> */}
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Strategy */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Strategy</label>
              <div className="relative">
                <select
                  value={filters.strategy}
                  onChange={(e) => handleFilterChange('strategy', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  {strategies.map((item, key) => (
                    <option key={key} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  {/* <option value="Iron Condor">Iron Condor</option>
                  <option value="Credit Spread">Credit Spread</option>
                  <option value="Straddle">Straddle</option>
                  <option value="Strangle">Strangle</option> */}
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Bot Status */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Bot Status</label>
              <div className="relative">
                <select
                  value={filters.botStatus}
                  onChange={(e) => handleFilterChange('botStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Entry Day */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Entry Day</label>
              <div className="relative">
                <select
                  value={filters.entryDay}
                  onChange={(e) => handleFilterChange('entryDay', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="Any">Any</option>
                  <option value="All">All</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* View by Symbol */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">View by Symbol</label>
              <div className="relative">
                <select
                  value={filters.symbol}
                  onChange={(e) => handleFilterChange('symbol', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="All">All</option>
                  {symbols.map((item, key) => (
                    <option key={key} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Include Webhook/Partial Finish/One-Offs */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Include Webhook/Partial Finish/One-Offs in Stats</label>
              <div className="relative">
                <select
                  value={filters.webhookPartial}
                  onChange={(e) => handleFilterChange('webhookPartial', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="All Auto Trades (Partials and Original Trade)">All Auto Trades (Partials and Original Trade)</option>
                  <option value="Only One-Off/Webhook Trades">Only One-Off/Webhook Trades</option>
                  <option value="Only Partial Finish Trades">Only Partial Finish Trades</option>
                </select>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSelectMultiple}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                ✓ SELECT MULTIPLE
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Search by Bot Name</label>
                <input
                  type="text"
                  placeholder="Bot Name"
                  value={filters.botName}
                  onChange={(e) => handleFilterChange('botName', e.target.value)}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  getBots();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mt-6">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bot Name ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Enabled ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Leg Specs ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Entry ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Exit ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Trade ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trades ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    YTD P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    All Time P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Qty 1x P/L ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Win Rate ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Strategy ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions ↕
                  </th>
                </tr>
                {bots && bots.map((item, key) => (
                  <tr key={key}>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {item.is_active ? "Enabled" : "Disabled"}
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {item.strategy.symbol}
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {item.strategy.name}
                    </td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ---
                    </td>
                  </tr>
                ))}

              </thead>
              <tbody className="bg-slate-800">
                <tr>
                  <td colSpan={17} className="px-4 py-12 text-center text-gray-400">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="text-sm text-gray-400">
            Showing 0 to 0 of 0 entries
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
