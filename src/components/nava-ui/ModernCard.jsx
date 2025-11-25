import React from 'react';
import { motion } from 'framer-motion';
import theme from '../../styles/navaUITheme';

/**
 * ModernCard - VisionOS-style glass card with depth and glow
 *
 * @param {string} variant - 'default' | 'glass' | 'glass-strong' | 'gradient'
 * @param {boolean} glow - Enable glow effect
 * @param {string} glowColor - 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
 * @param {boolean} hoverable - Enable hover lift effect
 * @param {boolean} animated - Enable entrance animation
 * @param {string} className - Additional Tailwind classes
 */
const ModernCard = ({
  children,
  variant = 'default',
  glow = false,
  glowColor = 'primary',
  hoverable = true,
  animated = true,
  className = '',
  onClick,
  ...props
}) => {
  // Base styles for all variants
  const baseStyles = 'relative overflow-hidden transition-all duration-300';

  // Variant-specific styles
  const variantStyles = {
    default: 'bg-[#1A1F2E] border border-white/10 rounded-2xl shadow-xl',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl',
    'glass-strong': 'bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl',
    gradient: 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-teal-500/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl',
  };

  // Glow styles
  const glowStyles = {
    primary: 'shadow-[0_0_20px_rgba(0,196,255,0.4),0_0_40px_rgba(0,196,255,0.2)]',
    secondary: 'shadow-[0_0_20px_rgba(0,255,204,0.4),0_0_40px_rgba(0,255,204,0.2)]',
    accent: 'shadow-[0_0_20px_rgba(146,16,255,0.4),0_0_40px_rgba(146,16,255,0.2)]',
    success: 'shadow-[0_0_20px_rgba(16,185,129,0.4),0_0_40px_rgba(16,185,129,0.2)]',
    warning: 'shadow-[0_0_20px_rgba(245,158,11,0.4),0_0_40px_rgba(245,158,11,0.2)]',
    error: 'shadow-[0_0_20px_rgba(239,68,68,0.4),0_0_40px_rgba(239,68,68,0.2)]',
  };

  // Hover styles
  const hoverStyles = hoverable ? 'hover:-translate-y-1 hover:shadow-2xl cursor-pointer' : '';

  // Animation variants
  const animationVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: hoverable ? {
      y: -4,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    } : {},
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.default}
    ${glow ? glowStyles[glowColor] : ''}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const CardComponent = animated ? motion.div : 'div';

  const motionProps = animated ? {
    initial: 'initial',
    animate: 'animate',
    whileHover: 'hover',
    variants: animationVariants,
  } : {};

  return (
    <CardComponent
      className={combinedClassName}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Mesh gradient overlay (subtle) */}
      {variant === 'gradient' && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: theme.gradients.mesh.cyber,
          }}
        />
      )}
    </CardComponent>
  );
};

export default ModernCard;
