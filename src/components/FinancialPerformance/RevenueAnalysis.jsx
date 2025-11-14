// NAVA OPS - Revenue Analysis Component
// Detailed revenue metrics, breakdown by category, and trend analysis

import React from 'react';
import { RevenueTrendChart, SimpleBarChart } from '@/components/UI/Charts';
import StatCard from '@/components/UI/StatCard';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function RevenueAnalysis({ data }) {
  const { total, byCategory, trends, growth } = data;

  if (!total) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Revenue Analysis
        </h2>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`SAR ${Math.round(total).toLocaleString()}`}
          subtitle="Gross income"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue={`+${growth}%`}
        />
        <StatCard
          title="Average Daily Revenue"
          value={`SAR ${Math.round(total / 30).toLocaleString()}`}
          subtitle="Per day estimate"
          icon={TrendingUp}
          color="blue"
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard
          title="Revenue per Channel"
          value="SAR 12,450"
          subtitle="Average channel"
          icon={DollarSign}
          color="purple"
          trend="up"
          trendValue="+5.1%"
        />
      </div>

      {/* Revenue by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue by Category
          </h3>
          <div className="space-y-4">
            {byCategory.map((category, index) => {
              const percentage = (category.value / total) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      SAR {Math.round(category.value).toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Distribution
          </h3>
          <SimpleBarChart
            data={byCategory.map(cat => ({
              name: cat.name,
              value: cat.value
            }))}
            loading={false}
          />
        </div>
      </div>

      {/* Revenue Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue Trends Over Time
        </h3>
        <RevenueTrendChart data={trends} loading={false} />
      </div>

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Growth Indicators</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Month-over-Month Growth</span>
              <span className="font-semibold text-green-600">+15.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Year-over-Year Growth</span>
              <span className="font-semibold text-green-600">+28.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Quarter Growth Rate</span>
              <span className="font-semibold text-green-600">+12.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Channel Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dine-In Performance</span>
              <span className="font-semibold text-blue-600">↑ 18.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Delivery Performance</span>
              <span className="font-semibold text-blue-600">↑ 12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Takeout Performance</span>
              <span className="font-semibold text-blue-600">↑ 8.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
