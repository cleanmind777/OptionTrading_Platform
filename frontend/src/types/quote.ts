export interface Reference {
  cusip: string;
  description: string;
  exchange: string;
  exchangeName: string;
}

export interface Quote {
  askMICId: string;
  askPrice: number;
  askSize: number;
  askTime: number;
  bidMICId: string;
  bidPrice: number;
  bidSize: number;
  bidTime: number;
  closePrice: number;
  highPrice: number;
  lastMICId: string;
  lastPrice: number;
  lastSize: number;
  lowPrice: number;
  mark: number;
  markChange: number;
  markPercentChange: number;
  netChange: number;
  netPercentChange: number;
  openPrice: number;
  quoteTime: number;
  securityStatus: string;
  totalVolume: number;
  tradeTime: number;
  volatility: number;
}

export interface Regular {
  regularMarketLastPrice: number;
  regularMarketLastSize: number;
  regularMarketNetChange: number;
  regularMarketPercentChange: number;
  regularMarketTradeTime: number;
}

export interface Fundamental {
  avg10DaysVolume: number;
  avg1YearVolume: number;
  divAmount: number;
  divFreq: number;
  divPayAmount: number;
  divYield: number;
  eps: number;
  fundLeverageFactor: number;
  peRatio: number;
}

export interface StockQuoteData {
  assetMainType: string; // e.g. "EQUITY"
  symbol: string; // e.g. "AAPL"
  quoteType: string; // e.g. "NBBO"
  realtime: boolean;
  ssid: number;
  reference: Reference;
  quote: Quote;
  regular: Regular;
  fundamental: Fundamental;
}
