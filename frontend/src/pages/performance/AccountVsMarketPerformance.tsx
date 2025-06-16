import { useState } from "react";
import { DatePicker } from "../../components/DatePicker";

interface ComparisonData {
  accountReturn: number;
  benchmarkReturn: number;
  alpha: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  correlation: number;
  winRate: number;
  totalTrades: number;
}

export function AccountVsMarketPerformance() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedBenchmark, setSelectedBenchmark] = useState("SPY");
  const [dateRange, setDateRange] = useState("06/09/2024 - 06/09/2025");
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );

  const accounts = [
    { id: "", name: "Select Account", disabled: true },
    { id: "account-1", name: "Main Trading Account", balance: "$125,430.50" },
    { id: "account-2", name: "Options Account", balance: "$67,890.25" },
    { id: "account-3", name: "Conservative Account", balance: "$89,123.75" },
    { id: "combined", name: "All Accounts Combined", balance: "$282,444.50" },
  ];

  const benchmarks = [
    { id: "SPY", name: "SPY (S&P 500)", description: "SPDR S&P 500 ETF Trust" },
    { id: "QQQ", name: "QQQ (NASDAQ 100)", description: "Invesco QQQ Trust" },
    {
      id: "VTI",
      name: "VTI (Total Stock Market)",
      description: "Vanguard Total Stock Market ETF",
    },
    {
      id: "IWM",
      name: "IWM (Russell 2000)",
      description: "iShares Russell 2000 ETF",
    },
    {
      id: "DIA",
      name: "DIA (Dow Jones)",
      description: "SPDR Dow Jones Industrial Average ETF",
    },
    {
      id: "TLT",
      name: "TLT (20+ Year Treasury)",
      description: "iShares 20+ Year Treasury Bond ETF",
    },
  ];

  const handleGenerateComparison = async () => {
    if (!selectedAccount) {
      alert("Please select an account to compare.");
      return;
    }

    setIsLoading(true);
    console.log("Generating comparison with:", {
      selectedAccount,
      selectedBenchmark,
      dateRange,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock comparison data
    setComparisonData({
      accountReturn: 12.8,
      benchmarkReturn: 9.2,
      alpha: 3.6,
      beta: 0.95,
      sharpeRatio: 1.45,
      maxDrawdown: -5.2,
      volatility: 14.3,
      correlation: 0.78,
      winRate: 68.5,
      totalTrades: 142,
    } as ComparisonData);

    setIsLoading(false);
  };

  const handleReset = () => {
    setSelectedAccount("");
    setSelectedBenchmark("SPY");
    setDateRange("06/09/2024 - 06/09/2025");
    setComparisonData(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Account vs Market Performance
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Compare your trading account performance against market benchmarks
            to analyze risk-adjusted returns, correlation, and alpha generation.
          </p>
        </div>

        {/* Configuration Section */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-3 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Comparison Configuration
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Trading Account
              </label>
              <div className="relative">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors"
                >
                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                      disabled={account.disabled}
                    >
                      {account.name}
                      {account.balance && ` - ${account.balance}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Benchmark Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Market Benchmark
              </label>
              <div className="relative">
                <select
                  value={selectedBenchmark}
                  onChange={(e) => setSelectedBenchmark(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors"
                >
                  {benchmarks.map((benchmark) => (
                    <option key={benchmark.id} value={benchmark.id}>
                      {benchmark.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              {selectedBenchmark && (
                <p className="text-xs text-gray-500 mt-2">
                  {
                    benchmarks.find((b) => b.id === selectedBenchmark)
                      ?.description
                  }
                </p>
              )}
            </div>

            {/* Date Range */}
            <div>
              <DatePicker
                label="Analysis Period"
                value={dateRange}
                onChange={setDateRange}
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleGenerateComparison}
              disabled={isLoading || !selectedAccount}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>GENERATE COMPARISON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {comparisonData ? (
          <div className="space-y-8">
            {/* Performance Summary */}
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Performance Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-900/20 to-green-700/20 rounded-lg p-6 border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Account Return
                    </span>
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    +{comparisonData.accountReturn}%
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/20 to-blue-700/20 rounded-lg p-6 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      {selectedBenchmark} Return
                    </span>
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    +{comparisonData.benchmarkReturn}%
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Alpha Generated
                    </span>
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    +{comparisonData.alpha}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Outperformance
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-6 border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Sharpe Ratio</span>
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {comparisonData.sharpeRatio}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Risk-adjusted return
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Risk & Performance Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Beta (Market Sensitivity)
                    </span>
                    <span className="text-blue-400 font-bold">
                      {comparisonData.beta}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${comparisonData.beta * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {comparisonData.beta < 1
                      ? "Less volatile than market"
                      : "More volatile than market"}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Max Drawdown</span>
                    <span className="text-red-400 font-bold">
                      {comparisonData.maxDrawdown}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full"
                      style={{
                        width: `${Math.abs(comparisonData.maxDrawdown) * 2}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Largest peak-to-trough decline
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Volatility</span>
                    <span className="text-orange-400 font-bold">
                      {comparisonData.volatility}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${comparisonData.volatility}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Standard deviation of returns
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Correlation</span>
                    <span className="text-green-400 font-bold">
                      {comparisonData.correlation}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${comparisonData.correlation * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Correlation with benchmark
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Win Rate</span>
                    <span className="text-emerald-400 font-bold">
                      {comparisonData.winRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full"
                      style={{ width: `${comparisonData.winRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Percentage of profitable trades
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Total Trades</span>
                    <span className="text-cyan-400 font-bold">
                      {comparisonData.totalTrades}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full"
                      style={{
                        width: `${Math.min(comparisonData.totalTrades / 2, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Number of executed trades
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Insight */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-8 border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Performance Insight
              </h3>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-green-400">
                    Excellent Performance:
                  </strong>{" "}
                  Your account generated{" "}
                  <span className="text-green-400 font-semibold">
                    +{comparisonData.alpha}% alpha
                  </span>{" "}
                  compared to the {selectedBenchmark} benchmark. With a Sharpe
                  ratio of{" "}
                  <span className="text-yellow-400 font-semibold">
                    {comparisonData.sharpeRatio}
                  </span>
                  , you're achieving superior risk-adjusted returns. The
                  correlation of{" "}
                  <span className="text-blue-400 font-semibold">
                    {comparisonData.correlation}
                  </span>{" "}
                  indicates moderate diversification from market movements,
                  while maintaining a{" "}
                  <span className="text-emerald-400 font-semibold">
                    {comparisonData.winRate}% win rate
                  </span>{" "}
                  across {comparisonData.totalTrades} trades.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* No Data State */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-3">
              Ready to Analyze Performance
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Select your trading account and benchmark, then click "Generate
              Comparison" to view detailed performance analytics and risk
              metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
