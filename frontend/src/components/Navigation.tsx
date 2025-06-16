import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavigationProps {
  onLogout: () => void;
}

export function Navigation({ onLogout }: NavigationProps) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isTradesDropdownOpen, setIsTradesDropdownOpen] = useState(false);
  const [isBotsDropdownOpen, setIsBotsDropdownOpen] = useState(false);
  const [isPerformanceDropdownOpen, setIsPerformanceDropdownOpen] =
    useState(false);
  const [isStrategiesDropdownOpen, setIsStrategiesDropdownOpen] =
    useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseOption, setPauseOption] = useState<"manual" | "timed">("manual");
  const [resumeDateTime, setResumeDateTime] = useState("");

  // Simulate logged in state - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true to show account menu by default
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setIsAccountDropdownOpen(false);
    // In real app, this would clear auth tokens and redirect
  };

  const handlePauseAutotrading = () => {
    setIsPauseModalOpen(true);
    setIsBotsDropdownOpen(false);
  };

  const handleConfirmPause = () => {
    console.log("Pausing autotrading with option:", pauseOption);
    if (pauseOption === "timed") {
      console.log("Resume at:", resumeDateTime);
    }
    setIsPauseModalOpen(false);
    // In real app, this would make API call to pause trading
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
        setIsTradesDropdownOpen(false);
        setIsBotsDropdownOpen(false);
        setIsPerformanceDropdownOpen(false);
        setIsStrategiesDropdownOpen(false);
        setIsSupportDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 py-3 px-6 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="currentColor"
            >
              <path d="M3 13h8V3c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10zm0 8h8c1.1 0 2-.9 2-2v-6H3v8zm10 0h8c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-8v10zm0-12h8V3c0-1.1-.9-2-2-2h-6v6z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-white">TRADE STEWARD</div>
          </div>
        </Link>

        {/* Navigation Menu Items */}
        {isLoggedIn && (
          <div
            className="hidden lg:flex items-center space-x-1"
            ref={dropdownRef}
          >
            {/* MY ACCOUNT */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsAccountDropdownOpen(!isAccountDropdownOpen);
                  setIsTradesDropdownOpen(false);
                  setIsBotsDropdownOpen(false);
                  setIsPerformanceDropdownOpen(false);
                  setIsStrategiesDropdownOpen(false);
                  setIsSupportDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>MY ACCOUNT</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isAccountDropdownOpen ? "rotate-180" : ""}`}
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

              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      console.log("Privacy mode toggled");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Disable Privacy Mode</span>
                  </button>

                  <Link
                    to="/useracct"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className=" px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    to="/useracct/brokerlink"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>Manage Linked Brokerage</span>
                  </Link>

                  <div className="border-t border-slate-700 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center space-x-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* TRADES */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTradesDropdownOpen(!isTradesDropdownOpen);
                  setIsAccountDropdownOpen(false);
                  setIsBotsDropdownOpen(false);
                  setIsPerformanceDropdownOpen(false);
                  setIsStrategiesDropdownOpen(false);
                  setIsSupportDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>TRADES</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isTradesDropdownOpen ? "rotate-180" : ""}`}
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

              {isTradesDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsTradesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Trading Dashboard
                  </Link>
                  <Link
                    to="/trades/history"
                    onClick={() => setIsTradesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Trade Log
                  </Link>
                  <Link
                    to="/trades/positions"
                    onClick={() => setIsTradesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Open Positions
                  </Link>
                </div>
              )}
            </div>

            {/* BOTS */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsBotsDropdownOpen(!isBotsDropdownOpen);
                  setIsAccountDropdownOpen(false);
                  setIsTradesDropdownOpen(false);
                  setIsPerformanceDropdownOpen(false);
                  setIsStrategiesDropdownOpen(false);
                  setIsSupportDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>BOTS</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isBotsDropdownOpen ? "rotate-180" : ""}`}
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

              {isBotsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  {/* Status Section */}
                  <div className="px-4 py-3 border-b border-slate-600">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium">
                        Bots Enabled
                      </span>
                    </div>
                  </div>

                  {/* Pause Autotrading */}
                  <button
                    onClick={handlePauseAutotrading}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Pause Autotrading
                  </button>

                  <div className="border-t border-slate-600 my-1" />

                  {/* Bot Management */}
                  <Link
                    to="/bots/manage"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    View Bots
                  </Link>

                  <Link
                    to="/bots/shared"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Group Shared Bots
                  </Link>

                  <Link
                    to="/bots/activity"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    View Bot Activity
                  </Link>

                  <Link
                    to="/bots/create"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Create Bot
                  </Link>

                  <Link
                    to="/bots/create-tranche"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Create Tranche Bots
                  </Link>

                  <div className="border-t border-slate-600 my-1" />

                  {/* Bot Editing */}
                  <Link
                    to="/bots/edit-single"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Edit Single Bot
                  </Link>

                  <Link
                    to="/bots/edit-multiple"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Edit Multiple Bots
                  </Link>

                  <Link
                    to="/bots/import"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Import Bots
                  </Link>

                  <Link
                    to="/bots/settings-history"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bot Settings History
                  </Link>

                  <div className="border-t border-slate-600 my-1" />

                  {/* Bot Analytics & Tools */}
                  <Link
                    to="/bots/day-planner"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bot Day Planner
                  </Link>

                  <Link
                    to="/bots/performance"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bot Performance
                  </Link>

                  <Link
                    to="/bots/analytics"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Analytics & Backtesting
                  </Link>

                  <div className="border-t border-slate-600 my-1" />

                  {/* Advanced Features */}
                  <Link
                    to="/backtesting"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Advanced Backtesting
                  </Link>

                  <Link
                    to="/trades/bidless-long-credit-recovery"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bidless Long Credit Recovery
                  </Link>

                  <Link
                    to="/bots/webhook-activity"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Webhook Activity
                  </Link>

                  <div className="border-t border-slate-600 my-1" />

                  {/* Bot Filters */}
                  <Link
                    to="/bots/filter-values"
                    onClick={() => setIsBotsDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bot Filter Values
                  </Link>
                </div>
              )}
            </div>

            {/* PERFORMANCE */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPerformanceDropdownOpen(!isPerformanceDropdownOpen);
                  setIsAccountDropdownOpen(false);
                  setIsTradesDropdownOpen(false);
                  setIsBotsDropdownOpen(false);
                  setIsStrategiesDropdownOpen(false);
                  setIsSupportDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>PERFORMANCE</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isPerformanceDropdownOpen ? "rotate-180" : ""}`}
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

              {isPerformanceDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  <Link
                    to="/performance/balance-profits-time"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Balance and Profits Over Time
                  </Link>
                  <Link
                    to="/performance/balance-history"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Balance History Table
                  </Link>
                  <Link
                    to="/performance/historical-dashboards"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    View Historical Dashboards
                  </Link>
                  <Link
                    to="/performance/monthly-calendar"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Monthly Calendar Report
                  </Link>
                  <Link
                    to="/performance/account-vs-market"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Account vs Market Performance
                  </Link>
                  <Link
                    to="/performance/volatility"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Performance Volatility
                  </Link>

                  <div className="border-t border-slate-600 my-1" />

                  <Link
                    to="/bots/performance"
                    onClick={() => setIsPerformanceDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Bot Performance
                  </Link>
                </div>
              )}
            </div>

            {/* STRATEGIES */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStrategiesDropdownOpen(!isStrategiesDropdownOpen);
                  setIsAccountDropdownOpen(false);
                  setIsTradesDropdownOpen(false);
                  setIsBotsDropdownOpen(false);
                  setIsPerformanceDropdownOpen(false);
                  setIsSupportDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span>STRATEGIES</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isStrategiesDropdownOpen ? "rotate-180" : ""}`}
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

              {isStrategiesDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  <Link
                    to="/strategies/view"
                    onClick={() => setIsStrategiesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    View Strategies
                  </Link>
                  <Link
                    to="/strategies/performance"
                    onClick={() => setIsStrategiesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Strategy Performance
                  </Link>
                  <Link
                    to="/strategies/backtest"
                    onClick={() => setIsStrategiesDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Strategy Backtesting
                  </Link>
                </div>
              )}
            </div>

            {/* SUPPORT */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSupportDropdownOpen(!isSupportDropdownOpen);
                  setIsAccountDropdownOpen(false);
                  setIsTradesDropdownOpen(false);
                  setIsBotsDropdownOpen(false);
                  setIsPerformanceDropdownOpen(false);
                  setIsStrategiesDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>SUPPORT</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isSupportDropdownOpen ? "rotate-180" : ""}`}
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

              {isSupportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                  <Link
                    to="/support/video-vault"
                    onClick={() => setIsSupportDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Video Vault
                  </Link>
                  <Link
                    to="/support/discord"
                    onClick={() => setIsSupportDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Discord Community
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications & Mobile Menu Button & Auth Buttons */}
        <div className="flex items-center space-x-3">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                onClick={() => setIsLoggedIn(true)}
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
              >
                SIGN UP
              </Link>
            </>
          ) : (
            <div className="lg:hidden">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span>MENU</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isLoggedIn && isAccountDropdownOpen && (
        <div className="lg:hidden mt-4 bg-slate-800 rounded-lg border border-slate-700 mx-6">
          <div className="py-2">
            <Link
              to="/dashboard"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
              onClick={() => setIsAccountDropdownOpen(false)}
            >
              Trading Dashboard
            </Link>
            <Link
              to="/account-stats"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
              onClick={() => setIsAccountDropdownOpen(false)}
            >
              Account Insights
            </Link>
            <Link
              to="/useracct"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
              onClick={() => setIsAccountDropdownOpen(false)}
            >
              Account Settings
            </Link>
            <Link
              to="/useracct/brokerlink"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
              onClick={() => setIsAccountDropdownOpen(false)}
            >
              Manage Brokerage
            </Link>
            <div className="border-t border-slate-700 my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Pause Autotrading Modal */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Pause Automated Trading
              </h2>
              <button
                onClick={() => setIsPauseModalOpen(false)}
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

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                This will disable new positions from opening by automated
                trading bots for your account. All enabled bots will no longer
                enter new positions. There will be no changes to bots' "Enabled"
                settings, but no trades will open while the account has
                automated trading paused. Currently open trades will continue to
                be monitored, stopped and exited as stipulated by their bot
                settings. No further trades will open while automated trading is
                paused for your account.
              </p>
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">
                How long should opening new automated trades be paused?
              </h3>

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setPauseOption("manual")}
                    className={`flex-1 px-4 py-3 rounded-md border transition-colors ${
                      pauseOption === "manual"
                        ? "border-red-500 bg-red-500 bg-opacity-20 text-red-400"
                        : "border-slate-600 text-gray-300 hover:border-red-500"
                    }`}
                  >
                    UNTIL I TURN BACK ON
                  </button>
                  <button
                    onClick={() => setPauseOption("timed")}
                    className={`flex-1 px-4 py-3 rounded-md border transition-colors ${
                      pauseOption === "timed"
                        ? "border-purple-500 bg-purple-500 bg-opacity-20 text-purple-400"
                        : "border-slate-600 text-gray-300 hover:border-purple-500"
                    }`}
                  >
                    PAUSE UNTIL TIME
                  </button>
                </div>
              </div>
            </div>

            {/* Timed Resume Section */}
            {pauseOption === "timed" && (
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">
                  Resume Opening New Trades After:
                </h4>
                <input
                  type="datetime-local"
                  value={resumeDateTime}
                  onChange={(e) => setResumeDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="2025-06-09 9:30 AM"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Eastern/Market Time
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                NEVERMIND
              </button>
              <button
                onClick={handleConfirmPause}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                PAUSE AUTOMATED TRADING
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
