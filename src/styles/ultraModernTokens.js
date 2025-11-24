/**
 * Ultra Modern Design Tokens - PRIMARY DESIGN SYSTEM
 * Cutting-edge design system for NAVA OPS dashboard
 *
 * This is the official design system for all new components.
 *
 * Features:
 * - Glassmorphism effects with backdrop blur
 * - Dynamic gradients and mesh backgrounds
 * - Neon accents and glow effects
 * - Framer Motion animation variants
 * - Advanced shadow systems
 * - Futuristic component theming
 *
 * Usage:
 * import { ultraColors, ultraGradients, ultraShadows } from '@/styles/ultraModernTokens';
 */

// ============================================================================
// COLOR SYSTEM - FUTURISTIC PALETTE
// ============================================================================

export const ultraColors = {
  // Primary Gradient Colors
  neon: {
    blue: '#00D4FF',
    purple: '#8B5CF6',
    pink: '#EC4899',
    cyan: '#22D3EE',
    green: '#10B981',
    orange: '#F97316',
    gold: '#FFD700',
  },

  // Glassmorphism Backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    heavy: 'rgba(255, 255, 255, 0.18)',
    card: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(255, 255, 255, 0.2)',
  },

  // Dark Theme Core Colors
  dark: {
    primary: '#0A0F1C',
    secondary: '#111827',
    tertiary: '#1F2937',
    surface: '#0D1117',
    elevated: '#161B22',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },

  // Light Theme Core Colors
  light: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    surface: '#FFFFFF',
    elevated: '#FAFAFA',
    overlay: 'rgba(255, 255, 255, 0.8)',
  },

  // Semantic Colors
  semantic: {
    success: {
      base: '#10B981',
      light: '#34D399',
      dark: '#059669',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    warning: {
      base: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    error: {
      base: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
    info: {
      base: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      glow: 'rgba(59, 130, 246, 0.4)',
    },
  },
};

// ============================================================================
// GRADIENT SYSTEM
// ============================================================================

export const ultraGradients = {
  // Hero Gradients
  aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
  ocean: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  fire: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  night: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',

  // Premium Gradients
  premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
  platinum: 'linear-gradient(135deg, #E5E4E2 0%, #B4B4B4 50%, #999999 100%)',

  // Card Gradients
  card: {
    blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    green: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)',
    orange: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)',
  },

  // Mesh Gradients
  mesh: {
    primary: `
      radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(16, 185, 129, 0.2) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)
    `,
    dark: `
      radial-gradient(at 40% 20%, rgba(0, 212, 255, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)
    `,
  },

  // Glow Gradients
  glow: {
    blue: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
    purple: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
    cyan: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
  },
};

// ============================================================================
// SHADOWS - ELEVATION SYSTEM
// ============================================================================

export const ultraShadows = {
  // Glass Shadows
  glass: {
    sm: '0 2px 8px -2px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
    md: '0 8px 24px -4px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
    lg: '0 16px 48px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
  },

  // Glow Shadows
  glow: {
    blue: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
    purple: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
    cyan: '0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(34, 211, 238, 0.3)',
    green: '0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3)',
    gold: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
    pink: '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)',
  },

  // Elevation Shadows
  elevation: {
    1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    3: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)',
    4: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    5: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },

  // Neon Shadows
  neon: {
    blue: '0 0 5px #00D4FF, 0 0 10px #00D4FF, 0 0 20px #00D4FF, 0 0 40px #00D4FF',
    purple: '0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 20px #8B5CF6, 0 0 40px #8B5CF6',
    cyan: '0 0 5px #22D3EE, 0 0 10px #22D3EE, 0 0 20px #22D3EE, 0 0 40px #22D3EE',
    gold: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 40px #FFD700',
  },
};

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const ultraAnimations = {
  // Durations
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Framer Motion Variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    staggerChildren: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
  },
};

// ============================================================================
// BLUR & EFFECTS
// ============================================================================

export const ultraEffects = {
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },

  backdrop: {
    glass: 'blur(16px) saturate(180%)',
    frosted: 'blur(24px) saturate(150%)',
    crystal: 'blur(32px) saturate(200%)',
  },

  overlay: {
    dark: 'rgba(0, 0, 0, 0.5)',
    light: 'rgba(255, 255, 255, 0.5)',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
  },
};

// ============================================================================
// COMPONENT THEMES
// ============================================================================

export const componentThemes = {
  card: {
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(20px)',
      shadow: ultraShadows.glass.md,
    },
    elevated: {
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      shadow: ultraShadows.elevation[3],
    },
    gradient: {
      background: ultraGradients.card.blue,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      shadow: ultraShadows.glow.blue,
    },
  },

  button: {
    primary: {
      background: ultraGradients.ocean,
      color: '#ffffff',
      shadow: ultraShadows.glow.blue,
      hoverShadow: ultraShadows.neon.blue,
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      hoverBackground: 'rgba(255, 255, 255, 0.05)',
    },
  },

  input: {
    default: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      focusBorder: '1px solid rgba(59, 130, 246, 0.5)',
      focusShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
    },
  },
};

// ============================================================================
// CHART COLOR PALETTE
// ============================================================================

export const chartColors = {
  primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'],
  vibrant: ['#00D4FF', '#8B5CF6', '#EC4899', '#FFD700', '#10B981', '#F97316'],
  pastel: ['#93C5FD', '#C4B5FD', '#F9A8D4', '#FDE68A', '#A7F3D0', '#A5F3FC'],
  gradient: [
    ['#3B82F6', '#8B5CF6'],
    ['#EC4899', '#F59E0B'],
    ['#10B981', '#06B6D4'],
  ],
};

// ============================================================================
// EXPORT COMPLETE DESIGN SYSTEM
// ============================================================================

export const ultraModernTokens = {
  colors: ultraColors,
  gradients: ultraGradients,
  shadows: ultraShadows,
  animations: ultraAnimations,
  effects: ultraEffects,
  componentThemes,
  chartColors,
};

export default ultraModernTokens;
