import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * GlassCard - Modern glassmorphic card with hover effects
 * Features: Backdrop blur, gradient borders, glow effects, smooth animations
 */
const GlassCard = ({
  children,
  className = '',
  variant = 'default',
  glow = false,
  glowColor = 'blue',
  hover = true,
  padding = 'md',
  onClick,
  animate = true,
  delay = 0,
}) => {
  // Padding variants
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Glow color variants
  const glowColors = {
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    green: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    gold: 'hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
  };

  // Card style variants
  const variantStyles = {
    default: `
      bg-white/[0.03] dark:bg-white/[0.03]
      backdrop-blur-xl
      border border-white/[0.08] dark:border-white/[0.08]
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    `,
    solid: `
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      shadow-lg
    `,
    gradient: `
      bg-gradient-to-br from-white/[0.08] to-white/[0.02]
      dark:from-white/[0.08] dark:to-white/[0.02]
      backdrop-blur-xl
      border border-white/[0.1]
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    `,
    elevated: `
      bg-white/[0.06] dark:bg-white/[0.06]
      backdrop-blur-2xl
      border border-white/[0.12]
      shadow-[0_20px_50px_rgba(0,0,0,0.2)]
    `,
    neon: `
      bg-black/30 dark:bg-black/30
      backdrop-blur-xl
      border border-cyan-500/30
      shadow-[0_0_20px_rgba(34,211,238,0.2)]
    `,
  };

  // Hover effects
  const hoverStyles = hover ? `
    transition-all duration-500 ease-out
    hover:-translate-y-1
    hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
    hover:border-white/[0.15]
    ${glow ? glowColors[glowColor] : ''}
  ` : '';

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const CardComponent = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: 'hidden',
    animate: 'visible',
    variants: cardVariants,
  } : {};

  return (
    <CardComponent
      className={`
        rounded-2xl overflow-hidden
        ${variantStyles[variant]}
        ${paddingMap[padding]}
        ${hoverStyles}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </CardComponent>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'solid', 'gradient', 'elevated', 'neon']),
  glow: PropTypes.bool,
  glowColor: PropTypes.oneOf(['blue', 'purple', 'cyan', 'green', 'gold', 'pink']),
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  onClick: PropTypes.func,
  animate: PropTypes.bool,
  delay: PropTypes.number,
};

export default GlassCard;
