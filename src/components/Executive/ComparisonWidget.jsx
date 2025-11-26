import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MapPin,
  Radio,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useBrandTheme } from '../../contexts/BrandThemeContext';
import { executiveTypography, executiveColorSemantics } from '../../styles/executiveDesignSystem';
import { entranceAnimations, interactiveAnimations } from '../../utils/executiveAnimations';

/**
 * Comparison Widget
 * Multi-dimensional metric comparison (time, location, channel, etc.)
 *
 * Props:
 * - title: Widget title
 * - comparisonType: 'period' | 'branch' | 'channel' | 'custom'
 * - data: Array of comparison items
 *   {
 *     id: string,
 *     label: string,
 *     value: number,
 *     previousValue: number (optional),
 *     metadata: object (optional)
 *   }
 * - metric: Metric name
 * - format: 'number' | 'currency' | 'percentage'
 * - showTrend: Boolean to show trend indicators
 * - onSelectItem: Callback when item is clicked
 * - className: Additional CSS classes
 */
const ComparisonWidget = ({
  title,
  comparisonType = 'period',
  data = [],
  metric,
  format = 'number',
  showTrend = true,
  onSelectItem,
  className = ''
}) => {
  const { currentTheme } = useBrandTheme();
  const [selectedId, setSelectedId] = useState(data[0]?.id);

  // Get icon for comparison type
  const getTypeIcon = () => {
    switch (comparisonType) {
      case 'period':
        return Calendar;
      case 'branch':
        return MapPin;
      case 'channel':
        return Radio;
      default:
        return ChevronDown;
    }
  };

  const TypeIcon = getTypeIcon();

  // Format value
  const formatValue = (val) => {
    if (val === undefined || val === null) return 'N/A';

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

  // Calculate trend
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change)
    };
  };

  // Find max value for bar chart scaling
  const maxValue = Math.max(...data.map(item => item.value), 0);

  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedId(item.id);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  if (data.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        No comparison data available
      </div>
    );
  }

  return (
    <motion.div
      className={`rounded-xl p-6 ${className}`}
      style={{
        background: currentTheme.components.kpiCard.background,
        border: currentTheme.components.kpiCard.border,
        boxShadow: currentTheme.components.kpiCard.shadow,
        backdropFilter: 'blur(12px)'
      }}
      {...entranceAnimations.slideUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: currentTheme.colors.primary + '20',
              color: currentTheme.colors.primary
            }}
          >
            <TypeIcon size={20} />
          </div>
          <div>
            <h3
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: executiveTypography.heading.h4.fontSize,
                fontWeight: executiveTypography.heading.h4.fontWeight
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metric}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison items */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const trend = item.previousValue ? calculateTrend(item.value, item.previousValue) : null;
          const isSelected = selectedId === item.id;
          const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          const TrendIcon = trend?.direction === 'up' ? TrendingUp
            : trend?.direction === 'down' ? TrendingDown
            : Minus;

          const trendColor = trend?.direction === 'up'
            ? executiveColorSemantics.trend.positive.color
            : trend?.direction === 'down'
            ? executiveColorSemantics.trend.negative.color
            : executiveColorSemantics.trend.neutral.color;

          return (
            <motion.div
              key={item.id}
              className={`relative rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              style={{
                ringColor: isSelected ? currentTheme.colors.primary : 'transparent'
              }}
              onClick={() => handleSelectItem(item)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Background bar */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-10"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  width: `${barWidth}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: executiveTypography.body.base.fontSize,
                        fontWeight: 500
                      }}
                    >
                      {item.label}
                    </p>

                    {/* Metadata badges */}
                    {item.metadata && (
                      <div className="flex items-center space-x-1">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trend indicator */}
                  {showTrend && trend && (
                    <div
                      className="flex items-center space-x-1 text-sm"
                      style={{ color: trendColor }}
                    >
                      <TrendIcon size={14} />
                      <span className="font-medium">
                        {trend.percentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Value */}
                <div className="text-right">
                  <p
                    className="font-bold text-gray-900 dark:text-white"
                    style={{
                      fontSize: executiveTypography.metric.tertiary.fontSize,
                      fontWeight: executiveTypography.metric.tertiary.fontWeight,
                      fontFeatureSettings: executiveTypography.metric.tertiary.fontFeatureSettings
                    }}
                  >
                    {formatValue(item.value)}
                  </p>

                  {item.previousValue !== undefined && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      vs {formatValue(item.previousValue)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              BEST PERFORMER
            </p>
            <p
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: executiveTypography.body.small.fontSize,
                fontWeight: 600
              }}
            >
              {data.reduce((max, item) => item.value > max.value ? item : max, data[0])?.label}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              TOTAL
            </p>
            <p
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: executiveTypography.body.small.fontSize,
                fontWeight: 600
              }}
            >
              {formatValue(data.reduce((sum, item) => sum + item.value, 0))}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              AVERAGE
            </p>
            <p
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: executiveTypography.body.small.fontSize,
                fontWeight: 600
              }}
            >
              {formatValue(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonWidget;
