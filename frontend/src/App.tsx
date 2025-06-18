import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TradingDashboard } from "./pages/trades/TradingDashboard";
import { AccountStats } from "./pages/account/AccountStats";
import { AccountSettings } from "./pages/account/AccountSettings";
import { BrokerLink } from "./pages/account/BrokerLink";
import { BrokerAuth } from "./pages/account/BrokerAuth";
import { BotManagement } from "./pages/bots/BotManagement";
import { BotCreateWizard } from "./pages/bots/BotCreateWizard";
import { CreateTrancheBots } from "./pages/bots/CreateTrancheBots";
import { BotPerformance } from "./pages/bots/BotPerformance";
import { BotSharedBots } from "./pages/bots/BotSharedBots";
import { BotActivity } from "./pages/bots/BotActivity";
import { BotDayPlanner } from "./pages/bots/BotDayPlanner";
import { TradeLog } from "./pages/trades/TradeLog";
import { OpenPositions } from "./pages/trades/OpenPositions";
import { EditSingleBot } from "./pages/bots/EditSingleBot";
import { EditMultipleBots } from "./pages/bots/EditMultipleBots";
import { ImportBots } from "./pages/bots/ImportBots";
import { BotSettingsHistory } from "./pages/bots/BotSettingsHistory";
import { BidlessLongCreditRecovery } from "./pages/bots/BidlessLongCreditRecovery";
import { WebhookActivity } from "./pages/bots/WebhookActivity";
import { BotFilterValues } from "./pages/bots/BotFilterValues";
import { BalanceProfitsOverTime } from "./pages/performance/BallanceProfitsOverTime";
import { BalanceHistoryTable } from "./pages/performance/BallanceHistoryTable";
import { ViewHistoricalDashboards } from "./pages/performance/ViewHistoricalDashboards";
import { MonthlyCalendarReport } from "./pages/performance/MonthlyCalendarReport";
import { PerformanceVolatility } from "./pages/performance/PerformanceVolatility";
import { StrategyPerformance } from "./pages/performance/StrategyPerformance";
import { BotAnalytics } from "./pages/bots/BotAnalytics";
import { ComprehensiveBotAnalytics } from "./pages/bots/ComprehensiveBotAnalytics";
import { AdvancedBacktesting } from "./pages/bots/AdvancedBacktesting";
import { ViewStrategies } from "./pages/strategies/ViewStrategies";
import { VideoVault } from "./pages/support/VideoVault";
import { DiscordCommunity } from "./pages/support/DiscordCommunity";
import { AccountVsMarketPerformance } from "./pages/performance/AccountVsMarketPerformance";
import { EmailPrefs } from "./pages/account/EmailPrefs";
import { MainNavigation } from "./components/MainNavigation";
import { Navigation } from "./components/Navigation";
// import { NotificationProvider } from "./contexts/NotificationContext";
// import { ToastNotifications } from "./components/ToastNotifications";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  useEffect(() => {
    sessionStorage.getItem('access_token') ? setIsLoggedIn(true) : setIsLoggedIn(false);
  });
  return (
    // <NotificationProvider>
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <MainNavigation
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        {/* <ToastNotifications /> */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleLogin} />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/account-stats" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <TradingDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/account-stats"
              element={
                isLoggedIn ? <AccountStats /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/useracct"
              element={
                isLoggedIn ? (
                  <AccountSettings />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/useracct/brokerlink"
              element={
                isLoggedIn ? <BrokerLink /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/broker-auth"
              element={
                isLoggedIn ? <BrokerAuth /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/bots/manage"
              element={
                isLoggedIn ? (
                  <BotManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/create"
              element={
                isLoggedIn ? (
                  <BotCreateWizard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/create-tranche"
              element={
                isLoggedIn ? (
                  <CreateTrancheBots />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/edit-single"
              element={
                isLoggedIn ? (
                  <EditSingleBot />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/edit-multiple"
              element={
                isLoggedIn ? (
                  <EditMultipleBots />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/import"
              element={
                isLoggedIn ? <ImportBots /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/bots/day-planner"
              element={
                isLoggedIn ? (
                  <BotDayPlanner />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/settings-history"
              element={
                isLoggedIn ? (
                  <BotSettingsHistory />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/bots/analytics"
              element={
                isLoggedIn ? <BotAnalytics /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/bots/comprehensive-analytics"
              element={
                isLoggedIn ? (
                  <ComprehensiveBotAnalytics />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/backtesting"
              element={
                isLoggedIn ? (
                  <AdvancedBacktesting />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/bots/shared" element={<BotSharedBots />} />
            <Route path="/bots/activity" element={<BotActivity />} />
            <Route path="/bots/performance" element={<BotPerformance />} />
            <Route
              path="/bots/:botId/performance"
              element={<BotPerformance />}
            />
            <Route path="/bots/:botId/edit" element={<BotCreateWizard />} />
            <Route path="/trades/history" element={<TradeLog />} />
            <Route path="/trades/positions" element={<OpenPositions />} />
            <Route
              path="/trades/bidless-long-credit-recovery"
              element={<BidlessLongCreditRecovery />}
            />
            <Route
              path="/bots/webhook-activity"
              element={<WebhookActivity />}
            />
            <Route path="/bots/filter-values" element={<BotFilterValues />} />
            <Route
              path="/performance/balance-profits-time"
              element={<BalanceProfitsOverTime />}
            />
            <Route
              path="/performance/balance-history"
              element={<BalanceHistoryTable />}
            />
            <Route
              path="/performance/historical-dashboards"
              element={<ViewHistoricalDashboards />}
            />
            <Route
              path="/performance/monthly-calendar"
              element={<MonthlyCalendarReport />}
            />
            <Route
              path="/performance/volatility"
              element={<PerformanceVolatility />}
            />
            <Route path="/strategies/view" element={<ViewStrategies />} />
            <Route
              path="/strategies/performance"
              element={<StrategyPerformance />}
            />
            <Route
              path="/strategies/backtest"
              element={<AdvancedBacktesting />}
            />
            <Route path="/support/video-vault" element={<VideoVault />} />
            <Route path="/support/discord" element={<DiscordCommunity />} />
            <Route
              path="/performance/account-vs-market"
              element={<AccountVsMarketPerformance />}
            />
            <Route path="/email-preferences" element={<EmailPrefs />} />
          </Routes>
        </main>
      </div>
    </Router>
    // {/* </NotificationProvider> */}
  );
}

export default App;
