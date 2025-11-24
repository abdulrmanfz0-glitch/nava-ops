// NAVA OPS - Smart Features Dashboard
// Comprehensive AI-powered analytics and insights dashboard

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Download,
  RefreshCw,
  Eye,
  Sparkles,
  BarChart3,
  Activity,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

import PageHeader from '../components/UI/PageHeader';
import StatCard from '../components/UI/StatCard';
import { GaugeChart, Sparkline, SimpleLineChart, DonutChart, ProgressBar } from '../components/UI/AdvancedCharts';
import { formatCurrency, formatPercentage, formatNumber, formatDateTime } from '../utils/formatters';

// Phase 1 Libraries
import { generateAIInsights, INSIGHT_TYPES, IMPACT_LEVELS } from '../lib/aiInsightsGenerator';
import { calculatePerformanceScore, getGrade, getGradeColor } from '../lib/performanceScoring';
import { generatePredictions } from '../lib/predictiveAnalytics';
// import { generateRealtimeMetrics } from '../lib/realTimeSimulator';
// import { calculatePlatformPerformance } from '../lib/platformAnalytics';
// import { exportToExcel, exportToPDF, exportToJSON } from '../lib/exportEngine';
import { logger } from '../lib/logger';

/**
 * Smart Features Dashboard Page
 *
 * Features:
 * - AI Insights cards grid
 * - Performance Score widget with gauge chart
 * - Predictive Analytics panel
 * - Real-time metrics feed
 * - Platform performance comparison
 * - Quick actions toolbar
 * - Export functionality
 */
export default function SmartFeatures() {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [performanceScore, setPerformanceScore] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState([]);
  const [platformPerformance, setPlatformPerformance] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // Mock restaurant data (in production, this would come from API/Supabase)
      const mockRestaurantData = {
        revenue: 125000,
        expenses: 75000,
        orders: 1250,
        avgOrderValue: 100,
        revenueGrowth: 15.5,
        profitMargin: 18.2,
        orderGrowth: 12.3,
        customerSatisfaction: 4.5,
        operationalEfficiency: 85
      };

      const mockPerformanceData = {
        revenueGrowth: 15.5,
        profitMargin: 18.2,
        avgOrderValue: 100,
        orderGrowth: 12.3,
        platformGrowth: {
          talabat: 20,
          hungerstation: 15,
          jahez: 18
        }
      };

      // Generate AI Insights
      const aiInsights = generateAIInsights(mockRestaurantData, mockPerformanceData);
      setInsights(aiInsights);

      // Calculate Performance Score
      const score = calculatePerformanceScore({
        revenueGrowth: mockPerformanceData.revenueGrowth,
        profitMargin: mockPerformanceData.profitMargin,
        orderGrowth: mockPerformanceData.orderGrowth,
        customerSatisfaction: mockRestaurantData.customerSatisfaction,
        operationalEfficiency: mockRestaurantData.operationalEfficiency
      });
      setPerformanceScore(score);

      // Generate Predictions
      const prediction = generatePredictions(mockRestaurantData, { minDataPoints: 3 });
      setPredictions(prediction);

      // Generate Real-time Metrics
      // const metrics = generateRealtimeMetrics();
      // setRealtimeMetrics(metrics);
      setRealtimeMetrics(null);

      // Calculate Platform Performance
      // const platformPerf = calculatePlatformPerformance({
      //   talabat: { revenue: 45000, orders: 450, avgOrderValue: 100 },
      //   hungerstation: { revenue: 40000, orders: 400, avgOrderValue: 100 },
      //   jahez: { revenue: 40000, orders: 400, avgOrderValue: 100 }
      // });
      // setPlatformPerformance(platformPerf);
      setPlatformPerformance(null);

      setLastUpdated(new Date());
      logger.info('Smart Features dashboard data loaded successfully');

    } catch (error) {
      logger.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize and setup auto-refresh
   */
  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  /**
   * Manual refresh
   */
  const handleRefresh = () => {
    fetchDashboardData();
  };

  /**
   * Export dashboard data
   */
  const handleExport = async (format) => {
    try {
      const data = {
        insights,
        performanceScore,
        predictions,
        realtimeMetrics,
        platformPerformance,
        exportedAt: new Date().toISOString()
      };

      let result;
      if (format === 'excel') {
        result = await exportToExcel(data, 'smart-features-dashboard');
      } else if (format === 'pdf') {
        result = await exportToPDF(data, 'Smart Features Dashboard Report');
      } else if (format === 'json') {
        result = exportToJSON(data, 'smart-features-dashboard');
      }

      if (result.success) {
        logger.info(`Dashboard exported to ${format} successfully`);
      }
    } catch (error) {
      logger.error('Export failed', error);
    }
  };

  /**
   * Get insight icon
   */
  const getInsightIcon = (type) => {
    const iconMap = {
      [INSIGHT_TYPES.SUCCESS]: CheckCircle,
      [INSIGHT_TYPES.WARNING]: AlertCircle,
      [INSIGHT_TYPES.INFO]: Brain,
      [INSIGHT_TYPES.ERROR]: AlertCircle,
      [INSIGHT_TYPES.CRITICAL]: AlertCircle
    };
    return iconMap[type] || Brain;
  };

  /**
   * Get insight color
   */
  const getInsightColor = (type) => {
    const colorMap = {
      [INSIGHT_TYPES.SUCCESS]: 'green',
      [INSIGHT_TYPES.WARNING]: 'orange',
      [INSIGHT_TYPES.INFO]: 'blue',
      [INSIGHT_TYPES.ERROR]: 'red',
      [INSIGHT_TYPES.CRITICAL]: 'red'
    };
    return colorMap[type] || 'blue';
  };

  /**
   * Get impact badge
   */
  const getImpactBadge = (impact) => {
    const styles = {
      [IMPACT_LEVELS.CRITICAL]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      [IMPACT_LEVELS.HIGH]: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      [IMPACT_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      [IMPACT_LEVELS.LOW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    };
    return styles[impact] || styles[IMPACT_LEVELS.LOW];
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Smart Features Dashboard"
        subtitle="AI-powered analytics, insights, and predictive intelligence"
        icon={Sparkles}
        actions={
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <p className="text-xs text-gray-500 dark:text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateTime(lastUpdated)}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="btn-outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>

            <div className="relative group">
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  Export to Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export to PDF
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  Export to JSON
                </button>
              </div>
            </div>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Performance Score"
          value={performanceScore?.score ? `${Math.round(performanceScore.score)}/100` : 'N/A'}
          subtitle={performanceScore ? `Grade: ${performanceScore.grade}` : ''}
          icon={Award}
          color={performanceScore ? getGradeColor(performanceScore.grade) : 'blue'}
          trend={performanceScore?.score >= 80 ? 'up' : performanceScore?.score >= 60 ? 'flat' : 'down'}
        />

        <StatCard
          title="AI Insights"
          value={insights.length}
          subtitle={`${insights.filter(i => i.impact === IMPACT_LEVELS.CRITICAL).length} critical`}
          icon={Brain}
          color="purple"
        />

        <StatCard
          title="Predictions"
          value={predictions ? formatCurrency(predictions.predicted.revenue) : 'N/A'}
          subtitle="Next week forecast"
          icon={TrendingUp}
          color="blue"
          trend={predictions?.predicted.revenue > predictions?.current.revenue ? 'up' : 'down'}
          trendValue={predictions ? formatPercentage(predictions.confidence) : ''}
        />

        <StatCard
          title="Real-time Updates"
          value={realtimeMetrics.length}
          subtitle="Active metrics"
          icon={Activity}
          color="green"
        />
      </div>

      {/* Performance Score Widget */}
      {performanceScore && (
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Performance Score Breakdown
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overall business health score based on 5 key dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gauge Chart */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs">
                <GaugeChart
                  value={performanceScore.score}
                  max={100}
                  label={`Grade ${performanceScore.grade}`}
                  size={200}
                />
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { label: 'Revenue Growth', value: performanceScore.breakdown.revenueGrowth, max: 30 },
                { label: 'Profit Margin', value: performanceScore.breakdown.profitMargin, max: 25 },
                { label: 'Order Volume', value: performanceScore.breakdown.orderVolume, max: 20 },
                { label: 'Customer Satisfaction', value: performanceScore.breakdown.customerSatisfaction, max: 15 },
                { label: 'Operational Efficiency', value: performanceScore.breakdown.operationalEfficiency, max: 10 }
              ].map((item, index) => (
                <div key={index}>
                  <ProgressBar
                    value={item.value}
                    max={item.max}
                    label={item.label}
                    showLabel={true}
                    height={12}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Grid */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI-Powered Insights
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Actionable recommendations based on data analysis
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-500">Filter:</span>
            <select className="input-field py-1 text-sm">
              <option value="all">All Insights</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Impact</option>
              <option value="success">Positive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 6).map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);

            return (
              <div
                key={index}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  hover:shadow-md cursor-pointer
                  ${color === 'green' ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : ''}
                  ${color === 'orange' ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10' : ''}
                  ${color === 'red' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''}
                  ${color === 'blue' ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${color === 'green' ? 'bg-green-100 dark:bg-green-900/30' : color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' : color === 'red' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    <Icon className={`w-5 h-5 ${color === 'green' ? 'text-green-600' : color === 'orange' ? 'text-orange-600' : color === 'red' ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {insight.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImpactBadge(insight.impact)}`}>
                        {insight.impact}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {insight.message}
                    </p>

                    {insight.action && (
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictive Analytics */}
      {predictions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predictions */}
          <div className="card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Predictive Analytics
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next week forecast with {formatPercentage(predictions.confidence)} confidence
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Revenue', current: predictions.current.revenue, predicted: predictions.predicted.revenue },
                { label: 'Orders', current: predictions.current.orders, predicted: predictions.predicted.orders },
                { label: 'Avg Order Value', current: predictions.current.avgOrderValue, predicted: predictions.predicted.avgOrderValue }
              ].map((item, index) => {
                const change = ((item.predicted - item.current) / item.current) * 100;
                const isPositive = change > 0;

                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {item.label}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.label === 'Revenue' || item.label === 'Avg Order Value'
                          ? formatCurrency(item.predicted)
                          : formatNumber(item.predicted)
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
                        {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span className="font-semibold">
                          {formatPercentage(Math.abs(change))}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        vs current
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Performance */}
          {platformPerformance && (
            <div className="card p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Platform Performance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue distribution across delivery platforms
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(platformPerformance.platforms).map(([platform, data], index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {platform}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>

                    <ProgressBar
                      value={data.revenue}
                      max={platformPerformance.summary.totalRevenue}
                      height={8}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Best Platform
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {platformPerformance.summary.bestPerformer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(platformPerformance.summary.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time Metrics Feed */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Real-time Metrics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Live performance indicators
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Activity className="w-4 h-4 animate-pulse text-success-600" />
            <span>Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {realtimeMetrics.slice(0, 6).map((metric, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.label}
                </span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                {metric.trend && (
                  <span className={`text-sm font-medium ${metric.trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                )}
              </div>

              {metric.sparkline && (
                <div className="h-8">
                  <Sparkline data={metric.sparkline} height={32} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="btn-outline flex items-center justify-center gap-2 py-4">
            <Eye className="w-5 h-5" />
            <span>View Full Report</span>
          </button>

          <button className="btn-outline flex items-center justify-center gap-2 py-4">
            <Target className="w-5 h-5" />
            <span>Set Goals</span>
          </button>

          <button className="btn-outline flex items-center justify-center gap-2 py-4">
            <Zap className="w-5 h-5" />
            <span>Run Simulation</span>
          </button>

          <button className="btn-outline flex items-center justify-center gap-2 py-4">
            <BarChart3 className="w-5 h-5" />
            <span>Compare Periods</span>
          </button>
        </div>
      </div>
    </div>
  );
}
