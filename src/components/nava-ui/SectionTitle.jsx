import React from 'react';
import { motion } from 'framer-motion';

/**
 * SectionTitle - Modern section heading with accent line
 *
 * @param {string} title - Main title text
 * @param {string} subtitle - Optional subtitle
 * @param {React.Component} icon - Optional icon
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} accent - 'primary' | 'secondary' | 'accent' | 'gradient'
 * @param {boolean} animated - Enable entrance animation
 * @param {React.Node} action - Optional action element (e.g., button)
 */
const SectionTitle = ({
  title,
  subtitle,
  icon: Icon,
  size = 'lg',
  accent = 'primary',
  animated = true,
  action,
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: {
      title: 'text-lg',
      subtitle: 'text-xs',
      icon: 'w-5 h-5',
      spacing: 'mb-3',
    },
    md: {
      title: 'text-xl',
      subtitle: 'text-sm',
      icon: 'w-6 h-6',
      spacing: 'mb-4',
    },
    lg: {
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-sm md:text-base',
      icon: 'w-7 h-7',
      spacing: 'mb-6',
    },
    xl: {
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-base md:text-lg',
      icon: 'w-8 h-8',
      spacing: 'mb-8',
    },
  };

  // Accent colors
  const accentColors = {
    primary: 'from-cyan-500 to-blue-500',
    secondary: 'from-teal-500 to-cyan-500',
    accent: 'from-purple-500 to-pink-500',
    gradient: 'from-cyan-500 via-purple-500 to-teal-500',
  };

  const iconColors = {
    primary: 'text-cyan-400',
    secondary: 'text-teal-400',
    accent: 'text-purple-400',
    gradient: 'text-cyan-400',
  };

  const sizeStyle = sizeStyles[size] || sizeStyles.lg;

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const TitleComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: 'initial',
    animate: 'animate',
    variants: animationVariants,
  } : {};

  return (
    <TitleComponent className={`${sizeStyle.spacing} ${className}`} {...motionProps}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Title with icon */}
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <motion.div
                className={`${iconColors[accent]} ${sizeStyle.icon}`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-full h-full" />
              </motion.div>
            )}
            <h2 className={`${sizeStyle.title} font-bold text-white tracking-tight`}>
              {title}
            </h2>
          </div>

          {/* Accent line */}
          <motion.div
            className={`h-1 rounded-full bg-gradient-to-r ${accentColors[accent]}`}
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className={`${sizeStyle.subtitle} text-white/60 mt-3 max-w-2xl`}
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Action element */}
        {action && (
          <motion.div
            initial={animated ? { opacity: 0, x: 10 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </TitleComponent>
  );
};

export default SectionTitle;
