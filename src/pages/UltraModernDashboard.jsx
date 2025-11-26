import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  ArrowUpRight,
  RefreshCw,
  Filter,
  Download,
  Clock,
  Coffee,
  Star,
  Award,
  TrendingUp,
  Bell,
  Sparkles,
} from 'lucide-react';
// NEW: Import from nava-ui component library
import {
  ModernCard,
  KPIWidget,
  ChartCard,
  LineChart,
  DonutChart,
  NeoButton,
  SectionTitle,
  StatBadge,
  InfoBlock,
} from '../components/nava-ui';
import api from '@/services/api';
import aiEngine from '@/lib/aiEngine';
import logger from '@/lib/logger';

/**
 * UltraModernDashboard - REBUILT with NAVA UI Components
 * VISUAL LAYER ONLY - All functionality preserved
 */
const UltraModernDashboard = () => {
  // ============================================================
  // STATE MANAGEMENT (UNCHANGED)
  // ============================================================
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

  // ============================================================
  // EFFECTS (UNCHANGED)
  // ============================================================
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // ============================================================
  // DATA FETCHING LOGIC (UNCHANGED)
  // ============================================================
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const days = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

      const [overviewData, trendsData] = await Promise.all([
        api.analytics.getDashboardOverview(null, days),
        api.analytics.getRevenueTrends(null, days),
      ]);

      setOverview(overviewData.overview);
      setRevenueTrends(trendsData);

      if (trendsData.length >= 7) {
        const forecastResult = aiEngine.forecastRevenue(trendsData, 7);
        setForecast(forecastResult);

        const insights = generateAIInsights(overviewData.overview, trendsData, forecastResult);
        setAiInsights(insights);
      }

      if (overviewData.overview) {
        const alertsResult = aiEngine.generateSmartAlerts({
          revenue: overviewData.overview.totalRevenue,
          previousRevenue: trendsData.length >= 2 ? trendsData[0].revenue : 0,
          customerSatisfaction: 4.8,
          lowStockItems: [],
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

  // ============================================================
  // AI INSIGHTS GENERATION (UNCHANGED)
  // ============================================================
  const generateAIInsights = (overview, trends, forecast) => {
    const insights = [];
    let insightId = 1;

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

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, refreshKey]);

  // ============================================================
  // DATA PREPARATION (UNCHANGED)
  // ============================================================
  const user = {
    name: 'Ahmed',
    email: 'ahmed@nava.com',
    role: 'Administrator',
  };

  const kpiData = overview ? [
    {
      title: 'Total Revenue',
      value: overview.totalRevenue || 0,
      prefix: 'SAR ',
      trend: (overview.totalRevenue > (revenueTrends.length >= 2 ? revenueTrends[0].revenue : 0)) ? 'up' : 'down',
      trendValue: revenueTrends.length >= 2
        ? ((overview.totalRevenue - revenueTrends[0].revenue) / revenueTrends[0].revenue * 100).toFixed(1)
        : 0,
      icon: DollarSign,
      iconColor: 'text-green-400',
    },
    {
      title: 'Active Customers',
      value: overview.activeCustomers || 0,
      trend: 'up',
      trendValue: 12.5,
      icon: Users,
      iconColor: 'text-blue-400',
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders || 0,
      trend: 'up',
      trendValue: 8.3,
      icon: ShoppingCart,
      iconColor: 'text-purple-400',
    },
    {
      title: 'Avg Order Value',
      value: overview.averageOrderValue || 0,
      prefix: 'SAR ',
      trend: 'up',
      trendValue: 4.2,
      icon: Target,
      iconColor: 'text-orange-400',
    },
  ] : [
    { title: 'Total Revenue', value: 128450, prefix: 'SAR ', trend: 'up', trendValue: 14.3, icon: DollarSign, iconColor: 'text-green-400' },
    { title: 'Active Customers', value: 3842, trend: 'up', trendValue: 12.5, icon: Users, iconColor: 'text-blue-400' },
    { title: 'Total Orders', value: 1256, trend: 'up', trendValue: 8.3, icon: ShoppingCart, iconColor: 'text-purple-400' },
    { title: 'Avg Order Value', value: 48.5, prefix: 'SAR ', trend: 'up', trendValue: 4.2, icon: Target, iconColor: 'text-orange-400' },
  ];

  const revenueData = revenueTrends.length > 0
    ? revenueTrends.slice(-7).map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: d.revenue || 0,
        orders: d.orders || 0,
        profit: (d.revenue || 0) * 0.4,
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

  const categoryData = [
    { name: 'Main Course', value: 45 },
    { name: 'Appetizers', value: 25 },
    { name: 'Beverages', value: 18 },
    { name: 'Desserts', value: 12 },
  ];

  const topItems = [
    { name: 'Grilled Salmon', orders: 156, revenue: '$4,680', trend: '+12%', rating: 4.8 },
    { name: 'Truffle Risotto', orders: 142, revenue: '$3,550', trend: '+8%', rating: 4.9 },
    { name: 'Wagyu Steak', orders: 128, revenue: '$6,400', trend: '+15%', rating: 4.7 },
    { name: 'Caesar Salad', orders: 115, revenue: '$1,725', trend: '+5%', rating: 4.6 },
    { name: 'Tiramisu', orders: 98, revenue: '$980', trend: '+10%', rating: 4.9 },
  ];

  const quickStats = [
    { label: 'Avg Order', value: '$48.50', icon: DollarSign, change: '+4.2%' },
    { label: 'Peak Hours', value: '7-9 PM', icon: Clock, change: null },
    { label: 'Top Category', value: 'Main Course', icon: Coffee, change: '+12%' },
    { label: 'Rating', value: '4.8', icon: Star, change: '+0.2' },
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const dateRanges = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  // ============================================================
  // NEW UI WITH NAVA-UI COMPONENTS
  // ============================================================
  return (
    <div className="min-h-screen bg-[#0A0E14]">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 bg-gradient-mesh-cyber opacity-50 pointer-events-none -z-10" />

      {/* Main Content - Layout will add sidebar and navbar */}
      <main className="space-y-8">
        {/* Header Section */}
        <SectionTitle
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your business."
          icon={TrendingUp}
          accent="primary"
          action={
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${dateRange === range.value
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                    `}
                    onClick={() => setDateRange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <NeoButton
                variant="ghost"
                size="md"
                icon={Filter}
                iconPosition="left"
              >
                Filter
              </NeoButton>

              <NeoButton
                variant="ghost"
                size="md"
                icon={RefreshCw}
                iconPosition="left"
                onClick={handleRefresh}
                loading={isLoading}
              >
                Refresh
              </NeoButton>

              <NeoButton
                variant="primary"
                size="md"
                icon={Download}
                iconPosition="left"
              >
                Export
              </NeoButton>
            </div>
          }
        />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPIWidget
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              prefix={kpi.prefix}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              icon={kpi.icon}
              iconColor={kpi.iconColor}
              variant="glass"
              animated={true}
            />
          ))}
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <ModernCard key={stat.label} variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white">{stat.value}</span>
                    {stat.change && (
                      <StatBadge
                        value={stat.change}
                        variant={stat.change.startsWith('+') ? 'success' : 'error'}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - 2 columns */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Revenue Overview"
              subtitle="Daily revenue and profit trends"
              value={`SAR ${(revenueData.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(1)}K`}
              trend="up"
              trendValue={12.5}
              chart={
                <LineChart
                  data={revenueData}
                  lines={[
                    { dataKey: 'revenue', name: 'Revenue', color: '#00C4FF', gradient: true },
                    { dataKey: 'profit', name: 'Profit', color: '#9210FF', gradient: true },
                  ]}
                  xAxisKey="name"
                  smooth={true}
                  gradient={true}
                  height={300}
                />
              }
            />
          </div>

          {/* Category Performance - 1 column */}
          <ChartCard
            title="Category Performance"
            subtitle="Sales distribution by category"
            chart={
              <DonutChart
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                showLegend={true}
                centerLabel="Total"
                centerValue="100%"
                height={300}
              />
            }
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Items */}
          <ModernCard variant="glass" className="lg:col-span-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Top Items</h3>
                <p className="text-sm text-white/50">Best performing menu items</p>
              </div>
            </div>

            <div className="space-y-4">
              {topItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-white/40">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{item.revenue}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white/40">{item.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ModernCard>

          {/* AI Insights */}
          <div className="lg:col-span-2">
            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                  <p className="text-sm text-white/50">Powered by machine learning</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : aiInsights.length > 0 ? (
                <div className="space-y-4">
                  {aiInsights.slice(0, 3).map((insight) => (
                    <InfoBlock
                      key={insight.id}
                      variant={insight.type === 'warning' ? 'warning' : insight.type === 'growth' ? 'success' : 'info'}
                      title={insight.title}
                      message={insight.content}
                    />
                  ))}
                </div>
              ) : (
                <InfoBlock
                  variant="info"
                  title="No insights available"
                  message="We need more data to generate AI-powered insights for your business."
                />
              )}
            </ModernCard>
          </div>
        </div>

        {/* Achievement Banner */}
        <ModernCard variant="gradient" className="p-8" glow glowColor="primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Congratulations! You've reached a milestone!
                </h3>
                <p className="text-white/70">
                  Your revenue has grown 23% this month. Keep up the great work!
                </p>
              </div>
            </div>

            <NeoButton
              variant="glow"
              size="lg"
              icon={ArrowUpRight}
              iconPosition="right"
            >
              View Achievements
            </NeoButton>
          </div>
        </ModernCard>
      </main>
    </div>
  );
};

export default UltraModernDashboard;
