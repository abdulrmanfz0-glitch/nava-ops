/**
 * NAVA OPS - Channel Performance Report
 * Analysis across dine-in, takeout, delivery channels
 * Includes real data binding, commission impact, and profitability analysis
 */

import React, { useState, useEffect } from 'react';
import { Store, Package, Truck, TrendingUp, Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '@/services/api';
import { CHANNELS, COMMISSION_STRUCTURE, getChannelName, getChannelColor } from '@/services/channelPerformanceService';
import { logger } from '@/lib/logger';

export default function ChannelPerformanceReport({ branchId = null, startDate = null, endDate = null }) {
  const [channelMetrics, setChannelMetrics] = useState([]);
  const [trends, setTrends] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profitability, setProfitability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30days');

  useEffect(() => {
    fetchChannelData();
  }, [branchId, startDate, endDate, period]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = { branchId };

      // Set date range based on period
      const now = new Date();
      let start = startDate;
      let end = endDate;

      if (!start || !end) {
        end = now.toISOString().split('T')[0];
        start = new Date(now.getTime() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }

      filters.startDate = start;
      filters.endDate = end;

      logger.debug('[ChannelPerformanceReport] Fetching data with filters:', filters);

      // Fetch all required data in parallel
      const [metrics, trendsData, comparisonData, recsData, profitData] = await Promise.all([
        api.channelPerformance.getChannelMetrics(filters),
        api.channelPerformance.getChannelTrends({ ...filters, days: parseInt(period) }),
        api.channelPerformance.compareChannels(filters),
        api.channelPerformance.getChannelRecommendations(filters),
        api.channelPerformance.getProfitabilityAnalysis(filters)
      ]);

      setChannelMetrics(metrics || []);
      setTrends(trendsData || []);
      setComparison(comparisonData || {});
      setRecommendations(recsData || []);
      setProfitability(profitData || {});
    } catch (err) {
      logger.error('[ChannelPerformanceReport] Error fetching data:', err);
      setError(err.message || 'Failed to load channel performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading channel performance data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400">
        <h3 className="font-semibold mb-2">Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  const totalRevenue = channelMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = channelMetrics.reduce((sum, m) => sum + m.orders, 0);
  const totalCommission = channelMetrics.reduce((sum, m) => sum + m.commission, 0);
  const totalProfit = channelMetrics.reduce((sum, m) => sum + m.profit, 0);

  // Prepare chart data
  const chartData = channelMetrics.map(m => ({
    name: getChannelName(m.channel),
    revenue: m.revenue,
    orders: m.orders,
    profit: m.profit,
    commission: m.commission
  }));

  const pieData = channelMetrics.map(m => ({
    name: getChannelName(m.channel),
    value: m.revenue
  }));

  const COLORS = ['#0088FF', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setPeriod('7')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${period === '7' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
        >
          7 Days
        </button>
        <button
          onClick={() => setPeriod('30')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${period === '30' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
        >
          30 Days
        </button>
        <button
          onClick={() => setPeriod('90')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${period === '90' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
        >
          90 Days
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channelMetrics.map((channel) => (
          <ChannelCard key={channel.channel} channel={channel} totalRevenue={totalRevenue} />
        ))}
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`SAR ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={Package}
          color="blue"
        />
        <MetricCard
          label="Total Commission"
          value={`SAR ${totalCommission.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={AlertTriangle}
          color="orange"
        />
        <MetricCard
          label="Net Profit"
          value={`SAR ${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Revenue & Orders Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Channel Revenue & Orders Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
              formatter={(value) => value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#0088FF" name="Revenue (SAR)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="orders" fill="#10B981" name="Orders" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Distribution & Profitability Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Revenue Distribution by Channel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
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
                formatter={(value) => `SAR ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Commission Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Commission Impact & Net Profit
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
                formatter={(value) => `SAR ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              />
              <Legend />
              <Bar dataKey="commission" fill="#F59E0B" name="Commission (SAR)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10B981" name="Net Profit (SAR)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profitability Analysis Table */}
      {profitability && Object.keys(profitability).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detailed Profitability Analysis
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gross Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Commission Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Avg Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(profitability).map(([channelId, data]) => (
                  <tr key={channelId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${getChannelColor(channelId)}20` }}>
                          {channelId === 'dine_in' && <Store className="w-5 h-5" style={{ color: getChannelColor(channelId) }} />}
                          {channelId === 'takeout' && <Package className="w-5 h-5" style={{ color: getChannelColor(channelId) }} />}
                          {channelId === 'delivery' && <Truck className="w-5 h-5" style={{ color: getChannelColor(channelId) }} />}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{getChannelName(channelId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      SAR {data.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {data.commissionRate}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      SAR {data.commission.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      SAR {data.netRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.profitMargin >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {data.profitMargin.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      SAR {data.avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      {trends.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Channel Revenue Trends
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              />
              <Legend />
              {Object.keys(trends[0] || {})
                .filter(k => k !== 'date')
                .map((channel, idx) => (
                  <Area
                    key={channel}
                    type="monotone"
                    dataKey={channel}
                    stackId="1"
                    stroke={COLORS[idx]}
                    fill={COLORS[idx]}
                    name={getChannelName(channel)}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">AOV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Peak Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {channelMetrics.map((channel) => (
                <ChannelRow key={channel.channel} channel={channel} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Channel Insights & Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChannelCard({ channel, totalRevenue }) {
  const percentage = totalRevenue > 0 ? ((channel.revenue / totalRevenue) * 100).toFixed(1) : 0;
  const icon = channel.channel === 'dine_in' ? Store : channel.channel === 'takeout' ? Package : Truck;
  const Icon = icon;
  const color = getChannelColor(channel.channel);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Growth</div>
          <div className={`text-lg font-bold ${channel.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {channel.growth >= 0 ? '+' : ''}{channel.growth.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {getChannelName(channel.channel)}
        </h3>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          SAR {channel.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
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
          <span className="font-medium text-gray-900 dark:text-white">SAR {channel.avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
          <span className={`font-medium ${channel.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {channel.profitMargin.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
          <span className="font-medium text-gray-900 dark:text-white">⭐ {channel.customerSatisfaction.toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colors = {
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <Icon className={`w-5 h-5 ${colors[color]}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function ChannelRow({ channel }) {
  const icon = channel.channel === 'dine_in' ? Store : channel.channel === 'takeout' ? Package : Truck;
  const Icon = icon;
  const color = getChannelColor(channel.channel);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{getChannelName(channel.channel)}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {channel.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {channel.orders.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {channel.avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {channel.commission.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${channel.profitMargin >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
          {channel.profitMargin.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        ⭐ {channel.customerSatisfaction.toFixed(1)}/5
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
        {channel.peakHours}
      </td>
    </tr>
  );
}

function RecommendationCard({ recommendation }) {
  const severityColors = {
    success: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    error: 'border-red-500 bg-red-50 dark:bg-red-900/10'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[recommendation.severity]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{recommendation.title}</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300">
          {recommendation.action}
        </span>
      </div>
    </div>
  );
}
