import { BarData } from "lightweight-charts";
import { ContractFilter, ContractOverview } from "../types/contract";
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

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=50000&apiKey=${API_KEY}`;

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

export async function fetchOptionContracts(filter: ContractFilter) {
  const url = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${filter.underlying_ticker}&contract_type=${filter.contract_type}&limit=1000&sort=strike_price&expiration_date=${filter.expiration_date}&apiKey=${API_KEY}&expired=${filter.expired}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.results) {
    return [];
  }
  console.log(json);
  return json.results;
}

export async function fetchTickerHistoricalData(ticker: string) {
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2011-01-01/${formatDate(today)}?adjusted=true&sort=asc&limit=5000&apiKey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.results) {
    return [];
  }
  console.log(json);
  return json.results;
}
