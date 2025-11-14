// NAVA OPS - Dashboard v2
// Modern, modular dashboard with widget system

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import PageHeader from '@/components/UI/PageHeader';
import DateRangePicker from '@/components/UI/DateRangePicker';
import DashboardGrid, { GridItem } from '@/components/DashboardV2/DashboardGrid';
import MetricWidget from '@/components/DashboardV2/Widgets/MetricWidget';
import ChartWidget from '@/components/DashboardV2/Widgets/ChartWidget';
import ActivityFeedWidget from '@/components/DashboardV2/Widgets/ActivityFeedWidget';
import InsightsFeedWidget from '@/components/DashboardV2/Widgets/InsightsFeedWidget';
import { BarChart3, RefreshCw, Settings, Plus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardContent() {
  const { userProfile } = useAuth();
  const {
    layout,
    widgets,
    isCustomizing,
    dateRange,
    selectedBranch,
    setDateRange,
    setSelectedBranch,
    toggleCustomization,
    resetToDefault,
    removeWidget
  } = useDashboard();

  // Widget component mapping
  const widgetComponents = {
    MetricWidget,
    ChartWidget,
    ActivityFeedWidget,
    InsightsFeedWidget,
    BranchComparisonWidget: ChartWidget // Reuse ChartWidget for now
  };

  // Render widget based on type
  const renderWidget = (widgetId) => {
    const widget = widgets[widgetId];
    if (!widget) return null;

    const WidgetComponent = widgetComponents[widget.component || 'MetricWidget'];
    if (!WidgetComponent) return null;

    return (
      <WidgetComponent
        widgetId={widgetId}
        config={widget.config}
        onRemove={() => removeWidget(widgetId)}
      />
    );
  };

  // Get grid size from layout
  const getGridSize = (widgetId) => {
    const layoutItem = layout.find(item => item.i === widgetId);
    return {
      colSpan: layoutItem?.w || 1,
      rowSpan: layoutItem?.h || 1
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Dashboard v2"
          subtitle={`Welcome back, ${userProfile?.full_name || 'User'}! Here's your personalized business overview.`}
          icon={BarChart3}
          badge={{
            text: 'Enhanced',
            icon: null,
            color: 'blue'
          }}
          actions={
            <div className="flex items-center gap-3 flex-wrap">
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
              />

              <button
                onClick={toggleCustomization}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  transition-all duration-200 font-medium
                  ${isCustomizing
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }
                `}
              >
                <Settings className="w-5 h-5" />
                <span>{isCustomizing ? 'Done' : 'Customize'}</span>
              </button>
            </div>
          }
        />
      </motion.div>

      {/* Customization Panel */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customize Your Dashboard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your layout is automatically saved
                </p>
              </div>

              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800
                         hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200
                         rounded-lg transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg
                         border-2 border-dashed border-gray-300 dark:border-gray-600
                         hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20
                         transition-all duration-200"
              >
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">Add Widget</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid */}
      <DashboardGrid columns={4}>
        {layout.map((item) => {
          const { colSpan, rowSpan } = getGridSize(item.i);
          return (
            <GridItem key={item.i} colSpan={colSpan} rowSpan={rowSpan}>
              {renderWidget(item.i)}
            </GridItem>
          );
        })}
      </DashboardGrid>

      {/* Empty State */}
      {layout.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full
                       flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Widgets Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
            Click "Customize" to add widgets and build your personalized dashboard
          </p>
          <button
            onClick={toggleCustomization}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700
                     text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Get Started</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardV2() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
