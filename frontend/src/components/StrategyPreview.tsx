import { useState, useEffect, useMemo } from "react";

interface StrategyLeg {
  action: "BUY" | "SELL";
  type: "CALL" | "PUT";
  strike: number;
  quantity: number;
  price: number;
  delta: number;
  expiration: string;
}

interface StrategyPreviewProps {
  symbol: string;
  currentPrice: number;
  legs: StrategyLeg[];
  strategy: string;
  daysToExpiration: number;
  impliedVolatility: number;
  onUpdate?: (analysis: StrategyAnalysis) => void;
}

interface StrategyAnalysis {
  maxProfit: number;
  maxLoss: number;
  breakevens: number[];
  probabilityOfProfit: number;
  riskRewardRatio: number;
  marginRequirement: number;
  profitZone: {
    lower: number;
    upper: number;
  };
  greeks: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
  };
  scenarios: PriceScenario[];
}

interface PriceScenario {
  price: number;
  profit: number;
  profitPercent: number;
  probability: number;
}

export function StrategyPreview({
  symbol,
  currentPrice,
  legs,
  strategy,
  daysToExpiration,
  impliedVolatility,
  onUpdate,
}: StrategyPreviewProps) {
  const [selectedTime, setSelectedTime] = useState<number>(0); // 0 = expiration, other values = days before
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [showGreeks, setShowGreeks] = useState(false);

  // Calculate strategy analysis
  const analysis = useMemo(() => {
    return calculateStrategyAnalysis(
      legs,
      currentPrice,
      daysToExpiration,
      impliedVolatility
    );
  }, [legs, currentPrice, daysToExpiration, impliedVolatility]);

  // Generate P&L chart data
  const chartData = useMemo(() => {
    return generatePLChart(
      legs,
      currentPrice,
      selectedTime,
      daysToExpiration,
      impliedVolatility
    );
  }, [legs, currentPrice, selectedTime, daysToExpiration, impliedVolatility]);

  useEffect(() => {
    onUpdate?.(analysis);
  }, [analysis, onUpdate]);

  if (legs.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Strategy Preview</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-300">
            Configure your strategy to see risk/reward analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">
          Strategy Preview: {strategy}
        </h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value={0}>At Expiration</option>
            <option value={7}>7 Days Before</option>
            <option value={14}>14 Days Before</option>
            <option value={21}>21 Days Before</option>
            <option value={30}>30 Days Before</option>
          </select>
          <button
            onClick={() => setShowGreeks(!showGreeks)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              showGreeks
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-gray-300 hover:text-white"
            }`}
          >
            Greeks
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-green-400 font-bold text-lg">
            ${analysis.maxProfit.toFixed(0)}
          </div>
          <div className="text-gray-400 text-xs">Max Profit</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-red-400 font-bold text-lg">
            ${Math.abs(analysis.maxLoss).toFixed(0)}
          </div>
          <div className="text-gray-400 text-xs">Max Loss</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-blue-400 font-bold text-lg">
            {analysis.probabilityOfProfit.toFixed(1)}%
          </div>
          <div className="text-gray-400 text-xs">Win Probability</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-purple-400 font-bold text-lg">
            {analysis.riskRewardRatio.toFixed(2)}:1
          </div>
          <div className="text-gray-400 text-xs">Risk:Reward</div>
        </div>
      </div>

      {/* P&L Chart */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-white mb-4">Profit & Loss Chart</h4>
        <div className="relative h-64">
          <svg
            width="100%"
            height="100%"
            className="overflow-visible"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const priceRange = chartData.maxPrice - chartData.minPrice;
              const price = chartData.minPrice + (x / rect.width) * priceRange;
              setHoveredPrice(price);
            }}
            onMouseLeave={() => setHoveredPrice(null)}
          >
            {/* Background grid */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Zero line */}
            <line
              x1="0"
              y1={chartData.zeroY}
              x2="100%"
              y2={chartData.zeroY}
              stroke="#6B7280"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Profit zone highlighting */}
            {analysis.profitZone.lower < analysis.profitZone.upper && (
              <rect
                x={
                  ((analysis.profitZone.lower - chartData.minPrice) /
                    (chartData.maxPrice - chartData.minPrice)) *
                    100 +
                  "%"
                }
                y="0"
                width={
                  ((analysis.profitZone.upper - analysis.profitZone.lower) /
                    (chartData.maxPrice - chartData.minPrice)) *
                    100 +
                  "%"
                }
                height="100%"
                fill="#10B981"
                fillOpacity="0.1"
              />
            )}

            {/* P&L curve */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={chartData.points
                .map((point, index) => {
                  const x = (index / (chartData.points.length - 1)) * 100;
                  const y =
                    ((chartData.maxPL - point.pl) /
                      (chartData.maxPL - chartData.minPL)) *
                    100;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Breakeven points */}
            {analysis.breakevens.map((breakeven, index) => {
              const x =
                ((breakeven - chartData.minPrice) /
                  (chartData.maxPrice - chartData.minPrice)) *
                100;
              return (
                <g key={index}>
                  <line
                    x1={x + "%"}
                    y1="0"
                    x2={x + "%"}
                    y2="100%"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={x + "%"}
                    cy={chartData.zeroY}
                    r="4"
                    fill="#F59E0B"
                  />
                </g>
              );
            })}

            {/* Current price line */}
            <line
              x1={
                ((currentPrice - chartData.minPrice) /
                  (chartData.maxPrice - chartData.minPrice)) *
                  100 +
                "%"
              }
              y1="0"
              x2={
                ((currentPrice - chartData.minPrice) /
                  (chartData.maxPrice - chartData.minPrice)) *
                  100 +
                "%"
              }
              y2="100%"
              stroke="#EF4444"
              strokeWidth="2"
            />

            {/* Price axis labels */}
            {chartData.priceLabels.map((price, index) => {
              const x = (index / (chartData.priceLabels.length - 1)) * 100;
              return (
                <text
                  key={index}
                  x={x + "%"}
                  y="105%"
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  ${price.toFixed(0)}
                </text>
              );
            })}

            {/* Hovered price indicator */}
            {hoveredPrice && (
              <g>
                <line
                  x1={
                    ((hoveredPrice - chartData.minPrice) /
                      (chartData.maxPrice - chartData.minPrice)) *
                      100 +
                    "%"
                  }
                  y1="0"
                  x2={
                    ((hoveredPrice - chartData.minPrice) /
                      (chartData.maxPrice - chartData.minPrice)) *
                      100 +
                    "%"
                  }
                  y2="100%"
                  stroke="#8B5CF6"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={
                    ((hoveredPrice - chartData.minPrice) /
                      (chartData.maxPrice - chartData.minPrice)) *
                      100 +
                    "%"
                  }
                  y="10"
                  textAnchor="middle"
                  className="text-xs fill-purple-400"
                >
                  ${hoveredPrice.toFixed(0)}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Chart legend */}
        <div className="flex justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-400">P&L Curve</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-gray-400">Current Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-yellow-500 border-dashed"></div>
            <span className="text-gray-400">Breakeven</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-green-500 bg-opacity-20"></div>
            <span className="text-gray-400">Profit Zone</span>
          </div>
        </div>
      </div>

      {/* Strategy Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position Details */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">Position Details</h4>
          <div className="space-y-2">
            {legs.map((leg, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      leg.action === "SELL"
                        ? "bg-red-900 text-red-300"
                        : "bg-green-900 text-green-300"
                    }`}
                  >
                    {leg.action}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      leg.type === "PUT"
                        ? "bg-orange-900 text-orange-300"
                        : "bg-blue-900 text-blue-300"
                    }`}
                  >
                    {leg.type}
                  </span>
                  <span className="text-white">${leg.strike}</span>
                </div>
                <div className="text-right">
                  <div className="text-white">${leg.price.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">
                    Δ {leg.delta.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Greeks Display */}
        {showGreeks && (
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">Portfolio Greeks</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-lg font-bold text-blue-400">
                  {analysis.greeks.delta.toFixed(3)}
                </div>
                <div className="text-gray-400 text-xs">Delta</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {analysis.greeks.gamma.toFixed(4)}
                </div>
                <div className="text-gray-400 text-xs">Gamma</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">
                  {analysis.greeks.theta.toFixed(2)}
                </div>
                <div className="text-gray-400 text-xs">Theta</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">
                  {analysis.greeks.vega.toFixed(2)}
                </div>
                <div className="text-gray-400 text-xs">Vega</div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Scenarios */}
        <div className="bg-slate-700 rounded-lg p-4 md:col-span-2">
          <h4 className="font-medium text-white mb-3">Price Scenarios</h4>
          <div className="grid grid-cols-5 gap-4">
            {analysis.scenarios.map((scenario, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  {scenario.price === currentPrice
                    ? "Current"
                    : scenario.price > currentPrice
                      ? `+${(((scenario.price - currentPrice) / currentPrice) * 100).toFixed(0)}%`
                      : `${(((scenario.price - currentPrice) / currentPrice) * 100).toFixed(0)}%`}
                </div>
                <div className="font-medium text-white">
                  ${scenario.price.toFixed(0)}
                </div>
                <div
                  className={`text-sm font-medium ${
                    scenario.profit >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${scenario.profit.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">
                  {scenario.probability.toFixed(0)}% prob
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for calculations
function calculateStrategyAnalysis(
  legs: StrategyLeg[],
  currentPrice: number,
  dte: number,
  iv: number
): StrategyAnalysis {
  if (legs.length === 0) {
    return {
      maxProfit: 0,
      maxLoss: 0,
      breakevens: [],
      probabilityOfProfit: 0,
      riskRewardRatio: 0,
      marginRequirement: 0,
      profitZone: { lower: 0, upper: 0 },
      greeks: { delta: 0, gamma: 0, theta: 0, vega: 0 },
      scenarios: [],
    };
  }

  // Calculate net credit/debit
  const netCredit = legs.reduce((sum, leg) => {
    return (
      sum + (leg.action === "SELL" ? leg.price : -leg.price) * leg.quantity
    );
  }, 0);

  // Find breakeven points
  const breakevens = findBreakevens(legs, netCredit);

  // Calculate max profit/loss
  let maxProfit = netCredit;
  let maxLoss = netCredit;

  // Sample P&L at different price points
  const priceRange = currentPrice * 0.5; // 50% range
  for (
    let price = currentPrice - priceRange;
    price <= currentPrice + priceRange;
    price += 5
  ) {
    const pl = calculatePLAtPrice(legs, price, netCredit);
    maxProfit = Math.max(maxProfit, pl);
    maxLoss = Math.min(maxLoss, pl);
  }

  // Calculate profit zone
  const profitZone = findProfitZone(legs, netCredit);

  // Calculate portfolio Greeks
  const greeks = calculatePortfolioGreeks(legs);

  // Generate scenarios
  const scenarios = generatePriceScenarios(
    legs,
    currentPrice,
    netCredit,
    iv,
    dte
  );

  // Calculate probability of profit
  const profitableScenarios = scenarios.filter((s) => s.profit > 0);
  const probabilityOfProfit = profitableScenarios.reduce(
    (sum, s) => sum + s.probability,
    0
  );

  const riskRewardRatio = maxProfit > 0 ? Math.abs(maxLoss) / maxProfit : 0;

  return {
    maxProfit,
    maxLoss,
    breakevens,
    probabilityOfProfit,
    riskRewardRatio,
    marginRequirement: Math.abs(maxLoss),
    profitZone,
    greeks,
    scenarios,
  };
}

function generatePLChart(
  legs: StrategyLeg[],
  currentPrice: number,
  timeToExpiration: number,
  dte: number,
  iv: number
) {
  const priceRange = currentPrice * 0.4; // 40% range
  const minPrice = currentPrice - priceRange;
  const maxPrice = currentPrice + priceRange;
  const points: Array<{ price: number; pl: number }> = [];

  // Generate P&L points
  for (
    let price = minPrice;
    price <= maxPrice;
    price += (maxPrice - minPrice) / 100
  ) {
    const netCredit = legs.reduce(
      (sum, leg) =>
        sum + (leg.action === "SELL" ? leg.price : -leg.price) * leg.quantity,
      0
    );

    let pl: number;
    if (timeToExpiration === 0) {
      // At expiration
      pl = calculatePLAtPrice(legs, price, netCredit);
    } else {
      // Before expiration (simplified calculation)
      pl = calculatePLBeforeExpiration(
        legs,
        price,
        netCredit,
        timeToExpiration,
        dte,
        iv
      );
    }

    points.push({ price, pl });
  }

  const allPLValues = points.map((p) => p.pl);
  const minPL = Math.min(...allPLValues);
  const maxPL = Math.max(...allPLValues);
  const zeroY = ((maxPL - 0) / (maxPL - minPL)) * 100;

  // Generate price labels
  const priceLabels = [];
  for (let i = 0; i <= 6; i++) {
    priceLabels.push(minPrice + (i / 6) * (maxPrice - minPrice));
  }

  return {
    points,
    minPrice,
    maxPrice,
    minPL,
    maxPL,
    zeroY,
    priceLabels,
  };
}

function calculatePLAtPrice(
  legs: StrategyLeg[],
  price: number,
  netCredit: number
): number {
  let intrinsicValue = 0;

  for (const leg of legs) {
    let optionValue = 0;

    if (leg.type === "CALL") {
      optionValue = Math.max(0, price - leg.strike);
    } else {
      optionValue = Math.max(0, leg.strike - price);
    }

    if (leg.action === "SELL") {
      intrinsicValue -= optionValue * leg.quantity;
    } else {
      intrinsicValue += optionValue * leg.quantity;
    }
  }

  return netCredit + intrinsicValue;
}

function calculatePLBeforeExpiration(
  legs: StrategyLeg[],
  price: number,
  netCredit: number,
  timeToExpiration: number,
  dte: number,
  iv: number
): number {
  // Simplified calculation - in reality would use Black-Scholes
  const timeDecayFactor = timeToExpiration / dte;
  const intrinsicValue = calculatePLAtPrice(legs, price, 0); // Just intrinsic
  const timeValue = netCredit * timeDecayFactor;

  return timeValue + intrinsicValue;
}

function findBreakevens(legs: StrategyLeg[], netCredit: number): number[] {
  const breakevens: number[] = [];

  // Simplified breakeven calculation
  // For credit spreads and iron condors
  if (legs.length >= 2) {
    const strikes = legs.map((leg) => leg.strike).sort((a, b) => a - b);

    if (netCredit > 0) {
      // Credit strategy
      breakevens.push(strikes[0] + netCredit / 100); // Lower breakeven
      if (strikes.length > 2) {
        breakevens.push(strikes[strikes.length - 1] - netCredit / 100); // Upper breakeven
      }
    } else {
      // Debit strategy
      breakevens.push(strikes[0] - netCredit / 100);
      if (strikes.length > 2) {
        breakevens.push(strikes[strikes.length - 1] + netCredit / 100);
      }
    }
  }

  return breakevens.filter((be) => be > 0);
}

function findProfitZone(
  legs: StrategyLeg[],
  netCredit: number
): { lower: number; upper: number } {
  const breakevens = findBreakevens(legs, netCredit);

  if (breakevens.length >= 2) {
    return {
      lower: Math.min(...breakevens),
      upper: Math.max(...breakevens),
    };
  } else if (breakevens.length === 1) {
    const strikes = legs.map((leg) => leg.strike);
    return netCredit > 0
      ? { lower: breakevens[0], upper: Math.max(...strikes) + 50 }
      : { lower: Math.min(...strikes) - 50, upper: breakevens[0] };
  }

  return { lower: 0, upper: 0 };
}

function calculatePortfolioGreeks(legs: StrategyLeg[]): {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
} {
  return legs.reduce(
    (portfolio, leg) => {
      const multiplier = leg.action === "SELL" ? -1 : 1;

      return {
        delta: portfolio.delta + leg.delta * multiplier * leg.quantity,
        gamma: portfolio.gamma + 0.01 * multiplier * leg.quantity, // Simplified
        theta: portfolio.theta + -0.05 * multiplier * leg.quantity, // Simplified
        vega: portfolio.vega + 0.1 * multiplier * leg.quantity, // Simplified
      };
    },
    { delta: 0, gamma: 0, theta: 0, vega: 0 }
  );
}

function generatePriceScenarios(
  legs: StrategyLeg[],
  currentPrice: number,
  netCredit: number,
  iv: number,
  dte: number
): PriceScenario[] {
  const scenarios: PriceScenario[] = [];
  const priceChanges = [-0.2, -0.1, 0, 0.1, 0.2]; // -20%, -10%, 0%, +10%, +20%

  for (const change of priceChanges) {
    const price = currentPrice * (1 + change);
    const profit = calculatePLAtPrice(legs, price, netCredit);
    const profitPercent =
      netCredit !== 0 ? (profit / Math.abs(netCredit)) * 100 : 0;

    // Simplified probability calculation using normal distribution
    const probability =
      Math.exp(-0.5 * Math.pow(change / (iv * Math.sqrt(dte / 365)), 2)) * 20;

    scenarios.push({
      price,
      profit,
      profitPercent,
      probability: Math.min(probability, 100),
    });
  }

  return scenarios;
}

export default StrategyPreview;
