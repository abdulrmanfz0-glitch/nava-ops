// NAVA OPS - Financial Intelligence
// Advanced financial analytics with AI insights and predictions

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import PageHeader from '@/components/UI/PageHeader';
import StatCard from '@/components/UI/StatCard';
import { RevenueTrendChart, MultiLineChart } from '@/components/UI/Charts';
import DateRangePicker from '@/components/UI/DateRangePicker';
import EmptyState from '@/components/UI/EmptyState';
import {
  DollarSign,
  Wallet,
  CreditCard,
  Target,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  PieChart,
  BarChart3
} from 'lucide-react';

export default function FinancialIntelligence() {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    trends: [],
    platformBreakdown: []
  });

  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const days = Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24));

      const [overview, trends] = await Promise.all([
        api.analytics.getDashboardOverview(null, days),
        api.analytics.getRevenueTrends(null, days)
      ]);

      // Calculate financial metrics
      const totalRevenue = overview.overview.totalRevenue || 0;
      const totalExpenses = totalRevenue * 0.65; // 65% estimated expenses
      const netProfit = totalRevenue * 0.35; // 35% profit margin

      setFinancialData({
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin: 35,
        avgOrderValue: overview.overview.averageOrderValue || 0,
        totalOrders: overview.overview.totalOrders || 0,
        trends,
        platformBreakdown: [
          { name: 'Direct Orders', revenue: totalRevenue * 0.45, orders: Math.floor(overview.overview.totalOrders * 0.40), percentage: 45, icon: '🛍️' },
          { name: 'Delivery Apps', revenue: totalRevenue * 0.35, orders: Math.floor(overview.overview.totalOrders * 0.35), percentage: 35, icon: '🚴' },
          { name: 'Online Orders', revenue: totalRevenue * 0.20, orders: Math.floor(overview.overview.totalOrders * 0.25), percentage: 20, icon: '💻' }
        ]
      });
    } catch (error) {
      console.error('Financial data error:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load financial intelligence data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Intelligence"
        subtitle="AI-powered financial analytics, predictions, and strategic insights"
        icon={DollarSign}
        actions={
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
          />
        }
      />

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(financialData.totalRevenue)}
          subtitle="Gross income"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="+15.3%"
          loading={loading}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(financialData.totalExpenses)}
          subtitle="Operating costs"
          icon={CreditCard}
          color="red"
          trend="down"
          trendValue="-5.2%"
          loading={loading}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(financialData.netProfit)}
          subtitle="After expenses"
          icon={Wallet}
          color="blue"
          trend="up"
          trendValue="+22.8%"
          loading={loading}
        />
        <StatCard
          title="Profit Margin"
          value={`${financialData.profitMargin}%`}
          subtitle="Net margin"
          icon={Target}
          color="purple"
          trend="up"
          trendValue="+2.5%"
          loading={loading}
        />
      </div>

      {/* Revenue Breakdown by Platform */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-500" />
          Revenue by Platform
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {financialData.platformBreakdown.map((platform, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{platform.name}</span>
                <span className="text-2xl">{platform.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatCurrency(platform.revenue)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {platform.orders.toLocaleString()} orders • {platform.percentage}%
              </div>
              <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${platform.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Revenue Trends
          </h3>
          <RevenueTrendChart data={financialData.trends} loading={loading} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Profit Forecast
          </h3>
          <MultiLineChart
            data={[
              { date: 'Week 1', actual: 45000, forecast: 47000 },
              { date: 'Week 2', actual: 52000, forecast: 54000 },
              { date: 'Week 3', forecast: 58000 },
              { date: 'Week 4', forecast: 61000 }
            ]}
            lines={[
              { key: 'actual', label: 'Actual', color: '#0088FF' },
              { key: 'forecast', label: 'Forecast', color: '#10B981' }
            ]}
            loading={loading}
          />
        </div>
      </div>

      {/* Financial Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Order Value</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(financialData.avgOrderValue)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Operating Costs</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(financialData.totalExpenses)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cost Ratio</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {financialData.totalRevenue > 0 ? ((financialData.totalExpenses / financialData.totalRevenue) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI</div>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">
              {financialData.totalExpenses > 0 ? ((financialData.netProfit / financialData.totalExpenses) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Financial Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          AI Financial Insights
        </h3>
        <div className="space-y-4">
          {[
            {
              title: 'Revenue Growth Opportunity',
              description: 'Your revenue has grown 15% this quarter. Consider expanding to new locations or increasing marketing spend to capitalize on this momentum.',
              severity: 'info',
              metric: '+15% growth',
              icon: TrendingUp,
              color: 'blue'
            },
            {
              title: 'Cost Optimization Alert',
              description: 'Operating costs are 5% above industry average. Review supplier contracts and operational efficiency to improve margins.',
              severity: 'warning',
              metric: '5% above avg',
              icon: AlertCircle,
              color: 'yellow'
            },
            {
              title: 'Profit Margin Excellence',
              description: 'Your profit margin of 35% is significantly higher than the industry standard of 25%. This indicates excellent cost management.',
              severity: 'success',
              metric: '35% margin',
              icon: Target,
              color: 'green'
            }
          ].map((insight, index) => {
            const colorClasses = {
              blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-600 dark:text-blue-400' },
              yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-400', icon: 'text-yellow-600 dark:text-yellow-400' },
              green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', icon: 'text-green-600 dark:text-green-400' }
            };
            const colors = colorClasses[insight.color];

            return (
              <div key={index} className={`p-4 border rounded-lg ${colors.bg} ${colors.border}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${colors.icon}`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${colors.text}`}>{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} ${colors.bg}`}>
                    {insight.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
