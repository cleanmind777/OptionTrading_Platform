import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { useAtom, useAtomValue } from 'jotai';
// import { userAtom } from '../../atoms/userAtom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface AccountAccessSettings {
  pause_bots_if_no_activity_for: number;
  log_me_out_after_no_activity_for: number;
}

export function AccountSettings() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [pauseBots, setPauseBots] = useState(0)
  const [logMeOut, setLogMeOut] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [firstName, setFirstName] = useState("");
  const [discord, setDiscord] = useState("")
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(false); // Add loading state
  const [accountAccessSettings, setaccountAccessSettings] = useState({});
  const storedUserInfo = localStorage.getItem("userinfo");
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {
    email: "",
    account_access_settings: {
      pause_bots_if_no_activity_for: 0,
      log_me_out_after_no_activity_for: 0,
    },
    // Add other required fields with default values
  };
  const [tradingGroup, setTradingGroup] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [userInfo, setUserInfo] = useState(localStorage.getItem("userinfo"));
  const [userPreferences, setUserPreferences] = useState({
    intraday_chart_settings: {
      display_buying_power: true,
      display_trades: true,
      delay_chart_start_until: true,
    },
    main_dashboard_settings: {
      default_to_privacy_mode_on: false,
      hide_closed_trades_on_bots_table: false,
      show_all_bot_trades_profit_card: false,
      show_intraday_chart: false,
      show_recent_bot_activity: false,
      show_strategy_profits_on_profit_cards: false,
      show_todays_bot_trade_profit_card: false,
      show_trade_counts_card: false,
    },
    number_of_recent_bot_activities_to_show: 3,
    chart_comparison_index: "SPY",
  });

  const [botPreferences, setBotPreferences] = useState({
    enable_bot_webhook_controls: false,
    leverage_sizing_uses_minimum_quantity_of_1: true,
    percent_sizing_uses_minimum_quantity_of_1: false,
    profit_target_trigger: 5,
    wide_spread_patience_window: 3
  })

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const update_account_settings = async (
    email: string,
    account_access_settings: AccountAccessSettings
  ) => {
    const data = {
      email: email,
      account_access_settings: account_access_settings,
    };
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/update/account_access_settings`,
        data
      );
      console.log("Account Settings change successful:", response.data);
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log("error");
      alert("Error");
      return false;
    }
  };
  const update_preferences = async (
    email: string,
    userPreferences: any, // Replace `any` with the correct type
    botPreferences: any   // Replace `any` with the correct type
  ) => {
    const data = {
      email: email,
      user_preferences: userPreferences,
      bot_preferences: botPreferences,
    };
    try {
      const response = await axios.post(`${BACKEND_URL}/user/update/preferences`, data);
      console.log("Preferences change successful:", response.data);
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log("error");
      alert("Error updating preferences");
      return false;
    }
  };
  const update_firstName = async (email: string, new_first_name: string) => {
    const data = {
      email: email,
      new_first_name: new_first_name
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/user/update/first_name`, data)
      console.log('FirstName change successful:', response.data)
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      return response.data
    } catch (error) {
      console.log("error")
      alert("Error")
      return false
    }
  }
  const update_discord = async (email: string, new_discord: string) => {
    const data = {
      email: email,
      new_discord: new_discord
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/user/update/discord`, data)
      console.log('Discord change successful:', response.data)
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      return response.data
    } catch (error) {
      console.log("error")
      alert("Error")
      return false
    }
  }
  const update_phone_number = async (email: string, new_phone_number: string) => {
    const data = {
      email: email,
      new_phone_number: new_phone_number
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/user/update/phone_number`, data)
      console.log('PhoneNumber change successful:', response.data)
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      return response.data
    } catch (error) {
      console.log("error")
      alert("Error")
      return false
    }
  }
  const update_password = async () => {
    if (confirmPassword != newPassword) {
      alert("Plz match with confirm and new")
    }
    else {
      const data = {
        email: userInfo.email,
        current_password: currentPassword,
        new_password: newPassword
      }
      try {
        const response = await axios.post(`${BACKEND_URL}/user/update/password`, data)
        console.log('Password change successful:', response.data)
        localStorage.setItem("userinfo", JSON.stringify(response.data));
        return response.data
      } catch (error) {
        console.log("error")
        alert("Error")
        return false
      }
    }
  }
  const update_email = async (current_email: string, password: string, new_email: string) => {
    const data = {
      current_email: current_email,
      password: password,
      new_email: new_email
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/user/update/email`, data)
      console.log('Email change successful:', response.data)
      setShowEmailModal(false);
      userInfo.email = Email
      localStorage.setItem("userinfo", JSON.stringify(userInfo));
      return response.data
    } catch (error) {
      console.log("error")
      alert("Incorrect Password")
      return false
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Handle initial page load with hash
    console.log("jotai", userInfo);
    setDemo(userInfo.demo_status)
    setUserPreferences(userInfo.user_preferences)
    setBotPreferences(userInfo.bot_preferences)
    setFirstName(userInfo.first_name);
    setPauseBots(userInfo.account_access_settings.pause_bots_if_no_activity_for);
    setPhoneNumber(userInfo.phone_number);
    setDiscord(userInfo.social_account.Discord);
    setLogMeOut(userInfo.account_access_settings.log_me_out_after_no_activity_for)
  }, []);
  useEffect(() => {
    // Handle initial page load w ith hash
    console.log(pauseBots)

  }, [firstName, discord, phoneNumber]);
  const createDemo = async () => {
    setLoading(true); // Start loading
    const params = {
      user_id: userInfo.id
    }
    axios
      .get(`${BACKEND_URL}/demo/create`, { params })
      .then((response) => {
        alert("Success")
      })
      .catch((error) => {
        alert(error.response.data.detail)
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });

  };

  const deleteDemo = async () => {
    const params = {
      user_id: userInfo.id
    }
    axios
      .delete(`${BACKEND_URL}/demo/delete`, { params })
      .then((response) => {
        alert("Success")
      })
      .catch((error) => {
        alert(error.detail)
        console.error("Error fetching data:", error);
      });
  };
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] rounded-lg p-6 max-w-md w-full mx-4 relative">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              <span className="text-white">Creating Demo Account...</span>
            </div>
          </div>
        </div>
      )}
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

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  To get started, please input your new email
                </label>
                <input
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  placeholder="Enter your new email"
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
                    update_email(userInfo.email, verifyPassword, Email)
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
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <button
                      onClick={() =>
                        update_firstName(userInfo.email, firstName)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
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
                        value={discord}
                        onChange={(e) =>
                          setDiscord(e.target.value)
                        }
                        placeholder="Enter Discord Username"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={() =>
                        update_discord(userInfo.email, discord)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
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
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <button
                      onClick={() =>
                        update_phone_number(userInfo.email, phoneNumber)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
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

                <button
                  onClick={() =>
                    update_password()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
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

            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span>Demo Trading Accounts & Logs</span>
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Create Demo Trading Accounts & Logs
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Create the demo trading accounts and logs for performance chart.
                  </p>
                  <button
                    onClick={createDemo}
                    disabled={loading} // Disable button while loading
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Create Demo Account</span>
                  </button>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Delete Demo Trading Accounts & Logs
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Permanently remove your demo account and all associated data.
                  </p>
                  <button
                    onClick={deleteDemo}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete Demo Account</span>
                  </button>
                </div>
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

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Log Me Out After No Activity For:
                  </label>
                  <select
                    value={logMeOut}
                    onChange={(e) => {
                      setLogMeOut(Number(e.target.value))
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option value={0.5}>30 Minutes</option>
                    <option value={1}>1 Hours</option>
                    <option value={2}>2 Hours</option>
                    <option value={4}>4 Hours</option>
                    <option value={8}>8 Hours</option>
                    <option value={12}>12 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Pause Bots If No Activity For:
                  </label>
                  <select
                    value={pauseBots}
                    onChange={(e) => {
                      setPauseBots(Number(e.target.value))
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>7 Days</option>
                    <option value={10}>10 Days</option>
                  </select>
                </div>
              </div>
              <button
                onClick={(e) => {
                  // console.log(userInfo.account_access_settings);
                  // console.log(pauseBots)
                  // console.log(logMeOut)
                  update_account_settings(userInfo.email, {
                    pause_bots_if_no_activity_for: pauseBots, // Keep as number
                    log_me_out_after_no_activity_for: logMeOut, // Keep as number
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full">
                UPDATE
              </button>
            </div>

            {/* User Preferences */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                User Preferences
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Main Dashboard Settings
                  </div>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userPreferences.main_dashboard_settings.default_to_privacy_mode_on}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              default_to_privacy_mode_on: e.target.checked,
                            },
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
                        checked={userPreferences.main_dashboard_settings.hide_closed_trades_on_bots_table}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              hide_closed_trades_on_bots_table: e.target.checked,
                            },
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
                        checked={userPreferences.main_dashboard_settings.show_all_bot_trades_profit_card}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              show_all_bot_trades_profit_card: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Following Bot Trades on Profit Card
                      </span>
                    </label>
                    {/* <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userPreferences.main_dashboard_settings.show_recent_bot_activity}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              show_recent_bot_activity: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">
                        Show Recent Activity
                      </span>
                    </label> */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userPreferences.main_dashboard_settings.show_strategy_profits_on_profit_cards}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              show_strategy_profits_on_profit_cards: e.target.checked,
                            },
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
                        checked={userPreferences.main_dashboard_settings.show_intraday_chart}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              show_intraday_chart: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Show Intraday Chart</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userPreferences.main_dashboard_settings.show_recent_bot_activity}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            main_dashboard_settings: {
                              ...userPreferences.main_dashboard_settings,
                              show_recent_bot_activity: e.target.checked,
                            },
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
                        checked={userPreferences.intraday_chart_settings.display_buying_power}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            intraday_chart_settings: {
                              ...userPreferences.intraday_chart_settings,
                              display_buying_power: e.target.checked,
                            },
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
                        checked={userPreferences.intraday_chart_settings.display_trades}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            intraday_chart_settings: {
                              ...userPreferences.intraday_chart_settings,
                              display_trades: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Display Trades</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userPreferences.intraday_chart_settings.delay_chart_start_until}
                        onChange={(e) =>
                          setUserPreferences({
                            ...userPreferences,
                            intraday_chart_settings: {
                              ...userPreferences.intraday_chart_settings,
                              delay_chart_start_until: e.target.checked,
                            },
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
                        checked={botPreferences.percent_sizing_uses_minimum_quantity_of_1}
                        onChange={(e) =>
                          setBotPreferences({
                            ...botPreferences,
                            percent_sizing_uses_minimum_quantity_of_1: e.target.checked,
                          },
                          )
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
                        checked={botPreferences.leverage_sizing_uses_minimum_quantity_of_1}
                        onChange={(e) =>
                          setBotPreferences({
                            ...botPreferences,
                            leverage_sizing_uses_minimum_quantity_of_1: e.target.checked,
                          },
                          )
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
                    value={userPreferences.chart_comparison_index}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        chart_comparison_index: e.target.value
                      })
                    }
                    className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value={"SPY"}>SPY</option>
                    <option value={"QQQ"}>QQQ</option>
                    <option value={"IWM"}>IWM</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Wide Spread Performance Window
                  </div>
                  <select
                    value={botPreferences.wide_spread_patience_window}
                    onChange={(e) =>
                      setBotPreferences({
                        ...botPreferences,
                        wide_spread_patience_window: Number(e.target.value),
                      },
                      )
                    }
                    className="w-32 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value={3}>3 Minutes</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={0}>Until Normal Quotes</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm text-white font-medium mb-2">
                    Profit Target Triggering
                  </div>
                  <select
                    value={botPreferences.profit_target_trigger}
                    onChange={(e) =>
                      setBotPreferences({
                        ...botPreferences,
                        profit_target_trigger: Number(e.target.value),
                      },
                      )
                    }
                    className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value={0}>Immediatley</option>
                    <option value={5}>5%</option>
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                    <option value={20}>20%</option>
                    <option value={25}>25%</option>
                    <option value={30}>30%</option>
                    <option value={35}>35%</option>
                    <option value={40}>40%</option>
                    <option value={45}>45%</option>
                    <option value={50}>50%</option>
                    <option value={55}>55%</option>
                    <option value={60}>60%</option>
                    <option value={65}>65%</option>
                    <option value={70}>70%</option>
                    <option value={75}>75%</option>
                    <option value={80}>80%</option>

                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  update_preferences(userInfo.email, userPreferences, botPreferences);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full">
                UPDATE
              </button>
            </div>

            {/* Account Data Summary */}
            <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Account Data Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-300">
                <div>Member Since: {userInfo.created_time}</div>
                <div>Last Login: {userInfo.last_login_time}</div>
                <div>
                  Last Website Activity: {userInfo.last_website_activity}
                </div>
                <div>Trades Logged: {userInfo.trades_logged}</div>
                <div>Bots Created: {userInfo.bots_created}</div>
                <div>Bot Groups: {userInfo.bot_groups}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
