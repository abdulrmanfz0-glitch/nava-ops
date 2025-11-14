// NAVA OPS - Channel Performance Report
// Analysis across dine-in, takeout, delivery channels

import React, { useMemo } from 'react';
import { Store, Package, Truck, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Channel icon mappings
const CHANNEL_ICONS = {
  'Dine-In': Store,
  'Dine in': Store,
  'Takeout': Package,
  'Take out': Package,
  'Delivery': Truck,
  'Pickup': Package,
  'Online': Truck
};

const CHANNEL_COLORS = {
  'Dine-In': '#0088FF',
  'Dine in': '#0088FF',
  'Takeout': '#10B981',
  'Take out': '#10B981',
  'Delivery': '#F59E0B',
  'Pickup': '#F59E0B',
  'Online': '#EC4899'
};

// Generate dynamic insights based on channel data
function generateChannelInsights(channelData) {
  const insights = [];

  // Find top performing channel by growth
  const topGrowthChannel = channelData.reduce((max, ch) =>
    (ch.growth > max.growth) ? ch : max, channelData[0]);

  // Find channel with highest satisfaction
  const highestSatisfaction = channelData.reduce((max, ch) =>
    (ch.customerSatisfaction > max.customerSatisfaction) ? ch : max, channelData[0]);

  // Find lowest growth channel
  const lowestGrowthChannel = channelData.reduce((min, ch) =>
    (ch.growth < min.growth) ? ch : min, channelData[0]);

  if (topGrowthChannel) {
    const revenuePercentage = ((topGrowthChannel.revenue / channelData.reduce((sum, ch) => sum + ch.revenue, 0)) * 100).toFixed(0);
    insights.push({
      title: `${topGrowthChannel.channel} is Your Growth Engine`,
      description: `${topGrowthChannel.channel} shows ${topGrowthChannel.growth}% growth and generates ${revenuePercentage}% of total revenue. Continue investing in this channel's optimization.`,
      severity: 'success'
    });
  }

  if (highestSatisfaction && highestSatisfaction.channel !== topGrowthChannel.channel) {
    insights.push({
      title: `Optimize ${highestSatisfaction.channel} Experience`,
      description: `${highestSatisfaction.channel} has the highest customer satisfaction (${highestSatisfaction.customerSatisfaction}/5) but moderate growth. Focus on increasing throughput during peak hours (${highestSatisfaction.peakHours}).`,
      severity: 'info'
    });
  }

  if (lowestGrowthChannel && lowestGrowthChannel.channel !== topGrowthChannel.channel) {
    insights.push({
      title: `Boost ${lowestGrowthChannel.channel} Performance`,
      description: `${lowestGrowthChannel.channel} has the lowest growth rate (${lowestGrowthChannel.growth}%). Consider targeted promotions, loyalty programs, and operational improvements to increase orders.`,
      severity: 'warning'
    });
  }

  // Add staffing insight if we have peak hours data
  if (topGrowthChannel && topGrowthChannel.peakHours) {
    insights.push({
      title: 'Optimize Staffing During Peak Hours',
      description: `Ensure adequate staff during ${topGrowthChannel.channel}'s peak hours (${topGrowthChannel.peakHours}) to handle order volume effectively and maintain service quality.`,
      severity: 'info'
    });
  }

  return insights;
}

function ChannelPerformanceReport({ reportData }) {
  // Use channel data from reportData if available
  let channelData = reportData?.channelData || [];

  // Enrich channel data with icons and colors if not present
  channelData = channelData.map(ch => ({
    ...ch,
    icon: CHANNEL_ICONS[ch.channel] || Store,
    color: CHANNEL_COLORS[ch.channel] || '#0088FF'
  }));

  // Handle empty data
  if (!channelData || channelData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No channel data available for this period</p>
      </div>
    );
  }

  // Memoize chart data calculations for performance
  const { totalRevenue, totalOrders, revenueChartData, pieChartData } = useMemo(() => {
    const totalRevenue = channelData.reduce((sum, ch) => sum + ch.revenue, 0);
    const totalOrders = channelData.reduce((sum, ch) => sum + ch.orders, 0);

    // Chart data
    const revenueChartData = channelData.map(ch => ({
      name: ch.channel,
      revenue: ch.revenue,
      orders: ch.orders
    }));

    const pieChartData = channelData.map(ch => ({
      name: ch.channel,
      value: ch.revenue
    }));

    return { totalRevenue, totalOrders, revenueChartData, pieChartData };
  }, [channelData]);

  const COLORS = ['#0088FF', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channelData.map((channel, index) => (
          <ChannelCard key={index} channel={channel} totalRevenue={totalRevenue} />
        ))}
      </div>

      {/* Revenue Comparison Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Channel Revenue & Orders Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#0088FF" name="Revenue (SAR)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="orders" fill="#10B981" name="Orders" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Distribution Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Revenue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Key Performance Indicators
          </h3>
          <div className="space-y-4">
            <KPIRow
              label="Total Revenue"
              value={`SAR ${totalRevenue.toLocaleString()}`}
              icon={TrendingUp}
              color="green"
            />
            <KPIRow
              label="Total Orders"
              value={totalOrders.toLocaleString()}
              icon={Package}
              color="blue"
            />
            <KPIRow
              label="Avg Order Value"
              value={`SAR ${(totalRevenue / totalOrders).toFixed(2)}`}
              icon={TrendingUp}
              color="purple"
            />
            <KPIRow
              label="Leading Channel"
              value="Delivery (+22.7%)"
              icon={Truck}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Channel Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  AOV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Growth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Peak Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {channelData.map((channel, index) => (
                <ChannelRow key={index} channel={channel} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                    rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Channel Insights & Recommendations
        </h3>
        <div className="space-y-3">
          {generateChannelInsights(channelData).map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              description={insight.description}
              severity={insight.severity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChannelPerformanceReport);

const ChannelCard = React.memo(function ChannelCard({ channel, totalRevenue }) {
  const Icon = channel.icon;
  const percentage = ((channel.revenue / totalRevenue) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${channel.color}20` }}>
          <Icon className="w-6 h-6" style={{ color: channel.color }} />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Growth</div>
          <div className="text-lg font-bold text-green-600">+{channel.growth}%</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {channel.channel}
        </h3>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          SAR {channel.revenue.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {percentage}% of total revenue
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Orders</span>
          <span className="font-medium text-gray-900 dark:text-white">{channel.orders.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">AOV</span>
          <span className="font-medium text-gray-900 dark:text-white">SAR {channel.avgOrderValue.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
          <span className="font-medium text-gray-900 dark:text-white">⭐ {channel.customerSatisfaction}/5.0</span>
        </div>
      </div>
    </div>
  );
});

const ChannelRow = React.memo(function ChannelRow({ channel }) {
  const Icon = channel.icon;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${channel.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: channel.color }} />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{channel.channel}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {channel.revenue.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {channel.orders.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {channel.avgOrderValue.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          +{channel.growth}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        ⭐ {channel.customerSatisfaction}/5.0
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
        {channel.peakHours}
      </td>
    </tr>
  );
});

const KPIRow = React.memo(function KPIRow({ label, value, icon: Icon, color }) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
});

const InsightCard = React.memo(function InsightCard({ title, description, severity }) {
  const severityColors = {
    success: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow ${severityColors[severity]}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
});
