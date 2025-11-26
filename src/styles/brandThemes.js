/**
 * NAVA Brand Themes System
 * Multi-tenant theming with brand-specific customization
 *
 * Each theme includes:
 * - Color palette (primary, secondary, accent, semantic)
 * - Typography settings
 * - Component-specific styles
 * - Effects and animations
 */

/**
 * Default NAVA Theme - Executive Intelligence Design Language
 */
const navaDefault = {
  id: 'nava-default',
  name: 'NAVA Executive',
  description: 'Premium executive dashboard with intelligence-first design',

  colors: {
    // Primary brand colors
    primary: '#0088FF',        // NAVA Blue - Intelligence & Trust
    primaryLight: '#33A3FF',
    primaryDark: '#0066CC',

    // Secondary colors
    secondary: '#FFD700',      // NAVA Gold - Premium & Excellence
    secondaryLight: '#FFE44D',
    secondaryDark: '#CCac00',

    // Accent colors
    accent: '#8B5CF6',         // Purple - Innovation
    success: '#10B981',        // Green - Positive metrics
    warning: '#F59E0B',        // Amber - Attention needed
    danger: '#EF4444',         // Red - Critical alerts
    info: '#06B6D4',           // Cyan - Information

    // Neutral palette
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      dark: '#111827',
      darkSecondary: '#1F2937',
      darkTertiary: '#374151'
    },

    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      light: '#D1D5DB'
    },

    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      heavy: '#9CA3AF'
    },

    // Special effects
    glass: {
      light: 'rgba(255, 255, 255, 0.7)',
      medium: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(17, 24, 39, 0.7)'
    },

    glow: {
      primary: 'rgba(0, 136, 255, 0.3)',
      secondary: 'rgba(255, 215, 0, 0.3)',
      accent: 'rgba(139, 92, 246, 0.3)',
      success: 'rgba(16, 185, 129, 0.3)'
    }
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace'
    },

    scale: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem'     // 72px
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },

    lineHeights: {
      xs: 1.2,
      sm: 1.3,
      base: 1.5,
      lg: 1.6,
      xl: 1.7,
      '2xl': 1.3,
      '3xl': 1.2,
      '4xl': 1.1,
      '5xl': 1,
      '6xl': 1,
      '7xl': 1
    }
  },

  spacing: {
    unit: '4px',  // Base spacing unit (1 = 4px, 2 = 8px, etc.)
  },

  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px'
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(0, 136, 255, 0.3)',
    glowLg: '0 0 40px rgba(0, 136, 255, 0.4)'
  },

  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      blur: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },

    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
    },

    animations: {
      spring: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      },
      smooth: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.3
      }
    }
  },

  components: {
    // KPI Card styling
    kpiCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    },

    // Button variants
    button: {
      primary: {
        background: '#0088FF',
        hoverBackground: '#0066CC',
        color: '#FFFFFF'
      },
      secondary: {
        background: '#F3F4F6',
        hoverBackground: '#E5E7EB',
        color: '#111827'
      }
    },

    // Navigation
    sidebar: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      itemHoverBackground: 'rgba(0, 136, 255, 0.1)',
      itemActiveBackground: 'rgba(0, 136, 255, 0.15)',
      width: '280px',
      collapsedWidth: '80px'
    }
  }
};

/**
 * Dark Mode Theme
 */
const navaDark = {
  ...navaDefault,
  id: 'nava-dark',
  name: 'NAVA Executive Dark',
  description: 'Premium dark mode for extended use',

  colors: {
    ...navaDefault.colors,

    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      dark: '#0F172A',
      darkSecondary: '#1E293B',
      darkTertiary: '#334155'
    },

    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      inverse: '#0F172A',
      light: '#64748B'
    },

    border: {
      light: '#334155',
      medium: '#475569',
      heavy: '#64748B'
    },

    glass: {
      light: 'rgba(15, 23, 42, 0.7)',
      medium: 'rgba(15, 23, 42, 0.5)',
      dark: 'rgba(15, 23, 42, 0.9)'
    }
  },

  components: {
    ...navaDefault.components,

    kpiCard: {
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      padding: '1.5rem'
    },

    sidebar: {
      background: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      itemHoverBackground: 'rgba(0, 136, 255, 0.2)',
      itemActiveBackground: 'rgba(0, 136, 255, 0.3)',
      width: '280px',
      collapsedWidth: '80px'
    }
  }
};

/**
 * Restaurant Brand Template - Warm & Inviting
 */
const restaurantWarm = {
  ...navaDefault,
  id: 'restaurant-warm',
  name: 'Restaurant Warm',
  description: 'Warm, inviting theme perfect for casual dining brands',

  colors: {
    ...navaDefault.colors,
    primary: '#D97706',        // Warm amber
    primaryLight: '#F59E0B',
    primaryDark: '#B45309',

    secondary: '#DC2626',      // Rich red
    secondaryLight: '#EF4444',
    secondaryDark: '#B91C1C',

    accent: '#059669',         // Fresh green
  }
};

/**
 * Restaurant Brand Template - Fresh & Modern
 */
const restaurantFresh = {
  ...navaDefault,
  id: 'restaurant-fresh',
  name: 'Restaurant Fresh',
  description: 'Fresh, modern theme for health-focused brands',

  colors: {
    ...navaDefault.colors,
    primary: '#10B981',        // Fresh green
    primaryLight: '#34D399',
    primaryDark: '#059669',

    secondary: '#06B6D4',      // Cyan
    secondaryLight: '#22D3EE',
    secondaryDark: '#0891B2',

    accent: '#F59E0B',         // Warm accent
  }
};

/**
 * Restaurant Brand Template - Premium & Elegant
 */
const restaurantPremium = {
  ...navaDefault,
  id: 'restaurant-premium',
  name: 'Restaurant Premium',
  description: 'Elegant, sophisticated theme for fine dining',

  colors: {
    ...navaDefault.colors,
    primary: '#1F2937',        // Deep charcoal
    primaryLight: '#374151',
    primaryDark: '#111827',

    secondary: '#D4AF37',      // Metallic gold
    secondaryLight: '#EBC351',
    secondaryDark: '#AA8C2D',

    accent: '#7C3AED',         // Royal purple
  }
};

/**
 * Fast Food Theme - Bold & Energetic
 */
const fastFood = {
  ...navaDefault,
  id: 'fast-food',
  name: 'Fast Food Energy',
  description: 'Bold, energetic theme for quick-service restaurants',

  colors: {
    ...navaDefault.colors,
    primary: '#DC2626',        // Bold red
    primaryLight: '#EF4444',
    primaryDark: '#B91C1C',

    secondary: '#FBBF24',      // Vibrant yellow
    secondaryLight: '#FCD34D',
    secondaryDark: '#F59E0B',

    accent: '#0EA5E9',         // Sky blue
  }
};

/**
 * Cafe Theme - Cozy & Warm
 */
const cafeTheme = {
  ...navaDefault,
  id: 'cafe',
  name: 'Cafe Cozy',
  description: 'Warm, cozy theme perfect for cafes and coffee shops',

  colors: {
    ...navaDefault.colors,
    primary: '#92400E',        // Coffee brown
    primaryLight: '#B45309',
    primaryDark: '#78350F',

    secondary: '#F59E0B',      // Warm amber
    secondaryLight: '#FBBF24',
    secondaryDark: '#D97706',

    accent: '#059669',         // Fresh accent
  }
};

/**
 * Export all brand themes
 */
export const brandThemes = {
  'nava-default': navaDefault,
  'nava-dark': navaDark,
  'restaurant-warm': restaurantWarm,
  'restaurant-fresh': restaurantFresh,
  'restaurant-premium': restaurantPremium,
  'fast-food': fastFood,
  'cafe': cafeTheme
};

/**
 * Helper function to get theme by ID
 */
export const getTheme = (themeId) => {
  return brandThemes[themeId] || brandThemes['nava-default'];
};

/**
 * Helper function to get all available themes
 */
export const getAvailableThemes = () => {
  return Object.keys(brandThemes).map(id => ({
    id,
    name: brandThemes[id].name,
    description: brandThemes[id].description
  }));
};

export default brandThemes;
