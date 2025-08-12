import React, { useEffect, useState } from "react";
import { StockQuoteData } from "../types/quote"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface SseComponentProps {
  symbol: string;
}

const SseComponent: React.FC<SseComponentProps> = ({ symbol }) => {
  const [data, setData] = useState<{ price: number; quote: StockQuoteData } | null>(
    null
  );

  useEffect(() => {
    const eventSource = new EventSource(
      `${BACKEND_URL}/live-trade/current-price/${symbol}`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [symbol]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        padding: "12px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#8B949E",
        minWidth: "350px",
      }}
    >
      {/* Symbol and Live Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "110px" }}>
        <h3 style={{ margin: 0, color: "#22c55e", fontWeight: "700", fontSize: "18px" }}>
          {symbol} Live Data
        </h3>
        <span
          style={{
            backgroundColor: "#2ea043",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "14px",
            fontWeight: "600",
            animation: "pulse 1.5s infinite",
            userSelect: "none",
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* Data fields in one row */}
      {data ? (
        <>
          <p style={{ margin: 0 }}>
            Price:{" "}
            <span style={{ color: "#4ade80", fontWeight: "700" }}>
              ${data.price.toFixed(2)}
            </span>
          </p>
          <p style={{ margin: 0 }}>
            Ask:{" "}
            <span style={{ color: "#facc15", fontWeight: "700" }}>
              {data.quote.quote.askPrice.toLocaleString()}
            </span>
          </p>
          <p style={{ margin: 0 }}>
            Bid:{" "}
            <span style={{ color: "#facc15", fontWeight: "700" }}>
              {data.quote.quote.bidPrice.toLocaleString()}
            </span>
          </p>
          <p style={{ margin: 0 }}>
            Volume:{" "}
            <span style={{ color: "#facc15", fontWeight: "700" }}>
              {data.quote.quote.totalVolume.toLocaleString()}
            </span>
          </p>
        </>
      ) : (
        <p style={{ margin: 0, color: "#555" }}>Waiting for data...</p>
      )}

      {/* Pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { background-color: #2ea043; }
            50% { background-color: #238636; }
            100% { background-color: #2ea043; }
          }
        `}
      </style>
    </div>
  );
};

export default SseComponent;
