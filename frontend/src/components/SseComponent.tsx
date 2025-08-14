import React, { useEffect, useState } from "react";
import { StockQuoteData } from "../types/quote";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface SseComponentProps {
  symbol: string;
}
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
const SseComponent: React.FC<SseComponentProps> = ({ symbol }) => {
  const [data, setData] = useState<{
    price: number;
    quote: StockQuoteData;
  } | null>(null);

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
  }, []);

  return (
    <Card>
      <h3 style={{ color: "#58a6ff", marginBottom: "12px" }}>💸 Option Data</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "15px",
        }}
      >
        <StatCard
          label="Current Price"
          value={`$${data?.price}`}
          color="#4cafef"
        />
        <StatCard
          label="Bid Price"
          value={`$${data?.quote.quote.bidPrice.toLocaleString()}`}
          color="#4ade80"
        />
        <StatCard
          label="Ask Price"
          value={`$${data?.quote.quote.askPrice.toLocaleString()}`}
          color="#ef4444"
        />
        <StatCard
          label="Total Volume"
          value={`${data?.quote.quote.totalVolume.toLocaleString()}`}
          color="#a3e635"
        />
      </div>
    </Card>
  );
};

export default SseComponent;
