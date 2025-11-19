// src/pages/FinancialReports.jsx
import React from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

const FinancialReports = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Reports</h1>
          <p className="text-gray-400">View and analyze your financial performance</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 245,750</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Net Profit</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 98,300</p>
          <div className="flex items-center gap-1 text-blue-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>40% margin</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Expenses</span>
            <DollarSign className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 147,450</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span>60% of revenue</span>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Financial Overview</h3>
        <p className="text-gray-400">Detailed financial data will be displayed here.</p>
      </div>
    </div>
  );
};

export default FinancialReports;

// NAVA OPS - Financial Intelligence
// Advanced financial analytics with predictions and trends

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import PageHeader from '@/components/UI/PageHeader';
import StatCard from '@/components/UI/StatCard';
import { RevenueTrendChart, MultiLineChart } from '@/components/UI/Charts';
import DateRangePicker from '@/components/UI/DateRangePicker';
import { DollarSign, Wallet, CreditCard, Target, AlertCircle } from 'lucide-react';

export default function FinancialReports() {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    trends: []
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

      setFinancialData({
        totalRevenue: overview.overview.totalRevenue,
        totalExpenses: overview.overview.totalRevenue * 0.65,
        netProfit: overview.overview.totalRevenue * 0.35,
        profitMargin: 35,
        trends
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to load financial data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Intelligence"
        subtitle="Advanced financial analytics, predictions, and insights"
        icon={DollarSign}
        actions={
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`SAR ${financialData.totalRevenue.toLocaleString()}`}
          subtitle="Gross income"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="+15.3%"
          loading={loading}
        />
        <StatCard
          title="Total Expenses"
          value={`SAR ${financialData.totalExpenses.toLocaleString()}`}
          subtitle="Operating costs"
          icon={CreditCard}
          color="red"
          trend="down"
          trendValue="-5.2%"
          loading={loading}
        />
        <StatCard
          title="Net Profit"
          value={`SAR ${financialData.netProfit.toLocaleString()}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h3>
          <RevenueTrendChart data={financialData.trends} loading={loading} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profit Forecast</h3>
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          Financial Insights
        </h3>
        <div className="space-y-4">
          {[
            {
              title: 'Revenue Growth Opportunity',
              description: 'Your revenue has grown 15% this quarter. Consider expanding to new locations.',
              severity: 'info',
              metric: '+15% growth'
            },
            {
              title: 'Cost Optimization',
              description: 'Operating costs are 5% above industry average. Review supplier contracts.',
              severity: 'warning',
              metric: '5% above avg'
            }
          ].map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {insight.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
