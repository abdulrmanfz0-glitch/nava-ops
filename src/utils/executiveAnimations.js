/**
 * Executive Micro-Animations Library
 * Purposeful, delightful animations that enhance comprehension
 *
 * Principles:
 * - Every animation serves a purpose
 * - Respect user's motion preferences
 * - Optimize for performance (GPU-accelerated properties)
 * - Use natural, spring-based motion
 */

import { executiveAnimations } from '../styles/executiveDesignSystem';

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation config respecting user preferences
 */
const getAnimationConfig = (config) => {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      transition: { duration: 0.01 }
    };
  }
  return config;
};

/**
 * PAGE TRANSITIONS
 */
export const pageTransitions = {
  // Fade in new page
  fadeIn: getAnimationConfig({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  }),

  // Slide from right (forward navigation)
  slideFromRight: getAnimationConfig({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }),

  // Slide from left (back navigation)
  slideFromLeft: getAnimationConfig({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  })
};

/**
 * COMPONENT ENTRANCES
 */
export const entranceAnimations = {
  // Fade and slide up (default entrance)
  slideUp: getAnimationConfig({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  }),

  // Fade and slide down (from top)
  slideDown: getAnimationConfig({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  }),

  // Scale in (modals, popovers)
  scaleIn: getAnimationConfig({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] }
  }),

  // Spring bounce (celebratory, emphasis)
  springBounce: getAnimationConfig({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }),

  // Blur in (glass morphism elements)
  blurIn: getAnimationConfig({
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }
  })
};

/**
 * STAGGER ANIMATIONS
 * For lists and grids of items
 */
export const staggerAnimations = {
  // Container that staggers children
  container: getAnimationConfig({
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }),

  // Child items
  item: getAnimationConfig({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  }),

  // Grid items (from left to right, top to bottom)
  gridItem: getAnimationConfig({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  })
};

/**
 * INTERACTIVE ANIMATIONS
 * Hover, tap, focus states
 */
export const interactiveAnimations = {
  // Button hover/tap
  button: {
    hover: getAnimationConfig({
      scale: 1.02,
      transition: { duration: 0.15 }
    }),
    tap: getAnimationConfig({
      scale: 0.98,
      transition: { duration: 0.1 }
    })
  },

  // Card hover
  card: {
    hover: getAnimationConfig({
      y: -4,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    })
  },

  // Icon button hover
  iconButton: {
    hover: getAnimationConfig({
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.15 }
    }),
    tap: getAnimationConfig({
      scale: 0.95,
      transition: { duration: 0.1 }
    })
  },

  // Chip/badge hover
  chip: {
    hover: getAnimationConfig({
      scale: 1.05,
      transition: { duration: 0.15 }
    })
  }
};

/**
 * DATA VISUALIZATION ANIMATIONS
 */
export const dataVizAnimations = {
  // Number counter animation
  counter: {
    duration: 1.5,
    ease: [0.4, 0, 0.2, 1]
  },

  // Chart bars growing
  barGrow: getAnimationConfig({
    initial: { scaleY: 0, opacity: 0 },
    animate: { scaleY: 1, opacity: 1 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }),

  // Line chart drawing
  lineDraw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1, ease: 'easeInOut' }
  },

  // Pie chart segments
  pieSegment: getAnimationConfig({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] }
  }),

  // Sparkline
  sparkline: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

/**
 * LOADING ANIMATIONS
 */
export const loadingAnimations = {
  // Skeleton shimmer
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0']
    },
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity
    }
  },

  // Pulse
  pulse: {
    animate: {
      opacity: [1, 0.5, 1]
    },
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity
    }
  },

  // Spinner rotation
  spin: {
    animate: {
      rotate: 360
    },
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity
    }
  },

  // Dots
  dot: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.5, 1]
    },
    transition: {
      duration: 1,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

/**
 * SUCCESS & FEEDBACK ANIMATIONS
 */
export const feedbackAnimations = {
  // Success checkmark
  checkmark: getAnimationConfig({
    initial: { scale: 0, rotate: -45 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }),

  // Error shake
  shake: getAnimationConfig({
    animate: {
      x: [0, -10, 10, -10, 10, 0]
    },
    transition: {
      duration: 0.4
    }
  }),

  // Success badge
  successBadge: getAnimationConfig({
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 12
    }
  }),

  // Notification slide in
  notification: getAnimationConfig({
    initial: { opacity: 0, y: -50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  })
};

/**
 * METRIC ANIMATIONS
 * Special animations for KPIs and metrics
 */
export const metricAnimations = {
  // Trend indicator (up/down arrow)
  trendIndicator: {
    up: getAnimationConfig({
      initial: { y: 5, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
    }),
    down: getAnimationConfig({
      initial: { y: -5, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
    })
  },

  // Metric value change highlight
  valueChange: getAnimationConfig({
    animate: {
      backgroundColor: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0)', 'rgba(16, 185, 129, 0)']
    },
    transition: {
      duration: 1.5,
      ease: 'easeOut'
    }
  }),

  // Insight badge pop in
  insightBadge: getAnimationConfig({
    initial: { scale: 0, rotate: -10 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20
    }
  })
};

/**
 * MODAL & OVERLAY ANIMATIONS
 */
export const modalAnimations = {
  // Backdrop fade
  backdrop: getAnimationConfig({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  }),

  // Modal dialog
  dialog: getAnimationConfig({
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] }
  }),

  // Drawer from side
  drawer: {
    right: getAnimationConfig({
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }),
    left: getAnimationConfig({
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    })
  },

  // Dropdown menu
  dropdown: getAnimationConfig({
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.15, ease: [0, 0, 0.2, 1] }
  })
};

/**
 * ATTENTION ANIMATIONS
 * Draw user attention to important elements
 */
export const attentionAnimations = {
  // Gentle pulse
  pulse: {
    animate: {
      scale: [1, 1.05, 1]
    },
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  },

  // Glow effect
  glow: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(0, 136, 255, 0)',
        '0 0 0 10px rgba(0, 136, 255, 0.1)',
        '0 0 0 0 rgba(0, 136, 255, 0)'
      ]
    },
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  },

  // Wiggle (for errors or important actions)
  wiggle: {
    animate: {
      rotate: [0, -5, 5, -5, 5, 0]
    },
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },

  // Bounce (for new notifications)
  bounce: {
    animate: {
      y: [0, -10, 0, -5, 0]
    },
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

/**
 * Utility function to create custom animation
 */
export const createAnimation = (config) => {
  return getAnimationConfig(config);
};

/**
 * Export all animations
 */
export default {
  pageTransitions,
  entranceAnimations,
  staggerAnimations,
  interactiveAnimations,
  dataVizAnimations,
  loadingAnimations,
  feedbackAnimations,
  metricAnimations,
  modalAnimations,
  attentionAnimations,
  createAnimation,
  prefersReducedMotion
};
