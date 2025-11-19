// NAVA OPS - Advanced SVG Chart Components
// Lightweight, customizable charts with animations and gradients

import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

/**
 * Simple SVG Line Chart
 * Perfect for trend visualization
 */
export const SimpleLineChart = memo(({
  data = [],
  height = 200,
  color = '#0088FF',
  gradient = true,
  showDots = true,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  const width = 100; // Use percentage
  const padding = 5;

  // Calculate min/max
  const values = data.map(d => d.value || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  // Generate path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((d.value - min) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        {gradient && (
          <linearGradient id={`lineGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      {/* Area fill */}
      {gradient && (
        <path
          d={areaD}
          fill={`url(#lineGradient-${color})`}
          className="transition-all duration-500"
        />
      )}

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500"
      />

      {/* Dots */}
      {showDots && points.map((point, i) => {
        const [x, y] = point.split(',');
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            className="transition-all duration-300 hover:r-3"
          />
        );
      })}
    </svg>
  );
});

SimpleLineChart.displayName = 'SimpleLineChart';

/**
 * Bar Chart Component
 * Perfect for comparisons
 */
export const SimpleBarChart = memo(({
  data = [],
  height = 200,
  color = '#10B981',
  className = '',
  showValues = false
}) => {
  if (!data || data.length === 0) return null;

  const width = 100;
  const padding = 10;
  const barPadding = 2;

  const values = data.map(d => d.value || 0);
  const max = Math.max(...values, 1);

  const barWidth = (width - 2 * padding) / data.length - barPadding;
  const chartHeight = height - 2 * padding;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`barGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {data.map((d, i) => {
        const barHeight = (d.value / max) * chartHeight;
        const x = padding + i * (barWidth + barPadding);
        const y = height - padding - barHeight;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={`url(#barGradient-${color})`}
              rx="1"
              className="transition-all duration-300 hover:opacity-80"
            />

            {/* Value Label */}
            {showValues && (
              <text
                x={x + barWidth / 2}
                y={y - 2}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
                fontSize="3"
              >
                {formatNumber(d.value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
});

SimpleBarChart.displayName = 'SimpleBarChart';

/**
 * Donut Chart Component
 * Perfect for distribution visualization
 */
export const DonutChart = memo(({
  data = [],
  size = 200,
  thickness = 30,
  showLabels = true,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  const colors = [
    '#0088FF', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'
  ];

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  if (total === 0) return null;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - thickness) / 2;
  const innerRadius = radius - thickness;

  let currentAngle = -90; // Start from top

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full ${className}`}
    >
      {data.map((d, i) => {
        const percentage = (d.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;

        // Calculate arc path
        const startRad = (currentAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const x3 = centerX + innerRadius * Math.cos(endRad);
        const y3 = centerY + innerRadius * Math.sin(endRad);
        const x4 = centerX + innerRadius * Math.cos(startRad);
        const y4 = centerY + innerRadius * Math.sin(startRad);

        const largeArc = angle > 180 ? 1 : 0;

        const pathD = [
          `M ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
          `L ${x3} ${y3}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
          'Z'
        ].join(' ');

        const color = colors[i % colors.length];
        currentAngle = endAngle;

        return (
          <g key={i}>
            <path
              d={pathD}
              fill={color}
              className="transition-all duration-300 hover:opacity-80"
            >
              <title>{`${d.label}: ${formatPercentage(percentage)}`}</title>
            </path>
          </g>
        );
      })}

      {/* Center Circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius}
        fill="white"
        className="dark:fill-gray-900"
      />

      {/* Total in center */}
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xl font-bold fill-gray-900 dark:fill-white"
        fontSize="16"
      >
        {formatNumber(total)}
      </text>
    </svg>
  );
});

DonutChart.displayName = 'DonutChart';

/**
 * Sparkline Component
 * Compact trend indicator
 */
export const Sparkline = memo(({
  data = [],
  height = 40,
  color = '#0088FF',
  showTrend = true,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  const width = 100;
  const padding = 2;

  const values = data.map(d => typeof d === 'number' ? d : d.value || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((value - min) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  // Calculate trend
  const first = values[0];
  const last = values[values.length - 1];
  const trend = last > first ? 'up' : last < first ? 'down' : 'flat';
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : color;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="flex-1"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showTrend && (
        <div className="flex-shrink-0">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-success-600" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-error-600" />}
        </div>
      )}
    </div>
  );
});

Sparkline.displayName = 'Sparkline';

/**
 * Progress Bar Chart
 * Visual representation of progress/completion
 */
export const ProgressBar = memo(({
  value = 0,
  max = 100,
  height = 8,
  color = '#0088FF',
  showLabel = false,
  label = '',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getColor = () => {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 50) return '#0088FF';
    if (percentage >= 30) return '#F59E0B';
    return '#EF4444';
  };

  const barColor = color || getColor();

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {formatPercentage(percentage)}
          </span>
        </div>
      )}

      <div
        className="w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor
          }}
        >
          <div
            className="h-full w-full rounded-full opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`
            }}
          />
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

/**
 * Horizontal Bar Chart
 * Good for rankings and comparisons
 */
export const HorizontalBarChart = memo(({
  data = [],
  maxValue = null,
  height = 300,
  colors = ['#0088FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  showValues = true,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  const max = maxValue || Math.max(...data.map(d => d.value || 0), 1);
  const barHeight = 30;
  const barSpacing = 10;
  const labelWidth = 120;
  const chartWidth = 400;

  const totalHeight = data.length * (barHeight + barSpacing);

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${labelWidth + chartWidth} ${totalHeight}`}
        className="w-full"
        style={{ height: `${height}px` }}
      >
        {data.map((d, i) => {
          const barWidth = (d.value / max) * chartWidth;
          const y = i * (barHeight + barSpacing);
          const color = colors[i % colors.length];

          return (
            <g key={i}>
              {/* Label */}
              <text
                x="0"
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm fill-gray-700 dark:fill-gray-300 font-medium"
                fontSize="12"
              >
                {d.label}
              </text>

              {/* Bar Background */}
              <rect
                x={labelWidth}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill="currentColor"
                className="text-gray-200 dark:text-gray-800"
                rx="4"
              />

              {/* Bar */}
              <rect
                x={labelWidth}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="4"
                className="transition-all duration-500"
              >
                <animate
                  attributeName="width"
                  from="0"
                  to={barWidth}
                  dur="0.5s"
                  fill="freeze"
                />
              </rect>

              {/* Value */}
              {showValues && (
                <text
                  x={labelWidth + barWidth + 5}
                  y={y + barHeight / 2}
                  dominantBaseline="middle"
                  className="text-sm fill-gray-900 dark:fill-white font-bold"
                  fontSize="12"
                >
                  {formatNumber(d.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});

HorizontalBarChart.displayName = 'HorizontalBarChart';

/**
 * Gauge Chart
 * Perfect for performance scores
 */
export const GaugeChart = memo(({
  value = 0,
  max = 100,
  size = 200,
  thickness = 20,
  label = '',
  showValue = true,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180; // Half circle

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - thickness) / 2;
  const innerRadius = radius - thickness;

  // Color based on value
  const getColor = () => {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#0088FF';
    if (percentage >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const color = getColor();

  // Calculate arc
  const startAngle = 180;
  const endAngle = startAngle + angle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full ${className}`}
    >
      {/* Background Arc */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        className="text-gray-200 dark:text-gray-800"
      />

      {/* Value Arc */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        className="transition-all duration-500"
      />

      {/* Center Text */}
      {showValue && (
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold fill-gray-900 dark:fill-white"
          fontSize="40"
        >
          {Math.round(percentage)}
        </text>
      )}

      {/* Label */}
      {label && (
        <text
          x={centerX}
          y={centerY + 35}
          textAnchor="middle"
          className="text-sm fill-gray-600 dark:fill-gray-400"
          fontSize="12"
        >
          {label}
        </text>
      )}
    </svg>
  );
});

GaugeChart.displayName = 'GaugeChart';

export default {
  SimpleLineChart,
  SimpleBarChart,
  DonutChart,
  Sparkline,
  ProgressBar,
  HorizontalBarChart,
  GaugeChart
};
