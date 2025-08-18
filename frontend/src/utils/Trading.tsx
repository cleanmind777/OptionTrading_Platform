import { TradingLog, TradingChartData } from "../types/trading"
export function transformTradingLogs(logs: TradingLog[]): TradingChartData[] {
    return logs.map(log => ({
        time: typeof log.time === 'string' ? log.time : new Date(log.time).toISOString(),
        current_total_balance: log.current_total_balance || 0,
        current_total_profit: log.current_total_profit || 0,
        current_total_loss: log.current_total_loss || 0,
        current_total_wins: Number(log.current_total_wins_for_user || log.current_total_wins || 0),
        current_total_losses: Number(log.current_total_losses_for_user || log.current_total_losses || 0)
    }));
}