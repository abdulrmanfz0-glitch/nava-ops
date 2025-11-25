import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import ModernCard from './ModernCard';

/**
 * KPIWidget - Animated KPI metric display with icon and trend
 *
 * @param {string} title - KPI title
 * @param {number} value - Numeric value
 * @param {string} prefix - Value prefix (e.g., '$', '%')
 * @param {string} suffix - Value suffix (e.g., 'K', 'M')
 * @param {string} trend - 'up' | 'down' | 'neutral'
 * @param {number} trendValue - Trend percentage
 * @param {React.Component} icon - Lucide icon component
 * @param {string} iconColor - Tailwind color class
 * @param {string} variant - Card variant
 * @param {boolean} animated - Enable count animation
 */
const KPIWidget = ({
  title,
  value,
  prefix = '',
  suffix = '',
  trend = 'neutral',
  trendValue = 0,
  icon: Icon,
  iconColor = 'text-cyan-400',
  variant = 'glass',
  animated = true,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated value using Framer Motion spring
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (animated) {
      spring.set(value);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated, spring]);

  useEffect(() => {
    if (animated) {
      const unsubscribe = spring.on('change', (latest) => {
        setDisplayValue(latest);
      });
      return () => unsubscribe();
    }
  }, [spring, animated]);

  // Format number with commas
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';

    // Handle decimals
    const hasDecimal = num % 1 !== 0;
    const formatted = hasDecimal ? num.toFixed(2) : Math.floor(num);

    return formatted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Trend indicators
  const trendStyles = {
    up: 'text-green-400 bg-green-400/10',
    down: 'text-red-400 bg-red-400/10',
    neutral: 'text-gray-400 bg-gray-400/10',
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <ModernCard
      variant={variant}
      glow={false}
      hoverable={true}
      animated={animated}
      className={`p-6 ${className}`}
    >
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
          <motion.div
            className="text-3xl font-bold text-white"
            initial={false}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
            key={value}
          >
            {prefix}
            {formatNumber(displayValue)}
            {suffix}
          </motion.div>
        </div>

        {/* Icon */}
        {Icon && (
          <motion.div
            className={`p-3 rounded-xl bg-white/5 backdrop-blur-sm ${iconColor}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
      </div>

      {/* Trend indicator */}
      {trend !== 'neutral' || trendValue !== 0 ? (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendStyles[trend]}`}>
            {trendIcons[trend]}
            <span className="text-xs font-semibold">
              {trendValue > 0 ? '+' : ''}{trendValue}%
            </span>
          </div>
          <span className="text-xs text-white/40">vs last period</span>
        </div>
      ) : null}

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </ModernCard>
  );
};

export default KPIWidget;
