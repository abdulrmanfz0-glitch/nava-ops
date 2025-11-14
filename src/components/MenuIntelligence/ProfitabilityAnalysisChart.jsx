// Profitability Analysis Chart
// Shows distribution and trends of profitability and popularity metrics

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

export default function ProfitabilityAnalysisChart({ menuItems = [] }) {
  // Sort items by revenue for better visualization
  const sortedItems = [...menuItems].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const chartData = sortedItems.map(item => ({
    name: item.name,
    image: item.image,
    profitability: (item.profitability * 100).toFixed(1),
    popularity: (item.popularity * 100).toFixed(1),
    revenue: item.revenue,
    orders: item.orders,
    margin: (item.margin * 100).toFixed(1),
    classification: item.classification
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">{data.image} {data.name}</div>
          <div className="text-gray-600 dark:text-gray-400 space-y-1">
            <div><span className="font-medium">Revenue:</span> SAR {data.revenue.toLocaleString()}</div>
            <div><span className="font-medium">Orders:</span> {data.orders.toLocaleString()}</div>
            <div><span className="font-medium">Margin:</span> {data.margin}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Profitability vs Popularity Analysis
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Top 10 items by revenue showing profitability and popularity metrics
      </p>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 60, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* Profitability Bars */}
            <Bar yAxisId="left" dataKey="profitability" fill="#3b82f6" name="Profitability %" radius={[8, 8, 0, 0]} />

            {/* Popularity Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="popularity"
              stroke="#ec4899"
              strokeWidth={2}
              name="Popularity %"
              dot={{ fill: '#ec4899', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highest Profitability */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-3 text-sm">
            Highest Profitability
          </h4>
          {menuItems.length > 0 && (() => {
            const highest = menuItems.reduce((max, item) =>
              item.profitability > max.profitability ? item : max
            );
            return (
              <div className="space-y-1 text-sm">
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {highest.image} {highest.name}
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  Margin: {(highest.margin * 100).toFixed(0)}%
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xs">
                  SAR {highest.revenue.toLocaleString()}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Highest Popularity */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
          <h4 className="font-semibold text-pink-900 dark:text-pink-400 mb-3 text-sm">
            Highest Popularity
          </h4>
          {menuItems.length > 0 && (() => {
            const highest = menuItems.reduce((max, item) =>
              item.popularity > max.popularity ? item : max
            );
            return (
              <div className="space-y-1 text-sm">
                <div className="text-lg font-bold text-pink-700 dark:text-pink-300">
                  {highest.image} {highest.name}
                </div>
                <div className="text-pink-600 dark:text-pink-400">
                  Orders: {highest.orders.toLocaleString()}
                </div>
                <div className="text-pink-600 dark:text-pink-400 text-xs">
                  SAR {highest.revenue.toLocaleString()}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Highest Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-900 dark:text-green-400 mb-3 text-sm">
            Highest Revenue
          </h4>
          {menuItems.length > 0 && (() => {
            const highest = menuItems.reduce((max, item) =>
              item.revenue > max.revenue ? item : max
            );
            return (
              <div className="space-y-1 text-sm">
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {highest.image} {highest.name}
                </div>
                <div className="text-green-600 dark:text-green-400">
                  Revenue: SAR {highest.revenue.toLocaleString()}
                </div>
                <div className="text-green-600 dark:text-green-400 text-xs">
                  {highest.orders.toLocaleString()} orders
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Category Breakdown */}
      {menuItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(
              menuItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = {
                    count: 0,
                    totalRevenue: 0,
                    avgProfitability: 0,
                    avgPopularity: 0
                  };
                }
                acc[item.category].count++;
                acc[item.category].totalRevenue += item.revenue;
                acc[item.category].avgProfitability += item.profitability;
                acc[item.category].avgPopularity += item.popularity;
                return acc;
              }, {})
            ).map(([category, stats]) => (
              <div key={category} className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">{category}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Items</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{stats.count}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Revenue</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      SAR {stats.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Avg Profitability</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {((stats.avgProfitability / stats.count) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Avg Popularity</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {((stats.avgPopularity / stats.count) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
