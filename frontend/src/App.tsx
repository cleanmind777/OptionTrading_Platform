import { useState, useEffect, Suspense } from "react";
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

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const TradingDashboard = lazy(() => import("./pages/trades/TradingDashboard"));
const AccountStats = lazy(() => import("./pages/account/AccountStats"));
const AccountSettings = lazy(() => import("./pages/account/AccountSettings"));
const BrokerLink = lazy(() => import("./pages/account/BrokerLink"));
const BrokerAuth = lazy(() => import("./pages/account/BrokerAuth"));
const BotManagement = lazy(() => import("./pages/bots/BotManagement"));
const BotCreateWizard = lazy(() => import("./pages/bots/BotCreateWizard"));
const CreateTrancheBots = lazy(() => import("./pages/bots/CreateTrancheBots"));
const BotPerformance = lazy(() => import("./pages/bots/BotPerformance"));
const BotSharedBots = lazy(() => import("./pages/bots/BotSharedBots"));
const BotActivity = lazy(() => import("./pages/bots/BotActivity"));
const BotDayPlanner = lazy(() => import("./pages/bots/BotDayPlanner"));
const TradeLog = lazy(() => import("./pages/trades/TradeLog"));
const OpenPositions = lazy(() => import("./pages/trades/OpenPositions"));
const EditSingleBot = lazy(() => import("./pages/bots/EditSingleBot"));
const EditMultipleBots = lazy(() => import("./pages/bots/EditMultipleBots"));
const ImportBots = lazy(() => import("./pages/bots/ImportBots"));
const BotSettingsHistory = lazy(() => import("./pages/bots/BotSettingsHistory"));
const BidlessLongCreditRecovery = lazy(() => import("./pages/bots/BidlessLongCreditRecovery"));
const WebhookActivity = lazy(() => import("./pages/bots/WebhookActivity"));
const BotFilterValues = lazy(() => import("./pages/bots/BotFilterValues"));
const BalanceProfitsOverTime = lazy(() => import("./pages/performance/BallanceProfitsOverTime"));
const BalanceHistoryTable = lazy(() => import("./pages/performance/BallanceHistoryTable"));
const ViewHistoricalDashboards = lazy(() => import("./pages/performance/ViewHistoricalDashboards"));
const MonthlyCalendarReport = lazy(() => import("./pages/performance/MonthlyCalendarReport"));
const PerformanceVolatility = lazy(() => import("./pages/performance/PerformanceVolatility"));
const StrategyPerformance = lazy(() => import("./pages/performance/StrategyPerformance"));
const BotAnalytics = lazy(() => import("./pages/bots/BotAnalytics"));
const ComprehensiveBotAnalytics = lazy(() => import("./pages/bots/ComprehensiveBotAnalytics"));
const AdvancedBacktesting = lazy(() => import("./pages/bots/AdvancedBacktesting"));
const ViewStrategies = lazy(() => import("./pages/strategies/ViewStrategies"));
const VideoVault = lazy(() => import("./pages/support/VideoVault"));
const DiscordCommunity = lazy(() => import("./pages/support/DiscordCommunity"));
const AccountVsMarketPerformance = lazy(() => import("./pages/performance/AccountVsMarketPerformance"));
const EmailPrefs = lazy(() => import("./pages/account/EmailPrefs"));
const MainNavigation = lazy(() => import("./components/MainNavigation"));

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
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
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
          setIsAuthenticated(true);
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
  }, [setUser, setIsAuthenticated, setGlobalLoading, setGlobalError]);

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
      setIsAuthenticated(false);
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
    setIsAuthenticated(true);
    authService.storeUserData(userData);
    addNotification(setGlobalError, 'success', 'Login successful!');
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
        <div className="min-h-screen bg-slate-900 text-white">
          <Suspense fallback={<LoadingComponent />}>
            <MainNavigation
              isLoggedIn={isAuthenticated}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </Suspense>

          <main className="pt-16">
            <Suspense fallback={<LoadingComponent />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage onLogin={handleLogin} />} />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/account-stats" replace />
                    ) : (
                      <LoginPage onLogin={handleLogin} />
                    )
                  }
                />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <TradingDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account-stats"
                  element={
                    <ProtectedRoute>
                      <AccountStats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/useracct"
                  element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/useracct/brokerlink"
                  element={
                    <ProtectedRoute>
                      <BrokerLink />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/broker-auth"
                  element={
                    <ProtectedRoute>
                      <BrokerAuth />
                    </ProtectedRoute>
                  }
                />

                {/* Bot Management Routes */}
                <Route
                  path="/bots/manage"
                  element={
                    <ProtectedRoute>
                      <BotManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/create"
                  element={
                    <ProtectedRoute>
                      <BotCreateWizard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/create-tranche"
                  element={
                    <ProtectedRoute>
                      <CreateTrancheBots />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/edit-single"
                  element={
                    <ProtectedRoute>
                      <EditSingleBot />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/edit-multiple"
                  element={
                    <ProtectedRoute>
                      <EditMultipleBots />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/import"
                  element={
                    <ProtectedRoute>
                      <ImportBots />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/day-planner"
                  element={
                    <ProtectedRoute>
                      <BotDayPlanner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/settings-history"
                  element={
                    <ProtectedRoute>
                      <BotSettingsHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/performance"
                  element={
                    <ProtectedRoute>
                      <BotPerformance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/shared"
                  element={
                    <ProtectedRoute>
                      <BotSharedBots />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/activity"
                  element={
                    <ProtectedRoute>
                      <BotActivity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/analytics"
                  element={
                    <ProtectedRoute>
                      <BotAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/comprehensive-analytics"
                  element={
                    <ProtectedRoute>
                      <ComprehensiveBotAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/backtesting"
                  element={
                    <ProtectedRoute>
                      <AdvancedBacktesting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/bidless-recovery"
                  element={
                    <ProtectedRoute>
                      <BidlessLongCreditRecovery />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/webhook-activity"
                  element={
                    <ProtectedRoute>
                      <WebhookActivity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bots/filter-values"
                  element={
                    <ProtectedRoute>
                      <BotFilterValues />
                    </ProtectedRoute>
                  }
                />

                {/* Trading Routes */}
                <Route
                  path="/trades/history"
                  element={
                    <ProtectedRoute>
                      <TradeLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trades/positions"
                  element={
                    <ProtectedRoute>
                      <OpenPositions />
                    </ProtectedRoute>
                  }
                />

                {/* Performance Routes */}
                <Route
                  path="/performance/balance-profits-time"
                  element={
                    <ProtectedRoute>
                      <BalanceProfitsOverTime />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/balance-history"
                  element={
                    <ProtectedRoute>
                      <BalanceHistoryTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/historical-dashboards"
                  element={
                    <ProtectedRoute>
                      <ViewHistoricalDashboards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/monthly-calendar"
                  element={
                    <ProtectedRoute>
                      <MonthlyCalendarReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/volatility"
                  element={
                    <ProtectedRoute>
                      <PerformanceVolatility />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/strategy-performance"
                  element={
                    <ProtectedRoute>
                      <StrategyPerformance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance/account-vs-market"
                  element={
                    <ProtectedRoute>
                      <AccountVsMarketPerformance />
                    </ProtectedRoute>
                  }
                />

                {/* Strategy Routes */}
                <Route
                  path="/strategies/view"
                  element={
                    <ProtectedRoute>
                      <ViewStrategies />
                    </ProtectedRoute>
                  }
                />

                {/* Support Routes */}
                <Route
                  path="/support/video-vault"
                  element={
                    <ProtectedRoute>
                      <VideoVault />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support/discord"
                  element={
                    <ProtectedRoute>
                      <DiscordCommunity />
                    </ProtectedRoute>
                  }
                />

                {/* Account Routes */}
                <Route
                  path="/account/email-preferences"
                  element={
                    <ProtectedRoute>
                      <EmailPrefs />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
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
