export interface ContractFilter {
  expiration_date: string;
  contract_type: string;
  underlying_ticker: string;
  expired: boolean;
}

export interface ContractOverview {
  cfi: string;
  contract_type: string;
  exercise_style: string;
  expiration_date: string;
  primary_exchange: string;
  shares_per_contract: number;
  strike_price: number;
  ticker: string;
  underlying_ticker: string;
}

export interface StockLine {
  symbol: string;
  color: string;
}

export interface ContractLine {
  ticker: string;
  color: string;
}

export interface AllLine {
  underlying_ticker: StockLine;
  tickers: ContractLine[];
}
