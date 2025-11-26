import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { brandThemes } from '../styles/brandThemes';

const BrandThemeContext = createContext();

/**
 * Brand Theme Provider - Multi-tenant theming engine
 * Supports dynamic brand customization while maintaining design system consistency
 */
export const BrandThemeProvider = ({ children, initialBrandId = 'nava-default' }) => {
  const [currentBrandId, setCurrentBrandId] = useState(initialBrandId);
  const [customizations, setCustomizations] = useState({});

  // Load brand theme from localStorage on mount
  useEffect(() => {
    const savedBrandId = localStorage.getItem('nava_brand_theme');
    const savedCustomizations = localStorage.getItem('nava_brand_customizations');

    if (savedBrandId) {
      setCurrentBrandId(savedBrandId);
    }

    if (savedCustomizations) {
      try {
        setCustomizations(JSON.parse(savedCustomizations));
      } catch (error) {
        console.error('Failed to parse brand customizations:', error);
      }
    }
  }, []);

  // Get current brand theme with customizations applied
  const currentTheme = useMemo(() => {
    const baseTheme = brandThemes[currentBrandId] || brandThemes['nava-default'];

    // Apply customizations
    return {
      ...baseTheme,
      ...customizations,
      colors: {
        ...baseTheme.colors,
        ...(customizations.colors || {})
      },
      typography: {
        ...baseTheme.typography,
        ...(customizations.typography || {})
      },
      components: {
        ...baseTheme.components,
        ...(customizations.components || {})
      }
    };
  }, [currentBrandId, customizations]);

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;

    // Primary colors
    root.style.setProperty('--brand-primary', theme.colors.primary);
    root.style.setProperty('--brand-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--brand-primary-dark', theme.colors.primaryDark);

    // Secondary colors
    root.style.setProperty('--brand-secondary', theme.colors.secondary);
    root.style.setProperty('--brand-secondary-light', theme.colors.secondaryLight);
    root.style.setProperty('--brand-secondary-dark', theme.colors.secondaryDark);

    // Accent colors
    root.style.setProperty('--brand-accent', theme.colors.accent);
    root.style.setProperty('--brand-success', theme.colors.success);
    root.style.setProperty('--brand-warning', theme.colors.warning);
    root.style.setProperty('--brand-danger', theme.colors.danger);
    root.style.setProperty('--brand-info', theme.colors.info);

    // Neutral colors
    root.style.setProperty('--brand-bg-primary', theme.colors.background.primary);
    root.style.setProperty('--brand-bg-secondary', theme.colors.background.secondary);
    root.style.setProperty('--brand-bg-tertiary', theme.colors.background.tertiary);

    root.style.setProperty('--brand-text-primary', theme.colors.text.primary);
    root.style.setProperty('--brand-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--brand-text-tertiary', theme.colors.text.tertiary);

    // Border colors
    root.style.setProperty('--brand-border-light', theme.colors.border.light);
    root.style.setProperty('--brand-border-medium', theme.colors.border.medium);
    root.style.setProperty('--brand-border-heavy', theme.colors.border.heavy);

    // Typography
    root.style.setProperty('--brand-font-primary', theme.typography.fontFamily.primary);
    root.style.setProperty('--brand-font-secondary', theme.typography.fontFamily.secondary);
    root.style.setProperty('--brand-font-mono', theme.typography.fontFamily.mono);

    // Spacing
    root.style.setProperty('--brand-spacing-unit', theme.spacing.unit);

    // Border radius
    root.style.setProperty('--brand-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--brand-radius-md', theme.borderRadius.md);
    root.style.setProperty('--brand-radius-lg', theme.borderRadius.lg);
    root.style.setProperty('--brand-radius-xl', theme.borderRadius.xl);

    // Shadows
    root.style.setProperty('--brand-shadow-sm', theme.shadows.sm);
    root.style.setProperty('--brand-shadow-md', theme.shadows.md);
    root.style.setProperty('--brand-shadow-lg', theme.shadows.lg);
    root.style.setProperty('--brand-shadow-xl', theme.shadows.xl);

    // Glass effects
    root.style.setProperty('--brand-glass-bg', theme.effects.glass.background);
    root.style.setProperty('--brand-glass-blur', theme.effects.glass.blur);
    root.style.setProperty('--brand-glass-border', theme.effects.glass.border);
  }, [currentTheme]);

  /**
   * Switch to a different brand theme
   */
  const switchBrand = (brandId) => {
    if (brandThemes[brandId]) {
      setCurrentBrandId(brandId);
      localStorage.setItem('nava_brand_theme', brandId);
    } else {
      console.warn(`Brand theme "${brandId}" not found`);
    }
  };

  /**
   * Apply custom theme overrides
   */
  const customizeBrand = (overrides) => {
    setCustomizations(prev => {
      const updated = { ...prev, ...overrides };
      localStorage.setItem('nava_brand_customizations', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Reset to default brand theme
   */
  const resetBrand = () => {
    setCurrentBrandId('nava-default');
    setCustomizations({});
    localStorage.removeItem('nava_brand_theme');
    localStorage.removeItem('nava_brand_customizations');
  };

  /**
   * Get available brand themes
   */
  const getAvailableBrands = () => {
    return Object.keys(brandThemes).map(id => ({
      id,
      name: brandThemes[id].name,
      description: brandThemes[id].description
    }));
  };

  const value = {
    currentBrandId,
    currentTheme,
    customizations,
    switchBrand,
    customizeBrand,
    resetBrand,
    getAvailableBrands,

    // Helper methods for components
    getColor: (colorPath) => {
      const paths = colorPath.split('.');
      let value = currentTheme.colors;
      for (const path of paths) {
        value = value?.[path];
      }
      return value;
    },

    getTypography: (size, weight) => {
      return {
        fontSize: currentTheme.typography.scale[size],
        fontWeight: currentTheme.typography.weights[weight],
        lineHeight: currentTheme.typography.lineHeights[size]
      };
    },

    getSpacing: (multiplier) => {
      return `${parseFloat(currentTheme.spacing.unit) * multiplier}px`;
    },

    getComponentStyle: (componentName) => {
      return currentTheme.components[componentName] || {};
    }
  };

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  );
};

/**
 * Hook to access brand theme
 */
export const useBrandTheme = () => {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error('useBrandTheme must be used within BrandThemeProvider');
  }
  return context;
};

export default BrandThemeContext;
