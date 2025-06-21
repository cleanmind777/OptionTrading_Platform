import { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAtom } from "jotai";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { authService } from "./services/auth";
import {
  userAtom,
  isAuthenticatedAtom,
  globalLoadingAtom,
  globalErrorAtom,
  updateUserActivity,
  clearAuthData,
  setLoading,
  setError,
  addNotification,
} from "./store";

// Import pages using named imports
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

import "./App.css";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <Navigate to="/login" replace />
}) => {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Loading Component
const LoadingComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [globalLoading, setGlobalLoading] = useAtom(globalLoadingAtom);
  const [globalError, setGlobalError] = useAtom(globalErrorAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(setGlobalLoading, 'global', true);

        // Initialize authentication
        const userData = await authService.initializeAuth();

        if (userData) {
          setUser(userData);
          addNotification(setGlobalError, 'success', 'Welcome back!');
        }

        // Set up session monitoring
        authService.setupSessionMonitoring();

        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setError(setGlobalError, 'global', 'Failed to initialize application');
        setIsInitialized(true);
      } finally {
        setLoading(setGlobalLoading, 'global', false);
      }
    };

    initializeApp();
  }, [setUser, setGlobalLoading, setGlobalError]);

  // Handle user activity
  useEffect(() => {
    const handleUserActivity = () => {
      updateUserActivity(setUser);
    };

    // Listen for user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [setUser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(setGlobalLoading, 'global', true);
      await authService.logout();
      clearAuthData(setUser);
      addNotification(setGlobalError, 'success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      setError(setGlobalError, 'global', 'Logout failed');
    } finally {
      setLoading(setGlobalLoading, 'global', false);
    }
  };

  // Handle login
  const handleLogin = (userData: any) => {
    setUser(userData);
    authService.storeUserData(userData);
    addNotification(setGlobalError, 'success', 'Login successful!');
  };

  // Handle login button click (for navigation)
  const handleLoginClick = () => {
    // This will be handled by the LoginPage component
  };

  // Show loading while initializing
  if (!isInitialized || globalLoading) {
    return <LoadingComponent />;
  }

  // Show error if initialization failed
  if (globalError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Application Error
          </h1>
          <p className="text-slate-400 mb-4">{globalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <MainNavigation onLogin={handleLoginClick} />

          <main className="pt-16">
            <Suspense fallback={<LoadingComponent />}>
              <Routes>
                <Route path="/" element={<HomePage onLogin={handleLoginClick} />} />

                {/* Public routes */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <TradingDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/account/stats" element={
                  <ProtectedRoute>
                    <AccountStats />
                  </ProtectedRoute>
                } />

                <Route path="/account/settings" element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } />

                <Route path="/account/broker-link" element={
                  <ProtectedRoute>
                    <BrokerLink />
                  </ProtectedRoute>
                } />

                <Route path="/account/broker-auth" element={
                  <ProtectedRoute>
                    <BrokerAuth />
                  </ProtectedRoute>
                } />

                <Route path="/account/email-preferences" element={
                  <ProtectedRoute>
                    <EmailPrefs />
                  </ProtectedRoute>
                } />

                <Route path="/bots/management" element={
                  <ProtectedRoute>
                    <BotManagement />
                  </ProtectedRoute>
                } />

                <Route path="/bots/create" element={
                  <ProtectedRoute>
                    <BotCreateWizard />
                  </ProtectedRoute>
                } />

                <Route path="/bots/create-tranche" element={
                  <ProtectedRoute>
                    <CreateTrancheBots />
                  </ProtectedRoute>
                } />

                <Route path="/bots/performance" element={
                  <ProtectedRoute>
                    <BotPerformance />
                  </ProtectedRoute>
                } />

                <Route path="/bots/shared" element={
                  <ProtectedRoute>
                    <BotSharedBots />
                  </ProtectedRoute>
                } />

                <Route path="/bots/activity" element={
                  <ProtectedRoute>
                    <BotActivity />
                  </ProtectedRoute>
                } />

                <Route path="/bots/day-planner" element={
                  <ProtectedRoute>
                    <BotDayPlanner />
                  </ProtectedRoute>
                } />

                <Route path="/trades/log" element={
                  <ProtectedRoute>
                    <TradeLog />
                  </ProtectedRoute>
                } />

                <Route path="/trades/positions" element={
                  <ProtectedRoute>
                    <OpenPositions />
                  </ProtectedRoute>
                } />

                <Route path="/bots/edit-single" element={
                  <ProtectedRoute>
                    <EditSingleBot />
                  </ProtectedRoute>
                } />

                <Route path="/bots/edit-multiple" element={
                  <ProtectedRoute>
                    <EditMultipleBots />
                  </ProtectedRoute>
                } />

                <Route path="/bots/import" element={
                  <ProtectedRoute>
                    <ImportBots />
                  </ProtectedRoute>
                } />

                <Route path="/bots/settings-history" element={
                  <ProtectedRoute>
                    <BotSettingsHistory />
                  </ProtectedRoute>
                } />

                <Route path="/bots/bidless-long-credit-recovery" element={
                  <ProtectedRoute>
                    <BidlessLongCreditRecovery />
                  </ProtectedRoute>
                } />

                <Route path="/bots/webhook-activity" element={
                  <ProtectedRoute>
                    <WebhookActivity />
                  </ProtectedRoute>
                } />

                <Route path="/bots/filter-values" element={
                  <ProtectedRoute>
                    <BotFilterValues />
                  </ProtectedRoute>
                } />

                <Route path="/performance/balance-profits" element={
                  <ProtectedRoute>
                    <BalanceProfitsOverTime />
                  </ProtectedRoute>
                } />

                <Route path="/performance/balance-history" element={
                  <ProtectedRoute>
                    <BalanceHistoryTable />
                  </ProtectedRoute>
                } />

                <Route path="/performance/historical-dashboards" element={
                  <ProtectedRoute>
                    <ViewHistoricalDashboards />
                  </ProtectedRoute>
                } />

                <Route path="/performance/monthly-calendar" element={
                  <ProtectedRoute>
                    <MonthlyCalendarReport />
                  </ProtectedRoute>
                } />

                <Route path="/performance/volatility" element={
                  <ProtectedRoute>
                    <PerformanceVolatility />
                  </ProtectedRoute>
                } />

                <Route path="/performance/strategy" element={
                  <ProtectedRoute>
                    <StrategyPerformance />
                  </ProtectedRoute>
                } />

                <Route path="/bots/analytics" element={
                  <ProtectedRoute>
                    <BotAnalytics />
                  </ProtectedRoute>
                } />

                <Route path="/bots/comprehensive-analytics" element={
                  <ProtectedRoute>
                    <ComprehensiveBotAnalytics />
                  </ProtectedRoute>
                } />

                <Route path="/bots/advanced-backtesting" element={
                  <ProtectedRoute>
                    <AdvancedBacktesting />
                  </ProtectedRoute>
                } />

                <Route path="/strategies" element={
                  <ProtectedRoute>
                    <ViewStrategies />
                  </ProtectedRoute>
                } />

                <Route path="/support/video-vault" element={
                  <ProtectedRoute>
                    <VideoVault />
                  </ProtectedRoute>
                } />

                <Route path="/support/discord" element={
                  <ProtectedRoute>
                    <DiscordCommunity />
                  </ProtectedRoute>
                } />

                <Route path="/performance/account-vs-market" element={
                  <ProtectedRoute>
                    <AccountVsMarketPerformance />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
