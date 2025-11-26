import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Target,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  X
} from 'lucide-react';
import { useBrandTheme } from '../../contexts/BrandThemeContext';
import { executiveTypography, executiveColorSemantics } from '../../styles/executiveDesignSystem';
import { entranceAnimations, interactiveAnimations } from '../../utils/executiveAnimations';

/**
 * Insight Action Panel
 * Displays AI-generated insights with executable actions
 *
 * Props:
 * - insights: Array of insight objects
 *   {
 *     id: string,
 *     type: 'opportunity' | 'warning' | 'success' | 'info',
 *     title: string,
 *     description: string,
 *     impact: 'high' | 'medium' | 'low',
 *     metrics: { label, value }[], // Key metrics related to this insight
 *     actions: [{ label, onClick, primary }],
 *     timestamp: Date,
 *     category: string (optional)
 *   }
 * - maxVisible: Number of insights to show before "View all"
 * - onDismiss: Callback when insight is dismissed
 * - className: Additional CSS classes
 */
const InsightActionPanel = ({
  insights = [],
  maxVisible = 3,
  onDismiss,
  className = ''
}) => {
  const { currentTheme } = useBrandTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [visibleInsights, setVisibleInsights] = useState(
    insights.slice(0, maxVisible)
  );
  const [showAll, setShowAll] = useState(false);

  // Get icon for insight type
  const getIcon = (type) => {
    switch (type) {
      case 'opportunity':
        return TrendingUp;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'info':
      default:
        return Lightbulb;
    }
  };

  // Get colors for insight type
  const getTypeColors = (type) => {
    switch (type) {
      case 'opportunity':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-900 dark:text-green-100',
          icon: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-900 dark:text-amber-100',
          icon: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100'
        };
      case 'success':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-900 dark:text-blue-100',
          icon: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-900 dark:text-gray-100',
          icon: 'text-gray-600 dark:text-gray-400',
          badge: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
        };
    }
  };

  // Get impact badge
  const getImpactBadge = (impact) => {
    const colors = {
      high: executiveColorSemantics.priority.high,
      medium: executiveColorSemantics.priority.medium,
      low: executiveColorSemantics.priority.low
    };

    const impactColor = colors[impact] || colors.medium;

    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-medium uppercase"
        style={{
          backgroundColor: impactColor.background,
          color: impactColor.color,
          border: `1px solid ${impactColor.border}`
        }}
      >
        {impact} Impact
      </span>
    );
  };

  const handleDismiss = (insightId) => {
    setVisibleInsights(prev => prev.filter(i => i.id !== insightId));
    if (onDismiss) {
      onDismiss(insightId);
    }
  };

  const handleToggleExpand = (insightId) => {
    setExpandedId(expandedId === insightId ? null : insightId);
  };

  const displayedInsights = showAll ? insights : visibleInsights;

  if (insights.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No insights available at the moment
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Check back later for AI-generated recommendations
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: currentTheme.colors.primary + '20',
              color: currentTheme.colors.primary
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h3
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: executiveTypography.heading.h3.fontSize,
                fontWeight: executiveTypography.heading.h3.fontWeight
              }}
            >
              AI Insights & Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insights.length} actionable insight{insights.length !== 1 ? 's' : ''} generated
            </p>
          </div>
        </div>
      </div>

      {/* Insights list */}
      <AnimatePresence>
        <div className="space-y-3">
          {displayedInsights.map((insight, index) => {
            const Icon = getIcon(insight.type);
            const colors = getTypeColors(insight.type);
            const isExpanded = expandedId === insight.id;

            return (
              <motion.div
                key={insight.id}
                className={`rounded-xl border p-5 ${colors.bg} ${colors.border}`}
                style={{
                  backdropFilter: 'blur(8px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${colors.icon}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4
                          className={`font-semibold ${colors.text}`}
                          style={{
                            fontSize: executiveTypography.heading.h5.fontSize,
                            fontWeight: executiveTypography.heading.h5.fontWeight
                          }}
                        >
                          {insight.title}
                        </h4>
                        {insight.impact && getImpactBadge(insight.impact)}
                      </div>
                      <p
                        className={`${colors.text} opacity-80`}
                        style={{
                          fontSize: executiveTypography.body.small.fontSize,
                          lineHeight: executiveTypography.body.small.lineHeight
                        }}
                      >
                        {insight.description}
                      </p>
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => handleDismiss(insight.id)}
                    className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                {/* Metrics (if provided) */}
                {insight.metrics && insight.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {insight.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white/50 dark:bg-black/20"
                      >
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {metric.label}
                        </p>
                        <p
                          className="font-bold text-gray-900 dark:text-white"
                          style={{
                            fontSize: executiveTypography.metric.inline.fontSize,
                            fontWeight: executiveTypography.metric.inline.fontWeight
                          }}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {insight.actions && insight.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {insight.actions.map((action, idx) => (
                      <motion.button
                        key={idx}
                        onClick={action.onClick}
                        className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                          action.primary
                            ? 'text-white shadow-md'
                            : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                        style={
                          action.primary
                            ? {
                                backgroundColor: currentTheme.colors.primary,
                                color: '#FFFFFF'
                              }
                            : {}
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{action.label}</span>
                        <ArrowRight size={16} />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    {insight.category && (
                      <span className={`px-2 py-1 rounded ${colors.badge}`}>
                        {insight.category}
                      </span>
                    )}
                    {insight.timestamp && (
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* View all button */}
      {!showAll && insights.length > maxVisible && (
        <motion.button
          onClick={() => setShowAll(true)}
          className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 transition-all flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>View {insights.length - maxVisible} more insights</span>
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default InsightActionPanel;
