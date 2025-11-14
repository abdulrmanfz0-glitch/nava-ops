// NAVA OPS - Net Profit Tracking Component
// Profit metrics, margin analysis, and profit forecasting

import React from 'react';
import { MultiLineChart } from '@/components/UI/Charts';
import StatCard from '@/components/UI/StatCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function NetProfitTracking({ data }) {
  const { total, margin, comparison, forecast } = data;

  if (!total) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No profit data available</p>
      </div>
    );
  }

  const previousProfit = comparison[1]?.value || 0;
  const profitGrowth = previousProfit > 0 ? ((total - previousProfit) / previousProfit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Profit Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-blue-600" />
          Net Profit Tracking
        </h2>
      </div>

      {/* Profit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Net Profit"
          value={`SAR ${Math.round(total).toLocaleString()}`}
          subtitle="After all expenses"
          icon={Wallet}
          color="blue"
          trend="up"
          trendValue={`+${profitGrowth.toFixed(1)}%`}
        />
        <StatCard
          title="Profit Margin"
          value={`${margin.toFixed(2)}%`}
          subtitle="Of total revenue"
          icon={TrendingUp}
          color="green"
          trend="up"
          trendValue="+2.5%"
        />
        <StatCard
          title="Daily Profit"
          value={`SAR ${Math.round(total / 30).toLocaleString()}`}
          subtitle="Average per day"
          icon={Wallet}
          color="purple"
          trend="up"
          trendValue="+8.7%"
        />
      </div>

      {/* Profit Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Period Comparison
          </h3>
          <div className="space-y-4">
            {comparison.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.period}</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    SAR {Math.round(item.value).toLocaleString()}
                  </p>
                  {index === 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      ↑ {profitGrowth.toFixed(1)}% vs Previous
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Margin Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Margin Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gross Profit Margin
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Operating Profit Margin
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{margin.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: `${margin}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  EBITDA Margin
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{(margin + 5).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: `${margin + 5}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Forecast */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profit Forecast
        </h3>
        <MultiLineChart
          data={forecast}
          lines={[
            { key: 'actual', label: 'Actual Profit', color: '#0088FF' },
            { key: 'forecast', label: 'Forecasted Profit', color: '#10B981' }
          ]}
          loading={false}
        />
      </div>

      {/* Profit Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Profit Drivers
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Revenue growth outpacing expense increase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Operational efficiency improvements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Reduced cost of goods sold</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span className="text-gray-700 dark:text-gray-300">Labor cost optimization potential</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span className="text-gray-700 dark:text-gray-300">Reduce operational waste</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span className="text-gray-700 dark:text-gray-300">Negotiate better supplier terms</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
