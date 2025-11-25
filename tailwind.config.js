// tailwind.config.js - Modern Design System
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NAVA UI Primary Palette (Cyan - VisionOS Style)
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
        // Legacy Primary (for backward compatibility)
        'primary-legacy': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0088FF',  // NAVA Brand Color
          600: '#0070e0',
          700: '#005bb7',
          800: '#00478e',
          900: '#003366',
          950: '#002244',
        },
        // Gold/Navy Brand Colors for NAVA
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700',  // NAVA Gold
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#0A2540',  // NAVA Navy
          600: '#1a3a5c',
          700: '#243b53',
          800: '#102a43',
          900: '#0d1f33',
        },
        // NAVA UI Secondary Palette (Teal)
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
        // NAVA UI Accent Palette (Purple)
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
        // Legacy Secondary (for backward compatibility)
        'secondary-legacy': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Refined Success Palette
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Refined Warning Palette
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Refined Error Palette
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Modern Gray Scale with better contrast
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // NAVA Brand Colors (mapped from :root CSS variables)
        nava: {
          // Using RGB format for alpha transparency support
          primary: 'rgb(var(--nava-primary) / <alpha-value>)',
          secondary: 'rgb(var(--nava-secondary) / <alpha-value>)',
          success: 'rgb(var(--nava-success) / <alpha-value>)',
          warning: 'rgb(var(--nava-warning) / <alpha-value>)',
          error: 'rgb(var(--nava-error) / <alpha-value>)',
          dark: 'rgb(var(--nava-dark) / <alpha-value>)',
          light: 'rgb(var(--nava-light) / <alpha-value>)',
          muted: 'rgb(var(--nava-muted) / <alpha-value>)',

          // Legacy hex values for backward compatibility
          premium: '#0088FF',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        'arabic': ['Tahoma', 'Arial', 'sans-serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      boxShadow: {
        // Standard Tailwind shadows
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',

        // Mapped from :root CSS variables
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',

        // Modern Shadows with Depth
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 6px 20px -3px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px -5px rgba(0, 136, 255, 0.3)',
        'glow-lg': '0 0 30px -5px rgba(0, 136, 255, 0.4)',
        'glow-primary': '0 8px 16px -4px rgba(0, 136, 255, 0.2)',
        'glow-success': '0 8px 16px -4px rgba(16, 185, 129, 0.2)',
        'glow-gold': '0 8px 16px -4px rgba(255, 215, 0, 0.2)',

        // Elevation shadows for cards and modals
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

        // NAVA UI Glass & Glow Effects
        'glass-light': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'glass-medium': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-strong': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',

        'glow-cyan': '0 0 20px rgba(0, 196, 255, 0.4), 0 0 40px rgba(0, 196, 255, 0.2)',
        'glow-teal': '0 0 20px rgba(0, 255, 204, 0.4), 0 0 40px rgba(0, 255, 204, 0.2)',
        'glow-purple': '0 0 20px rgba(146, 16, 255, 0.4), 0 0 40px rgba(146, 16, 255, 0.2)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)',
      },
      animation: {
        // Smooth, modern animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'modal-slide-in': 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backgroundImage: {
        // Mapped from :root CSS variables
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-mesh': 'var(--gradient-mesh)',

        // Additional modern gradients
        'gradient-secondary': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-dark': 'linear-gradient(135deg, #171717 0%, #262626 100%)',

        // NAVA Brand Gradients
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 100%)',
        'gradient-premium': 'linear-gradient(135deg, #0088FF 0%, #00b4ff 100%)',

        // NAVA UI VisionOS Gradients
        'gradient-cyan-purple': 'linear-gradient(135deg, #00C4FF 0%, #9210FF 100%)',
        'gradient-teal-cyan': 'linear-gradient(135deg, #00FFCC 0%, #00C4FF 100%)',
        'gradient-mesh-cyber': 'radial-gradient(at 0% 0%, rgba(0, 196, 255, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(146, 16, 255, 0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 255, 204, 0.15) 0px, transparent 50%)',
        'gradient-mesh-aurora': 'radial-gradient(at 0% 100%, rgba(0, 196, 255, 0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(146, 16, 255, 0.25) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(0, 255, 204, 0.15) 0px, transparent 50%)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '900': '900',   // Dropdowns
        '1000': '1000', // Modals
        '1050': '1050', // Tooltips
        '1100': '1100', // Notifications
        '9999': '9999', // Max
      },
      transitionDuration: {
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [
    // Add RTL support plugin if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('tailwindcss-rtl'),
  ],
}