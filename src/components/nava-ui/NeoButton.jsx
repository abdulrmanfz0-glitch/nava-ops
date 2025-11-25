import React from 'react';
import { motion } from 'framer-motion';

/**
 * NeoButton - Modern button with multiple variants and effects
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'glass' | 'gradient' | 'glow' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} disabled - Disable button
 * @param {boolean} loading - Show loading state
 * @param {React.Component} icon - Icon component
 * @param {string} iconPosition - 'left' | 'right'
 * @param {function} onClick - Click handler
 */
const NeoButton = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600
      text-white font-semibold
      shadow-lg shadow-cyan-500/30
      hover:shadow-xl hover:shadow-cyan-500/40
      border border-cyan-400/20
    `,
    secondary: `
      bg-gradient-to-r from-teal-500 to-cyan-600
      text-white font-semibold
      shadow-lg shadow-teal-500/30
      hover:shadow-xl hover:shadow-teal-500/40
      border border-teal-400/20
    `,
    accent: `
      bg-gradient-to-r from-purple-500 to-pink-600
      text-white font-semibold
      shadow-lg shadow-purple-500/30
      hover:shadow-xl hover:shadow-purple-500/40
      border border-purple-400/20
    `,
    ghost: `
      bg-transparent text-white/80
      hover:bg-white/10 hover:text-white
      border border-white/10
    `,
    glass: `
      bg-white/5 backdrop-blur-xl text-white
      hover:bg-white/10
      border border-white/10
      shadow-lg
    `,
    gradient: `
      bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-teal-500/20
      backdrop-blur-xl text-white border border-white/20
      hover:from-cyan-500/30 hover:via-purple-500/30 hover:to-teal-500/30
    `,
    glow: `
      bg-gradient-to-r from-cyan-500 to-purple-600
      text-white font-bold
      shadow-[0_0_20px_rgba(0,196,255,0.5),0_0_40px_rgba(146,16,255,0.3)]
      hover:shadow-[0_0_30px_rgba(0,196,255,0.6),0_0_60px_rgba(146,16,255,0.4)]
      border border-cyan-400/30
    `,
    outline: `
      bg-transparent text-cyan-400
      border-2 border-cyan-400/40
      hover:bg-cyan-400/10 hover:border-cyan-400
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-600
      text-white font-semibold
      shadow-lg shadow-green-500/30
      hover:shadow-xl hover:shadow-green-500/40
      border border-green-400/20
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-600
      text-white font-semibold
      shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40
      border border-red-400/20
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-base rounded-xl gap-2',
    lg: 'px-6 py-3 text-lg rounded-xl gap-2.5',
    xl: 'px-8 py-4 text-xl rounded-2xl gap-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const baseStyles = `
    inline-flex items-center justify-center
    relative overflow-hidden
    font-medium transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <motion.button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit">
        {loading ? (
          <LoadingSpinner />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className={iconSizes[size]} />
        ) : null}

        {children}

        {!loading && Icon && iconPosition === 'right' && (
          <Icon className={iconSizes[size]} />
        )}
      </span>
    </motion.button>
  );
};

export default NeoButton;
