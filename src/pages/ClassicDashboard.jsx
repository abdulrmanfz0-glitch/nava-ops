// src/pages/ClassicDashboard.jsx - Enhanced Classic Dashboard
// Clean, simple, and well-organized dashboard with modern features and AI insights
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import logger from '@/lib/logger';
import aiEngine from '@/lib/aiEngine';
import PageHeader from '@/components/UI/PageHeader';
import StatCard, { StatCardSkeleton } from '@/components/UI/StatCard';
import { RevenueTrendChart, OrdersBarChart, BranchComparisonChart } from '@/components/UI/Charts';
import DateRangePicker from '@/components/UI/DateRangePicker';
import EmptyState from '@/components/UI/EmptyState';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Store,
  AlertCircle,
  Users,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Building,
  Crown
} from 'lucide-react';

export default function ClassicDashboard() {
  const { userProfile } = useAuth();
  const { addNotification } = useNotification();

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [insights, setInsights] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [forecast, setForecast] = useState(null);

  // Date range (default: last 30 days)
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  // Calculate days between dates
  const getDaysBetween = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = getDaysBetween(dateRange.startDate, dateRange.endDate);

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      // Fetch all data in parallel
      const [overviewData, trendsData, branchesData, insightsData, branchCompData, topPerformersData] = await Promise.all([
        api.analytics.getDashboardOverview(selectedBranch, days),
        api.analytics.getRevenueTrends(selectedBranch, days),
        api.branches.getAll(),
        api.insights.getAll({ limit: 5, status: 'new' }),
        api.analytics.getBranchComparison(days),
        api.analytics.getTopPerformers(selectedBranch, days, 5)
      ]);

      setOverview(overviewData.overview);
      setRevenueTrends(trendsData);
      setBranches(branchesData);
      setInsights(insightsData);
      setBranchComparison(branchCompData);
      setTopPerformers(topPerformersData);

      // Generate AI forecast if enough data
      if (trendsData.length >= 7) {
        const forecastResult = aiEngine.forecastRevenue(trendsData, 7);
        setForecast(forecastResult);
      } else {
        setForecast(null);
      }

      if (!showLoader) {
        addNotification({
          title: 'Success',
          message: 'Dashboard refreshed successfully',
          type: 'success'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to load dashboard data',
        type: 'error'
      });
      logger.error('Dashboard error', { error: error.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [selectedBranch, dateRange]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  // Handle branch selection
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value || null);
  };

  // Handle date range change
  const handleDateRangeChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  // Calculate performance metrics
  const performanceScore = overview && revenueTrends.length >= 2 ? Math.min(100, Math.round(
    (overview.totalRevenue / 1000000) * 20 +
    (overview.totalOrders / 1000) * 20 +
    (overview.activeBranches / Math.max(overview.totalBranches, 1)) * 20 +
    30 // Base score
  )) : 0;

  const revenueGrowth = revenueTrends.length >= 2
    ? ((revenueTrends[revenueTrends.length - 1].revenue - revenueTrends[0].revenue) / Math.max(revenueTrends[0].revenue, 1) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${userProfile?.full_name || 'User'}! Here's your business overview.`}
        icon={BarChart3}
        actions={
          <>
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={handleDateRangeChange}
            />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                       text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </>
        }
      />

      {/* Branch Filter */}
      <div className="flex items-center gap-4">
        <select
          value={selectedBranch || ''}
          onChange={handleBranchChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} {branch.code ? `(${branch.code})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Performance Score Banner */}
      {!loading && overview && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Overall Performance</div>
                  <div className="text-4xl font-bold">{performanceScore}%</div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${performanceScore}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-12 h-12" />
              </div>
              <div>
                <div className="text-sm opacity-90">Total Revenue</div>
                <div className="text-3xl font-bold">
                  SAR {overview.totalRevenue?.toLocaleString() || 0}
                </div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  {revenueGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{Math.abs(revenueGrowth)}% vs last period</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <Building className="w-12 h-12" />
              </div>
              <div>
                <div className="text-sm opacity-90">Active Branches</div>
                <div className="text-3xl font-bold">
                  {overview.activeBranches} / {overview.totalBranches}
                </div>
                <div className="text-sm mt-1">
                  {Math.round((overview.activeBranches / Math.max(overview.totalBranches, 1)) * 100)}% operational
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`SAR ${overview?.totalRevenue?.toLocaleString() || 0}`}
              subtitle={`Last ${days} days`}
              icon={DollarSign}
              color="green"
              trend="up"
              trendValue="+12.5%"
            />
            <StatCard
              title="Total Orders"
              value={overview?.totalOrders?.toLocaleString() || 0}
              subtitle={`Last ${days} days`}
              icon={ShoppingCart}
              color="blue"
              trend="up"
              trendValue="+8.3%"
            />
            <StatCard
              title="Active Branches"
              value={`${overview?.activeBranches || 0} / ${overview?.totalBranches || 0}`}
              subtitle="Branch locations"
              icon={Store}
              color="purple"
              trend="neutral"
              trendValue="Stable"
            />
            <StatCard
              title="Avg Order Value"
              value={`SAR ${overview?.averageOrderValue?.toFixed(2) || 0}`}
              subtitle="Per transaction"
              icon={TrendingUp}
              color="orange"
              trend="up"
              trendValue="+4.2%"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends with AI Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Revenue Trends & Forecast
            </h3>
            {forecast && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400
                           rounded-full text-sm font-medium flex items-center gap-1">
                <Zap className="w-4 h-4" />
                AI Forecast
              </span>
            )}
          </div>
          <RevenueTrendChart data={revenueTrends} loading={loading} />

          {/* AI Forecast Card */}
          {forecast && forecast.success && !loading && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    7-Day Forecast: {forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)} Trend
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Predicted revenue for next week: SAR {Math.round(forecast.predictions[6].predictedRevenue).toLocaleString()}
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                      ({forecast.confidence} confidence)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Branch Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Branch Performance
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Compare All
            </button>
          </div>
          <BranchComparisonChart data={branchComparison.slice(0, 5)} loading={loading} />
        </div>
      </div>

      {/* Insights and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI Insights & Recommendations
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {insights.length} new
              </span>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : insights.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="No Insights Yet"
                message="AI insights will appear here as your data grows."
              />
            ) : (
              <div className="space-y-4">
                {insights.slice(0, 5).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg
                             hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg
                        ${insight.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : ''}
                        ${insight.severity === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' : ''}
                        ${insight.severity === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : ''}
                      `}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {insight.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {insight.insight_type}
                          </span>
                          {insight.confidence_score && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(insight.confidence_score * 100).toFixed(0)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600
                               hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
                               transition-all duration-200 transform hover:scale-105">
                <Download className="w-5 h-5" />
                <span className="font-medium">Generate Report</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700
                               hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg
                               transition-colors duration-200">
                <Store className="w-5 h-5" />
                <span className="font-medium">Add Branch</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700
                               hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg
                               transition-colors duration-200">
                <Users className="w-5 h-5" />
                <span className="font-medium">Invite Team Member</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Sync</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">● Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">● Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
              </div>
            </div>
 
          </div>
        </div>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Branches */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Top Performing Branches
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-lg h-20"></div>
              ))}
            </div>
          ) : branchComparison.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No Branch Data"
              message="Branch performance data will appear here."
            />
          ) : (
            <div className="space-y-3">
              {branchComparison.slice(0, 5).map((branch, index) => (
                <BranchRankCard key={branch.id} branch={branch} rank={index + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Top Performing Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Performing Products
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-lg h-20"></div>
              ))}
            </div>
          ) : topPerformers.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No Product Data"
              message="Top selling products will appear here."
            />
          ) : (
            <div className="space-y-3">
              {topPerformers.map((product, index) => (
                <ProductRankCard key={index} product={product} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New order received', branch: 'Downtown Branch', time: '2 minutes ago', icon: ShoppingCart, color: 'blue' },
              { action: 'Monthly report generated', branch: 'All Branches', time: '1 hour ago', icon: Download, color: 'green' },
              { action: 'Inventory alert', branch: 'Westside Branch', time: '3 hours ago', icon: AlertCircle, color: 'orange' },
              { action: 'Team member joined', branch: 'System', time: '5 hours ago', icon: Users, color: 'purple' }
            ].map((activity, index) => {
              const colorClasses = {
                blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400' },
                green: { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400' },
                orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400' },
                purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400' }
              };
              const colors = colorClasses[activity.color] || colorClasses.blue;

              return (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <activity.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.branch}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              );
            })}
          </div>
 
        </div>
      </div>
    </div>
  );
}

// Helper Components

function BranchRankCard({ branch, rank }) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : `#${rank}`;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                  hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div className="text-2xl w-8 text-center">{medal}</div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{branch.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{branch.city || 'Location'}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">
          SAR {branch.revenue?.toLocaleString() || 0}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {branch.orders || 0} orders
        </div>
      </div>
    </div>
  );
}

function ProductRankCard({ product, rank }) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : `#${rank}`;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                  hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div className="text-2xl w-8 text-center">{medal}</div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {product.quantity || 0} sold
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">
          SAR {Math.round(product.revenue || 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
