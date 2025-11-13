// NAVA OPS - Chart Components
// Professional chart components using Recharts

import React from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            <span className="font-semibold">
              {prefix}{entry.value.toLocaleString()}{suffix}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Revenue Trend Line Chart
export function RevenueTrendChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Orders Bar Chart
export function OrdersBarChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Area Chart for Trends
export function TrendAreaChart({ data, dataKeys = [], colors = [], loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
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
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Branch Comparison Chart
export function BranchComparisonChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          type="number"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Pie Chart for Category Distribution
export function CategoryPieChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Multi-Line Chart for Comparison
export function MultiLineChart({ data, lines = [], loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Stacked Bar Chart
export function StackedBarChart({ data, bars = [], loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
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
  );
}

// Pie Chart Component (Enhanced version for Executive Dashboard)
export function PieChartComponent({ data, loading = false }) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLOR_PALETTE[index % COLOR_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {payload[0].name}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">
                      SAR {payload[0].value.toLocaleString()}
                    </span>
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export { CHART_COLORS, COLOR_PALETTE };
