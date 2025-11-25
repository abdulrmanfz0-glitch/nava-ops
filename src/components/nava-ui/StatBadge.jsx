import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatBadge - Small status/metric badge with glow
 *
 * @param {string} label - Badge label
 * @param {string|number} value - Badge value
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} glow - Enable glow effect
 * @param {boolean} pulse - Enable pulse animation
 * @param {React.Component} icon - Optional icon
 */
const StatBadge = ({
  label,
  value,
  variant = 'primary',
  size = 'md',
  glow = false,
  pulse = false,
  icon: Icon,
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(0,196,255,0.3)]',
    },
    secondary: {
      bg: 'bg-teal-500/10 border-teal-500/30',
      text: 'text-teal-400',
      glow: 'shadow-[0_0_15px_rgba(0,255,204,0.3)]',
    },
    accent: {
      bg: 'bg-purple-500/10 border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(146,16,255,0.3)]',
    },
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    },
    neutral: {
      bg: 'bg-white/5 border-white/10',
      text: 'text-white/70',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.2)]',
    },
  };

  // Size styles
  const sizeStyles = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-1.5',
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
    },
  };

  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  const combinedClassName = `
    inline-flex items-center ${sizeStyle.gap} ${sizeStyle.padding}
    ${variantStyle.bg} ${variantStyle.text}
    border backdrop-blur-sm rounded-full
    font-semibold ${sizeStyle.text}
    ${glow ? variantStyle.glow : ''}
    transition-all duration-200
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const pulseAnimation = pulse ? {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  } : {};

  return (
    <motion.div
      className={combinedClassName}
      animate={pulseAnimation}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {Icon && <Icon className={sizeStyle.icon} />}

      {label && (
        <span className="opacity-70">{label}</span>
      )}

      {value !== undefined && value !== null && (
        <span className="font-bold">{value}</span>
      )}
    </motion.div>
  );
};

export default StatBadge;
