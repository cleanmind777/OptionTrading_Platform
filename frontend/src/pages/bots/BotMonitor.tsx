import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LightweightChart from "../../components/LightweightChart";
import { Bot } from "../../types/bot";
import { Strategy } from "../../types/strategy";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function BotMonitor() {
  const { id } = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching strategy data:", error);
    }
  };

  useEffect(() => {
    getBot();
  }, [id]);

  useEffect(() => {
    if (bot) {
      getStrategy(bot.strategy_id);
    }
  }, [bot]);

  if (loading) {
    return <p style={{ color: "#ccc", textAlign: "center" }}>Loading...</p>;
  }

  if (!bot) {
    return (
      <p style={{ color: "#ff4d4f", textAlign: "center" }}>No data found.</p>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "20px",
        color: "#e0e0e0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Chart */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <LightweightChart />
      </div>

      {/* Bot & Strategy Info */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ color: "#4cc9f0", marginBottom: "10px" }}>Bot Details</h2>

        <p>
          <strong>ID:</strong> {id}
        </p>
        <p>
          <strong>Name:</strong> {bot.name}
        </p>

        <p>
          <strong>Status:</strong> {bot.is_active ? "Active" : "Stop"}
        </p>
        {strategy && (
          <p>
            <strong>Strategy:</strong>{" "}
            <span style={{ color: "#ffaa00" }}>{strategy.name}</span>
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <StatCard
            label="Total Profit"
            value={bot.total_profit}
            color="#4cafef"
          />
          <StatCard
            label="Win Rate"
            value={`${bot.win_rate}%`}
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
            value={bot.average_win}
            color="#a3e635"
          />
          <StatCard
            label="Average Loss"
            value={bot.average_loss}
            color="#f97316"
          />
        </div>
      </div>
    </div>
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
        backgroundColor: "#2a2a2a",
        padding: "12px",
        borderRadius: "6px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "14px", color: "#aaa" }}>{label}</div>
      <div style={{ fontSize: "18px", fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}

export default BotMonitor;
