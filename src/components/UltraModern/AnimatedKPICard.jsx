import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Percent,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';

/**
 * AnimatedKPICard - Interactive KPI display with animated values
 * Features: Animated counters, sparklines, trend indicators, hover effects
 */
const AnimatedKPICard = ({
  title,
  value,
  previousValue,
  format = 'number',
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor = 'blue',
  trend,
  sparklineData = [],
  description,
  delay = 0,
  size = 'md',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef(null);

  // Animated counter
  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    const controls = animate(0, numValue, {
      duration: 1.5,
      delay: delay + 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplayValue(v),
    });
    return () => controls.stop();
  }, [value, delay]);

  // Calculate trend percentage
  const trendPercent = trend || (previousValue
    ? ((value - previousValue) / previousValue * 100).toFixed(1)
    : 0);
  const isPositive = parseFloat(trendPercent) >= 0;

  // Format value based on type
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percent':
        return val.toFixed(1);
      case 'decimal':
        return val.toFixed(2);
      default:
        return Math.round(val).toLocaleString();
    }
  };

  // Icon color variants
  const iconColors = {
    blue: 'from-blue-500 to-cyan-400',
    purple: 'from-purple-500 to-pink-400',
    green: 'from-emerald-500 to-teal-400',
    orange: 'from-orange-500 to-amber-400',
    pink: 'from-pink-500 to-rose-400',
    gold: 'from-amber-400 to-yellow-300',
  };

  // Icon glow colors
  const glowColors = {
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    purple: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    green: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    orange: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    pink: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    gold: 'shadow-[0_0_20px_rgba(255,215,0,0.4)]',
  };

  // Size variants
  const sizeClasses = {
    sm: {
      card: 'p-4',
      icon: 'w-10 h-10',
      iconInner: 'w-5 h-5',
      title: 'text-xs',
      value: 'text-xl',
      trend: 'text-xs',
    },
    md: {
      card: 'p-6',
      icon: 'w-12 h-12',
      iconInner: 'w-6 h-6',
      title: 'text-sm',
      value: 'text-3xl',
      trend: 'text-sm',
    },
    lg: {
      card: 'p-8',
      icon: 'w-14 h-14',
      iconInner: 'w-7 h-7',
      title: 'text-base',
      value: 'text-4xl',
      trend: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  // Mini sparkline component
  const Sparkline = () => {
    if (!sparklineData.length) return null;

    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    const height = 40;
    const width = 80;
    const points = sparklineData.map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <motion.svg
        width={width}
        height={height}
        className="overflow-visible"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.5 }}
      >
        <defs>
          <linearGradient id={`sparkline-gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polyline
          fill="none"
          stroke={isPositive ? '#10B981' : '#EF4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.6, duration: 1 }}
        />
        <polygon
          fill={`url(#sparkline-gradient-${title})`}
          points={`0,${height} ${points} ${width},${height}`}
        />
      </motion.svg>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        ${sizes.card}
        transition-all duration-500 ease-out
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        hover:-translate-y-1 hover:border-white/[0.15]
        ${onClick ? 'cursor-pointer' : ''}
        group
      `}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background gradient animation */}
      <motion.div
        className={`
          absolute -top-20 -right-20 w-40 h-40 rounded-full
          bg-gradient-to-br ${iconColors[iconColor]} opacity-10
          blur-3xl
        `}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Animated Icon */}
            <motion.div
              className={`
                ${sizes.icon} rounded-xl
                bg-gradient-to-br ${iconColors[iconColor]}
                flex items-center justify-center
                ${glowColors[iconColor]}
              `}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {Icon && <Icon className={`${sizes.iconInner} text-white`} />}
            </motion.div>

            <div>
              <h3 className={`${sizes.title} font-medium text-gray-400 dark:text-gray-400`}>
                {title}
              </h3>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>

          {/* Sparkline */}
          <Sparkline />
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <motion.div
            className={`${sizes.value} font-bold text-gray-900 dark:text-white tracking-tight`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {prefix}
            {formatValue(displayValue)}
            {suffix}
          </motion.div>

          {/* Trend Badge */}
          <motion.div
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full
              ${sizes.trend} font-medium
              ${isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
              }
            `}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(trendPercent)}%</span>
          </motion.div>
        </div>

        {/* Bottom info bar */}
        <motion.div
          className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          <span className="text-xs text-gray-500">vs last period</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Activity className="w-3 h-3" />
            <span>Live</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

AnimatedKPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  previousValue: PropTypes.number,
  format: PropTypes.oneOf(['number', 'currency', 'percent', 'decimal']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.oneOf(['blue', 'purple', 'green', 'orange', 'pink', 'gold']),
  trend: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sparklineData: PropTypes.arrayOf(PropTypes.number),
  description: PropTypes.string,
  delay: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
};

export default AnimatedKPICard;

// Export icon components for convenience
export const KPIIcons = {
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Percent,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
};
