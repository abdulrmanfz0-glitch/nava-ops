// NAVA OPS - StatCard v2
// Enhanced KPI card with sparklines, real trends, and animations

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatCardV2({
  title,
  value,
  previousValue,
  subtitle,
  icon: Icon,
  color = 'blue',
  format = 'number', // 'number' | 'currency' | 'percentage'
  loading = false,
  onClick,
  sparklineData = [], // Array of numbers for mini chart
  comparison,         // { value, period, label }
  alert,             // { type: 'warning'|'critical', message }
  showSparkline = true,
  showTrend = true,
  animated = true
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Calculate trend
  const trend = previousValue ? calculateTrend(value, previousValue) : null;

  // Animate value counting
  useEffect(() => {
    if (!animated || loading) return;

    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, loading, animated]);

  // Format value for display
  const formatValue = (val) => {
    const numVal = animated ? displayValue : (typeof val === 'number' ? val : parseFloat(val) || 0);

    switch (format) {
      case 'currency':
        return `SAR ${numVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'percentage':
        return `${numVal.toFixed(1)}%`;
      default:
        return numVal.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
  };

  // Color classes
  const colorClasses = {
    blue: {
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-950/30',
      text: 'text-primary-600 dark:text-primary-400',
      icon: 'text-primary-600 dark:text-primary-400',
      border: 'border-primary-200 dark:border-primary-800'
    },
    green: {
      gradient: 'from-success-500 to-success-600',
      bg: 'bg-success-50 dark:bg-success-950/30',
      text: 'text-success-600 dark:text-success-400',
      icon: 'text-success-600 dark:text-success-400',
      border: 'border-success-200 dark:border-success-800'
    },
    purple: {
      gradient: 'from-secondary-500 to-secondary-600',
      bg: 'bg-secondary-50 dark:bg-secondary-950/30',
      text: 'text-secondary-600 dark:text-secondary-400',
      icon: 'text-secondary-600 dark:text-secondary-400',
      border: 'border-secondary-200 dark:border-secondary-800'
    },
    orange: {
      gradient: 'from-warning-500 to-warning-600',
      bg: 'bg-warning-50 dark:bg-warning-950/30',
      text: 'text-warning-600 dark:text-warning-400',
      icon: 'text-warning-600 dark:text-warning-400',
      border: 'border-warning-200 dark:border-warning-800'
    },
    red: {
      gradient: 'from-error-500 to-error-600',
      bg: 'bg-error-50 dark:bg-error-950/30',
      text: 'text-error-600 dark:text-error-400',
      icon: 'text-error-600 dark:text-error-400',
      border: 'border-error-200 dark:border-error-800'
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      icon: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return <StatCardSkeleton />;
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        group relative overflow-hidden
        bg-white dark:bg-gray-900
        rounded-2xl border border-gray-200 dark:border-gray-800
        shadow-sm hover:shadow-lg
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700' : ''}
      `}
    >
      {/* Alert Badge */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`
              absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium
              ${alert.type === 'critical'
                ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
              }
            `}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background gradient on hover */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-5
        bg-gradient-to-br ${currentColor.gradient}
        transition-opacity duration-300
      `} />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">
              {title}
            </p>

            {/* Value with animation */}
            <motion.h3
              className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight"
              key={value} // Re-animate on value change
            >
              {formatValue(value)}
            </motion.h3>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate mb-3">
                {subtitle}
              </p>
            )}

            {/* Trend Indicator */}
            {showTrend && trend && (
              <TrendIndicator trend={trend} />
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`
                p-3 rounded-xl transition-all duration-300
                ${currentColor.bg}
                ${currentColor.icon}
              `}
            >
              <Icon className="w-6 h-6" strokeWidth={2} />
            </motion.div>
          )}
        </div>

        {/* Sparkline Chart */}
        {showSparkline && sparklineData.length > 0 && (
          <div className="mt-4">
            <Sparkline data={sparklineData} color={color} />
          </div>
        )}

        {/* Comparison */}
        {comparison && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {comparison.label || 'Previous period'}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {format === 'currency' && 'SAR '}
                {comparison.value.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Click indicator */}
        {onClick && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100
                       transition-opacity duration-200">
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Trend Indicator Component
function TrendIndicator({ trend }) {
  const { direction, percentage, isPositive } = trend;

  const getTrendIcon = () => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (direction === 'up' && isPositive) return 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/30';
    if (direction === 'down' && !isPositive) return 'text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950/30';
    if (direction === 'down' && isPositive) return 'text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950/30';
    if (direction === 'up' && !isPositive) return 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/30';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-2"
    >
      <span className={`
        inline-flex items-center gap-1
        px-2 py-1 rounded-lg
        text-sm font-medium
        ${getTrendColor()}
      `}>
        {getTrendIcon()}
        <span>{percentage.toFixed(1)}%</span>
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-500">
        vs last period
      </span>
    </motion.div>
  );
}

// Sparkline Chart Component
function Sparkline({ data, color = 'blue' }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  const colorMap = {
    blue: '#0088FF',
    green: '#10B981',
    purple: '#8B5CF6',
    orange: '#F59E0B',
    red: '#EF4444',
    indigo: '#6366F1'
  };

  const strokeColor = colorMap[color] || colorMap.blue;

  return (
    <div className="w-full h-12 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Area fill */}
        <path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill={strokeColor}
          fillOpacity="0.1"
        />
        {/* Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Loading skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3"></div>
    </div>
  );
}

// Helper: Calculate trend
function calculateTrend(currentValue, previousValue) {
  if (!previousValue || previousValue === 0) return null;

  const current = typeof currentValue === 'number' ? currentValue : parseFloat(currentValue) || 0;
  const previous = typeof previousValue === 'number' ? previousValue : parseFloat(previousValue) || 0;

  const change = current - previous;
  const percentage = (change / previous) * 100;

  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    percentage: Math.abs(percentage),
    change,
    isPositive: change >= 0 // For metrics where increase is positive (revenue, orders, etc.)
  };
}
