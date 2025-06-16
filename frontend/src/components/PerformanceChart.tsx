import React from "react";
import { Dispatch, SetStateAction } from "react";

// Define different prop interfaces for different use cases
interface BasePerformanceChartProps {
  className?: string;
}

interface AnalyticsPerformanceChartProps extends BasePerformanceChartProps {
  data: {
    date: string;
    equity: number;
    profit: number;
    trades: number;
    winRate: number;
    drawdown: number;
  }[];
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
  onTimeframeChange: Dispatch<
    SetStateAction<"1D" | "1W" | "1M" | "3M" | "1Y" | "ALL">
  >;
}

interface DashboardPerformanceChartProps extends BasePerformanceChartProps {
  account: string;
  interval: string;
  dateRange: string;
  onExport: (format: "csv" | "json" | "png") => void;
}

export type PerformanceChartProps =
  | AnalyticsPerformanceChartProps
  | DashboardPerformanceChartProps;

// Type guards to determine which props interface is being used
function isAnalyticsProps(
  props: PerformanceChartProps
): props is AnalyticsPerformanceChartProps {
  return "data" in props && "timeframe" in props;
}

function isDashboardProps(
  props: PerformanceChartProps
): props is DashboardPerformanceChartProps {
  return "account" in props && "interval" in props;
}

export function PerformanceChart(props: PerformanceChartProps) {
  if (isAnalyticsProps(props)) {
    return <AnalyticsPerformanceChart {...props} />;
  } else if (isDashboardProps(props)) {
    return <DashboardPerformanceChart {...props} />;
  } else {
    return (
      <div className="text-red-400">Invalid props for PerformanceChart</div>
    );
  }
}

// Analytics version of the component
function AnalyticsPerformanceChart({
  data,
  timeframe,
  onTimeframeChange,
  className = "",
}: AnalyticsPerformanceChartProps) {
  // Filter data based on timeframe
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case "1D":
        startDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "ALL":
      default:
        return data;
    }

    return data.filter((item) => new Date(item.date) >= startDate);
  };

  const filteredData = getFilteredData();
  const latestData = filteredData[filteredData.length - 1];
  const firstData = filteredData[0];

  // Calculate metrics
  const totalReturn =
    latestData && firstData
      ? ((latestData.equity - firstData.equity) / firstData.equity) * 100
      : 0;

  const totalTrades = filteredData.reduce((sum, d) => sum + d.trades, 0);
  const avgWinRate =
    filteredData.length > 0
      ? filteredData.reduce((sum, d) => sum + d.winRate, 0) /
        filteredData.length
      : 0;
  const maxDrawdown =
    filteredData.length > 0
      ? Math.min(...filteredData.map((d) => d.drawdown))
      : 0;

  return (
    <div
      className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Performance Chart</h3>

        {/* Timeframe Selector */}
        <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
          {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === tf
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-slate-600"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📈 Performance Chart</div>
          <div className="text-sm text-gray-500">
            {filteredData.length} data points for {timeframe} timeframe
          </div>
          {latestData && (
            <div className="text-sm text-gray-500 mt-2">
              Current Equity: ${latestData.equity.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Total Return</div>
          <div
            className={`text-lg font-semibold ${totalReturn >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn.toFixed(2)}%
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Total Trades</div>
          <div className="text-lg font-semibold text-white">
            {totalTrades.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Avg Win Rate</div>
          <div className="text-lg font-semibold text-blue-400">
            {avgWinRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Max Drawdown</div>
          <div className="text-lg font-semibold text-red-400">
            {maxDrawdown.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard version of the component
function DashboardPerformanceChart({
  account,
  interval,
  dateRange,
  onExport,
  className = "",
}: DashboardPerformanceChartProps) {
  // Generate mock data based on the props
  const generateMockData = () => {
    const data = [];
    const days =
      dateRange === "1M"
        ? 30
        : dateRange === "3M"
          ? 90
          : dateRange === "1Y"
            ? 365
            : 7;

    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        value: 10000 + Math.random() * 2000 - 1000,
        change: (Math.random() - 0.5) * 200,
      });
    }

    return data;
  };

  const mockData = generateMockData();
  const latestValue = mockData[mockData.length - 1]?.value || 0;
  const firstValue = mockData[0]?.value || 0;
  const totalReturn = ((latestValue - firstValue) / firstValue) * 100;

  return (
    <div
      className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Performance Chart
          </h3>
          <p className="text-sm text-gray-400">
            Account: {account} • Interval: {interval} • Range: {dateRange}
          </p>
        </div>

        {/* Export Options */}
        <div className="flex space-x-2">
          <button
            onClick={() => onExport("csv")}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded text-sm transition-colors"
          >
            CSV
          </button>
          <button
            onClick={() => onExport("json")}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded text-sm transition-colors"
          >
            JSON
          </button>
          <button
            onClick={() => onExport("png")}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded text-sm transition-colors"
          >
            PNG
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            📊 Dashboard Performance Chart
          </div>
          <div className="text-sm text-gray-500">
            {mockData.length} data points for {dateRange}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Current Value: ${latestValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Total Return</div>
          <div
            className={`text-lg font-semibold ${totalReturn >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn.toFixed(2)}%
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Current Value</div>
          <div className="text-lg font-semibold text-white">
            ${latestValue.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Data Points</div>
          <div className="text-lg font-semibold text-blue-400">
            {mockData.length}
          </div>
        </div>
      </div>
    </div>
  );
}
