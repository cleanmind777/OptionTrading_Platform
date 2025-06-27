import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie"
interface MainNavigationProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

interface MenuItem {
  name: string;
  link: string;
  action?: () => void;
}

interface MenuSection {
  name: string;
  items: MenuItem[];
}

export function MainNavigation({
  isLoggedIn,
  onLogin,
  onLogout,
}: MainNavigationProps) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseOption, setPauseOption] = useState<string>("manual");
  const [resumeDateTime, setResumeDateTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the login page
  useEffect(() => {
    if (location.pathname === "/login") {
      onLogout();
    }
  }, [location.pathname, onLogout]);

  // Handle login
  const handleLogin = () => {
    onLogin();
    navigate("/account-stats");
  };

  // Handle logout
  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("access_id");
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
    localStorage.removeItem("userinfo");
    Cookies.remove("access_token");
    navigate("/");
  };

  // Handle section navigation
  const handleSectionClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pre-login navigation items
  const preLoginItems = [
    { name: "TRADING", section: "trading" },
    { name: "ACCOUNT INSIGHTS", section: "account-insights" },
    { name: "PERFORMANCE TRACKING", section: "features" },
    { name: "PRICING", section: "pricing" },
    { name: "FAQ", section: "faq" },
    { name: "VIDEO VAULT", section: "video-vault" },
    { name: "SUPPORT", section: "support" },
  ];

  // Post-login navigation items with their dropdown content
  const postLoginItems = [
    {
      name: "MY ACCOUNT",
      items: [
        { name: "Enable Privacy Mode", link: "/account-stats" },
        { name: "Account Settings", link: "/useracct" },
        { name: "Manage Brokerage", link: "/useracct/brokerlink" },
        { name: "Sign Out", link: "#", action: handleLogout },
      ],
    },
    {
      name: "TRADES",
      items: [
        { name: "Trading Dashboard", link: "/dashboard" },
        { name: "Trade Log", link: "/trades/history" },
        { name: "Open Positions", link: "/trades/positions" },
      ],
    },
    {
      name: "BOTS",
      items: [
        {
          name: "Pause Auto Trading",
          link: "#",
          action: () => setIsPauseModalOpen(true),
        },
        { name: "View Bots", link: "/bots/manage" },
        { name: "Group Shared Bots", link: "/bots/shared" },
        { name: "View Bot Activity", link: "/bots/activity" },
        { name: "Create Bot", link: "/bots/create" },
        { name: "Create Tranche Bots", link: "/bots/create-tranche" },
        { name: "Edit Single Bot", link: "/bots/edit-single" },
        { name: "Edit Multiple Bots", link: "/bots/edit-multiple" },
        { name: "Import Bots", link: "/bots/import" },
        { name: "Bot Settings History", link: "/bots/settings-history" },
        { name: "Bot Day Planner", link: "/bots/day-planner" },
        { name: "Bot Performance", link: "/bots/performance" },
        { name: "Analytics & Backtesting", link: "/bots/analytics" },
      ],
    },
    {
      name: "PERFORMANCE",
      items: [
        {
          name: "Balance and Profits Over Time",
          link: "/performance/balance-profits-time",
        },
        { name: "Balance History Table", link: "/performance/balance-history" },
        {
          name: "View Historical Dashboards",
          link: "/performance/historical-dashboards",
        },
        {
          name: "Monthly Calendar Report",
          link: "/performance/monthly-calendar",
        },
        {
          name: "Account vs Market Performance",
          link: "/performance/account-vs-market",
        },
        { name: "Performance Volatility", link: "/performance/volatility" },
      ],
    },
    {
      name: "STRATEGIES",
      items: [
        { name: "View Strategies", link: "/strategies/view" },
        { name: "Strategy Performance", link: "/strategies/performance" },
        { name: "Strategy Backtesting", link: "/strategies/backtest" },
      ],
    },
    {
      name: "SUPPORT",
      items: [
        { name: "Video Vault", link: "/support/video-vault" },
        { name: "Discord Community", link: "/support/discord" },
      ],
    },
  ];

  // Handle dropdown toggle
  const toggleDropdown = (item: string) => {
    setActiveDropdown(activeDropdown === item ? null : item);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".nav-dropdown")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmPause = () => {
    // TODO: Implement API call to pause trading
    const pauseData = {
      type: pauseOption,
      resumeDateTime: pauseOption === "timed" ? resumeDateTime : null,
    };

    // Close the modal
    setIsPauseModalOpen(false);

    // Reset the form
    setPauseOption("manual");
    setResumeDateTime("");

    // Show success message
    // TODO: Implement toast notification
    console.log("Trading paused successfully", pauseData);
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

        {/* Navigation Items */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isLoggedIn ? (
            // Pre-login navigation
            <div className="flex items-center space-x-4">
              {preLoginItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleSectionClick(item.section)}
                  className="px-2 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm whitespace-nowrap"
                >
                  {item.name}
                </button>
              ))}
            </div>
          ) : (
            // Post-login navigation
            postLoginItems.map((item) => (
              <div key={item.name} className="relative nav-dropdown">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
                >
                  <span>{item.name}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                      }`}
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
                {activeDropdown === item.name && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 py-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.link}
                        onClick={() => {
                          if (subItem.action) {
                            subItem.action();
                          }
                          setActiveDropdown(null);
                        }}
                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Login/Register Buttons */}
        {!isLoggedIn && (
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors font-medium text-sm whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium text-sm whitespace-nowrap"
            >
              Register
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-gray-300 hover:text-white transition-colors"
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
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Pause Modal */}
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
                  enter new positions. There will be no changes to bots'
                  "Enabled" settings, but no trades will open while the account
                  has automated trading paused. Currently open trades will
                  continue to be monitored, stopped and exited as stipulated by
                  their bot settings. No further trades will open while
                  automated trading is paused for your account.
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
                      className={`flex-1 px-4 py-3 rounded-md border transition-colors ${pauseOption === "manual"
                        ? "border-red-500 bg-red-500 bg-opacity-20 text-red-400"
                        : "border-slate-600 text-gray-300 hover:border-red-500"
                        }`}
                    >
                      UNTIL I TURN BACK ON
                    </button>
                    <button
                      onClick={() => setPauseOption("timed")}
                      className={`flex-1 px-4 py-3 rounded-md border transition-colors ${pauseOption === "timed"
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-slate-800 rounded-lg border border-slate-700 mx-6">
          {!isLoggedIn ? (
            // Pre-login mobile menu
            <div className="py-2">
              {preLoginItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    handleSectionClick(item.section);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-slate-700 my-2" />
              <Link
                to="/login"
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          ) : (
            // Post-login mobile menu
            <div className="py-2">
              {postLoginItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <svg
                      className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                        }`}
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
                  {activeDropdown === item.name && (
                    <div className="bg-slate-700">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.link}
                          onClick={() => {
                            if (subItem.action) {
                              subItem.action();
                            }
                            setActiveDropdown(null);
                            setIsMenuOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
