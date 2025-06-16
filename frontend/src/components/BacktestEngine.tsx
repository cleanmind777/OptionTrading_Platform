import React, { useState } from 'react';

interface BacktestConfig {
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategy: string;
  symbol: string;
  riskPerTrade: number;
}

interface BacktestResult {
  totalReturn: number;
  winRate: number;
  totalTrades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
}

export function BacktestEngine() {
  const [config, setConfig] = useState<BacktestConfig>({
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    strategy: 'momentum',
    symbol: 'AAPL',
    riskPerTrade: 2
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtest execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    const mockResults: BacktestResult = {
      totalReturn: Math.random() * 30 - 5, // -5% to 25%
      winRate: Math.random() * 20 + 60, // 60% to 80%
      totalTrades: Math.floor(Math.random() * 200) + 50,
      maxDrawdown: -(Math.random() * 10 + 2), // -2% to -12%
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
      profitFactor: Math.random() * 2 + 1 // 1 to 3
    };
    
    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Backtest Configuration */}
      <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Backtest Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">End Date</label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Initial Capital</label>
            <input
              type="number"
              value={config.initialCapital}
              onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Strategy</label>
            <select
              value={config.strategy}
              onChange={(e) => setConfig(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="momentum">Momentum Strategy</option>
              <option value="mean-reversion">Mean Reversion</option>
              <option value="scalping">Scalping Strategy</option>
              <option value="swing">Swing Trading</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Symbol</label>
            <input
              type="text"
              value={config.symbol}
              onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="AAPL"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Risk per Trade (%)</label>
            <input
              type="number"
              step="0.1"
              value={config.riskPerTrade}
              onChange={(e) => setConfig(prev => ({ ...prev, riskPerTrade: Number(e.target.value) }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={runBacktest}
          disabled={isRunning || !config.startDate || !config.endDate}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          {isRunning && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{isRunning ? 'Running Backtest...' : 'Run Backtest'}</span>
        </button>
      </div>

      {/* Backtest Results */}
      {results && (
        <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Backtest Results</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4 text-center"></div>
          </div>
        </div>
      )}
    </div>
  )
}
