import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function AccountSettings() {
  const [userInfo, setUserInfo] = useState({
    name: "lucas",
    userId: "user1",
    email: "lucaswong203162@gmail.com",
    emailVerified: true,
    discordUsername: "",
    phoneNumber: "561-672-1462",
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");

  const [tradingGroup, setTradingGroup] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [preferences, setPreferences] = useState({
    privacyMode: true,
    hideClosedTrades: false,
    hideFollowing: false,
    showStrategy: false,
    showRecent: false,
    displayBuyingPower: true,
    displayTrades: true,
    displayChart: true,
    displayProfile: false,
    displayBotActivity: false,
    percentSizing: false,
    leverageSizing: false,
    chartComparison: "SPY",
    targetTriggering: "DTE",
    wideSpreadWindow: "3 Minutes",
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-xl font-semibold text-white mb-4 pr-8">
              Change Email Address
            </h3>

            <p className="text-sm text-gray-400 mb-6">
              You can change your email address by validating a new email
              address. Your account will be linked to your current email address
              until you complete the process.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  To get started, please verify your current password
                </label>
                <input
                  type="password"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  placeholder="Enter your current password"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm"
                >
                  NEVERMIND
                </button>
                <button
                  onClick={() => {
                    // Handle password verification
                    setShowEmailModal(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  VERIFY PASSWORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-[rgb(15 23 42)] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Account Settings
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Information & Account Security */}
          <div className="space-y-8">
            {/* User Information */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                User Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Name
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, name: e.target.value })
                      }
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      UPDATE
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    User ID
                  </label>
                  <div className="text-sm text-gray-400">
                    To change this contact tradeSteward Support{" "}
                    <button className="text-blue-400 hover:text-blue-300">
                      here
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">
                      {userInfo.email} - Verified
                    </span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm mt-1"
                  >
                    Change Email Address
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => navigate("/email-preferences")}
                    className="w-full bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)] text-white px-4 py-2 rounded text-sm flex items-center justify-center space-x-2"
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
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>EMAIL PREFERENCES</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Discord Username
                  </label>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={userInfo.discordUsername}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            discordUsername: e.target.value,
                          })
                        }
                        placeholder="Enter Discord Username"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                      />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      UPDATE
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    An active tradeSteward subscription is required to gain
                    access to the tradeSteward Discord support and community.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={userInfo.phoneNumber}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      UPDATE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Account Security
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Change Account Password
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                  />
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  UPDATE
                </button>

                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-white font-medium mb-2">
                    Two-Factor Authentication
                  </h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Two-Factor Authentication Status:
                  </div>
                  <div className="text-sm text-gray-400 mb-3">Disabled</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                    ENABLE 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Subscription & Trading Group */}
          <div className="space-y-8">
            {/* Manage Subscription */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Manage Subscription
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-300">Current Plan</div>
                  <div className="text-white font-medium">Tracker Free</div>
                </div>

                <div>
                  <div className="text-sm text-gray-300">Plan Details</div>
                </div>

                <div className="bg-slate-700 rounded p-4">
                  <div className="text-sm text-white font-medium mb-2">
                    TRADE TRACKING
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Balance Tracking - 1 Account</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Trade Tracking - 1 Account</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Automatic Trade Capture</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Unlimited Historical Storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Unlimited Trade Log</span>
                    </div>
                  </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full">
                  UPGRADE NOW
                </button>
              </div>
            </div>

            {/* Trading Group */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Trading Group
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-300 mb-2">Join a Group</div>
                  <div className="text-sm text-gray-400 mb-3">
                    You are not currently a member of a trading group.
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-300 mb-2">
                    Here are the current options:
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-300 mb-1">
                    Create a Group
                  </div>
                  <input
                    type="text"
                    placeholder="Trading Group Name"
                    value={tradingGroup}
                    onChange={(e) => setTradingGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-300 mb-1">
                    Create a Code
                  </div>
                  <input
                    type="text"
                    placeholder="Group Code"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                  />
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  UPDATE
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Settings & Preferences */}
          <div className="space-y-8">
            {/* Account Access Settings */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Account Access Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Log Me Out After No Activity For:
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>4 Hours</option>
                    <option>8 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Phone Number (For Activity For):
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option>2 Days</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Preferences */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                User Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Main Dashboard Settings
                  </div>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.privacyMode}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            privacyMode: !preferences.privacyMode,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Default To Privacy Mode On
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.hideClosedTrades}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            hideClosedTrades: !preferences.hideClosedTrades,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Hide Closed Trades on Start Table
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.hideFollowing}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            hideFollowing: !preferences.hideFollowing,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Following Bot Trades on Profit Card
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.showRecent}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            showRecent: !preferences.showRecent,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Recent Activity
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.showStrategy}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            showStrategy: !preferences.showStrategy,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Strategy Profile on Profit Cards
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.displayChart}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            displayChart: !preferences.displayChart,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Show Intraday Chart</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.displayBotActivity}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            displayBotActivity: !preferences.displayBotActivity,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Recent Bot Activity
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Intraday Chart Settings
                  </div>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.displayBuyingPower}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            displayBuyingPower: !preferences.displayBuyingPower,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Display Buying Power
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.displayTrades}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            displayTrades: !preferences.displayTrades,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Display Trades</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.displayProfile}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            displayProfile: !preferences.displayProfile,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Daily Chart Best Until 9:31am
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Bot Preferences
                  </div>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.percentSizing}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            percentSizing: !preferences.percentSizing,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Percent Sizing Uses Minimum Quantity of 1
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.leverageSizing}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            leverageSizing: !preferences.leverageSizing,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Leverage Sizing Uses Minimum Quantity of 1
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Chart Comparison Index
                  </div>
                  <select
                    value={preferences.chartComparison}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        chartComparison: e.target.value,
                      })
                    }
                    className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option>SPY</option>
                    <option>QQQ</option>
                    <option>IWM</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Wide Spread Performance Window
                  </div>
                  <select
                    value={preferences.wideSpreadWindow}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        wideSpreadWindow: e.target.value,
                      })
                    }
                    className="w-32 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option>3 Minutes</option>
                    <option>5 Minutes</option>
                    <option>10 Minutes</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Profit Target Triggering
                  </div>
                  <select
                    value={preferences.targetTriggering}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        targetTriggering: e.target.value,
                      })
                    }
                    className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option>DTE</option>
                    <option>Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Data Summary */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Account Data Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-300">
                <div>Member Since: Thursday, June 2, 2022</div>
                <div>Last Login: 3:21pm on Thursday, June 2, 2022</div>
                <div>
                  Last Website Activity: 4:22pm on Thursday, June 2, 2022
                </div>
                <div>Trades Logged: 0</div>
                <div>Bots Created: 0</div>
                <div>Bot Groups: 0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
