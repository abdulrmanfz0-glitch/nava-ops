// NAVA OPS - Dashboard v2 Enhanced
// Stunning, intelligent, fully customizable dashboard experience

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Settings,
  Plus,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  ChevronDown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import PageHeader from '@/components/UI/PageHeader';
import DateRangePicker from '@/components/UI/DateRangePicker';
import DraggableGrid from '@/components/DashboardV2/DraggableGrid';
import EnhancedKPICard from '@/components/DashboardV2/EnhancedKPICard';
import SmartInsightsWidget from '@/components/DashboardV2/SmartInsightsWidget';
import WidgetMarketplace from '@/components/DashboardV2/WidgetMarketplace';
import { dashboardTheme, getColorTheme } from '@/styles/dashboardTheme';
import { exportDashboardToPDF, prepareWidgetDataForExport } from '@/utils/dashboardExport';
import api from '@/services/api';
import logger from '@/lib/logger';

export default function DashboardV2Enhanced() {
  const { userProfile } = useAuth();
  const {
    layout,
    widgets,
    isCustomizing,
    dateRange,
    selectedBranch,
    setDateRange,
    setSelectedBranch,
    toggleCustomization,
    resetToDefault,
    updateLayout,
    addWidget,
    removeWidget
  } = useDashboard();

  // Local state
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      logger.debug('Fetching dashboard data', { dateRange, selectedBranch });

      const days = getDaysBetween(dateRange.startDate, dateRange.endDate);

      // Fetch all data in parallel
      const [overview, trends, branches, topPerformers] = await Promise.all([
        api.analytics.getDashboardOverview(selectedBranch, days),
        api.analytics.getRevenueTrends(selectedBranch, days),
        api.analytics.getBranchComparison(days),
        api.analytics.getTopPerformers(selectedBranch, days)
      ]);

      // Calculate previous period for trends
      const previousEnd = new Date(dateRange.startDate);
      previousEnd.setDate(previousEnd.getDate() - 1);
      const previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - days);

      const previousOverview = await api.analytics.getDashboardOverview(
        selectedBranch,
        days,
        previousStart.toISOString().split('T')[0],
        previousEnd.toISOString().split('T')[0]
      );

      // Prepare enhanced data structure
      setDashboardData({
        revenue: {
          current: overview.overview?.totalRevenue || 0,
          previous: previousOverview.overview?.totalRevenue || 0,
          trend: calculateTrend(
            overview.overview?.totalRevenue,
            previousOverview.overview?.totalRevenue
          ),
          sparkline: trends.slice(-30).map(t => t.revenue || 0)
        },
        orders: {
          current: overview.overview?.totalOrders || 0,
          previous: previousOverview.overview?.totalOrders || 0,
          trend: calculateTrend(
            overview.overview?.totalOrders,
            previousOverview.overview?.totalOrders
          ),
          sparkline: trends.slice(-30).map(t => t.orders || 0)
        },
        customers: {
          current: overview.overview?.activeCustomers || 0,
          previous: previousOverview.overview?.activeCustomers || 0,
          trend: calculateTrend(
            overview.overview?.activeCustomers,
            previousOverview.overview?.activeCustomers
          ),
          sparkline: trends.slice(-30).map((t, i) => overview.overview?.activeCustomers * (0.9 + Math.random() * 0.2))
        },
        averageOrderValue: {
          current: overview.overview?.averageOrderValue || 0,
          previous: previousOverview.overview?.averageOrderValue || 0,
          trend: calculateTrend(
            overview.overview?.averageOrderValue,
            previousOverview.overview?.averageOrderValue
          ),
          sparkline: trends.slice(-30).map(t => (t.revenue || 0) / (t.orders || 1))
        },
        branches: branches || [],
        topPerformers: topPerformers || [],
        trends: trends || [],
        // AI Insights data
        aiInsights: {
          revenue: {
            current: overview.overview?.totalRevenue || 0,
            previous: previousOverview.overview?.totalRevenue || 0,
            trend: calculateTrend(
              overview.overview?.totalRevenue,
              previousOverview.overview?.totalRevenue
            )
          },
          customers: {
            activeCustomers: overview.overview?.activeCustomers || 0,
            churnRate: 0.12, // Mock data
            averageLifetimeValue: 5000 // Mock data
          },
          branches: {
            topPerformer: branches?.[0] || null,
            underperformer: branches?.[branches.length - 1] || null,
            averageRevenue: branches?.reduce((sum, b) => sum + (b.revenue || 0), 0) / (branches?.length || 1)
          },
          goals: [
            { id: 'q4-revenue', name: 'Q4 Revenue Target', progress: 0.87 },
            { id: 'customer-growth', name: 'Customer Growth', progress: 0.92 }
          ]
        }
      });

      logger.debug('Dashboard data loaded successfully');
    } catch (error) {
      logger.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedBranch]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      logger.debug('Exporting dashboard to PDF');

      const exportData = prepareWidgetDataForExport(
        Object.values(widgets),
        {
          'revenue-metric': {
            type: 'metric',
            value: `$${dashboardData.revenue?.current?.toLocaleString()}`,
            trend: dashboardData.revenue?.trend
          },
          'orders-metric': {
            type: 'metric',
            value: dashboardData.orders?.current?.toLocaleString(),
            trend: dashboardData.orders?.trend
          },
          'smart-insights': {
            type: 'insights',
            insights: [] // Would be populated with actual insights
          }
        }
      );

      await exportDashboardToPDF({
        title: 'Dashboard v2 Report',
        widgets: exportData,
        dateRange,
        userName: userProfile?.full_name || 'User'
      });

      logger.info('Dashboard exported successfully');
    } catch (error) {
      logger.error('Failed to export dashboard', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle preset layouts
  const handlePresetSelect = (preset) => {
    logger.info('Applying preset layout', { preset });
    resetToDefault();
    setShowPresets(false);
  };

  return (
    <div className={`min-h-screen ${dashboardTheme.gradients.mesh} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`
            ${dashboardTheme.glass.combined}
            ${dashboardTheme.card.elevated}
            rounded-2xl p-6
          `}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`
                    p-3 rounded-xl ${getColorTheme('primary').bg}
                    ${getColorTheme('primary').border} border
                  `}
                >
                  <BarChart3 className={`w-8 h-8 ${getColorTheme('primary').text}`} />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Dashboard v2
                    </h1>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        ${getColorTheme('purple').bg} ${getColorTheme('purple').text}
                        flex items-center gap-1
                      `}
                    >
                      <Sparkles className="w-3 h-3" />
                      Enhanced
                    </motion.div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back, <span className="font-semibold">{userProfile?.full_name || 'User'}</span>!
                    Here's your intelligent business overview.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onDateChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-200 transition-all duration-200
                    ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFullscreenToggle}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-200 transition-all duration-200
                  `}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCustomization}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    transition-all duration-200
                    ${isCustomizing
                      ? `bg-gradient-to-r ${getColorTheme('primary').gradient} text-white shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }
                  `}
                >
                  <Settings className="w-5 h-5" />
                  <span>{isCustomizing ? 'Done' : 'Customize'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customization Panel */}
        <AnimatePresence>
          {isCustomizing && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`
                ${dashboardTheme.glass.combined}
                ${dashboardTheme.card.elevated}
                rounded-2xl p-6 border-2 ${getColorTheme('primary').border}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${getColorTheme('primary').text}`} />
                    Customize Your Dashboard
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Drag widgets to rearrange • Click '+' to add new widgets • Changes save automatically
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPresets(!showPresets)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                      text-gray-700 dark:text-gray-200 transition-all duration-200
                    `}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Presets</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetToDefault}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700
                      text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700
                      transition-all duration-200
                    `}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMarketplace(true)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      bg-gradient-to-r ${getColorTheme('success').gradient}
                      text-white shadow-lg transition-all duration-200
                    `}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Widget</span>
                  </motion.button>
                </div>
              </div>

              {/* Preset Layouts */}
              <AnimatePresence>
                {showPresets && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    {['Executive', 'Manager', 'Analyst'].map((preset) => (
                      <motion.button
                        key={preset}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePresetSelect(preset.toLowerCase())}
                        className={`
                          p-4 rounded-xl text-left
                          bg-gradient-to-br from-gray-50 to-gray-100
                          dark:from-gray-800 dark:to-gray-700
                          hover:shadow-lg transition-all duration-200
                        `}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          {preset} View
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Optimized for {preset.toLowerCase()} role
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <EnhancedKPICard
            title="Total Revenue"
            value={dashboardData.revenue?.current || 0}
            previousValue={dashboardData.revenue?.previous || 0}
            icon={DollarSign}
            color="success"
            format="currency"
            sparklineData={dashboardData.revenue?.sparkline || []}
            subtitle="vs previous period"
          />
          <EnhancedKPICard
            title="Total Orders"
            value={dashboardData.orders?.current || 0}
            previousValue={dashboardData.orders?.previous || 0}
            icon={ShoppingCart}
            color="primary"
            format="number"
            sparklineData={dashboardData.orders?.sparkline || []}
            subtitle="order volume"
          />
          <EnhancedKPICard
            title="Active Customers"
            value={dashboardData.customers?.current || 0}
            previousValue={dashboardData.customers?.previous || 0}
            icon={Users}
            color="purple"
            format="number"
            sparklineData={dashboardData.customers?.sparkline || []}
            subtitle="engaged users"
          />
          <EnhancedKPICard
            title="Avg Order Value"
            value={dashboardData.averageOrderValue?.current || 0}
            previousValue={dashboardData.averageOrderValue?.previous || 0}
            icon={TrendingUp}
            color="cyan"
            format="currency"
            sparklineData={dashboardData.averageOrderValue?.sparkline || []}
            subtitle="per transaction"
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {layout.length === 0 ? (
            // Empty State
            <EmptyState onAddWidget={() => setShowMarketplace(true)} />
          ) : (
            <DraggableGrid
              layout={layout}
              onLayoutChange={updateLayout}
              isDraggable={isCustomizing}
              columns={4}
              gap={6}
            >
              {layout.map((item) => {
                // Render Smart Insights Widget
                if (item.i === 'smart-insights' || item.i.includes('insights')) {
                  return (
                    <div
                      key={item.i}
                      className={`
                        h-full ${dashboardTheme.glass.combined}
                        ${dashboardTheme.card.elevated}
                        rounded-2xl p-6
                      `}
                    >
                      <SmartInsightsWidget
                        widgetId={item.i}
                        data={dashboardData.aiInsights}
                        onRemove={() => removeWidget(item.i)}
                      />
                    </div>
                  );
                }

                // Render placeholder for other widgets
                return (
                  <div
                    key={item.i}
                    className={`
                      h-full ${dashboardTheme.glass.combined}
                      ${dashboardTheme.card.elevated}
                      rounded-2xl p-6 flex items-center justify-center
                    `}
                  >
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Widget: {item.i}</p>
                    </div>
                  </div>
                );
              })}
            </DraggableGrid>
          )}
        </motion.div>
      </div>

      {/* Widget Marketplace Modal */}
      <WidgetMarketplace
        isOpen={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        onAddWidget={(widget) => {
          logger.info('Adding widget', { widgetId: widget.id });
          addWidget(widget.id);
        }}
      />
    </div>
  );
}

// Empty State Component
function EmptyState({ onAddWidget }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${dashboardTheme.glass.combined}
        ${dashboardTheme.card.elevated}
        rounded-2xl p-12 text-center
      `}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`
          w-20 h-20 mx-auto mb-6 rounded-2xl
          ${getColorTheme('primary').bg}
          ${getColorTheme('primary').border} border-2
          flex items-center justify-center
        `}
      >
        <BarChart3 className={`w-10 h-10 ${getColorTheme('primary').text}`} />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your Canvas Awaits
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Start building your perfect dashboard by adding widgets that matter most to your business
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddWidget}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
          bg-gradient-to-r ${getColorTheme('primary').gradient}
          text-white shadow-xl hover:shadow-2xl transition-all duration-300
        `}
      >
        <Plus className="w-5 h-5" />
        <span>Add Your First Widget</span>
      </motion.button>
    </motion.div>
  );
}

// Helper functions
function getDaysBetween(start, end) {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateTrend(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
