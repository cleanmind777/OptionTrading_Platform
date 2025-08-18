import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TradingLog, TradingAccount, TradingLogFilter } from "../../types/trading";
import { getTradingLogs } from "../../api/trading";
import { roundTo } from "../../utils/NumberProcess";
import { transformTradingLogsForUser } from "../../utils/Trading";
import BotTradingChart from "../../components/BotTradingChart";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Bot {
  id: string;
  name: string;
  status: "active" | "paused" | "stopped";
  strategy: string;
  pnl: number;
  pnlPercent: number;
  trades: number;
  account: string;
}

export function TradingDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bots" | "accounts" | "trades">("overview");
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!);
  const navigate = useNavigate();
  const [bots, setBots] = useState<Bot[]>([]);
  const [tradingLogs, setTradingLogs] = useState<TradingLog[]>([]);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [todayProfit, setTodayProfit] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10";
      case "paused":
        return "text-yellow-400 bg-yellow-400/10";
      case "stopped":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTradingLogs = () => {
    const params = { user_id: userInfo.id };
    axios
      .get(`${BACKEND_URL}/live-trade/trading-logs`, { params })
      .then((response) => {
        setTradingLogs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const getUserInfo = () => {
    const params = { user_id: userInfo.id };
    axios
      .get(`${BACKEND_URL}/user/me`, { params })
      .then((response) => {
        localStorage.setItem("userinfo", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getTradingAccounts = () => {
    const params = { user_id: userInfo.id };
    axios
      .get(`${BACKEND_URL}/live-trade/trading-accounts`, { params })
      .then((response) => {
        setTradingAccounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getTodayTradingLogs = (logs: TradingLog[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return logs.filter((log) => {
      const logDate = new Date(log.time);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  };

  const calculateTodayMetrics = (logs: TradingLog[]) => {
    return logs.reduce(
      (acc, log) => {
        acc.totalProfit += log.profit ?? 0;
        acc.totalLoss += log.profit && log.profit < 0 ? log.profit : 0;
        acc.totalWins += log.profit >= 0 ? 1 : 0;
        acc.totalLosses += log.profit < 0 ? 1 : 0;
        return acc;
      },
      { totalProfit: 0, totalLoss: 0, totalWins: 0, totalLosses: 0 }
    );
  };

  const getBotsForTradingDashboard = () => {
    const params = { user_id: userInfo.id };
    axios
      .get(`${BACKEND_URL}/bot/get_bots_for_trading_dashboard`, { params })
      .then((response) => {
        setBots(response.data);
        if (response.data.length === 0) {
          alert("You don't have any bots. Please create a new bot.");
        }
        localStorage.setItem("botsForTradingDashboard", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const startBot = (bot_id: string) => {
    const params = { bot_id };
    axios
      .get(`${BACKEND_URL}/live-trade/start-trading/`, { params })
      .then(() => {
        getBotsForTradingDashboard();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert(error.response.data.detail);
      });
  };

  const stopBot = (bot_id: string) => {
    const params = { bot_id };
    axios
      .get(`${BACKEND_URL}/live-trade/stop-trading-bot-id/`, { params })
      .then(() => {
        getBotsForTradingDashboard();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert(error.response.data.detail);
      });
  };

  useEffect(() => {
    getUserInfo();
    getTradingLogs();
    getBotsForTradingDashboard();
    getTradingAccounts();
  }, []);

  useEffect(() => {
    const todayLog = getTodayTradingLogs(tradingLogs);
    const todayData = calculateTodayMetrics(todayLog);
    setTodayProfit(todayData.totalProfit);
  }, [tradingLogs]);

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
            <p className="text-gray-300 mt-1">Monitor your automated trading performance</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/bots/create"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105"
            >
              Create Bot
            </Link>
            <Link
              to="/useracct/brokerlink"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105"
            >
              Link Account
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview" },
              { key: "bots", label: "Trading Bots" },
              { key: "accounts", label: "Accounts" },
              { key: "trades", label: "Trade Log" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "overview" | "bots" | "accounts" | "trades")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
                <h3 className="text-gray-300 text-sm font-medium">Total Portfolio Value</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(userInfo.total_balance)}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm ${todayProfit >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {todayProfit >= 0 ? "+" : ""}
                    {formatCurrency(todayProfit)} today
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
                <h3 className="text-gray-300 text-sm font-medium">Active Bots</h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {bots.filter((bot) => bot.status === "active").length}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-gray-400 text-sm">{bots.length} total bots</span>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
                <h3 className="text-gray-300 text-sm font-medium">Total P&L</h3>
                <p
                  className={`text-3xl font-bold mt-2 ${userInfo.total_profit + userInfo.total_loss >= 0
                    ? "text-green-400"
                    : "text-red-400"
                    }`}
                >
                  {formatCurrency(userInfo.total_profit + userInfo.total_loss)}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm ${userInfo.total_profit + userInfo.total_loss >= 0
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {userInfo.total_profit + userInfo.total_loss >= 0 ? "+" : ""}
                    {(
                      (userInfo.total_profit / (userInfo.total_profit - userInfo.total_loss)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
              <BotTradingChart data={transformTradingLogsForUser(tradingLogs)} />
            </div>
          </div>
        )}

        {/* Bots Tab */}
        {activeTab === "bots" && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Trading Bots</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Bot Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Strategy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Trades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {bots.map((bot) => (
                    <tr key={bot.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{bot.name}</div>
                          <div className="text-sm text-gray-400">{bot.account}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            bot.status
                          )}`}
                        >
                          {bot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bot.strategy}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{formatCurrency(bot.pnl)}</div>
                        <div
                          className={`text-sm ${bot.pnlPercent >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {bot.pnlPercent >= 0 ? "+" : ""}
                          {bot.pnlPercent}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bot.trades}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => (bot.status === "active" ? stopBot(bot.id) : startBot(bot.id))}
                          >
                            {bot.status === "active" ? "Stop" : "Start"}
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => navigate(`/bots/monitor/${bot.id}`)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tradingAccounts.length > 0 ? (
              tradingAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                      <p className="text-gray-400 text-sm">{account.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Settings</button>
                      <button className="text-gray-400 hover:text-gray-300 text-sm">Refresh</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Account Balance</span>
                      <span className="text-white font-medium">
                        {formatCurrency(account.current_balance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Today's P&L</span>
                      <span
                        className={`font-medium ${account.total_profit + account.total_loss >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                      >
                        {account.total_profit + account.total_loss >= 0 ? "+" : ""}
                        {formatCurrency(account.total_profit + account.total_loss)} (
                        {account.total_profit + account.total_loss >= 0 ? "+" : ""}
                        {Math.round(account.win_rate * 10000) / 100}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active Bots</span>
                      <span className="text-white">
                        {bots.filter((bot) => bot.account === account.name && bot.status === "active").length}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-slate-800/50 border border-slate-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">
                  No Trading Accounts Found
                </h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  You haven't linked any trading accounts yet. Connect your brokerage account to get started.
                </p>
                <Link
                  to="/useracct/brokerlink"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="-ml-1 mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connect Account
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === "trades" && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>

            {tradingLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Profit/Loss
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Win/Loss
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Bot
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {tradingLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {log.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(log.time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${log.profit >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                          >
                            {formatCurrency(log.profit)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${log.win_loss ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                              }`}
                          >
                            {log.win_loss ? "Win" : "Loss"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {bots.find((bot) => bot.id === log.bot_id)?.name || "Unknown Bot"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p>No trading history found.</p>
                <p className="text-sm mt-2">Start trading to see your performance logs here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}