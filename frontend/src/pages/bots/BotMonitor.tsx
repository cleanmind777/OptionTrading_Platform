import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LightweightChart from "../../components/LightweightChart";
import TradingViewWidget from "../../components/TradingViewWidget";
import SseComponent from "../../components/SseComponent";
import BotTradingChart from "../../components/BotTradingChart"
import LineDataSettings, {
  LineDataElement,
} from "../../components/LineDataSettings";
import { Bot } from "../../types/bot";
import { StockQuoteData } from "../../types/quote";
import { Strategy } from "../../types/strategy";
import { ContractLine, StockLine, AllLine } from "../../types/contract";
import { roundTo } from "../../utils/NumberProcess"
import { transformTradingLogs } from "../../utils/Trading"
import { TradingLog, TradingChartData } from "../../types/trading"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function BotMonitor() {
  const { id } = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockLineData, setStockLineData] = useState<StockLine | null>(null);
  const [contractLineData, setContractLineData] = useState<ContractLine | null>(
    null
  );
  const [tradingLogs, setTradingLogs] = useState<TradingLog[]>([]);
  // Line Data Elements state
  const [lineDataElements, setLineDataElements] = useState<LineDataElement[]>(
    []
  );
  const userInfo = JSON.parse(localStorage.getItem("userinfo")!);

  // ... existing functions remain unchanged ...
  const getBot = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/bot/get_bot`, {
        params: { id },
      });
      setBot(data);
    } catch (error) {
      console.error("Error fetching bot data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStrategy = async (strategy_id: string) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/strategy/get_strategy`, {
        params: { strategy_id },
      });
      setStrategy(data);
      localStorage.setItem("strategy", JSON.stringify(data));

      // Update symbol in line data elements
      setLineDataElements((prev) =>
        prev.map((element) => ({
          ...element,
          settings: {
            ...element.settings,
            symbol: data.symbol,
          },
        }))
      );
    } catch (error) {
      console.error("Error fetching strategy:", error);
    }
  };

  const getTradingLogs = () => {
    const params = {
      user_id: userInfo.id,
      bot_id: id
    };
    axios.get(`${BACKEND_URL}/live-trade/trading-logs/bot`, { params })
      .then((response) => {
        setTradingLogs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Transform trading logs to match the expected TradingData interface
  // const transformTradingLogs = (logs: TradingLog[]): TradingChartData[] => {
  //   return logs.map(log => ({
  //     time: typeof log.time === 'string' ? log.time : new Date(log.time).toISOString(),
  //     current_total_balance: log.current_total_balance || 0,
  //     current_total_profit: log.current_total_profit || 0,
  //     current_total_loss: log.current_total_loss || 0,
  //     current_total_wins: Number(log.current_total_wins_for_user || log.current_total_wins || 0),
  //     current_total_losses: Number(log.current_total_losses_for_user || log.current_total_losses || 0)
  //   }));
  // };

  useEffect(() => {
    getBot();
    getTradingLogs();
  }, [id]);

  useEffect(() => {
    if (bot) {
      getStrategy(bot.strategy_id);
    }
  }, [bot]);

  useEffect(() => {
    setStockLineData({
      symbol: strategy?.symbol ?? "",
      color: "#00000000",
    });
  }, [strategy]);

  useEffect(() => {
    // Effect for lineDataElements changes
  }, [lineDataElements]);

  // Handle line data elements update
  const handleLineDataUpdate = (elements: LineDataElement[]) => {
    setLineDataElements(elements); // This triggers the update
  };

  // Check if any line data element has chart view enabled
  const shouldShowChart = () => {
    return lineDataElements.some((element) => element.settings.view);
  };

  if (loading) {
    return (
      <p style={{ color: "#ccc", textAlign: "center", marginTop: "40px" }}>
        Loading...
      </p>
    );
  }

  if (!bot) {
    return (
      <p style={{ color: "#ff4d4f", textAlign: "center", marginTop: "40px" }}>
        No data found.
      </p>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0D1117",
        minHeight: "100vh",
        padding: "20px",
        color: "#E6EDF3",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Using the transformed trading logs data for the chart */}
      {tradingLogs.length > 0 ? (
        <div style={{ width: '100%', height: '400px' }}>  {/* Full width, fixed height */}
          <BotTradingChart data={transformTradingLogs(tradingLogs)}></BotTradingChart>
        </div>
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>No trading data available for this bot.</p>
          </div>
        </Card>
      )}

      {/* Bot Info & Live Price */}
      <Card>
        <h2 style={{ color: "#4cc9f0", marginBottom: "10px" }}>
          📊 Bot Details
        </h2>
        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
            alignItems: "flex-start",
          }}
        >
          <InfoRow label="ID" value={id} />
          <InfoRow label="Name" value={bot.name} />

          {strategy && (
            <>
              <InfoRow label="Symbol" value={strategy.symbol} />
              <InfoRow
                label="Strategy"
                value={strategy.name}
                highlight="#ffaa00"
              />
            </>
          )}
          <InfoRow
            label="Status"
            value={bot.is_active ? "🟢 Active" : "🔴 Stopped"}
            highlight={bot.is_active ? "#4ade80" : "#ef4444"}
          />
        </div>
      </Card>

      {strategy && <SseComponent symbol={strategy?.symbol}></SseComponent>}

      {/* Stats Section */}
      <Card>
        <h3 style={{ color: "#58a6ff", marginBottom: "12px" }}>
          📈 Performance Stats
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "15px",
          }}
        >
          <StatCard
            label="Total Profit"
            value={`$${roundTo(bot.total_profit + bot.total_loss, 2)}`}
            color="#4cafef"
          />
          <StatCard
            label="Win Rate"
            value={`${roundTo(bot.win_rate * 100, 2)}%`}
            color="#4ade80"
          />
          <StatCard
            label="Win Trades"
            value={bot.win_trades_count}
            color="#22d3ee"
          />
          <StatCard
            label="Loss Trades"
            value={bot.loss_trades_count}
            color="#ef4444"
          />
          <StatCard
            label="Average Win"
            value={bot.win_trades_count > 0 ?
              roundTo(bot.total_profit / bot.win_trades_count, 2) :
              0}
            color="#22d3ee"
          />
          <StatCard
            label="Average Loss"
            value={bot.loss_trades_count > 0 ?
              roundTo(bot.total_loss / bot.loss_trades_count, 2) :
              0}
            color="#ef4444"
          />
        </div>
      </Card>
    </div>
  );
}

/* --- Reusable Components (unchanged) --- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#161B22",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        marginBottom: "20px",
        transition: "transform 0.2s ease-in-out, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 6px 20px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 15px rgba(0,0,0,0.5)";
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <hr
      style={{ border: 0, borderTop: "1px solid #30363D", margin: "10px 0" }}
    />
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: any;
  highlight?: string;
}) {
  return (
    <p style={{ margin: 0, fontSize: "14px" }}>
      <strong>{label}:</strong>{" "}
      <span
        style={{
          color: highlight || "#E6EDF3",
          fontWeight: highlight ? "bold" : "normal",
        }}
      >
        {value}
      </span>
    </p>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#21262D",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transition: "transform 0.2s ease-in-out, background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "#2b3137";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "#21262D";
      }}
    >
      <div style={{ fontSize: "13px", color: "#8B949E", marginBottom: "5px" }}>
        {label}
      </div>
      <div style={{ fontSize: "18px", fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}

export default BotMonitor;