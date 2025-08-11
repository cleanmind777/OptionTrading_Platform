import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface SseComponentProps {
  symbol: string;
}

const SseComponent: React.FC<SseComponentProps> = ({ symbol }) => {
  const [data, setData] = useState<{ price: number; volume: number } | null>(
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
        backgroundColor: "#161B22",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        display: "inline-block",
        minWidth: "200px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header with Live Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#4cc9f0", fontSize: "18px" }}>
          {symbol} Live Data
        </h3>
        <span
          style={{
            backgroundColor: "#2ea043",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "12px",
            animation: "pulse 1.5s infinite",
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* Data Display */}
      {data ? (
        <div style={{ marginTop: "10px" }}>
          <p style={{ margin: "5px 0", color: "#8B949E" }}>
            Price:{" "}
            <span style={{ color: "#4ade80", fontWeight: "bold" }}>
              ${data.price.toFixed(2)}
            </span>
          </p>
          <p style={{ margin: "5px 0", color: "#8B949E" }}>
            Volume:{" "}
            <span style={{ color: "#facc15", fontWeight: "bold" }}>
              {data.volume.toLocaleString()}
            </span>
          </p>
        </div>
      ) : (
        <p style={{ marginTop: "10px", color: "#aaa" }}>Waiting for data...</p>
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
