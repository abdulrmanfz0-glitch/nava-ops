// NAVA OPS - Smart Insights Widget
// AI-powered recommendations and intelligent insights

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { dashboardTheme, getColorTheme } from '@/styles/dashboardTheme';

// Insight types with their visual properties
const INSIGHT_TYPES = {
  opportunity: {
    icon: TrendingUp,
    color: 'success',
    label: 'Opportunity'
  },
  warning: {
    icon: AlertTriangle,
    color: 'warning',
    label: 'Warning'
  },
  trend: {
    icon: TrendingDown,
    color: 'cyan',
    label: 'Trend'
  },
  recommendation: {
    icon: Lightbulb,
    color: 'purple',
    label: 'Recommendation'
  },
  goal: {
    icon: Target,
    color: 'primary',
    label: 'Goal'
  },
  action: {
    icon: Zap,
    color: 'danger',
    label: 'Action Required'
  }
};

export default function SmartInsightsWidget({
  widgetId,
  onRemove,
  data = null,
  className = ''
}) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Generate intelligent insights based on data
  useEffect(() => {
    generateInsights(data);
  }, [data]);

  const generateInsights = (businessData) => {
    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const generatedInsights = [];

      // Revenue insights
      if (businessData?.revenue) {
        const { current, previous, trend } = businessData.revenue;

        if (trend > 10) {
          generatedInsights.push({
            id: 'revenue-surge',
            type: 'opportunity',
            title: 'Revenue Surge Detected',
            description: `Your revenue has increased by ${trend.toFixed(1)}% compared to the previous period. This momentum indicates strong market demand.`,
            impact: 'high',
            actionable: true,
            action: 'Scale marketing efforts to capitalize on this growth',
            confidence: 0.92
          });
        } else if (trend < -5) {
          generatedInsights.push({
            id: 'revenue-decline',
            type: 'warning',
            title: 'Revenue Decline Alert',
            description: `Revenue has dropped by ${Math.abs(trend).toFixed(1)}%. Immediate attention may be required.`,
            impact: 'high',
            actionable: true,
            action: 'Review pricing strategy and customer retention programs',
            confidence: 0.88
          });
        }
      }

      // Customer behavior insights
      if (businessData?.customers) {
        const { activeCustomers, churnRate, averageLifetimeValue } = businessData.customers;

        if (churnRate > 0.15) {
          generatedInsights.push({
            id: 'high-churn',
            type: 'action',
            title: 'High Customer Churn Rate',
            description: `${(churnRate * 100).toFixed(1)}% of customers are churning. This is above the industry average of 10%.`,
            impact: 'high',
            actionable: true,
            action: 'Implement customer satisfaction surveys and retention campaigns',
            confidence: 0.85
          });
        }
      }

      // Branch performance insights
      if (businessData?.branches) {
        const { topPerformer, underperformer, averageRevenue } = businessData.branches;

        if (topPerformer && underperformer) {
          const gap = ((topPerformer.revenue - underperformer.revenue) / underperformer.revenue * 100).toFixed(0);
          generatedInsights.push({
            id: 'branch-gap',
            type: 'recommendation',
            title: 'Branch Performance Gap',
            description: `${topPerformer.name} is outperforming ${underperformer.name} by ${gap}%. Success patterns can be replicated.`,
            impact: 'medium',
            actionable: true,
            action: `Share best practices from ${topPerformer.name} across all locations`,
            confidence: 0.79
          });
        }
      }

      // Seasonal trends
      const currentMonth = new Date().getMonth();
      if ([10, 11].includes(currentMonth)) { // November, December
        generatedInsights.push({
          id: 'seasonal-opportunity',
          type: 'opportunity',
          title: 'Holiday Season Preparation',
          description: 'Historical data shows 40% increase in sales during this period. Optimize inventory and staffing now.',
          impact: 'high',
          actionable: true,
          action: 'Review inventory levels and schedule additional staff',
          confidence: 0.91
        });
      }

      // Goal tracking
      if (businessData?.goals) {
        businessData.goals.forEach(goal => {
          if (goal.progress >= 0.8 && goal.progress < 1.0) {
            generatedInsights.push({
              id: `goal-${goal.id}`,
              type: 'goal',
              title: `Almost There: ${goal.name}`,
              description: `You're at ${(goal.progress * 100).toFixed(0)}% of your ${goal.name} goal. Just a little more push!`,
              impact: 'medium',
              actionable: false,
              confidence: 1.0
            });
          }
        });
      }

      // Default insights if no data available
      if (generatedInsights.length === 0) {
        generatedInsights.push(
          {
            id: 'welcome',
            type: 'recommendation',
            title: 'Welcome to Smart Insights',
            description: 'As your business data accumulates, AI-powered insights will appear here to help you make better decisions.',
            impact: 'low',
            actionable: false,
            confidence: 1.0
          },
          {
            id: 'setup',
            type: 'action',
            title: 'Complete Your Setup',
            description: 'Connect your data sources to unlock personalized insights and recommendations.',
            impact: 'medium',
            actionable: true,
            action: 'Go to Settings to connect data sources',
            confidence: 1.0
          }
        );
      }

      setInsights(generatedInsights.sort((a, b) => {
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      }));
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    generateInsights(data);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-xl ${getColorTheme('purple').bg}
            ${getColorTheme('purple').border} border
          `}>
            <Sparkles className={`w-5 h-5 ${getColorTheme('purple').text}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Smart Insights
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AI-powered recommendations
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={loading}
          className={`
            p-2 rounded-lg transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
          `}
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Loading skeleton
            [1, 2, 3].map((i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </motion.div>
            ))
          ) : (
            insights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                index={index}
                onClick={() => setSelectedInsight(insight)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <InsightDetailModal
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual insight card
function InsightCard({ insight, index, onClick }) {
  const typeConfig = INSIGHT_TYPES[insight.type];
  const Icon = typeConfig.icon;
  const colorTheme = getColorTheme(typeConfig.color);

  const impactColors = {
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={onClick}
      className={`
        p-4 rounded-xl cursor-pointer
        ${dashboardTheme.glass.combined}
        hover:shadow-lg transition-all duration-200
        border-l-4 ${colorTheme.border}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg ${colorTheme.bg}
          flex-shrink-0
        `}>
          <Icon className={`w-4 h-4 ${colorTheme.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              {insight.title}
            </h4>
            <span className={`
              px-2 py-0.5 rounded text-xs font-medium flex-shrink-0
              ${impactColors[insight.impact]}
            `}>
              {insight.impact.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {insight.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {(insight.confidence * 100).toFixed(0)}% confidence
            </span>
            {insight.actionable && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Insight detail modal
function InsightDetailModal({ insight, onClose }) {
  const typeConfig = INSIGHT_TYPES[insight.type];
  const Icon = typeConfig.icon;
  const colorTheme = getColorTheme(typeConfig.color);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-lg
          ${dashboardTheme.glass.combined}
          rounded-2xl p-6 shadow-2xl
        `}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`
            p-3 rounded-xl ${colorTheme.bg}
            ${colorTheme.border} border
          `}>
            <Icon className={`w-6 h-6 ${colorTheme.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {insight.title}
              </h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${colorTheme.bg} ${colorTheme.text}`}>
                {typeConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insight.description}
            </p>
          </div>
        </div>

        {insight.actionable && insight.action && (
          <div className={`
            p-4 rounded-xl mb-4
            ${getColorTheme('primary').bg}
            ${getColorTheme('primary').border} border
          `}>
            <div className="flex items-start gap-2">
              <Zap className={`w-4 h-4 ${getColorTheme('primary').text} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Recommended Action
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {insight.action}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{(insight.confidence * 100).toFixed(0)}%</span> confidence
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                     transition-colors duration-200 font-medium text-sm"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
