import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function CreateTrancheBots() {
  const navigate = useNavigate();
  const [selectedBot, setSelectedBot] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode
  const [selectedEditBot, setSelectedEditBot] = useState(""); // Selected bot for editing

  const botTemplates = [
    {
      id: "",
      name: "Select Source Bot",
      disabled: true,
      description: "",
      strategy: "",
      risk: "",
    },
    {
      id: "momentum-scalper",
      name: "Momentum Scalper Pro",
      disabled: false,
      description:
        "High-frequency scalping strategy targeting momentum breakouts",
      strategy: "Momentum + RSI",
      risk: "High",
    },
    {
      id: "trend-follower",
      name: "Trend Following Strategy",
      disabled: false,
      description: "Medium-term trend following with moving average crossovers",
      strategy: "MA + MACD",
      risk: "Medium",
    },
    {
      id: "mean-reversion",
      name: "Mean Reversion Bot",
      disabled: false,
      description: "Contrarian strategy betting on price reversals",
      strategy: "Bollinger Bands + RSI",
      risk: "Medium",
    },
    {
      id: "breakout-hunter",
      name: "Breakout Hunter Elite",
      disabled: false,
      description: "Identifies and trades key support/resistance breakouts",
      strategy: "Volume + Price Action",
      risk: "High",
    },
    {
      id: "grid-trading",
      name: "Grid Trading Master",
      disabled: false,
      description: "Automated grid trading for sideways markets",
      strategy: "Grid + DCA",
      risk: "Low",
    },
    {
      id: "swing-trader",
      name: "Swing Trading Algorithm",
      disabled: false,
      description: "Multi-day swing trading with technical analysis",
      strategy: "Swing + Fibonacci",
      risk: "Medium",
    },
  ];

  // Available bots for editing
  const availableBots = [
    { id: "", name: "Select Bot to Edit", disabled: true },
    { id: "iron-condor-1", name: "Iron Condor Strategy #1", status: "Active" },
    { id: "put-spread-1", name: "Put Spread Bot #1", status: "Paused" },
    { id: "call-spread-1", name: "Call Spread Bot #1", status: "Active" },
    { id: "momentum-bot-1", name: "Momentum Scalper #1", status: "Active" },
    { id: "trend-bot-1", name: "Trend Following #1", status: "Inactive" },
    { id: "grid-bot-1", name: "Grid Trading #1", status: "Active" },
  ];

  const [botConfig, setBotConfig] = useState({
    name: "",
    symbol: "SPY",
    trancheSize: 100,
    maxTranches: 5,
    entrySpacing: 1.0,
    stopLoss: 5.0,
    takeProfit: 10.0,
    timeframe: "1h",
    riskLevel: "medium",
  });

  const handleBotSelect = (botId: string) => {
    setSelectedBot(botId);
    setIsDropdownOpen(false);
  };

  const handleSelectSourceBot = () => {
    if (!selectedBot) {
      alert("Please select a source bot first");
      return;
    }
    setIsConfigModalOpen(true);
  };

  const handleEditBot = () => {
    navigate("/bots/create-tranche");
  };

  const handleCreateNewBot = () => {
    navigate("/bots/create-wizard");
  };

  // Edit mode handlers
  const handleEditBotSelect = (botId: string) => {
    setSelectedEditBot(botId);
    setIsDropdownOpen(false);
  };

  const handleEditBotAction = () => {
    navigate("/bots/create-tranche");
  };

  const handleCreateNewFromEdit = () => {
    navigate("/bots/create");
  };

  const handleCopyToNewBot = () => {
    navigate("/bots/manage");
  };

  const handleCreateTranches = () => {
    navigate("/bots/create-tranche");
  };

  const handleSettingsHistory = () => {
    navigate("/bots/settings-history");
  };

  const handleBotActivity = () => {
    navigate("/bots/activity");
  };

  const handleGetShareLink = () => {
    console.log("Getting share link for bot:", selectedEditBot);
    // Generate and copy share link
    alert("Share link copied to clipboard!");
  };

  const handleBackToCreate = () => {
    setIsEditMode(false);
    setSelectedEditBot("");
  };

  const selectedBotData = botTemplates.find((bot) => bot.id === selectedBot);

  const handleConfigSave = () => {
    console.log("Saving bot configuration:", botConfig);
    setIsConfigModalOpen(false);
    // Here would be API call to save configuration
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold text-white">
          {isEditMode
            ? "Edit Autotrader Bot"
            : "Create Tranches From Template Bot"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        {isEditMode ? (
          /* Edit Mode Interface */
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">
                Select Bot to Edit
              </h2>
              <button
                onClick={handleBackToCreate}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Create
              </button>
            </div>

            {/* Edit Bot Dropdown */}
            <div className="mb-6">
              <div className="relative w-full max-w-md">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-left text-gray-300 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                >
                  <span
                    className={selectedEditBot ? "text-white" : "text-gray-400"}
                  >
                    {selectedEditBot
                      ? availableBots.find((bot) => bot.id === selectedEditBot)
                          ?.name
                      : "Select Bot to Edit"}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
                    {availableBots.map((bot) => (
                      <button
                        key={bot.id}
                        onClick={() =>
                          !bot.disabled && handleEditBotSelect(bot.id)
                        }
                        disabled={bot.disabled}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors ${
                          bot.disabled
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-gray-300 hover:text-white"
                        } ${selectedEditBot === bot.id ? "bg-slate-600 text-white" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{bot.name}</span>
                          {bot.status && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                bot.status === "Active"
                                  ? "bg-green-900 text-green-200"
                                  : bot.status === "Paused"
                                    ? "bg-yellow-900 text-yellow-200"
                                    : "bg-gray-900 text-gray-200"
                              }`}
                            >
                              {bot.status}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEditBotAction}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                EDIT BOT
              </button>

              <button
                onClick={handleCreateNewFromEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                CREATE NEW
              </button>

              <button
                onClick={handleCopyToNewBot}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                COPY TO NEW BOT
              </button>

              <button
                onClick={handleCreateTranches}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                CREATE TRANCHES
              </button>

              <button
                onClick={handleSettingsHistory}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                SETTINGS HISTORY
              </button>

              <button
                onClick={handleBotActivity}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                BOT ACTIVITY
              </button>

              <button
                onClick={handleGetShareLink}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
              >
                GET SHARE LINK
              </button>
            </div>

            {/* Selected Bot Info */}
            {selectedEditBot &&
              availableBots.find((bot) => bot.id === selectedEditBot) && (
                <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h3 className="font-medium text-white mb-2">
                    {
                      availableBots.find((bot) => bot.id === selectedEditBot)
                        ?.name
                    }
                  </h3>
                  <div className="flex gap-4 text-xs">
                    <span
                      className={`px-2 py-1 rounded ${
                        availableBots.find((bot) => bot.id === selectedEditBot)
                          ?.status === "Active"
                          ? "bg-green-900 text-green-200"
                          : availableBots.find(
                                (bot) => bot.id === selectedEditBot
                              )?.status === "Paused"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-gray-900 text-gray-200"
                      }`}
                    >
                      Status:{" "}
                      {
                        availableBots.find((bot) => bot.id === selectedEditBot)
                          ?.status
                      }
                    </span>
                  </div>
                </div>
              )}
          </div>
        ) : (
          /* Create Mode Interface */
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <h2 className="text-lg font-medium text-white mb-6">
              Select Source Bot
            </h2>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Dropdown */}
              <div className="relative flex-1 min-w-[300px]">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-left text-gray-300 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                >
                  <span
                    className={selectedBot ? "text-white" : "text-gray-400"}
                  >
                    {selectedBot
                      ? botTemplates.find((bot) => bot.id === selectedBot)?.name
                      : "Select Source Bot"}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
                    {botTemplates.map((bot) => (
                      <button
                        key={bot.id}
                        onClick={() => !bot.disabled && handleBotSelect(bot.id)}
                        disabled={bot.disabled}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors ${
                          bot.disabled
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-gray-300 hover:text-white"
                        } ${selectedBot === bot.id ? "bg-slate-600 text-white" : ""}`}
                      >
                        <div className="font-medium">{bot.name}</div>
                        {bot.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {bot.description}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleSelectSourceBot}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                SELECT SOURCE BOT
              </button>

              <button
                onClick={handleEditBot}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
              >
                EDIT BOT
              </button>

              <button
                onClick={handleCreateNewBot}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
              >
                CREATE NEW BOT
              </button>
            </div>

            {/* Selected Bot Info */}
            {selectedBotData && selectedBotData.id && (
              <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="font-medium text-white mb-2">
                  {selectedBotData.name}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {selectedBotData.description}
                </p>
                <div className="flex gap-4 text-xs">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
                    Strategy: {selectedBotData.strategy}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      selectedBotData.risk === "High"
                        ? "bg-red-900 text-red-200"
                        : selectedBotData.risk === "Medium"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-green-900 text-green-200"
                    }`}
                  >
                    Risk: {selectedBotData.risk}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Configure Tranche Bot
              </h2>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botConfig.name}
                  onChange={(e) =>
                    setBotConfig({ ...botConfig, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bot name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Symbol
                  </label>
                  <select
                    value={botConfig.symbol}
                    onChange={(e) =>
                      setBotConfig({ ...botConfig, symbol: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SPY">SPY</option>
                    <option value="QQQ">QQQ</option>
                    <option value="AAPL">AAPL</option>
                    <option value="TSLA">TSLA</option>
                    <option value="MSFT">MSFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={botConfig.timeframe}
                    onChange={(e) =>
                      setBotConfig({ ...botConfig, timeframe: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1m">1 minute</option>
                    <option value="5m">5 minutes</option>
                    <option value="15m">15 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="4h">4 hours</option>
                    <option value="1d">1 day</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tranche Size ($)
                  </label>
                  <input
                    type="number"
                    value={botConfig.trancheSize}
                    onChange={(e) =>
                      setBotConfig({
                        ...botConfig,
                        trancheSize: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Tranches
                  </label>
                  <input
                    type="number"
                    value={botConfig.maxTranches}
                    onChange={(e) =>
                      setBotConfig({
                        ...botConfig,
                        maxTranches: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Spacing (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={botConfig.entrySpacing}
                    onChange={(e) =>
                      setBotConfig({
                        ...botConfig,
                        entrySpacing: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stop Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={botConfig.stopLoss}
                    onChange={(e) =>
                      setBotConfig({
                        ...botConfig,
                        stopLoss: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Take Profit (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={botConfig.takeProfit}
                    onChange={(e) =>
                      setBotConfig({
                        ...botConfig,
                        takeProfit: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  value={botConfig.riskLevel}
                  onChange={(e) =>
                    setBotConfig({ ...botConfig, riskLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfigSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Tranche Bot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bot Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Edit Bot Template
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Edit {selectedBotData?.name}
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This will open the advanced bot editor where you can modify
                strategy parameters, indicators, and trading logic for the
                selected template.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    console.log("Opening bot editor for:", selectedBot);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Open Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Bot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Bot</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Create From Scratch
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Start with a blank template and build your custom trading
                strategy using our advanced bot creation wizard.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    console.log("Opening bot creation wizard");
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Start Wizard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
