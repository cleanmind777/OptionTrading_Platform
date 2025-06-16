import { useState, useEffect, useRef } from "react";

interface Trade {
  id: string;
  fillTime: string;
  bot: string;
  orderNumber: string;
  account: string;
  symbol: string;
  quantity: number;
  legDescription: string;
  legPrice: number;
  effect: "Open" | "Close";
  order: "Buy" | "Sell";
  filled: string;
  netCredit: number;
  strategy: string;
  notes: string;
  commsFees: number;
  selected?: boolean;
}

interface SavedFilter {
  id: string;
  name: string;
  searchTerm: string;
  account: string;
  strategy: string;
  bot: string;
  symbol: string;
  dateRange: string;
  isRegex: boolean;
}

export function TradeLog() {
  const [searchAccount, setSearchAccount] = useState("All Accounts");
  const [searchStrategy, setSearchStrategy] = useState("All Strategies");
  const [searchBot, setSearchBot] = useState("Select Bot");
  const [searchSymbol, setSearchSymbol] = useState("All");
  const [searchDate, setSearchDate] = useState("05/10/2025 - 06/09/2025");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRegexSearch, setIsRegexSearch] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStrategy, setBulkStrategy] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const datePickerRef = useRef<HTMLDivElement>(null);

  // Sample trade data with more realistic entries
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: "1",
      fillTime: "2025-01-06 09:31:24",
      bot: "SPY Iron Condor Pro",
      orderNumber: "ORD-2025-001",
      account: "Main Account",
      symbol: "SPY",
      quantity: 1,
      legDescription: "SELL SPY JAN17 580P, BUY SPY JAN17 575P",
      legPrice: 1.85,
      effect: "Open",
      order: "Sell",
      filled: "09:31:24",
      netCredit: 185.0,
      strategy: "Iron Condor",
      notes: "High IV entry",
      commsFees: 2.6,
    },
    {
      id: "2",
      fillTime: "2025-01-06 10:15:18",
      bot: "QQQ Credit Spreads",
      orderNumber: "ORD-2025-002",
      account: "IRA Account",
      symbol: "QQQ",
      quantity: 2,
      legDescription: "SELL QQQ JAN24 510P, BUY QQQ JAN24 505P",
      legPrice: 3.2,
      effect: "Open",
      order: "Sell",
      filled: "10:15:18",
      netCredit: 640.0,
      strategy: "Put Credit Spread",
      notes: "Bullish outlook",
      commsFees: 1.4,
    },
    {
      id: "3",
      fillTime: "2025-01-05 14:22:45",
      bot: "Manual",
      orderNumber: "ORD-2025-003",
      account: "Main Account",
      symbol: "IWM",
      quantity: 1,
      legDescription: "BUY IWM JAN17 220P",
      legPrice: 4.2,
      effect: "Close",
      order: "Buy",
      filled: "14:22:45",
      netCredit: -420.0,
      strategy: "Long Put",
      notes: "Profit taking",
      commsFees: 0.7,
    },
  ]);

  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(trades);

  // Date picker functionality
  const dateRangePresets = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 3 months", value: "3m" },
    { label: "Last 6 months", value: "6m" },
    { label: "Year to date", value: "ytd" },
    { label: "All time", value: "all" },
  ];

  // Export field options
  const exportFields = [
    "fillTime",
    "bot",
    "orderNumber",
    "account",
    "symbol",
    "quantity",
    "legDescription",
    "legPrice",
    "effect",
    "order",
    "filled",
    "netCredit",
    "strategy",
    "notes",
    "commsFees",
  ];

  const strategies = [
    "Iron Condor",
    "Put Credit Spread",
    "Call Credit Spread",
    "Iron Butterfly",
    "Short Strangle",
    "Long Strangle",
    "Covered Call",
    "Protective Put",
    "Bull Call Spread",
    "Bear Put Spread",
    "Calendar Spread",
  ];

  // Real-time updates simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Simulate new trade data
        const newTrade: Trade = {
          id: `${Date.now()}`,
          fillTime: new Date().toLocaleString(),
          bot: "Auto Trader",
          orderNumber: `ORD-${Date.now()}`,
          account: "Main Account",
          symbol: "SPY",
          quantity: Math.floor(Math.random() * 5) + 1,
          legDescription: "Simulated trade",
          legPrice: Math.random() * 10,
          effect: Math.random() > 0.5 ? "Open" : "Close",
          order: Math.random() > 0.5 ? "Buy" : "Sell",
          filled: new Date().toLocaleTimeString(),
          netCredit: (Math.random() - 0.5) * 1000,
          strategy: strategies[Math.floor(Math.random() * strategies.length)],
          notes: "Auto-generated trade",
          commsFees: Math.random() * 5,
        };
        setTrades((prev) => [newTrade, ...prev]);
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Advanced search with regex support
  useEffect(() => {
    const filtered = trades.filter((trade) => {
      // Basic filters
      if (searchAccount !== "All Accounts" && trade.account !== searchAccount)
        return false;
      if (
        searchStrategy !== "All Strategies" &&
        trade.strategy !== searchStrategy
      )
        return false;
      if (searchBot !== "Select Bot" && trade.bot !== searchBot) return false;
      if (searchSymbol !== "All" && trade.symbol !== searchSymbol) return false;

      // Advanced search
      if (searchTerm) {
        const searchFields = [
          trade.symbol,
          trade.strategy,
          trade.notes,
          trade.legDescription,
          trade.orderNumber,
          trade.bot,
        ]
          .join(" ")
          .toLowerCase();

        if (isRegexSearch) {
          try {
            const regex = new RegExp(searchTerm, "i");
            return regex.test(searchFields);
          } catch (e) {
            // Invalid regex, fall back to simple search
            return searchFields.includes(searchTerm.toLowerCase());
          }
        } else {
          return searchFields.includes(searchTerm.toLowerCase());
        }
      }

      return true;
    });

    setFilteredTrades(filtered);
  }, [
    trades,
    searchAccount,
    searchStrategy,
    searchBot,
    searchSymbol,
    searchTerm,
    isRegexSearch,
  ]);

  // Save filter functionality
  const saveCurrentFilter = () => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      searchTerm,
      account: searchAccount,
      strategy: searchStrategy,
      bot: searchBot,
      symbol: searchSymbol,
      dateRange: searchDate,
      isRegex: isRegexSearch,
    };
    setSavedFilters((prev) => [...prev, newFilter]);
    setFilterName("");
    setShowSaveFilter(false);
  };

  const loadSavedFilter = (filter: SavedFilter) => {
    setSearchTerm(filter.searchTerm);
    setSearchAccount(filter.account);
    setSearchStrategy(filter.strategy);
    setSearchBot(filter.bot);
    setSearchSymbol(filter.symbol);
    setSearchDate(filter.dateRange);
    setIsRegexSearch(filter.isRegex);
  };

  // Bulk operations
  const toggleTradeSelection = (tradeId: string) => {
    setTrades((prev) =>
      prev.map((trade) =>
        trade.id === tradeId ? { ...trade, selected: !trade.selected } : trade
      )
    );
  };

  const toggleAllTrades = () => {
    const allSelected = filteredTrades.every((trade) => trade.selected);
    setTrades((prev) =>
      prev.map((trade) => ({
        ...trade,
        selected: filteredTrades.some((ft) => ft.id === trade.id)
          ? !allSelected
          : trade.selected,
      }))
    );
  };

  const applyBulkStrategy = () => {
    const selectedIds = trades.filter((t) => t.selected).map((t) => t.id);
    setTrades((prev) =>
      prev.map((trade) =>
        selectedIds.includes(trade.id)
          ? { ...trade, strategy: bulkStrategy, selected: false }
          : trade
      )
    );
    setShowBulkModal(false);
    setBulkStrategy("");
  };

  // Export functionality
  const exportTrades = () => {
    const dataToExport = filteredTrades.map((trade) => {
      const row: any = {};
      selectedFields.forEach((field) => {
        row[field] = trade[field as keyof Trade];
      });
      return row;
    });

    if (exportFormat === "csv") {
      const csv = [
        selectedFields.join(","),
        ...dataToExport.map((row) =>
          selectedFields.map((field) => row[field]).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trades_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trades_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    setShowExportModal(false);
  };

  const selectedTradesCount = trades.filter((t) => t.selected).length;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search Trade Log Section */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white text-center mb-6">
              Search Trade Log
            </h2>

            {/* Filter Row */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              {/* Search by Account */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Search by Account
                </label>
                <select
                  value={searchAccount}
                  onChange={(e) => setSearchAccount(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  <option value="All Accounts">All Accounts</option>
                  <option value="Main Account">Main Account</option>
                  <option value="IRA Account">IRA Account</option>
                </select>
              </div>

              {/* Search by Strategy */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Search by Strategy
                </label>
                <select
                  value={searchStrategy}
                  onChange={(e) => setSearchStrategy(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  <option value="All Strategies">All Strategies</option>
                  {strategies.map((strategy) => (
                    <option key={strategy} value={strategy}>
                      {strategy}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search by Bot */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Search by Bot
                </label>
                <select
                  value={searchBot}
                  onChange={(e) => setSearchBot(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  <option value="Select Bot">Select Bot</option>
                  <option value="SPY Iron Condor Pro">
                    SPY Iron Condor Pro
                  </option>
                  <option value="QQQ Credit Spreads">QQQ Credit Spreads</option>
                  <option value="IWM Bot">IWM Bot</option>
                  <option value="Manual">Manual</option>
                  <option value="Auto Trader">Auto Trader</option>
                </select>
              </div>

              {/* Search by Symbol */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Search by Symbol
                </label>
                <select
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  <option value="All">All</option>
                  <option value="SPY">SPY</option>
                  <option value="QQQ">QQQ</option>
                  <option value="IWM">IWM</option>
                  <option value="TLT">TLT</option>
                </select>
              </div>

              {/* Search by Date */}
              <div className="relative">
                <label className="block text-sm text-gray-300 mb-2">
                  Search by Date
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    onClick={() => setShowDatePicker(true)}
                    className="flex-1 bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm cursor-pointer"
                    readOnly
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
                    GET TRADES
                  </button>
                </div>

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <div
                    ref={datePickerRef}
                    className="absolute top-full left-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg p-4 shadow-lg z-50 w-80"
                  >
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">
                        Select Date Range
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {dateRangePresets.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => {
                              // Set appropriate date range based on preset
                              const today = new Date();
                              let startDate = new Date();

                              switch (preset.value) {
                                case "today":
                                  startDate = today;
                                  break;
                                case "7d":
                                  startDate.setDate(today.getDate() - 7);
                                  break;
                                case "30d":
                                  startDate.setDate(today.getDate() - 30);
                                  break;
                                case "3m":
                                  startDate.setMonth(today.getMonth() - 3);
                                  break;
                                case "6m":
                                  startDate.setMonth(today.getMonth() - 6);
                                  break;
                                case "ytd":
                                  startDate = new Date(
                                    today.getFullYear(),
                                    0,
                                    1
                                  );
                                  break;
                                default:
                                  startDate.setFullYear(
                                    today.getFullYear() - 1
                                  );
                              }

                              setSearchDate(
                                `${startDate.toLocaleDateString()} - ${today.toLocaleDateString()}`
                              );
                              setShowDatePicker(false);
                            }}
                            className="text-left text-sm text-gray-300 hover:text-white hover:bg-slate-600 p-2 rounded"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              ⬇ EXPORT TRADES
            </button>

            <div className="flex items-center space-x-4">
              {/* Advanced Search */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isRegexSearch
                      ? "Enter regex pattern..."
                      : "Search trades..."
                  }
                  className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm w-48"
                />
                <button
                  onClick={() => setIsRegexSearch(!isRegexSearch)}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    isRegexSearch
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-white"
                  }`}
                >
                  {isRegexSearch ? "RegEx" : "Text"}
                </button>
              </div>

              <button
                onClick={() => setShowBulkModal(true)}
                disabled={selectedTradesCount === 0}
                className={`px-4 py-2 rounded text-sm font-medium flex items-center space-x-2 ${
                  selectedTradesCount > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>⬇ BULK STRATEGY ASSIGNMENT</span>
                {selectedTradesCount > 0 && (
                  <span>({selectedTradesCount})</span>
                )}
              </button>
            </div>
          </div>

          {/* Main Trade Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <input
                      type="checkbox"
                      checked={
                        filteredTrades.length > 0 &&
                        filteredTrades.every((trade) => trade.selected)
                      }
                      onChange={toggleAllTrades}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Fill Time ▼
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Bot
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Leg Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Leg Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Effect
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Filled
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Net Credit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Strategy
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Comms/Fees
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length > 0 ? (
                  filteredTrades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={trade.selected || false}
                          onChange={() => toggleTradeSelection(trade.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.fillTime}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.bot}
                      </td>
                      <td className="px-4 py-3 text-blue-400 text-sm">
                        {trade.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.account}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {trade.symbol}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm max-w-xs truncate">
                        {trade.legDescription}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        ${trade.legPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.effect === "Open"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {trade.effect}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.order === "Buy"
                              ? "bg-blue-600/20 text-blue-400"
                              : "bg-orange-600/20 text-orange-400"
                          }`}
                        >
                          {trade.order}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.filled}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={
                            trade.netCredit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          ${trade.netCredit.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {trade.strategy}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm max-w-xs truncate">
                        {trade.notes}
                      </td>
                      <td className="px-4 py-3 text-red-400 text-sm">
                        ${trade.commsFees.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={16}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No trades found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-300 text-sm">entries</span>
            </div>

            <div className="text-gray-300 text-sm">
              Showing {filteredTrades.length} of {trades.length} entries
            </div>

            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-slate-700 text-gray-500 rounded text-sm cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 bg-slate-700 text-gray-500 rounded text-sm cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Filter Modal */}
      {showSaveFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-medium mb-4">Save Current Filter</h3>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter filter name..."
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveFilter(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentFilter}
                disabled={!filterName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Strategy Assignment Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-medium mb-4">
              Bulk Strategy Assignment ({selectedTradesCount} trades selected)
            </h3>
            <select
              value={bulkStrategy}
              onChange={(e) => setBulkStrategy(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded mb-4"
            >
              <option value="">Select Strategy</option>
              {strategies.map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </select>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={applyBulkStrategy}
                disabled={!bulkStrategy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-white font-medium mb-4">Export Trades</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">
                Select Fields
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {exportFields.map((field) => (
                  <label key={field} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields((prev) => [...prev, field]);
                        } else {
                          setSelectedFields((prev) =>
                            prev.filter((f) => f !== field)
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-300 text-sm capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setSelectedFields(exportFields)}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2"
              >
                Select All
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={exportTrades}
                disabled={selectedFields.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
