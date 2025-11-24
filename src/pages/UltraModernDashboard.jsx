import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Target,
  Zap,
  ArrowUpRight,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Maximize2,
  Clock,
  Coffee,
  Star,
  Award,
} from 'lucide-react';
import {
  GlassCard,
  AnimatedKPICard,
  ModernSidebar,
  ModernHeader,
  DynamicChartWidget,
  ActivityFeed,
  AIInsightsPanel,
} from '../components/UltraModern';
import api from '@/services/api';
import aiEngine from '@/lib/aiEngine';
import logger from '@/lib/logger';

/**
 * UltraModernDashboard - Cutting-edge dashboard with glassmorphism and animations
 * Features: Animated KPIs, dynamic charts, AI insights, activity feed, responsive layout
 */
const UltraModernDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshKey, setRefreshKey] = useState(0);

  // Real data state
  const [overview, setOverview] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [smartAlerts, setSmartAlerts] = useState([]);
  const [forecast, setForecast] = useState(null);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Fetch real dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Calculate days from dateRange
      const days = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

      // Fetch analytics data
      const [overviewData, trendsData] = await Promise.all([
        api.analytics.getDashboardOverview(null, days),
        api.analytics.getRevenueTrends(null, days),
      ]);

      setOverview(overviewData.overview);
      setRevenueTrends(trendsData);

      // Generate AI forecast if enough data
      if (trendsData.length >= 7) {
        const forecastResult = aiEngine.forecastRevenue(trendsData, 7);
        setForecast(forecastResult);

        // Generate AI insights based on real data
        const insights = generateAIInsights(overviewData.overview, trendsData, forecastResult);
        setAiInsights(insights);
      }

      // Generate smart alerts
      if (overviewData.overview) {
        const alertsResult = aiEngine.generateSmartAlerts({
          revenue: overviewData.overview.totalRevenue,
          previousRevenue: trendsData.length >= 2 ? trendsData[0].revenue : 0,
          customerSatisfaction: 4.8, // Could come from real data
          lowStockItems: [], // Could come from real inventory data
        });

        if (alertsResult.success) {
          setSmartAlerts(alertsResult.alerts);
        }
      }

      logger.info('UltraModern dashboard data loaded successfully');
    } catch (error) {
      logger.error('Failed to load dashboard data', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI insights from real data
  const generateAIInsights = (overview, trends, forecast) => {
    const insights = [];
    let insightId = 1;

    // Revenue trend insight
    if (trends.length >= 2) {
      const recentRevenue = trends[trends.length - 1].revenue;
      const oldRevenue = trends[0].revenue;
      const growth = ((recentRevenue - oldRevenue) / oldRevenue) * 100;

      if (growth > 0) {
        insights.push({
          id: insightId++,
          type: 'growth',
          title: 'Revenue Trend Analysis',
          content: `Your revenue has increased by ${growth.toFixed(1)}% over the selected period. ${
            growth > 20
              ? 'Exceptional growth! Consider scaling operations to maintain momentum.'
              : 'Steady growth detected. Continue current strategies for consistent performance.'
          }`,
          confidence: Math.min(95, 75 + Math.min(trends.length, 20)),
          action: 'View Detailed Analysis',
        });
      } else if (growth < -5) {
        insights.push({
          id: insightId++,
          type: 'warning',
          title: 'Revenue Decline Detected',
          content: `Revenue has decreased by ${Math.abs(growth).toFixed(1)}%. Recommend reviewing pricing strategy, marketing campaigns, and customer feedback to identify root causes.`,
          confidence: Math.min(92, 70 + Math.min(trends.length, 20)),
          action: 'Review Strategy',
        });
      }
    }

    // Forecast insight
    if (forecast && forecast.success) {
      const trendText = forecast.trend === 'increasing' ? 'upward' : forecast.trend === 'decreasing' ? 'downward' : 'stable';
      const nextWeekRevenue = forecast.predictions[6]?.predictedRevenue || 0;

      insights.push({
        id: insightId++,
        type: forecast.trend === 'increasing' ? 'ai' : 'action',
        title: 'AI Revenue Forecast',
        content: `Based on ${trends.length} days of historical data, the AI model predicts a ${trendText} trend. Expected revenue for next week: SAR ${Math.round(nextWeekRevenue).toLocaleString()}. Confidence level: ${forecast.confidence}.`,
        confidence: forecast.confidence === 'high' ? 90 : forecast.confidence === 'medium' ? 75 : 60,
        action: 'View Forecast Details',
      });
    }

    // Order volume insight
    if (overview && overview.totalOrders) {
      const avgOrderValue = overview.totalRevenue / overview.totalOrders;

      if (avgOrderValue > 40) {
        insights.push({
          id: insightId++,
          type: 'opportunity',
          title: 'High-Value Transactions',
          content: `Your average order value of SAR ${avgOrderValue.toFixed(2)} is above industry benchmarks. Consider introducing premium bundles or loyalty rewards to maintain this trend.`,
          confidence: 88,
          action: 'Create Premium Offers',
        });
      } else if (avgOrderValue < 30) {
        insights.push({
          id: insightId++,
          type: 'action',
          title: 'Average Order Value Optimization',
          content: `Current average order value is SAR ${avgOrderValue.toFixed(2)}. Implementing upselling strategies, combo deals, or minimum order incentives could boost revenue by 15-25%.`,
          confidence: 85,
          action: 'Optimize Pricing',
        });
      }
    }

    return insights;
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, refreshKey]);

  // Sample user data
  const user = {
    name: 'Ahmed',
    email: 'ahmed@nava.com',
    role: 'Administrator',
  };

  // KPI Data with sparklines - Use real data when available
  const kpiData = overview ? [
    {
      title: 'Total Revenue',
      value: overview.totalRevenue || 0,
      previousValue: revenueTrends.length >= 2 ? revenueTrends[0].revenue : 0,
      format: 'currency',
      prefix: 'SAR ',
      icon: DollarSign,
      iconColor: 'green',
      sparklineData: revenueTrends.slice(-12).map(d => d.revenue / 1000),
    },
    {
      title: 'Active Customers',
      value: overview.activeCustomers || 0,
      previousValue: Math.round((overview.activeCustomers || 0) * 0.9),
      format: 'number',
      icon: Users,
      iconColor: 'blue',
      sparklineData: revenueTrends.slice(-12).map((d, i) => 40 + i * 3),
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders || 0,
      previousValue: Math.round((overview.totalOrders || 0) * 0.87),
      format: 'number',
      icon: ShoppingCart,
      iconColor: 'purple',
      sparklineData: revenueTrends.slice(-12).map(d => d.orders || 0),
    },
    {
      title: 'Avg Order Value',
      value: overview.averageOrderValue || 0,
      previousValue: (overview.averageOrderValue || 0) * 0.96,
      format: 'currency',
      prefix: 'SAR ',
      icon: Target,
      iconColor: 'orange',
      sparklineData: revenueTrends.slice(-12).map(d => (d.revenue || 0) / (d.orders || 1)),
    },
  ] : [
    {
      title: 'Total Revenue',
      value: 128450,
      previousValue: 112380,
      format: 'currency',
      prefix: 'SAR ',
      icon: DollarSign,
      iconColor: 'green',
      sparklineData: [65, 72, 68, 85, 78, 92, 88, 95, 102, 98, 115, 128],
    },
    {
      title: 'Active Customers',
      value: 3842,
      previousValue: 3456,
      format: 'number',
      icon: Users,
      iconColor: 'blue',
      sparklineData: [42, 45, 48, 52, 49, 55, 58, 62, 65, 68, 72, 78],
    },
    {
      title: 'Total Orders',
      value: 1256,
      previousValue: 1089,
      format: 'number',
      icon: ShoppingCart,
      iconColor: 'purple',
      sparklineData: [85, 92, 88, 95, 102, 98, 115, 108, 120, 125, 118, 128],
    },
    {
      title: 'Avg Order Value',
      value: 48.5,
      previousValue: 46.2,
      format: 'currency',
      prefix: 'SAR ',
      icon: Target,
      iconColor: 'orange',
      sparklineData: [42, 43, 44, 45, 44, 46, 47, 46, 48, 47, 49, 48.5],
    },
  ];

  // Revenue Chart Data - Use real data when available
  const revenueData = revenueTrends.length > 0
    ? revenueTrends.slice(-7).map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: d.revenue || 0,
        orders: d.orders || 0,
        profit: (d.revenue || 0) * 0.4, // Assume 40% profit margin
      }))
    : [
        { name: 'Mon', revenue: 4200, orders: 85, profit: 1680 },
        { name: 'Tue', revenue: 5100, orders: 102, profit: 2040 },
        { name: 'Wed', revenue: 4800, orders: 96, profit: 1920 },
        { name: 'Thu', revenue: 6200, orders: 124, profit: 2480 },
        { name: 'Fri', revenue: 7800, orders: 156, profit: 3120 },
        { name: 'Sat', revenue: 9200, orders: 184, profit: 3680 },
        { name: 'Sun', revenue: 8500, orders: 170, profit: 3400 },
      ];

  // Category Performance Data
  const categoryData = [
    { name: 'Main Course', value: 45, orders: 520 },
    { name: 'Appetizers', value: 25, orders: 290 },
    { name: 'Beverages', value: 18, orders: 208 },
    { name: 'Desserts', value: 12, orders: 139 },
  ];

  // Top Items
  const topItems = [
    { name: 'Grilled Salmon', orders: 156, revenue: '$4,680', trend: '+12%', rating: 4.8 },
    { name: 'Truffle Risotto', orders: 142, revenue: '$3,550', trend: '+8%', rating: 4.9 },
    { name: 'Wagyu Steak', orders: 128, revenue: '$6,400', trend: '+15%', rating: 4.7 },
    { name: 'Caesar Salad', orders: 115, revenue: '$1,725', trend: '+5%', rating: 4.6 },
    { name: 'Tiramisu', orders: 98, revenue: '$980', trend: '+10%', rating: 4.9 },
  ];

  // Quick Stats
  const quickStats = [
    { label: 'Avg Order Value', value: '$48.50', icon: DollarSign, change: '+4.2%' },
    { label: 'Peak Hours', value: '7-9 PM', icon: Clock, change: null },
    { label: 'Top Category', value: 'Main Course', icon: Coffee, change: '+12%' },
    { label: 'Customer Rating', value: '4.8', icon: Star, change: '+0.2' },
  ];

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Date range options
  const dateRanges = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Background */}
      <div className="fixed inset-0 bg-gray-950">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Sidebar */}
      <ModernSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        user={user}
      />

      {/* Main Content */}
      <main
        className={`
          relative min-h-screen
          transition-all duration-300 ease-out
          ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}
        `}
      >
        {/* Header */}
        <ModernHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your business."
          user={user}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/ultra-dashboard' },
          ]}
        />

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Top Controls */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-1">
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg
                      transition-all duration-200
                      ${dateRange === range.value
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                      }
                    `}
                    onClick={() => setDateRange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Filter Button */}
              <motion.button
                className="
                  flex items-center gap-2 px-4 py-2.5
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.08] rounded-xl
                  text-gray-400 hover:text-white
                  transition-all duration-200
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <motion.button
                className="
                  flex items-center gap-2 px-4 py-2.5
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.08] rounded-xl
                  text-gray-400 hover:text-white
                  transition-all duration-200
                "
                onClick={handleRefresh}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>

              {/* Download Button */}
              <motion.button
                className="
                  flex items-center gap-2 px-4 py-2.5
                  bg-gradient-to-r from-cyan-500 to-blue-600
                  rounded-xl text-white text-sm font-medium
                  shadow-lg shadow-cyan-500/25
                  hover:shadow-xl hover:shadow-cyan-500/30
                  transition-all duration-200
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <AnimatedKPICard
                key={kpi.title}
                {...kpi}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Quick Stats Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {quickStats.map((stat, index) => (
              <GlassCard
                key={stat.label}
                className="flex items-center gap-4"
                padding="md"
                delay={0.5 + index * 0.1}
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white">{stat.value}</span>
                    {stat.change && (
                      <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart - Spans 2 columns */}
            <div className="lg:col-span-2">
              <DynamicChartWidget
                title="Revenue Overview"
                subtitle="Daily revenue, orders, and profit"
                data={revenueData}
                type="area"
                dataKeys={['revenue', 'profit']}
                colors={['#06B6D4', '#8B5CF6']}
                height={320}
                delay={0.6}
              />
            </div>

            {/* Activity Feed */}
            <ActivityFeed delay={0.7} />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Performance */}
            <DynamicChartWidget
              title="Category Performance"
              subtitle="Orders by category"
              data={categoryData}
              type="pie"
              dataKeys={['value']}
              colors={['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B']}
              height={280}
              delay={0.8}
            />

            {/* Top Items */}
            <GlassCard className="lg:col-span-1" padding="none" delay={0.9}>
              <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06]">
                <div>
                  <h3 className="text-lg font-semibold text-white">Top Items</h3>
                  <p className="text-xs text-gray-500">Best performing menu items</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {topItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="
                          w-8 h-8 rounded-lg
                          bg-gradient-to-br from-cyan-500/20 to-blue-500/20
                          flex items-center justify-center
                          text-sm font-bold text-cyan-400
                        ">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">{item.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{item.revenue}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-gray-400">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* AI Insights */}
            <AIInsightsPanel
              insights={aiInsights}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              delay={1}
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DynamicChartWidget
              title="Order Trends"
              subtitle="Weekly order distribution"
              data={revenueData}
              type="bar"
              dataKeys={['orders']}
              colors={['#8B5CF6']}
              height={280}
              delay={1.2}
            />

            <DynamicChartWidget
              title="Profit Analysis"
              subtitle="Daily profit trends"
              data={revenueData}
              type="line"
              dataKeys={['profit', 'revenue']}
              colors={['#10B981', '#06B6D4']}
              height={280}
              delay={1.3}
            />
          </div>

          {/* Achievement Banner */}
          <motion.div
            className="
              relative overflow-hidden rounded-2xl
              bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10
              border border-white/[0.1]
              p-8
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            {/* Animated background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  className="
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-amber-400 to-orange-500
                    flex items-center justify-center
                    shadow-lg shadow-amber-500/30
                  "
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Congratulations! You've reached a milestone!
                  </h3>
                  <p className="text-gray-400">
                    Your revenue has grown 23% this month. Keep up the great work!
                  </p>
                </div>
              </div>

              <motion.button
                className="
                  flex items-center gap-2 px-6 py-3
                  bg-white text-gray-900
                  rounded-xl text-sm font-semibold
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Achievements
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UltraModernDashboard;
