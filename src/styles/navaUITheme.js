/**
 * NAVA UI DESIGN SYSTEM
 * VisionOS-Inspired Ultra-Modern Theme
 *
 * This theme provides the foundational design tokens for the complete
 * visual rebuild of Nava Ops with futuristic, premium aesthetics.
 */

// ================================================================
// COLOR SYSTEM - Dark-First Premium Palette
// ================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#E0F7FF',
    100: '#B8EEFF',
    200: '#8DE5FF',
    300: '#5DD9FF',
    400: '#2BCFFF',
    500: '#00C4FF',  // Main cyan
    600: '#00A8E0',
    700: '#0088B8',
    800: '#006B8F',
    900: '#004E66',
  },

  // Secondary - Electric Teal
  secondary: {
    50: '#E0FFF9',
    100: '#B3FFF0',
    200: '#80FFE6',
    300: '#4DFFDC',
    400: '#26FFD4',
    500: '#00FFCC',  // Main teal
    600: '#00D9AD',
    700: '#00B38F',
    800: '#008C70',
    900: '#006652',
  },

  // Accent - Purple
  accent: {
    50: '#F3E5FF',
    100: '#E0B8FF',
    200: '#CC8AFF',
    300: '#B85CFF',
    400: '#A533FF',
    500: '#9210FF',  // Main purple
    600: '#7A0DD9',
    700: '#6209B3',
    800: '#4A068C',
    900: '#320466',
  },

  // Neon Accents
  neon: {
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    yellow: '#FFFF00',
    green: '#00FF00',
    pink: '#FF00AA',
    blue: '#0088FF',
  },

  // Grayscale - Premium Dark Mode
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    950: '#1A1D23',
  },

  // Dark Mode Background System
  dark: {
    bg: {
      primary: '#0A0E14',      // Main background
      secondary: '#0F131A',    // Secondary surface
      tertiary: '#141923',     // Elevated surface
      elevated: '#1A1F2E',     // Cards/modals
      glass: 'rgba(20, 25, 35, 0.7)',  // Glass effect
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
  },

  // Semantic Colors
  success: {
    50: '#E6FCF5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  warning: {
    50: '#FFF7ED',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
};

// ================================================================
// SPACING SYSTEM - Consistent Rhythm
// ================================================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
};

// ================================================================
// BORDER RADIUS - Modern Rounded Corners
// ================================================================

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '28px',
  '3xl': '36px',
  full: '9999px',
};

// ================================================================
// TYPOGRAPHY SYSTEM
// ================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'SF Pro Display', 'Geist', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Fira Code', 'Consolas', 'monospace'],
    display: ['SF Pro Display', 'Inter', 'system-ui'],
  },

  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '1' }],
    '6xl': ['60px', { lineHeight: '1' }],
    '7xl': ['72px', { lineHeight: '1' }],
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
};

// ================================================================
// SHADOW SYSTEM - Depth & Elevation
// ================================================================

export const shadows = {
  // Subtle Elevation
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Glass Effect Shadows
  glass: {
    light: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    medium: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    strong: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
  },

  // Glow Effects
  glow: {
    primary: `0 0 20px ${colors.primary[500]}40, 0 0 40px ${colors.primary[500]}20`,
    secondary: `0 0 20px ${colors.secondary[500]}40, 0 0 40px ${colors.secondary[500]}20`,
    accent: `0 0 20px ${colors.accent[500]}40, 0 0 40px ${colors.accent[500]}20`,
    success: `0 0 20px ${colors.success[500]}40, 0 0 40px ${colors.success[500]}20`,
    warning: `0 0 20px ${colors.warning[500]}40, 0 0 40px ${colors.warning[500]}20`,
    error: `0 0 20px ${colors.error[500]}40, 0 0 40px ${colors.error[500]}20`,
    cyan: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)',
    purple: '0 0 20px rgba(146, 16, 255, 0.4), 0 0 40px rgba(146, 16, 255, 0.2)',
  },

  // Inner Shadows (for depth)
  inner: {
    sm: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    md: 'inset 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
    lg: 'inset 0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  },
};

// ================================================================
// GLASS EFFECT SYSTEM - Frosted Glass Components
// ================================================================

export const glass = {
  // Background with blur
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: shadows.glass.light,
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    shadow: shadows.glass.medium,
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(24px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: shadows.glass.strong,
  },

  // Dark variants
  dark: {
    light: {
      background: 'rgba(20, 25, 35, 0.6)',
      backdropFilter: 'blur(12px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      shadow: shadows.glass.light,
    },
    medium: {
      background: 'rgba(20, 25, 35, 0.7)',
      backdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: shadows.glass.medium,
    },
    strong: {
      background: 'rgba(20, 25, 35, 0.85)',
      backdropFilter: 'blur(24px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: shadows.glass.strong,
    },
  },
};

// ================================================================
// GRADIENT SYSTEM - Mesh & Linear Gradients
// ================================================================

export const gradients = {
  // Mesh Gradients (multi-color radial)
  mesh: {
    cyber: 'radial-gradient(at 0% 0%, rgba(0, 196, 255, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(146, 16, 255, 0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 255, 204, 0.15) 0px, transparent 50%)',
    aurora: 'radial-gradient(at 0% 100%, rgba(0, 196, 255, 0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(146, 16, 255, 0.25) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(0, 255, 204, 0.15) 0px, transparent 50%)',
    neon: 'radial-gradient(at 0% 0%, rgba(255, 0, 255, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 255, 255, 0.2) 0px, transparent 50%)',
  },

  // Linear Gradients
  linear: {
    primary: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
    secondary: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[700]} 100%)`,
    accent: `linear-gradient(135deg, ${colors.accent[500]} 0%, ${colors.accent[700]} 100%)`,
    success: `linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[700]} 100%)`,

    // Special gradients
    cyan2purple: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.accent[500]} 100%)`,
    teal2cyan: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.primary[500]} 100%)`,
    sunset: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #6BCB77 100%)',
    ocean: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  },

  // Animated Gradients (for shimmer effects)
  animated: {
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
    breathing: `linear-gradient(135deg, ${colors.primary[500]}80 0%, ${colors.accent[500]}80 100%)`,
  },
};

// ================================================================
// ANIMATION SYSTEM - Smooth Transitions
// ================================================================

export const animations = {
  // Timing Functions
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    snappy: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Duration
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
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
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    float: {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    glow: {
      animate: {
        boxShadow: [
          shadows.glow.primary,
          '0 0 30px rgba(0, 196, 255, 0.6), 0 0 60px rgba(0, 196, 255, 0.3)',
          shadows.glow.primary,
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
  },

  // Keyframes (for CSS animations)
  keyframes: {
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    breathe: {
      '0%, 100%': { opacity: 0.6 },
      '50%': { opacity: 1 },
    },
  },
};

// ================================================================
// COMPONENT PRESETS - Ready-to-use Combinations
// ================================================================

export const presets = {
  // Card Variants
  card: {
    default: {
      background: colors.dark.bg.elevated,
      borderRadius: borderRadius.lg,
      border: colors.dark.border.default,
      padding: spacing.lg,
      shadow: shadows.md,
    },
    glass: {
      background: glass.dark.medium.background,
      backdropFilter: glass.dark.medium.backdropFilter,
      borderRadius: borderRadius.xl,
      border: glass.dark.medium.border,
      shadow: shadows.glass.medium,
      padding: spacing.lg,
    },
    glassStrong: {
      background: glass.dark.strong.background,
      backdropFilter: glass.dark.strong.backdropFilter,
      borderRadius: borderRadius.xl,
      border: glass.dark.strong.border,
      shadow: shadows.glass.strong,
      padding: spacing.lg,
    },
  },

  // Button Variants
  button: {
    primary: {
      background: gradients.linear.primary,
      color: '#FFFFFF',
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.semibold,
      shadow: shadows.md,
      hover: {
        shadow: shadows.glow.primary,
        transform: 'translateY(-2px)',
      },
    },
    ghost: {
      background: 'transparent',
      color: colors.dark.text.secondary,
      border: colors.dark.border.default,
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      hover: {
        background: colors.dark.bg.tertiary,
        color: colors.dark.text.primary,
      },
    },
    glass: {
      background: glass.dark.light.background,
      backdropFilter: glass.dark.light.backdropFilter,
      color: colors.dark.text.primary,
      border: glass.dark.light.border,
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      hover: {
        background: glass.dark.medium.background,
      },
    },
  },

  // Input Fields
  input: {
    default: {
      background: colors.dark.bg.secondary,
      border: colors.dark.border.default,
      borderRadius: borderRadius.md,
      padding: `${spacing.md} ${spacing.base}`,
      color: colors.dark.text.primary,
      fontSize: typography.fontSize.base[0],
      focus: {
        border: colors.primary[500],
        shadow: shadows.glow.primary,
      },
    },
    glass: {
      background: glass.dark.light.background,
      backdropFilter: glass.dark.light.backdropFilter,
      border: glass.dark.light.border,
      borderRadius: borderRadius.md,
      padding: `${spacing.md} ${spacing.base}`,
      color: colors.dark.text.primary,
      fontSize: typography.fontSize.base[0],
      focus: {
        border: colors.primary[500],
        background: glass.dark.medium.background,
      },
    },
  },
};

// ================================================================
// CHART COLOR PALETTES
// ================================================================

export const chartColors = {
  primary: [
    colors.primary[500],
    colors.primary[400],
    colors.primary[600],
    colors.primary[300],
    colors.primary[700],
  ],
  multi: [
    colors.primary[500],   // Cyan
    colors.accent[500],    // Purple
    colors.secondary[500], // Teal
    colors.success[500],   // Green
    colors.warning[500],   // Orange
    colors.error[500],     // Red
    colors.info[500],      // Blue
  ],
  gradient: [
    '#00C4FF',
    '#2BCFFF',
    '#5DD9FF',
    '#8DE5FF',
    '#B8EEFF',
  ],
  neon: [
    colors.neon.cyan,
    colors.neon.magenta,
    colors.neon.yellow,
    colors.neon.green,
    colors.neon.pink,
  ],
};

// ================================================================
// Z-INDEX SYSTEM - Layering Strategy
// ================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
  commandPalette: 1800,
};

// ================================================================
// BREAKPOINTS - Responsive Design
// ================================================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Export all as default
export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  glass,
  gradients,
  animations,
  presets,
  chartColors,
  zIndex,
  breakpoints,
};
