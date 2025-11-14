// NAVA OPS - Insights Feed Widget
// AI-powered insights and recommendations feed

import React, { useState, useEffect } from 'react';
import BaseWidget from '../Widget/BaseWidget';
import { Zap, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import logger from '../../../lib/logger';

export default function InsightsFeedWidget({
  widgetId,
  config = {},
  onRemove,
  onConfigure,
  dragHandleProps
}) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    limit = 5,
    severity = ['critical', 'warning', 'info']
  } = config;

  // Fetch insights
  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.insights.getAll({ limit, status: 'new' });
      setInsights(data || []);
    } catch (err) {
      logger.error('Failed to fetch insights', { error: err.message });
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();

    // Poll for updates every 2 minutes
    const interval = setInterval(fetchInsights, 120000);
    return () => clearInterval(interval);
  }, [limit]);

  return (
    <BaseWidget
      id={widgetId}
      title="AI Insights & Recommendations"
      subtitle="Smart business intelligence"
      icon={Zap}
      loading={loading}
      error={error}
      onRefresh={fetchInsights}
      onRemove={onRemove}
      onConfigure={onConfigure}
      dragHandleProps={dragHandleProps}
    >
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </AnimatePresence>

        {insights.length === 0 && !loading && (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No new insights yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              AI will analyze your data and surface insights here
            </p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}

// Insight Card Component
function InsightCard({ insight, index }) {
  const { title, description, severity, insight_type, confidence_score } = insight;

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-error-50 dark:bg-error-900/20',
          border: 'border-error-200 dark:border-error-800',
          icon: 'text-error-600 dark:text-error-400'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50 dark:bg-warning-900/20',
          border: 'border-warning-200 dark:border-warning-800',
          icon: 'text-warning-600 dark:text-warning-400'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'critical':
        return AlertCircle;
      case 'warning':
        return AlertCircle;
      default:
        return Lightbulb;
    }
  };

  const colors = getSeverityColor();
  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className={`
        p-4 rounded-lg border transition-all duration-200
        hover:shadow-md cursor-pointer
        ${colors.bg} ${colors.border}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white dark:bg-gray-900 ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {insight_type && (
              <span className="text-xs px-2 py-1 bg-white dark:bg-gray-900 rounded-md
                           text-gray-700 dark:text-gray-300 font-medium">
                {insight_type.replace('_', ' ')}
              </span>
            )}
            {confidence_score && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {(confidence_score * 100).toFixed(0)}% confidence
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
