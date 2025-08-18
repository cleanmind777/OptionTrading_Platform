import axios from "axios";
import { TradingLog } from "../types/trading"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getTradingLogs = (user_id: string) =>
    axios.get(`${BACKEND_URL}/live-trade/trading-logs`, {
        params: { user_id }
    });
