import { TradingLog, TradingChartData } from "../types/trading"
export function transformTradingLogsForUser(logs: TradingLog[]): TradingChartData[] {
    return logs.map(log => ({
        time: typeof log.time === 'string' ? log.time : new Date(log.time).toISOString(),
        current_total_balance: log.current_total_balance || 0,
        current_total_profit: log.current_total_profit_for_user || 0,
        current_total_loss: log.current_total_loss_for_user || 0,
        current_total_wins: Number(log.current_total_wins_for_user || 0),
        current_total_losses: Number(log.current_total_losses_for_user || 0)
    }));
}

export function transformTradingLogsForBot(logs: TradingLog[]): TradingChartData[] {
    return logs.map(log => ({
        time: typeof log.time === 'string' ? log.time : new Date(log.time).toISOString(),
        current_total_balance: log.current_total_balance || 0,
        current_total_profit: log.current_total_profit || 0,
        current_total_loss: log.current_total_loss || 0,
        current_total_wins: Number(log.current_total_wins || 0),
        current_total_losses: Number(log.current_total_losses || 0)
    }));
}

export function transformTradingLogsForAccount(logs: TradingLog[]): TradingChartData[] {
    return logs.map(log => ({
        time: typeof log.time === 'string' ? log.time : new Date(log.time).toISOString(),
        current_total_balance: log.current_account_balance || 0,
        current_total_profit: log.current_total_profit_for_account || 0,
        current_total_loss: log.current_total_loss_for_account || 0,
        current_total_wins: Number(log.current_total_wins_for_account || 0),
        current_total_losses: Number(log.current_total_losses_for_account || 0)
    }));
}