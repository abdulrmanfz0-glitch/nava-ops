// src/App.jsx
import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Layout from './components/Layout/Layout';
import OfflineIndicator from './components/UI/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import { logger, PerformanceLogger } from './lib/logger';

// Initialize app
logger.info('Application started', {
  version: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_ENVIRONMENT,
  devMode: import.meta.env.DEV
});

// Lazy load page components for performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RestaurantsManagement = lazy(() => import('./pages/RestaurantsManagement'));
const ReportHub = lazy(() => import('./pages/ReportHub'));

const DashboardV2 = lazy(() => import('./pages/DashboardV2Enhanced'));
const BranchesManagement = lazy(() => import('./pages/BranchesManagement'));
const ReportsAnalytics = lazy(() => import('./pages/ReportsAnalyticsNew')); // Unified Professional Report
const ExecutiveDashboard = lazy(() => import('./pages/ExecutiveDashboard'));
 
const TeamManagement = lazy(() => import('./pages/TeamManagement'));
const FinancialReports = lazy(() => import('./pages/FinancialReports'));
const FinancialIntelligence = lazy(() => import('./pages/FinancialIntelligence'));
const FinancialPerformanceReport = lazy(() => import('./pages/FinancialPerformanceReport'));
const MenuIntelligence = lazy(() => import('./pages/MenuIntelligence'));
const Settings = lazy(() => import('./pages/Settings'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));
const Intelligence = lazy(() => import('./pages/Intelligence'));
const ExecutiveHQ = lazy(() => import('./pages/ExecutiveHQ'));
const ClaudeNexusDemo = lazy(() => import('./pages/ClaudeNexusDemo'));
const GitOperations = lazy(() => import('./GitOperations'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Billing = lazy(() => import('./pages/Billing'));

// Protected route wrapper with authentication and permission checking
function RequireAuth({ children, requiredPermissions = [] }) {
  const { connectionStatus, user, hasPermission, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking session
  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Checking session...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading your data securely</p>
        </div>
      </div>
    );
  }

  // Show offline message if no internet connection
  if (!navigator.onLine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا يوجد اتصال بالإنترنت</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">يجب أن تكون متصلاً بالإنترنت للوصول إلى المنصة</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    logger.debug('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9V4m0 2h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">غير مصرح بالوصول</h3>
          <p className="text-gray-600 dark:text-gray-300">ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// Global loading component
function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin-slow"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg font-medium">جاري تحميل NAVA</p>
        <p className="text-primary-500 text-sm mt-2">منصة إدارة المطاعم المتكاملة</p>
      </div>
    </div>
  );
}

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <Navigate to="/" replace />
      </div>
    </div>
  );
}

export default function App() {
  // Track app initialization performance
  useEffect(() => {
    PerformanceLogger.start('app-init');
    return () => {
      PerformanceLogger.end('app-init', 3000);
    };
  }, []);

  return (
    <ErrorBoundary
      errorMessage="A critical error occurred in the application. Please refresh the page."
      onError={(error, errorInfo) => {
        logger.fatal('Critical Application Error', { errorInfo }, error)
      }}
    >
      <div className="App">
        <OfflineIndicator />
        <Suspense fallback={<GlobalLoading />}>
          <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />

                      {/* Protected Routes */}
                      <Route path="/" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/dashboard-v2" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <DashboardProvider>
                              <Layout>
                                <DashboardV2 />
                              </Layout>
                            </DashboardProvider>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/branches" element={
                        <RequireAuth requiredPermissions={['restaurants:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <BranchesManagement />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Backwards compatibility route */}
                      <Route path="/restaurants" element={
                        <RequireAuth requiredPermissions={['restaurants:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <BranchesManagement />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/reports" element={
                        <RequireAuth requiredPermissions={['reports:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <ReportsAnalytics />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Report Hub - Unified Reporting Center */}
                      <Route path="/report-hub" element={
                        <RequireAuth requiredPermissions={['reports:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <ReportHub />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Executive Dashboard */}
                      <Route path="/executive" element={
                        <RequireAuth requiredPermissions={['reports:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <ExecutiveDashboard />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Team Management */}
                      <Route path="/team" element={
                        <RequireAuth requiredPermissions={['team:manage']}>
                          <ErrorBoundary>
                            <Layout>
                              <TeamManagement />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/financial" element={
                        <RequireAuth requiredPermissions={['financial:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <FinancialReports />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Intelligence Hub - AI-Powered Analytics */}
                      <Route path="/intelligence" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <Intelligence />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Executive HQ Dashboard - Premium Feature */}
                      <Route path="/executive-hq" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <ExecutiveHQ />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Claude Nexus Demo - POC */}
                      <Route path="/claude-nexus" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <ClaudeNexusDemo />
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Financial Intelligence - Advanced Analytics */}
                      <Route path="/financial-intelligence" element={
                        <RequireAuth requiredPermissions={['financial:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <FinancialIntelligence />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Financial Performance Report - Unified Dashboard */}
                      <Route path="/financial-performance" element={
                        <RequireAuth requiredPermissions={['financial:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <FinancialPerformanceReport />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Menu Intelligence - Menu Performance Analysis */}
                      <Route path="/menu-intelligence" element={
                        <RequireAuth requiredPermissions={['reports:view']}>
                          <ErrorBoundary>
                            <Layout>
                              <MenuIntelligence />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Notifications Center */}
                      <Route path="/notifications" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <NotificationsCenter />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/settings" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <Settings />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      <Route path="/git-ops" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <GitOperations />
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Subscription Management */}
                      <Route path="/subscriptions" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <Subscriptions />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* Billing */}
                      <Route path="/billing" element={
                        <RequireAuth>
                          <ErrorBoundary>
                            <Layout>
                              <Billing />
                            </Layout>
                          </ErrorBoundary>
                        </RequireAuth>
                      } />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
    </ErrorBoundary>
 
  );
}
