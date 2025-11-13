// NAVA OPS - Enterprise Chart Components
// Production-ready chart components with error handling, validation, and performance optimization

import React, { memo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { AlertCircle, TrendingUp } from 'lucide-react';
import logger from '../../lib/logger';

// Color palette for charts
const CHART_COLORS = {
  primary: '#0088FF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  pink: '#EC4899',
  teal: '#14B8A6'
};

const COLOR_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
  CHART_COLORS.indigo,
  CHART_COLORS.danger,
  CHART_COLORS.pink,
  CHART_COLORS.teal
];

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Modern Custom Tooltip with refined styling
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {

// Chart validation helper
const validateChartData = (data, componentName = 'Chart') => {
  if (!data) {
    logger.warn(`${componentName}: No data provided`);
    return false;
  }
 main

  if (!Array.isArray(data)) {
    logger.warn(`${componentName}: Data is not an array`, { data });
    return false;
  }

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Modern Loading State
const ChartLoading = () => (
  <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
    <div className="text-center space-y-3">
      <div className="loading-spinner w-8 h-8 mx-auto" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading chart data...</p>

  if (data.length === 0) {
    logger.debug(`${componentName}: Empty data array`);
    return false;
  }

  return true;
};

// Loading State Component
const ChartLoading = memo(() => (
  <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-gray-500 dark:text-gray-400 text-sm">Loading chart...</div>
 main
    </div>
  </div>
));

// Empty State Component
const ChartEmpty = memo(({ message = 'No data available' }) => (
  <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </div>
  </div>
));

// Error State Component
const ChartError = memo(({ error }) => (
  <div className="w-full h-80 flex items-center justify-center bg-error-50 dark:bg-error-900/20 rounded-lg border border-error-200 dark:border-error-800">
    <div className="text-center max-w-md px-4">
      <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-3" />
      <p className="text-error-700 dark:text-error-400 font-medium mb-1">Chart Error</p>
      <p className="text-error-600 dark:text-error-500 text-sm">{error}</p>
    </div>
  </div>
));

// Chart Container with error boundary
const ChartContainer = ({ data, loading, error, children, emptyMessage }) => {
  if (loading) return <ChartLoading />;
  if (error) return <ChartError error={error} />;
  if (!validateChartData(data)) return <ChartEmpty message={emptyMessage} />;

  return children;
};

// Custom Tooltip with safe rendering
const CustomTooltip = memo(({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      {label && <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          <span className="font-semibold">
            {prefix}
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {suffix}
          </span>
        </p>
      ))}
    </div>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Orders Bar Chart with rounded corners
export function OrdersBarChart({ data, loading = false }) {
  if (loading) return <ChartLoading />;

// Orders Bar Chart - Memoized
export const OrdersBarChart = memo(({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }
 main

CustomTooltip.displayName = 'CustomTooltip';
 main

// Revenue Trend Line Chart
export const RevenueTrendChart = memo(({ data, loading = false, error = null }) => {
  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No revenue data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip prefix="$" />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.primary, r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Modern Area Chart with gradient fills
export function TrendAreaChart({ data, dataKeys = [], colors = [], loading = false }) {
  if (loading) return <ChartLoading />;

// Area Chart for Trends - Memoized
export const TrendAreaChart = memo(({ data, dataKeys = [], colors = [], loading = false }) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }
 main

RevenueTrendChart.displayName = 'RevenueTrendChart';
 main

// Orders Bar Chart
export const OrdersBarChart = memo(({ data, loading = false, error = null }) => {
  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No order data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="orders"
            fill={CHART_COLORS.success}
            radius={[8, 8, 0, 0]}
            name="Orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Branch Comparison Chart with modern horizontal bars
export function BranchComparisonChart({ data, loading = false }) {
  if (loading) return <ChartLoading />;

OrdersBarChart.displayName = 'OrdersBarChart';
 main

// Area Chart for Trends
export const TrendAreaChart = memo(({ data, dataKeys = [], colors = [], loading = false, error = null }) => {
  if (!loading && !error && dataKeys.length === 0) {
    logger.warn('TrendAreaChart: No dataKeys provided');
  }

  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No trend data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((key, index) => (
              <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index] || COLOR_PALETTE[index]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[index] || COLOR_PALETTE[index]} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || COLOR_PALETTE[index]}
              fillOpacity={1}
              fill={`url(#color${key})`}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Modern Pie Chart with clean design
export function CategoryPieChart({ data, loading = false }) {
  if (loading) return <ChartLoading />;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide labels for small slices


// Pie Chart for Category Distribution - Memoized
export const CategoryPieChart = memo(({ data, loading = false }) => {
  if (loading) {
 main
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

TrendAreaChart.displayName = 'TrendAreaChart';
 main

// Branch Comparison Chart
export const BranchComparisonChart = memo(({ data, loading = false, error = null }) => {
  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No branch data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            type="number"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
            width={100}
          />
          <Tooltip content={<CustomTooltip prefix="$" />} />
          <Legend />
          <Bar
            dataKey="revenue"
            fill={CHART_COLORS.primary}
            radius={[0, 8, 8, 0]}
            name="Revenue"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Multi-Line Chart for modern comparisons
export function MultiLineChart({ data, lines = [], loading = false }) {
  if (loading) return <ChartLoading />;

// Multi-Line Chart for Comparison - Memoized
export const MultiLineChart = memo(({ data, lines = [], loading = false }) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }
 main

BranchComparisonChart.displayName = 'BranchComparisonChart';
 main

// Pie Chart for Category Distribution
export const CategoryPieChart = memo(({ data, loading = false, error = null }) => {
  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No category data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Modern Stacked Bar Chart
export function StackedBarChart({ data, bars = [], loading = false }) {
  if (loading) return <ChartLoading />;

CategoryPieChart.displayName = 'CategoryPieChart';
 main

// Multi-Line Chart for Comparison
export const MultiLineChart = memo(({ data, lines = [], loading = false, error = null }) => {
  if (!loading && !error && lines.length === 0) {
    logger.warn('MultiLineChart: No lines configuration provided');
  }

  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No comparison data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color || COLOR_PALETTE[index]}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={line.label}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

MultiLineChart.displayName = 'MultiLineChart';

// Stacked Bar Chart
export const StackedBarChart = memo(({ data, bars = [], loading = false, error = null }) => {
  if (!loading && !error && bars.length === 0) {
    logger.warn('StackedBarChart: No bars configuration provided');
  }

  return (
    <ChartContainer
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No stacked data available"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            className="dark:stroke-gray-500"
          />
          <Tooltip content={<CustomTooltip prefix="$" />} />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              stackId="a"
              fill={bar.color || COLOR_PALETTE[index]}
              name={bar.label}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

StackedBarChart.displayName = 'StackedBarChart';

export { CHART_COLORS, COLOR_PALETTE };
