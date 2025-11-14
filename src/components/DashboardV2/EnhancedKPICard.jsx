// NAVA OPS - Enhanced KPI Card
// Beautiful KPI cards with motion, sparklines, and drill-down capabilities

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  X,
  BarChart3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { dashboardTheme, getColorTheme, getTrendColor, formatPercentageChange } from '@/styles/dashboardTheme';

export default function EnhancedKPICard({
  title,
  value,
  previousValue,
  icon: Icon,
  color = 'primary',
  format = 'number',
  sparklineData = [],
  subtitle,
  detailsData = null,
  className = ''
}) {
  const [showDetails, setShowDetails] = useState(false);
  const colorTheme = getColorTheme(color);

  // Calculate trend
  const trend = useMemo(() => {
    if (!previousValue) return { direction: 'neutral', value: 0, formatted: '0%' };

    const change = formatPercentageChange(value, previousValue);
    const direction = change.value > 0 ? 'up' : change.value < 0 ? 'down' : 'neutral';

    return {
      direction,
      value: change.value,
      formatted: change.formatted
    };
  }, [value, previousValue]);

  // Format value based on format type
  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return '--';

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);

      case 'percentage':
        return `${value.toFixed(1)}%`;

      case 'decimal':
        return value.toFixed(2);

      case 'compact':
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short'
        }).format(value);

      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }, [value, format]);

  // Prepare sparkline data for chart
  const chartData = useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) return [];
    return sparklineData.map((val, idx) => ({ value: val, index: idx }));
  }, [sparklineData]);

  // Get trend icon
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColorClass = trend.direction === 'up'
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
    : trend.direction === 'down'
    ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
    : 'text-gray-600 dark:text-gray-400 bg-gray-500/10';

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => detailsData && setShowDetails(true)}
        className={`
          relative overflow-hidden rounded-2xl
          ${dashboardTheme.glass.combined}
          ${dashboardTheme.card.elevated}
          p-6 group
          ${detailsData ? 'cursor-pointer' : ''}
          ${className}
        `}
      >
        {/* Gradient background effect */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br ${colorTheme.gradient}
        `} style={{ opacity: 0.05 }} />

        {/* Header */}
        <div className="relative flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`
                  p-3 rounded-xl ${colorTheme.bg}
                  ${colorTheme.border} border
                `}
              >
                <Icon className={`w-5 h-5 ${colorTheme.text}`} />
              </motion.div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {detailsData && (
            <motion.div
              whileHover={{ x: 4 }}
              className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.div>
          )}
        </div>

        {/* Value and Trend */}
        <div className="relative flex items-end justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formattedValue}
            </div>
            {previousValue !== null && previousValue !== undefined && (
              <div className={`
                inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold
                ${trendColorClass}
              `}>
                <TrendIcon className="w-3 h-3" />
                <span>{trend.formatted}</span>
              </div>
            )}
          </motion.div>

          {/* Mini sparkline */}
          {chartData.length > 0 && (
            <div className="w-24 h-12 -mr-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`rgb(var(--color-${color}-500))`}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {chartData.length > 0 && (
          <div className="relative h-16 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload[0]) return null;
                    return (
                      <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm">
                        {format === 'currency' ? `$${payload[0].value.toFixed(0)}` : payload[0].value}
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={`rgb(var(--color-${color}-500))`}
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && detailsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-full max-w-2xl max-h-[80vh] overflow-y-auto
                ${dashboardTheme.glass.combined}
                rounded-2xl p-6 shadow-2xl
              `}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed breakdown and analytics
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formattedValue}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previous</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {format === 'currency' ? `$${previousValue?.toFixed(0) || 0}` : previousValue || 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change</div>
                    <div className={`text-2xl font-bold ${trendColorClass.includes('emerald') ? 'text-emerald-600' : trendColorClass.includes('rose') ? 'text-rose-600' : 'text-gray-600'}`}>
                      {trend.formatted}
                    </div>
                  </div>
                </div>

                {/* Full Sparkline */}
                {chartData.length > 0 && (
                  <div className="h-48 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <defs>
                          <linearGradient id={`modal-gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload[0]) return null;
                            return (
                              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl">
                                <div className="text-sm font-semibold">
                                  {format === 'currency' ? `$${payload[0].value.toFixed(0)}` : payload[0].value}
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={`rgb(var(--color-${color}-500))`}
                          strokeWidth={3}
                          fill={`url(#modal-gradient-${title})`}
                          dot={false}
                          isAnimationActive={true}
                          animationDuration={1000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Additional Details */}
                {detailsData && (
                  <div className="space-y-3">
                    {Object.entries(detailsData).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
