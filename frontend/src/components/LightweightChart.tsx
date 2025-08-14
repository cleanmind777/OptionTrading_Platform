import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeries,
} from "lightweight-charts";
import {
  fetchTickerHistoricalData,
  fetchPolygonBars,
} from "../utils/FetchPolygonBars";
import { LineDataElement } from "../components/LineDataSettings";

interface LightweightChartProps {
  elements: LineDataElement[];
}

const LightweightChart: React.FC<LightweightChartProps> = ({ elements }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRefs = useRef<Record<string, ISeriesApi<"Line">>>({});
  const dataCache = useRef<Record<string, any[]>>({}); // Cache historical data by selectedTicker

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize the chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: 500,
      layout: {
        background: { color: "#222831" },
        textColor: "#eeeeee",
      },
      grid: {
        vertLines: { color: "#393e46" },
        horzLines: { color: "#393e46" },
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

    // Cleanup function for the chart
    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
      lineSeriesRefs.current = {};
      dataCache.current = {};
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Remove series for elements no longer present
    Object.keys(lineSeriesRefs.current).forEach((id) => {
      if (!elements.some((element) => element.id === id)) {
        chartRef.current?.removeSeries(lineSeriesRefs.current[id]);
        delete lineSeriesRefs.current[id];
        delete dataCache.current[id];
      }
    });

    const loadHistoricalData = async (element: LineDataElement) => {
      if (!element.settings.selectedTicker) return;

      if (dataCache.current[element.id]) {
        const lineSeries = lineSeriesRefs.current[element.id];
        if (lineSeries) {
          lineSeries.setData(dataCache.current[element.id]);
        }
        return;
      }

      try {
        const historicalData = await fetchTickerHistoricalData(
          element.settings.selectedTicker
        );
        const formattedData = historicalData.map((dataPoint: any) => ({
          time: new Date(dataPoint.t).toISOString().split("T")[0],
          value: dataPoint.c,
        }));
        dataCache.current[element.id] = formattedData;
        const lineSeries = lineSeriesRefs.current[element.id];
        if (lineSeries) {
          lineSeries.setData(formattedData);
        }
      } catch (error) {
        console.error(
          `Failed to load historical data for ticker ${element.settings.selectedTicker}:`,
          error
        );
      }
    };

    elements.forEach((element) => {
      let lineSeries = lineSeriesRefs.current[element.id];
      if (!lineSeries) {
        lineSeries = chartRef.current!.addSeries(LineSeries, {
          color: element.settings.color,
          lineWidth: 2,
        });
        lineSeriesRefs.current[element.id] = lineSeries;

        // Load data for new series
        loadHistoricalData(element);
      } else {
        // Update color and visibility immediately
        lineSeries.applyOptions({
          color: element.settings.color,
          visible: element.settings.view,
        });

        // Load data only if view is enabled and data not cached
        if (element.settings.view && !dataCache.current[element.id]) {
          loadHistoricalData(element);
        }
      }
    });

    // Hide series for elements with view === false
    Object.entries(lineSeriesRefs.current).forEach(([id, series]) => {
      const element = elements.find((el) => el.id === id);
      if (element) {
        series.applyOptions({ visible: element.settings.view });
      } else {
        // If element no longer exists, remove series
        chartRef.current?.removeSeries(series);
        delete lineSeriesRefs.current[id];
        delete dataCache.current[id];
      }
    });
  }, [elements]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: 500 }} />;
};

export default LightweightChart;