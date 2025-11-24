/**
 * @deprecated This file is deprecated. Use ultraModernTokens.js instead.
 *
 * Legacy Restalyze Design Tokens
 *
 * DEPRECATION NOTICE:
 * This design token system is being phased out in favor of the UltraModern
 * design system (ultraModernTokens.js) which provides:
 * - Glassmorphism effects
 * - Advanced animations
 * - Neon accents and gradients
 * - Modern component theming
 *
 * For new components, import from '@/styles/ultraModernTokens' instead.
 *
 * Original Color Scheme:
 * - Green: Growth metrics
 * - Blue: Benchmarks
 * - Cyan: Neutral metrics
 * - Orange: Warnings
 * - Gray/White: Backgrounds
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Primary Restalyze Brand Colors
  brand: {
    primary: '#0088FF', // Primary blue for branding
    accent: '#FF6B6B', // Accent red/coral
  },

  // Growth Metrics (Green Scale)
  growth: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Primary growth color
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#145231',
  },

  // Benchmark Metrics (Blue Scale)
  benchmark: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Primary benchmark color
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Neutral Metrics (Cyan Scale)
  neutral: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#06B6D4', // Primary neutral color
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // Warning Indicators (Orange Scale)
  warning: {
    50: '#FFF7ED',
    100: '#FEED7D',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Primary warning color
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Background Colors (Gray/White Scale)
  background: {
    white: '#FFFFFF',
    light: '#F8FAFB', // Very light background
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Medium gray
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827', // Dark background
  },

  // Error/Danger Colors (Red Scale)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Success Colors (Emerald Scale)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Text Colors
  text: {
    primary: '#111827', // Dark gray for main text
    secondary: '#6B7280', // Medium gray for secondary text
    tertiary: '#9CA3AF', // Light gray for tertiary text
    inverse: '#FFFFFF', // White text on dark backgrounds
  },
};

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
};

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
};

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Color-specific shadows for visual hierarchy
  growthGlow: '0 0 20px rgba(34, 197, 94, 0.3)',
  benchmarkGlow: '0 0 20px rgba(14, 165, 233, 0.3)',
  neutralGlow: '0 0 20px rgba(6, 182, 212, 0.3)',
  warningGlow: '0 0 20px rgba(249, 115, 22, 0.3)',
};

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0px',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// ============================================================================
// BRANDING TOKENS
// ============================================================================

export const branding = {
  // Logo specifications
  logo: {
    primaryColor: colors.brand.primary,
    accentColor: colors.brand.accent,
    minWidth: '40px', // Minimum width for legibility
    aspectRatio: '1/1', // Square aspect ratio
  },

  // Restaurant branding
  restaurant: {
    nameFont: {
      size: typography.fontSize['2xl'],
      weight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    logoSize: {
      small: '40px',
      medium: '60px',
      large: '100px',
    },
  },

  // Restalyze branding
  restalyze: {
    tagline: 'Powered by Restalyze',
    taglineFont: {
      size: typography.fontSize.xs,
      weight: typography.fontWeight.normal,
      color: colors.text.secondary,
    },
    footerText: '© Restalyze. All rights reserved.',
    brandColor: colors.brand.primary,
  },

  // Report-specific branding
  report: {
    headerHeight: '120px',
    footerHeight: '60px',
    padding: spacing[6],
    contentMaxWidth: '1200px',
    backgroundColor: colors.background.white,
  },
};

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slowest: '500ms',
  },

  easing: {
    linear: 'linear',
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

// ============================================================================
// COLOR MAPPING BY METRIC TYPE
// ============================================================================

export const metricColorMap = {
  growth: colors.growth[500],
  benchmark: colors.benchmark[500],
  neutral: colors.neutral[500],
  warning: colors.warning[500],
  error: colors.error[500],
  success: colors.success[500],
};

// ============================================================================
// THEME PRESETS
// ============================================================================

export const themePresets = {
  light: {
    background: colors.background.white,
    surface: colors.background[50],
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    border: colors.background[200],
    shadow: shadows.base,
  },

  dark: {
    background: colors.background[900],
    surface: colors.background[800],
    text: colors.text.inverse,
    textSecondary: colors.background[300],
    border: colors.background[700],
    shadow: shadows.lg,
  },
};

// ============================================================================
// REPORT COLOR SCHEME
// ============================================================================

export const reportColorScheme = {
  growth: {
    primary: colors.growth[500],
    light: colors.growth[100],
    dark: colors.growth[700],
    glow: shadows.growthGlow,
    label: 'Growth',
  },
  benchmark: {
    primary: colors.benchmark[500],
    light: colors.benchmark[100],
    dark: colors.benchmark[700],
    glow: shadows.benchmarkGlow,
    label: 'Benchmark',
  },
  neutral: {
    primary: colors.neutral[500],
    light: colors.neutral[100],
    dark: colors.neutral[700],
    glow: shadows.neutralGlow,
    label: 'Neutral',
  },
  warning: {
    primary: colors.warning[500],
    light: colors.warning[100],
    dark: colors.warning[700],
    glow: shadows.warningGlow,
    label: 'Warning',
  },
};

// ============================================================================
// EXPORT COMPLETE DESIGN SYSTEM
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  branding,
  animations,
  metricColorMap,
  themePresets,
  reportColorScheme,
};

export default designTokens;
