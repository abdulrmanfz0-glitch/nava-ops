import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  MapPin,
  Radio,
  Calendar,
  RefreshCw,
  Download,
  Settings,
  ChevronRight
} from 'lucide-react';

// Executive Components
import {
  ExecutiveKPICard,
  InsightActionPanel,
  ComparisonWidget,
  SmartLoadingState,
  IntelligentEmptyState
} from '../components/Executive';

// Services
import api from '../services/api';
import aiEngine from '../lib/aiEngine';
import logger from '../lib/logger';

// Contexts
import { useBrandTheme } from '../contexts/BrandThemeContext';
import { executiveTypography } from '../styles/executiveDesignSystem';
import { entranceAnimations, staggerAnimations } from '../utils/executiveAnimations';

/**
 * Executive Dashboard
 * Premium, intelligence-first dashboard with actionable insights
 *
 * Features:
 * - Smart KPI cards with context and trends
 * - AI-generated insights with executable actions
 * - Multi-dimensional comparisons
 * - Intelligent empty/loading states
 * - Brand-aware theming
 */
const ExecutiveDashboard = () => {
  const { currentTheme } = useBrandTheme();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Data state
  const [overview, setOverview] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [channelComparison, setChannelComparison] = useState([]);
  const [periodComparison, setPeriodComparison] = useState([]);
  const [insights, setInsights] = useState([]);
  const [forecast, setForecast] = useState(null);

  // ============================================================
  // DATA FETCHING
  // ============================================================
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, selectedBranch]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      logger.info('Loading Executive Dashboard data...');

      const days = getDaysFromRange(dateRange);

      // Fetch overview data
      const [overviewData, trendsData] = await Promise.all([
        api.analytics.getDashboardOverview(selectedBranch === 'all' ? null : selectedBranch, days),
        api.analytics.getRevenueTrends(selectedBranch === 'all' ? null : selectedBranch, days)
      ]);

      setOverview(overviewData.overview);
      setRevenueTrends(trendsData);

      // Generate AI insights
      if (trendsData.length >= 7 && overviewData.overview) {
        const forecastResult = aiEngine.forecastRevenue(trendsData, 7);
        setForecast(forecastResult);

        const generatedInsights = generateExecutiveInsights(
          overviewData.overview,
          trendsData,
          forecastResult
        );
        setInsights(generatedInsights);
      }

      // Generate comparison data
      generateComparisonData(overviewData.overview, trendsData);

      logger.info('Executive Dashboard data loaded successfully');
    } catch (error) {
      logger.error('Failed to load Executive Dashboard data', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================
  const getDaysFromRange = (range) => {
    const rangeMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
    return rangeMap[range] || 7;
  };

  const getPreviousValue = (overview, key) => {
    // Mock previous period data (in production, fetch from API)
    const mockPrevious = {
      totalRevenue: overview?.totalRevenue * 0.92 || 0,
      totalOrders: overview?.totalOrders * 0.88 || 0,
      totalCustomers: overview?.totalCustomers * 0.95 || 0,
      averageOrderValue: overview?.averageOrderValue * 1.04 || 0
    };
    return mockPrevious[key] || 0;
  };

  // ============================================================
  // AI INSIGHTS GENERATION
  // ============================================================
  const generateExecutiveInsights = (overview, trends, forecast) => {
    const insights = [];

    if (!overview || trends.length < 2) return insights;

    // Revenue trend insight
    const recentRevenue = trends[trends.length - 1]?.revenue || 0;
    const oldRevenue = trends[0]?.revenue || 1;
    const growth = ((recentRevenue - oldRevenue) / oldRevenue) * 100;

    if (growth > 10) {
      insights.push({
        id: 'insight-revenue-growth',
        type: 'opportunity',
        title: 'Strong Revenue Growth Detected',
        description: `Your revenue has grown by ${growth.toFixed(1)}% over the selected period. This momentum presents an opportunity to expand operations or invest in marketing.`,
        impact: 'high',
        metrics: [
          { label: 'Growth Rate', value: `+${growth.toFixed(1)}%` },
          { label: 'Current Revenue', value: `$${recentRevenue.toLocaleString()}` }
        ],
        actions: [
          {
            label: 'View Growth Analysis',
            onClick: () => console.log('Navigate to growth analysis'),
            primary: true
          },
          {
            label: 'Plan Expansion',
            onClick: () => console.log('Open expansion planner'),
            primary: false
          }
        ],
        category: 'Revenue',
        timestamp: new Date()
      });
    } else if (growth < -5) {
      insights.push({
        id: 'insight-revenue-decline',
        type: 'warning',
        title: 'Revenue Decline Needs Attention',
        description: `Revenue has decreased by ${Math.abs(growth).toFixed(1)}%. Review your pricing strategy, marketing campaigns, and customer feedback to identify root causes.`,
        impact: 'high',
        metrics: [
          { label: 'Decline Rate', value: `${growth.toFixed(1)}%` },
          { label: 'Revenue Lost', value: `$${(oldRevenue - recentRevenue).toLocaleString()}` }
        ],
        actions: [
          {
            label: 'Analyze Decline',
            onClick: () => console.log('Open decline analysis'),
            primary: true
          },
          {
            label: 'Review Strategy',
            onClick: () => console.log('Open strategy review'),
            primary: false
          }
        ],
        category: 'Revenue',
        timestamp: new Date()
      });
    }

    // Customer acquisition insight
    if (overview.totalCustomers > 0) {
      const customerGrowthRate = 12.5; // Mock - calculate from real data in production

      insights.push({
        id: 'insight-customer-growth',
        type: 'success',
        title: 'Customer Base Expanding',
        description: `You've acquired ${overview.newCustomers || Math.floor(overview.totalCustomers * 0.15)} new customers recently. Customer retention is key to sustainable growth.`,
        impact: 'medium',
        metrics: [
          { label: 'New Customers', value: overview.newCustomers || Math.floor(overview.totalCustomers * 0.15) },
          { label: 'Total Customers', value: overview.totalCustomers }
        ],
        actions: [
          {
            label: 'View Customer Insights',
            onClick: () => console.log('Navigate to customer insights'),
            primary: true
          }
        ],
        category: 'Customers',
        timestamp: new Date()
      });
    }

    // Order value insight
    if (overview.averageOrderValue > 0) {
      const avgOrderValue = overview.averageOrderValue;
      const targetAOV = avgOrderValue * 1.15; // 15% increase target

      insights.push({
        id: 'insight-aov-opportunity',
        type: 'info',
        title: 'Upselling Opportunity Identified',
        description: `Current average order value is $${avgOrderValue.toFixed(2)}. Implementing strategic upselling could increase this by 15% to $${targetAOV.toFixed(2)}.`,
        impact: 'medium',
        metrics: [
          { label: 'Current AOV', value: `$${avgOrderValue.toFixed(2)}` },
          { label: 'Target AOV', value: `$${targetAOV.toFixed(2)}` },
          { label: 'Potential Revenue', value: `+$${((targetAOV - avgOrderValue) * overview.totalOrders).toLocaleString()}` }
        ],
        actions: [
          {
            label: 'Create Upsell Strategy',
            onClick: () => console.log('Open upsell planner'),
            primary: true
          }
        ],
        category: 'Revenue Optimization',
        timestamp: new Date()
      });
    }

    return insights;
  };

  // ============================================================
  // COMPARISON DATA GENERATION
  // ============================================================
  const generateComparisonData = (overview, trends) => {
    // Period comparison (mock data - replace with real API data)
    const periodData = [
      {
        id: 'period-today',
        label: 'Today',
        value: overview?.todayRevenue || overview?.totalRevenue * 0.14 || 5000,
        previousValue: 4200,
        metadata: { date: new Date().toLocaleDateString() }
      },
      {
        id: 'period-yesterday',
        label: 'Yesterday',
        value: 4800,
        previousValue: 4100
      },
      {
        id: 'period-this-week',
        label: 'This Week',
        value: overview?.weekRevenue || overview?.totalRevenue * 0.7 || 28000,
        previousValue: 24500
      },
      {
        id: 'period-last-week',
        label: 'Last Week',
        value: 26500,
        previousValue: 23800
      }
    ];
    setPeriodComparison(periodData);

    // Branch comparison (mock data - replace with real API data)
    const branchData = [
      {
        id: 'branch-1',
        label: 'Downtown',
        value: overview?.totalRevenue * 0.4 || 16000,
        previousValue: 14200,
        metadata: { status: 'Active' }
      },
      {
        id: 'branch-2',
        label: 'Westside',
        value: overview?.totalRevenue * 0.35 || 14000,
        previousValue: 13500,
        metadata: { status: 'Active' }
      },
      {
        id: 'branch-3',
        label: 'Airport',
        value: overview?.totalRevenue * 0.25 || 10000,
        previousValue: 9800,
        metadata: { status: 'Active' }
      }
    ];
    setBranchComparison(branchData);

    // Channel comparison (mock data - replace with real API data)
    const channelData = [
      {
        id: 'channel-dine-in',
        label: 'Dine-In',
        value: overview?.totalRevenue * 0.5 || 20000,
        previousValue: 18500
      },
      {
        id: 'channel-delivery',
        label: 'Delivery',
        value: overview?.totalRevenue * 0.35 || 14000,
        previousValue: 12800
      },
      {
        id: 'channel-takeout',
        label: 'Takeout',
        value: overview?.totalRevenue * 0.15 || 6000,
        previousValue: 5900
      }
    ];
    setChannelComparison(channelData);
  };

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleExport = () => {
    console.log('Export dashboard data');
    // Implement export functionality
  };

  const handleKPIAction = (metric) => {
    console.log(`Drill down into ${metric}`);
    // Navigate to detailed view
  };

  // ============================================================
  // RENDER: LOADING STATE
  // ============================================================
  if (isLoading) {
    return <SmartLoadingState type="dashboard" message="Loading Executive Dashboard..." />;
  }

  // ============================================================
  // RENDER: NO DATA STATE
  // ============================================================
  if (!overview) {
    return (
      <div className="min-h-screen p-8">
        <IntelligentEmptyState
          type="no-data"
          context="analytics"
          actions={[
            {
              label: 'Refresh Data',
              onClick: handleRefresh,
              primary: true
            }
          ]}
        />
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-[1920px] mx-auto p-8 space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          {...entranceAnimations.slideDown}
        >
          <div>
            <h1
              className="font-bold text-gray-900 dark:text-white mb-2"
              style={{
                fontSize: executiveTypography.display.medium.fontSize,
                fontWeight: executiveTypography.display.medium.fontWeight,
                lineHeight: executiveTypography.display.medium.lineHeight,
                letterSpacing: executiveTypography.display.medium.letterSpacing
              }}
            >
              Executive Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Real-time intelligence and actionable insights for your restaurant operations
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <motion.button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </motion.button>

            <motion.button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              style={{ backgroundColor: currentTheme.colors.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              <span>Export</span>
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerAnimations.container}
          initial="initial"
          animate="animate"
        >
          <ExecutiveKPICard
            label="Total Revenue"
            value={overview.totalRevenue}
            previousValue={getPreviousValue(overview, 'totalRevenue')}
            format="currency"
            target={overview.totalRevenue * 1.1}
            insight="Revenue trending above target. Maintain current momentum."
            icon={DollarSign}
            action={{
              label: 'View Details',
              onClick: () => handleKPIAction('revenue')
            }}
            sparklineData={revenueTrends.slice(-10).map(t => t.revenue)}
          />

          <ExecutiveKPICard
            label="Total Orders"
            value={overview.totalOrders}
            previousValue={getPreviousValue(overview, 'totalOrders')}
            format="number"
            insight="Order volume increasing steadily."
            icon={ShoppingCart}
            action={{
              label: 'View Orders',
              onClick: () => handleKPIAction('orders')
            }}
          />

          <ExecutiveKPICard
            label="Total Customers"
            value={overview.totalCustomers}
            previousValue={getPreviousValue(overview, 'totalCustomers')}
            format="number"
            insight="Customer base growing consistently."
            icon={Users}
            action={{
              label: 'View Customers',
              onClick: () => handleKPIAction('customers')
            }}
          />

          <ExecutiveKPICard
            label="Avg Order Value"
            value={overview.averageOrderValue}
            previousValue={getPreviousValue(overview, 'averageOrderValue')}
            format="currency"
            target={overview.averageOrderValue * 1.15}
            insight="AOV opportunity: implement upselling strategies."
            icon={TrendingUp}
            action={{
              label: 'Optimize AOV',
              onClick: () => handleKPIAction('aov')
            }}
          />
        </motion.div>

        {/* AI Insights */}
        <InsightActionPanel
          insights={insights}
          maxVisible={3}
          onDismiss={(id) => setInsights(insights.filter(i => i.id !== id))}
        />

        {/* Comparison Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ComparisonWidget
            title="Period Comparison"
            comparisonType="period"
            data={periodComparison}
            metric="Revenue"
            format="currency"
            showTrend={true}
            onSelectItem={(item) => console.log('Selected:', item)}
          />

          <ComparisonWidget
            title="Branch Performance"
            comparisonType="branch"
            data={branchComparison}
            metric="Revenue"
            format="currency"
            showTrend={true}
            onSelectItem={(item) => console.log('Selected branch:', item)}
          />

          <ComparisonWidget
            title="Channel Analysis"
            comparisonType="channel"
            data={channelComparison}
            metric="Revenue"
            format="currency"
            showTrend={true}
            onSelectItem={(item) => console.log('Selected channel:', item)}
          />
        </div>

        {/* Quick Actions Footer */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          {...entranceAnimations.slideUp}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Menu Analytics', icon: Package, path: '/data-intelligence' },
              { label: 'Financial Reports', icon: DollarSign, path: '/financial' },
              { label: 'Branch Management', icon: MapPin, path: '/branches' },
              { label: 'Settings', icon: Settings, path: '/settings' }
            ].map((action, index) => (
              <motion.button
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex items-center justify-between group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => console.log('Navigate to:', action.path)}
              >
                <div className="flex items-center space-x-3">
                  <action.icon size={20} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
