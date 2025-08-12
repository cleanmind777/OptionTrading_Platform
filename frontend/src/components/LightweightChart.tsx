import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  BarData,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import { fetchPolygonBars } from "../utils/FetchPolygonBars";

// Helper: Calculate EMA
function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  let emaArray: number[] = [];
  emaArray[0] = data[0]; // Initialize with the first value
  for (let i = 1; i < data.length; i++) {
    emaArray[i] = data[i] * k + emaArray[i - 1] * (1 - k);
  }
  return emaArray;
}

// Helper: Calculate MACD line, signal line and histogram
function calculateMACD(
  closePrices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  const slowEMA = calculateEMA(closePrices, slowPeriod);
  const fastEMA = calculateEMA(closePrices, fastPeriod);

  // MACD line is difference between fast and slow EMA
  const macdLine = fastEMA.map((val, idx) => val - slowEMA[idx]);

  // Signal line is EMA of MACD line starting from slowPeriod-1 index
  const signalLine = calculateEMA(macdLine.slice(slowPeriod - 1), signalPeriod);

  // Histogram is MACD line - signal line, aligned to same indexes
  const histogram = macdLine
    .slice(slowPeriod - 1)
    .map((val, idx) => val - (signalLine[idx] || 0));

  return {
    macdLine: macdLine.slice(slowPeriod - 1),
    signalLine,
    histogram,
  };
}

const LightweightChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const macdLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const signalLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const histogramSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const width = chartContainerRef.current.clientWidth || 600;

    chartRef.current = createChart(chartContainerRef.current, {
      width,
      height: 500, // Increased height to fit MACD pane
      layout: {
        background: { color: "#222831" },
        textColor: "#eeeeee",
      },
      grid: {
        vertLines: { color: "#393e46" },
        horzLines: { color: "#393e46" },
      },
      crosshair: {
        vertLine: {
          color: "#888",
          width: 1,
          style: 0,
          visible: true,
          labelBackgroundColor: "#eeeeee",
        },
        horzLine: {
          color: "#888",
          width: 1,
          style: 0,
          visible: true,
          labelBackgroundColor: "#eeeeee",
        },
      },
      rightPriceScale: {
        borderColor: "#555555",
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#555555",
      },
    });

    // Add candlestick series
    candlestickSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#00ff00",
      downColor: "#ff3b30",
      borderVisible: false,
      wickUpColor: "#00ff00",
      wickDownColor: "#ff3b30",
    });

    // Add MACD series on a separate price scale "macd"
    macdLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: "cyan",
      lineWidth: 2,
      priceScaleId: "macd",
    });

    signalLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: "orange",
      lineWidth: 2,
      priceScaleId: "macd",
    });

    histogramSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
      color: "green",
      priceFormat: { type: "volume" },
      priceScaleId: "macd",
    });

    // Configure the new price scale for MACD pane
    chartRef.current.priceScale("macd").applyOptions({
      scaleMargins: { top: 0.7, bottom: 0.3 },
      borderVisible: true,
      borderColor: "#555555",
    });

    const loadData = async () => {
      let data: BarData[] = [];
      try {
        data = await fetchPolygonBars("AAPL", "2025-01-01", "2025-08-05", 1, "day");
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

      // Extract close prices and corresponding time strings
      const closePrices = data.map((d) => d.close);
      const times = data.map((d) => d.time as string);

      // Calculate MACD values
      const { macdLine, signalLine, histogram } = calculateMACD(closePrices);

      // Align timestamps with MACD arrays starting from slowPeriod-1
      const alignedTimes = times.slice(26 - 1); // 25

      const macdData = macdLine.map((value, idx) => ({
        time: alignedTimes[idx],
        value,
      }));
      const signalData = signalLine.map((value, idx) => ({
        time: alignedTimes[idx],
        value,
      }));
      const histogramData = histogram.map((value, idx) => ({
        time: alignedTimes[idx],
        value,
        color: value >= 0 ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)",
      }));

      macdLineSeriesRef.current?.setData(macdData);
      signalLineSeriesRef.current?.setData(signalData);
      histogramSeriesRef.current?.setData(histogramData);
    };

    loadData();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
      macdLineSeriesRef.current = null;
      signalLineSeriesRef.current = null;
      histogramSeriesRef.current = null;
    };
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: 500 }} />;
};

export default LightweightChart;
