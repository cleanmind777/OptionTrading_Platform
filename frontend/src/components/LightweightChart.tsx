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
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    elements.forEach((element) => {
      const series = lineSeriesRefs.current[element.id];
      if (series) {
        series.applyOptions({
          color: element.settings.color,
          visible: element.settings.view,
        });
      }
    });
    // Remove existing series for elements that are no longer in the list
    Object.keys(lineSeriesRefs.current).forEach((id) => {
      if (!elements.some((element) => element.id === id)) {
        chartRef.current?.removeSeries(lineSeriesRefs.current[id]);
        delete lineSeriesRefs.current[id];
      }
    });

    // Calculate the date range from the elements
    const dates = elements
      .map((element) => element.settings.date)
      .filter((date) => date); // Filter out empty dates
    const minDate =
      dates.length > 0
        ? new Date(Math.min(...dates.map((date) => new Date(date).getTime())))
        : null;
    const maxDate =
      dates.length > 0
        ? new Date(Math.max(...dates.map((date) => new Date(date).getTime())))
        : null;

    // Load historical data for each element
    const loadHistoricalData = async () => {
      if (minDate && maxDate) {
        try {
          // Fetch stock price data for the date range
          const stockPriceData = await fetchPolygonBars(
            elements[0].settings.symbol, // Use the symbol of the first element
            minDate.toISOString().split("T")[0],
            maxDate.toISOString().split("T")[0],
            1,
            "day"
          );

          // Create or update a line series for the stock price
          // let stockPriceSeries = lineSeriesRefs.current["stockPrice"];
          // if (!stockPriceSeries) {
          //   stockPriceSeries = chartRef.current!.addSeries(LineSeries, {
          //     color: "#4cc9f0", // Use a distinct color for the stock price line
          //     lineWidth: 2,
          //   });
          //   lineSeriesRefs.current["stockPrice"] = stockPriceSeries;
          // }

          // Format the data and set it to the series
          // const formattedData = stockPriceData.map((dataPoint) => ({
          //   time: dataPoint.time,
          //   value: dataPoint.close,
          // }));
          // stockPriceSeries.setData(formattedData);
        } catch (error) {
          console.error("Failed to load stock price data:", error);
        }
      }

      for (const element of elements) {
        if (element.settings.selectedTicker) {
          try {
            const historicalData = await fetchTickerHistoricalData(
              element.settings.selectedTicker
            );

            // Create or update a line series for this element
            let lineSeries = lineSeriesRefs.current[element.id];
            if (!lineSeries) {
              lineSeries = chartRef.current!.addSeries(LineSeries, {
                color: element.settings.color,
                lineWidth: 2,
              });
              lineSeriesRefs.current[element.id] = lineSeries;
            }

            // Format the data and set it to the series
            const formattedData = historicalData.map((dataPoint: any) => ({
              time: new Date(dataPoint.t).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
              value: dataPoint.c, // Use the close price
            }));
            lineSeries.setData(formattedData);

            // Toggle visibility based on the view setting
            lineSeries.applyOptions({
              visible: element.settings.view,
            });
          } catch (error) {
            console.error(
              `Failed to load historical data for ticker ${element.settings.selectedTicker}:`,
              error
            );
          }
        }
      }
    };

    loadHistoricalData();
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
