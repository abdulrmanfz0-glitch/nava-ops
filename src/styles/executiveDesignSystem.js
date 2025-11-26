/**
 * Executive Design System - Enhanced Design Tokens
 * Premium design language for executive dashboards
 *
 * Design Principles:
 * 1. Clarity Over Complexity
 * 2. Action Over Observation
 * 3. Context Over Isolation
 * 4. Intelligence Over Raw Data
 * 5. Speed Over Ceremony
 */

/**
 * Executive Typography Scale
 * Purpose-driven typography with semantic naming
 */
export const executiveTypography = {
  // Display - Hero metrics and page titles
  display: {
    hero: {
      fontSize: '4.5rem',      // 72px - Dashboard hero metrics
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    },
    large: {
      fontSize: '3.75rem',     // 60px - Major KPIs
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    },
    medium: {
      fontSize: '3rem',        // 48px - Section headers
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    },
    small: {
      fontSize: '2.25rem',     // 36px - Sub-headers
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  },

  // Headings - Structural hierarchy
  heading: {
    h1: {
      fontSize: '1.875rem',    // 30px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    h2: {
      fontSize: '1.5rem',      // 24px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em'
    },
    h3: {
      fontSize: '1.25rem',     // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0'
    },
    h4: {
      fontSize: '1.125rem',    // 18px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    h5: {
      fontSize: '1rem',        // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    h6: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    }
  },

  // Body - Content and descriptions
  body: {
    large: {
      fontSize: '1.125rem',    // 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0'
    },
    base: {
      fontSize: '1rem',        // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    small: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    }
  },

  // Labels - Form labels and UI elements
  label: {
    large: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      textTransform: 'none'
    },
    base: {
      fontSize: '0.75rem',     // 12px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    },
    small: {
      fontSize: '0.6875rem',   // 11px
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0.03em',
      textTransform: 'uppercase'
    }
  },

  // Metrics - Numbers and data values
  metric: {
    primary: {
      fontSize: '2.25rem',     // 36px - Main KPI value
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      fontFeatureSettings: '"tnum", "lnum"'  // Tabular numerals
    },
    secondary: {
      fontSize: '1.5rem',      // 24px - Secondary metrics
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.005em',
      fontFeatureSettings: '"tnum", "lnum"'
    },
    tertiary: {
      fontSize: '1.125rem',    // 18px - Supporting data
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0',
      fontFeatureSettings: '"tnum", "lnum"'
    },
    inline: {
      fontSize: '1rem',        // 16px - Inline numbers
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0',
      fontFeatureSettings: '"tnum", "lnum"'
    }
  },

  // Code - Monospace for IDs, codes, technical data
  code: {
    base: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: 'ui-monospace, SFMono-Regular, monospace'
    },
    small: {
      fontSize: '0.75rem',     // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: 'ui-monospace, SFMono-Regular, monospace'
    }
  },

  // Caption - Micro-copy and metadata
  caption: {
    base: {
      fontSize: '0.75rem',     // 12px
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0'
    },
    small: {
      fontSize: '0.6875rem',   // 11px
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.01em'
    }
  }
};

/**
 * Executive Color Semantics
 * Purpose-driven color usage with semantic meaning
 */
export const executiveColorSemantics = {
  // Status colors
  status: {
    excellent: {
      color: '#059669',        // Strong green - Exceeding targets
      background: '#D1FAE5',
      border: '#6EE7B7'
    },
    good: {
      color: '#10B981',        // Green - Meeting targets
      background: '#ECFDF5',
      border: '#A7F3D0'
    },
    neutral: {
      color: '#6B7280',        // Gray - Stable
      background: '#F3F4F6',
      border: '#D1D5DB'
    },
    warning: {
      color: '#D97706',        // Amber - Needs attention
      background: '#FEF3C7',
      border: '#FCD34D'
    },
    critical: {
      color: '#DC2626',        // Red - Urgent action needed
      background: '#FEE2E2',
      border: '#FCA5A5'
    }
  },

  // Trend indicators
  trend: {
    positive: {
      color: '#059669',
      background: 'rgba(5, 150, 105, 0.1)',
      icon: '↑'
    },
    negative: {
      color: '#DC2626',
      background: 'rgba(220, 38, 38, 0.1)',
      icon: '↓'
    },
    neutral: {
      color: '#6B7280',
      background: 'rgba(107, 114, 128, 0.1)',
      icon: '→'
    }
  },

  // Priority levels
  priority: {
    high: {
      color: '#DC2626',
      background: '#FEE2E2',
      border: '#FCA5A5',
      badge: 'HIGH'
    },
    medium: {
      color: '#F59E0B',
      background: '#FEF3C7',
      border: '#FCD34D',
      badge: 'MEDIUM'
    },
    low: {
      color: '#6B7280',
      background: '#F3F4F6',
      border: '#D1D5DB',
      badge: 'LOW'
    }
  },

  // Sentiment indicators
  sentiment: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280',
    mixed: '#F59E0B'
  },

  // Data visualization palette - Accessible & distinctive
  dataViz: {
    primary: ['#0088FF', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    sequential: {
      blue: ['#DBEAFE', '#93C5FD', '#3B82F6', '#1E40AF', '#1E3A8A'],
      green: ['#D1FAE5', '#6EE7B7', '#10B981', '#047857', '#064E3B'],
      amber: ['#FEF3C7', '#FCD34D', '#F59E0B', '#D97706', '#92400E'],
      red: ['#FEE2E2', '#FCA5A5', '#EF4444', '#DC2626', '#991B1B']
    },
    diverging: {
      redGreen: ['#DC2626', '#F87171', '#E5E7EB', '#6EE7B7', '#10B981'],
      purpleGreen: ['#8B5CF6', '#C084FC', '#E5E7EB', '#6EE7B7', '#10B981']
    }
  }
};

/**
 * Executive Spacing System
 * Consistent spacing with semantic names
 */
export const executiveSpacing = {
  // Component spacing
  component: {
    xs: '0.5rem',      // 8px - Tight internal spacing
    sm: '0.75rem',     // 12px - Comfortable internal spacing
    md: '1rem',        // 16px - Standard internal spacing
    lg: '1.5rem',      // 24px - Generous internal spacing
    xl: '2rem',        // 32px - Section spacing
    '2xl': '3rem',     // 48px - Major section spacing
    '3xl': '4rem'      // 64px - Page section spacing
  },

  // Layout spacing
  layout: {
    gutter: '1.5rem',          // Grid gutter
    sidebarPadding: '1.5rem',  // Sidebar internal padding
    contentPadding: '2rem',    // Main content padding
    cardPadding: '1.5rem',     // Card internal padding
    sectionGap: '3rem'         // Gap between major sections
  },

  // Inline spacing
  inline: {
    tight: '0.25rem',   // 4px
    base: '0.5rem',     // 8px
    relaxed: '1rem'     // 16px
  }
};

/**
 * Executive Elevation System
 * Shadow and layering with semantic meaning
 */
export const executiveElevation = {
  levels: {
    flat: {
      shadow: 'none',
      zIndex: 0,
      description: 'Baseline level, no elevation'
    },
    raised: {
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      zIndex: 1,
      description: 'Slightly raised, subtle depth'
    },
    elevated: {
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 10,
      description: 'Cards, panels, elevated content'
    },
    floating: {
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 20,
      description: 'Floating panels, dropdown menus'
    },
    modal: {
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      zIndex: 50,
      description: 'Modal dialogs, overlays'
    },
    popover: {
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      zIndex: 100,
      description: 'Popovers, tooltips, top-level UI'
    }
  },

  // Glass effect elevations
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      blur: '8px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.5)',
      blur: '12px',
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.3)',
      blur: '16px',
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  }
};

/**
 * Executive Animation Tokens
 * Performance-optimized animations with semantic timing
 */
export const executiveAnimations = {
  // Duration tokens
  duration: {
    instant: 100,      // Instant feedback (hover states)
    fast: 200,         // Quick transitions (dropdowns)
    base: 300,         // Standard transitions (modals, panels)
    slow: 500,         // Deliberate animations (page transitions)
    slower: 700        // Emphasis animations
  },

  // Easing functions
  easing: {
    // Entrances - Elements appearing
    entrance: 'cubic-bezier(0.0, 0.0, 0.2, 1)',        // Deceleration curve

    // Exits - Elements leaving
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',              // Acceleration curve

    // Standard - Balanced motion
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',        // Standard easing

    // Emphasis - Draw attention
    emphasis: 'cubic-bezier(0.0, 0.0, 0.2, 1)',        // Sharp easing

    // Spring - Natural motion
    spring: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },

  // Framer Motion variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }
  }
};

/**
 * Executive Component Patterns
 * Reusable patterns for common UI elements
 */
export const executivePatterns = {
  // KPI Card pattern
  kpiCard: {
    structure: {
      label: executiveTypography.label.base,
      value: executiveTypography.metric.primary,
      change: executiveTypography.body.small,
      insight: executiveTypography.caption.base
    },
    spacing: {
      internal: executiveSpacing.component.md,
      labelToValue: executiveSpacing.inline.base,
      valueToChange: executiveSpacing.inline.tight
    },
    visual: {
      borderRadius: '0.75rem',
      padding: '1.5rem',
      minHeight: '140px'
    }
  },

  // Insight Panel pattern
  insightPanel: {
    structure: {
      title: executiveTypography.heading.h4,
      description: executiveTypography.body.base,
      action: executiveTypography.label.large
    },
    spacing: {
      internal: executiveSpacing.component.lg,
      titleToDescription: executiveSpacing.inline.base,
      descriptionToAction: executiveSpacing.component.md
    },
    visual: {
      borderRadius: '1rem',
      padding: '2rem',
      iconSize: '24px'
    }
  },

  // Alert pattern
  alert: {
    structure: {
      title: executiveTypography.heading.h5,
      description: executiveTypography.body.small,
      timestamp: executiveTypography.caption.base
    },
    spacing: {
      internal: executiveSpacing.component.sm,
      iconToContent: executiveSpacing.inline.base
    },
    visual: {
      borderRadius: '0.5rem',
      padding: '1rem',
      borderLeft: '4px solid'
    }
  }
};

/**
 * Accessibility Tokens
 * WCAG 2.1 AA compliant specifications
 */
export const executiveAccessibility = {
  // Contrast ratios (WCAG 2.1 AA)
  contrast: {
    text: {
      normal: 4.5,      // Normal text: 4.5:1 minimum
      large: 3,         // Large text (18px+): 3:1 minimum
      graphics: 3       // UI components & graphics: 3:1 minimum
    }
  },

  // Focus indicators
  focus: {
    outline: '2px solid #0088FF',
    outlineOffset: '2px',
    borderRadius: '0.25rem'
  },

  // Touch targets (minimum 44x44px)
  touchTarget: {
    minimum: '44px',
    comfortable: '48px',
    spacious: '56px'
  },

  // Motion preferences
  motion: {
    // Respects prefers-reduced-motion
    reduced: {
      transition: 'none',
      animation: 'none'
    }
  }
};

/**
 * Export complete design system
 */
export const executiveDesignSystem = {
  typography: executiveTypography,
  colors: executiveColorSemantics,
  spacing: executiveSpacing,
  elevation: executiveElevation,
  animations: executiveAnimations,
  patterns: executivePatterns,
  accessibility: executiveAccessibility
};

export default executiveDesignSystem;
