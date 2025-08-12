import { BarData } from "lightweight-charts";
const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
export async function fetchPolygonBars(
  ticker: string,
  from: string,
  to: string,
  multiplier = 1,
  timespan = "day"
): Promise<BarData[]> {
  // Today's date
  const today = new Date();

  // Date 2 years ago
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  console.log("Today:", today);
  console.log("2 Years Ago:", twoYearsAgo);

  // If you want them as YYYY-MM-DD strings
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${formatDate(twoYearsAgo)}/${formatDate(today)}?adjusted=true&sort=asc&limit=50000&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.results) {
    return [];
  }

  // Map Polygon bars to Lightweight-Charts BarData
  const bars: BarData[] = json.results.map((bar: any) => ({
    time: Math.floor(bar.t / 1000), // Polygon timestamp in ms, convert to seconds for lightweight-charts
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
  }));

  return bars;
}
