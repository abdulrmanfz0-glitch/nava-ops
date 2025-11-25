import React from 'react';
import { motion } from 'framer-motion';
import ModernCard from './ModernCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * ChartCard - Container for charts with header and stats
 *
 * @param {string} title - Chart title
 * @param {string} subtitle - Chart subtitle/description
 * @param {string|number} value - Main metric value
 * @param {string} trend - 'up' | 'down' | 'neutral'
 * @param {number} trendValue - Trend percentage
 * @param {React.Node} chart - Chart component
 * @param {string} variant - Card variant
 * @param {React.Node} actions - Optional action buttons
 */
const ChartCard = ({
  title,
  subtitle,
  value,
  trend = 'neutral',
  trendValue,
  chart,
  variant = 'glass',
  actions,
  className = '',
}) => {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
    },
    down: {
      icon: TrendingDown,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
    },
    neutral: {
      icon: Minus,
      color: 'text-gray-400',
      bg: 'bg-gray-400/10',
      border: 'border-gray-400/30',
    },
  };

  const config = trendConfig[trend] || trendConfig.neutral;
  const TrendIcon = config.icon;

  return (
    <ModernCard
      variant={variant}
      glow={false}
      hoverable={false}
      animated={true}
      className={`p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-white/50">{subtitle}</p>
          )}

          {/* Value and trend */}
          {value && (
            <div className="flex items-baseline gap-3 mt-3">
              <motion.span
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.span>

              {trendValue !== undefined && trendValue !== null && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${config.bg} ${config.color} border ${config.border}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="text-xs font-semibold">
                    {trendValue > 0 ? '+' : ''}{trendValue}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        {chart}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </ModernCard>
  );
};

export default ChartCard;
