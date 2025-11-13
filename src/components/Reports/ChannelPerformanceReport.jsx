// NAVA OPS - Channel Performance Report
// Analysis across dine-in, takeout, delivery channels

import React from 'react';
import { Store, Package, Truck, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ChannelPerformanceReport({ reportData }) {
  // Sample channel data
  const channelData = [
    {
      channel: 'Dine-In',
      icon: Store,
      revenue: 125000,
      orders: 2450,
      avgOrderValue: 51.02,
      growth: 12.5,
      customerSatisfaction: 4.6,
      peakHours: '7PM - 9PM',
      color: '#0088FF'
    },
    {
      channel: 'Takeout',
      icon: Package,
      revenue: 89000,
      orders: 1820,
      avgOrderValue: 48.90,
      growth: 8.3,
      customerSatisfaction: 4.4,
      peakHours: '6PM - 8PM',
      color: '#10B981'
    },
    {
      channel: 'Delivery',
      icon: Truck,
      revenue: 156000,
      orders: 3120,
      avgOrderValue: 50.00,
      growth: 22.7,
      customerSatisfaction: 4.2,
      peakHours: '12PM - 2PM, 7PM - 9PM',
      color: '#F59E0B'
    }
  ];

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
          <InsightCard
            title="Delivery is Your Growth Engine"
            description="Delivery channel shows 22.7% growth and generates 42% of total revenue. Continue investing in delivery partnerships and optimization."
            severity="success"
          />
          <InsightCard
            title="Optimize Dine-In Experience"
            description="Dine-in has the highest customer satisfaction (4.6/5) but slower growth. Focus on increasing table turnover during peak hours (7-9 PM)."
            severity="info"
          />
          <InsightCard
            title="Boost Takeout Marketing"
            description="Takeout has the lowest growth rate (8.3%). Consider promotions, loyalty programs, and faster pickup options to increase orders."
            severity="warning"
          />
          <InsightCard
            title="Balance Peak Hours Staffing"
            description="Delivery has two peak periods daily. Ensure adequate staff during 12-2 PM lunch rush and 7-9 PM dinner rush."
            severity="info"
          />
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel, totalRevenue }) {
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
}

function ChannelRow({ channel }) {
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
}

function KPIRow({ label, value, icon: Icon, color }) {
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
}

function InsightCard({ title, description, severity }) {
  const severityColors = {
    success: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[severity]}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}
