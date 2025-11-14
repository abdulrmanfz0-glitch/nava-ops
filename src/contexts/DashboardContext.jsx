// NAVA OPS - Dashboard Context
// State management for dashboard customization and widget management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getDefaultLayout, getWidgetById } from '../components/DashboardV2/Widget/widgetRegistry';
import logger from '../lib/logger';

const DashboardContext = createContext();

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

export function DashboardProvider({ children }) {
  const { userProfile } = useAuth();

  // Dashboard state
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Load dashboard layout from localStorage or defaults
  useEffect(() => {
    const loadDashboard = () => {
      try {
        const savedLayout = localStorage.getItem('nava_dashboard_layout');
        const savedWidgets = localStorage.getItem('nava_dashboard_widgets');

        if (savedLayout && savedWidgets) {
          setLayout(JSON.parse(savedLayout));
          setWidgets(JSON.parse(savedWidgets));
          logger.debug('Dashboard loaded from localStorage');
        } else {
          // Load default layout based on user role
          const role = userProfile?.role || 'manager';
          const defaultLayout = getDefaultLayout(role);

          // Initialize widgets from layout
          const initialWidgets = {};
          defaultLayout.forEach(item => {
            const widgetDef = getWidgetById(item.i);
            if (widgetDef) {
              initialWidgets[item.i] = {
                id: item.i,
                type: widgetDef.id,
                config: { ...widgetDef.config }
              };
            }
          });

          setLayout(defaultLayout);
          setWidgets(initialWidgets);
          logger.debug('Dashboard initialized with defaults', { role });
        }
      } catch (error) {
        logger.error('Failed to load dashboard', error);
      }
    };

    loadDashboard();
  }, [userProfile]);

  // Save dashboard to localStorage
  const saveDashboard = useCallback(() => {
    try {
      localStorage.setItem('nava_dashboard_layout', JSON.stringify(layout));
      localStorage.setItem('nava_dashboard_widgets', JSON.stringify(widgets));
      logger.debug('Dashboard saved to localStorage');
    } catch (error) {
      logger.error('Failed to save dashboard', error);
    }
  }, [layout, widgets]);

  // Update layout
  const updateLayout = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  // Add widget
  const addWidget = useCallback((widgetType) => {
    try {
      const widgetDef = getWidgetById(widgetType);
      if (!widgetDef) {
        logger.warn('Widget type not found', { widgetType });
        return;
      }

      const widgetId = `${widgetType}_${Date.now()}`;

      // Add to widgets
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          id: widgetId,
          type: widgetDef.id,
          config: { ...widgetDef.config }
        }
      }));

      // Add to layout (find empty spot or append at bottom)
      const maxY = layout.length > 0 ? Math.max(...layout.map(item => item.y + item.h)) : 0;
      const newLayoutItem = {
        i: widgetId,
        x: 0,
        y: maxY,
        ...widgetDef.defaultSize
      };

      setLayout(prev => [...prev, newLayoutItem]);

      logger.debug('Widget added', { widgetId, widgetType });
    } catch (error) {
      logger.error('Failed to add widget', error);
    }
  }, [layout]);

  // Remove widget
  const removeWidget = useCallback((widgetId) => {
    try {
      setWidgets(prev => {
        const updated = { ...prev };
        delete updated[widgetId];
        return updated;
      });

      setLayout(prev => prev.filter(item => item.i !== widgetId));

      logger.debug('Widget removed', { widgetId });
    } catch (error) {
      logger.error('Failed to remove widget', error);
    }
  }, []);

  // Update widget config
  const updateWidgetConfig = useCallback((widgetId, config) => {
    try {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          config: {
            ...prev[widgetId]?.config,
            ...config
          }
        }
      }));

      logger.debug('Widget config updated', { widgetId, config });
    } catch (error) {
      logger.error('Failed to update widget config', error);
    }
  }, []);

  // Reset to default layout
  const resetToDefault = useCallback(() => {
    try {
      const role = userProfile?.role || 'manager';
      const defaultLayout = getDefaultLayout(role);

      const initialWidgets = {};
      defaultLayout.forEach(item => {
        const widgetDef = getWidgetById(item.i);
        if (widgetDef) {
          initialWidgets[item.i] = {
            id: item.i,
            type: widgetDef.id,
            config: { ...widgetDef.config }
          };
        }
      });

      setLayout(defaultLayout);
      setWidgets(initialWidgets);

      // Clear localStorage
      localStorage.removeItem('nava_dashboard_layout');
      localStorage.removeItem('nava_dashboard_widgets');

      logger.info('Dashboard reset to defaults', { role });
    } catch (error) {
      logger.error('Failed to reset dashboard', error);
    }
  }, [userProfile]);

  // Toggle customization mode
  const toggleCustomization = useCallback(() => {
    setIsCustomizing(prev => !prev);
  }, []);

  // Auto-save when layout or widgets change (debounced)
  useEffect(() => {
    if (layout.length > 0) {
      const timeout = setTimeout(saveDashboard, 1000);
      return () => clearTimeout(timeout);
    }
  }, [layout, widgets, saveDashboard]);

  const value = {
    // State
    layout,
    widgets,
    isCustomizing,
    dateRange,
    selectedBranch,

    // Actions
    updateLayout,
    addWidget,
    removeWidget,
    updateWidgetConfig,
    resetToDefault,
    toggleCustomization,
    saveDashboard,
    setDateRange,
    setSelectedBranch
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
