import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  BarData,
  CandlestickSeries,
} from "lightweight-charts";
import { fetchPolygonBars } from "../utils/FetchPolygonBars";

const LightweightChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const width = chartContainerRef.current.clientWidth || 600;

    chartRef.current = createChart(chartContainerRef.current, {
      width,
      height: 400,
      layout: {
        background: { color: "#222831" }, // Dark background color
        textColor: "#eeeeee", // Light text color
      },
      grid: {
        vertLines: { color: "#393e46" }, // Darker grid lines
        horzLines: { color: "#393e46" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#555555", // Dark border for time scale
      },
      crosshair: {
        vertLine: {
          color: "#888", // Crosshair vertical line color
          width: 1,
          style: 0,
          visible: true,
          labelBackgroundColor: "#222831",
        },
        horzLine: {
          color: "#888", // Crosshair horizontal line color
          width: 1,
          style: 0,
          visible: true,
          labelBackgroundColor: "#222831",
        },
      },
      rightPriceScale: {
        borderColor: "#555555", // Dark border for price scale
      },
      leftPriceScale: {
        borderColor: "#555555",
      },
    });

    // Add candlestick series with colors adjusted for dark theme
    candlestickSeriesRef.current = chartRef.current.addSeries(
      CandlestickSeries,
      {
        upColor: "#00ff00", // Bright green for bullish candles
        downColor: "#ff3b30", // Bright red for bearish candles
        borderVisible: false,
        wickUpColor: "#00ff00",
        wickDownColor: "#ff3b30",
      }
    );

    // Async function to load data with fallback
    const loadData = async () => {
      let data: BarData[] = [];
      try {
        data = await fetchPolygonBars(
          "AAPL",
          "2025-01-01",
          "2025-08-05",
          1,
          "day"
        );
      } catch (err) {
        console.error("Failed loading Polygon data, using fallback data:", err);
        data = [
          { time: "2023-08-01", open: 100, high: 105, low: 95, close: 102 },
          { time: "2023-08-02", open: 102, high: 108, low: 101, close: 107 },
          { time: "2023-08-03", open: 107, high: 110, low: 104, close: 106 },
          { time: "2023-08-04", open: 106, high: 107, low: 100, close: 101 },
          { time: "2023-08-05", open: 101, high: 103, low: 97, close: 99 },
        ];
      }
      candlestickSeriesRef.current?.setData(data);
    };

    loadData();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    };
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: 400 }} />;
};

export default LightweightChart;
