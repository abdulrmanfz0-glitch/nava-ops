import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

/**
 * ModernPageWrapper - Ultra Modern page container with consistent styling
 * Provides a consistent wrapper for all pages with glass effects and animations
 */
export default function ModernPageWrapper({
  children,
  className = '',
  animate = true
}) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!animate) {
    return <div className={`space-y-6 ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/**
 * ModernPageHeader - Ultra Modern page header component
 */
export function ModernPageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  stats
}) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <GlassCard key={index} hover className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.change > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                    </p>
                  )}
                </div>
                {stat.icon && (
                  <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/**
 * ModernSection - Ultra Modern section container
 */
export function ModernSection({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  className = ''
}) {
  return (
    <GlassCard className={className}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              )}
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </GlassCard>
  );
}

/**
 * ModernButton - Ultra Modern button component
 */
export function ModernButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30',
    secondary: 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08]',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30',
    ghost: 'hover:bg-white/[0.05] text-gray-300 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}

/**
 * ModernInput - Ultra Modern input component
 */
export function ModernInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            bg-white/[0.03] rounded-xl
            border border-white/[0.08]
            text-white placeholder:text-gray-500
            focus:outline-none focus:border-cyan-500/50
            focus:ring-2 focus:ring-cyan-500/20
            transition-all duration-200
            ${error ? 'border-red-500/50' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

/**
 * ModernBadge - Ultra Modern badge component
 */
export function ModernBadge({
  children,
  variant = 'default',
  size = 'md'
}) {
  const variants = {
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    primary: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center gap-1
      rounded-full font-medium border
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
}
