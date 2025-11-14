// NAVA OPS - Dashboard v2 Theme System
// Stunning visual design system with gradients, colors, and effects

export const dashboardTheme = {
  // Enhanced color palette with gradients
  colors: {
    primary: {
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/30'
    },
    success: {
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/30'
    },
    warning: {
      gradient: 'from-amber-500 via-orange-500 to-yellow-600',
      glow: 'shadow-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30'
    },
    danger: {
      gradient: 'from-rose-500 via-red-600 to-pink-600',
      glow: 'shadow-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      border: 'border-rose-500/30'
    },
    purple: {
      gradient: 'from-purple-500 via-violet-600 to-indigo-600',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      border: 'border-purple-500/30'
    },
    cyan: {
      gradient: 'from-cyan-500 via-blue-500 to-teal-600',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      border: 'border-cyan-500/30'
    }
  },

  // Glassmorphism effects
  glass: {
    light: 'bg-white/80 backdrop-blur-xl border border-gray-200/50',
    dark: 'dark:bg-gray-800/80 dark:backdrop-blur-xl dark:border-gray-700/50',
    combined: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50'
  },

  // Card styles
  card: {
    elevated: 'shadow-xl shadow-black/5 dark:shadow-black/20',
    glow: 'shadow-2xl',
    interactive: 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'
  },

  // Animation variants
  animations: {
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    }
  },

  // Stagger configurations
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    fast: {
      animate: {
        transition: {
          staggerChildren: 0.05
        }
      }
    },
    slow: {
      animate: {
        transition: {
          staggerChildren: 0.2
        }
      }
    }
  },

  // Gradient backgrounds
  gradients: {
    mesh: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20',
    radial: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900',
    aurora: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-indigo-900/30'
  }
};

// Utility function to get color theme
export const getColorTheme = (color) => {
  return dashboardTheme.colors[color] || dashboardTheme.colors.primary;
};

// Utility function to get trend color
export const getTrendColor = (value, previousValue) => {
  if (!previousValue || value === previousValue) return 'cyan';
  return value > previousValue ? 'success' : 'danger';
};

// Utility function to format percentage change
export const formatPercentageChange = (current, previous) => {
  if (!previous || previous === 0) return { value: 0, formatted: '0%' };
  const change = ((current - previous) / previous) * 100;
  const formatted = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  return { value: change, formatted };
};
