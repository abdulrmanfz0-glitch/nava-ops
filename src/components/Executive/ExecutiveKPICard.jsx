import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target
} from 'lucide-react';
import { useBrandTheme } from '../../contexts/BrandThemeContext';
import { executiveTypography, executiveColorSemantics } from '../../styles/executiveDesignSystem';
import { entranceAnimations, metricAnimations, interactiveAnimations } from '../../utils/executiveAnimations';

/**
 * Executive KPI Card
 * Smart metric display with context, trends, insights, and actions
 *
 * Props:
 * - label: KPI name
 * - value: Current value
 * - previousValue: Previous period value (for comparison)
 * - target: Target value (optional)
 * - format: 'number' | 'currency' | 'percentage'
 * - trend: 'up' | 'down' | 'neutral' (auto-calculated if not provided)
 * - insight: AI-generated insight text
 * - action: { label, onClick } - Recommended action
 * - status: 'excellent' | 'good' | 'neutral' | 'warning' | 'critical'
 * - sparklineData: Array of values for mini chart (optional)
 * - icon: Lucide icon component
 * - loading: Boolean
 */
const ExecutiveKPICard = ({
  label,
  value,
  previousValue,
  target,
  format = 'number',
  trend,
  insight,
  action,
  status,
  sparklineData,
  icon: Icon,
  loading = false,
  className = ''
}) => {
  const { currentTheme, getColor } = useBrandTheme();
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate trend if not provided
  const calculatedTrend = trend || (previousValue
    ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'neutral'
    : 'neutral');

  // Calculate change percentage
  const changePercent = previousValue && previousValue !== 0
    ? ((value - previousValue) / previousValue) * 100
    : 0;

  // Determine status if not provided
  const calculatedStatus = status || (
    target
      ? value >= target ? 'excellent' : value >= target * 0.9 ? 'good' : value >= target * 0.7 ? 'warning' : 'critical'
      : changePercent > 10 ? 'excellent' : changePercent > 0 ? 'good' : changePercent > -5 ? 'warning' : 'critical'
  );

  // Animate number counting
  useEffect(() => {
    if (loading) return;

    let startValue = displayValue;
    const endValue = value;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, loading]);

  // Format value
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    } else if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
  };

  // Get status colors
  const statusColors = executiveColorSemantics.status[calculatedStatus] || executiveColorSemantics.status.neutral;

  // Get trend icon
  const TrendIcon = calculatedTrend === 'up' ? TrendingUp : calculatedTrend === 'down' ? TrendingDown : Minus;
  const trendColor = calculatedTrend === 'up' ? executiveColorSemantics.trend.positive.color
    : calculatedTrend === 'down' ? executiveColorSemantics.trend.negative.color
    : executiveColorSemantics.trend.neutral.color;

  // Get status icon
  const StatusIcon = calculatedStatus === 'excellent' || calculatedStatus === 'good' ? CheckCircle
    : calculatedStatus === 'warning' ? AlertCircle
    : AlertCircle;

  if (loading) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-xl p-6 ${className}`}
        style={{
          background: currentTheme.components.kpiCard.background,
          border: currentTheme.components.kpiCard.border,
          backdropFilter: 'blur(12px)'
        }}
        {...entranceAnimations.slideUp}
      >
        {/* Skeleton loading */}
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all ${className}`}
      style={{
        background: currentTheme.components.kpiCard.background,
        border: currentTheme.components.kpiCard.border,
        boxShadow: isHovered
          ? currentTheme.components.kpiCard.hoverShadow
          : currentTheme.components.kpiCard.shadow,
        backdropFilter: 'blur(12px)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={interactiveAnimations.card.hover}
      {...entranceAnimations.slideUp}
    >
      {/* Top section - Label and Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p
            className="text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            style={{
              fontSize: executiveTypography.label.base.fontSize,
              fontWeight: executiveTypography.label.base.fontWeight,
              letterSpacing: executiveTypography.label.base.letterSpacing
            }}
          >
            {label}
          </p>
        </div>

        {/* Icon with status color */}
        {Icon && (
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: statusColors.background,
              color: statusColors.color
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Main metric value */}
      <div className="mb-3">
        <motion.div
          className="font-bold text-gray-900 dark:text-white"
          style={{
            fontSize: executiveTypography.metric.primary.fontSize,
            fontWeight: executiveTypography.metric.primary.fontWeight,
            lineHeight: executiveTypography.metric.primary.lineHeight,
            letterSpacing: executiveTypography.metric.primary.letterSpacing,
            fontFeatureSettings: executiveTypography.metric.primary.fontFeatureSettings
          }}
          {...metricAnimations.valueChange}
        >
          {formatValue(displayValue)}
        </motion.div>

        {/* Target indicator */}
        {target && (
          <div className="flex items-center mt-1 space-x-1 text-xs text-gray-500">
            <Target size={12} />
            <span>Target: {formatValue(target)}</span>
          </div>
        )}
      </div>

      {/* Trend and change */}
      <div className="flex items-center justify-between mb-3">
        <motion.div
          className="flex items-center space-x-1"
          style={{ color: trendColor }}
          {...(calculatedTrend === 'up' ? metricAnimations.trendIndicator.up : metricAnimations.trendIndicator.down)}
        >
          <TrendIcon size={16} />
          <span
            className="font-semibold"
            style={{
              fontSize: executiveTypography.body.small.fontSize,
              fontWeight: 600
            }}
          >
            {Math.abs(changePercent).toFixed(1)}%
          </span>
        </motion.div>

        {/* Status badge */}
        <div
          className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1"
          style={{
            backgroundColor: statusColors.background,
            color: statusColors.color,
            border: `1px solid ${statusColors.border}`
          }}
        >
          <StatusIcon size={12} />
          <span className="capitalize">{calculatedStatus}</span>
        </div>
      </div>

      {/* Sparkline (if provided) */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-12 mb-3">
          <MiniSparkline data={sparklineData} color={trendColor} />
        </div>
      )}

      {/* Insight */}
      {insight && (
        <motion.div
          className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
          {...entranceAnimations.slideUp}
        >
          <div className="flex items-start space-x-2">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p
              className="text-blue-900 dark:text-blue-100"
              style={{
                fontSize: executiveTypography.caption.base.fontSize,
                lineHeight: executiveTypography.caption.base.lineHeight
              }}
            >
              {insight}
            </p>
          </div>
        </motion.div>
      )}

      {/* Action button */}
      {action && (
        <motion.button
          onClick={action.onClick}
          className="w-full mt-2 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: '#FFFFFF'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{action.label}</span>
          <ArrowUpRight size={16} />
        </motion.button>
      )}

      {/* Hover overlay effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}10 0%, transparent 50%)`,
          opacity: 0
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

/**
 * Mini Sparkline Component
 */
const MiniSparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={`0,100 ${points} 100,100`}
        fill="url(#sparklineGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
};

export default ExecutiveKPICard;
