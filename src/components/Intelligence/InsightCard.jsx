// src/components/Intelligence/InsightCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/**
 * Smart Insight Card Component
 * Displays AI-generated insights with visual appeal and actionable information
 */
const InsightCard = ({
  insight,
  onClick,
  className = '',
  expandable = false,
  showActions = true,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  // Get styling based on insight type and priority
  const getInsightStyle = () => {
    const styles = {
      opportunity: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
        border: 'border-green-200 dark:border-green-800',
        icon: Lightbulb,
        iconColor: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        badge: 'bg-green-500',
      },
      warning: {
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        icon: AlertTriangle,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        badge: 'bg-amber-500',
      },
      anomaly: {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
        border: 'border-red-200 dark:border-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/50',
        badge: 'bg-red-500',
      },
      trend: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        icon: Activity,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        badge: 'bg-blue-500',
      },
      prediction: {
        bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30',
        border: 'border-purple-200 dark:border-purple-800',
        icon: Sparkles,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        badge: 'bg-purple-500',
      },
      recommendation: {
        bg: 'bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30',
        border: 'border-cyan-200 dark:border-cyan-800',
        icon: Target,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
        badge: 'bg-cyan-500',
      },
    };

    return styles[insight.type] || styles.trend;
  };

  const getPriorityBadge = () => {
    const badges = {
      critical: { text: 'CRITICAL', color: 'bg-red-500', pulse: true },
      high: { text: 'HIGH', color: 'bg-orange-500', pulse: false },
      medium: { text: 'MEDIUM', color: 'bg-yellow-500', pulse: false },
      low: { text: 'LOW', color: 'bg-blue-500', pulse: false },
      info: { text: 'INFO', color: 'bg-gray-500', pulse: false },
    };

    return badges[insight.priority] || badges.info;
  };

  const getConfidenceBadge = () => {
    if (!insight.confidence) return null;

    const confidence = typeof insight.confidence === 'number'
      ? insight.confidence
      : insight.confidence === 'high' ? 0.85 : insight.confidence === 'medium' ? 0.70 : 0.50;

    const percentage = Math.round(confidence * 100);
    let color = 'bg-green-500';
    if (percentage < 70) color = 'bg-yellow-500';
    if (percentage < 50) color = 'bg-red-500';

    return (
      <div className="flex items-center gap-1 text-xs">
        <div className={`h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
          <div
            className={`h-full ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-600 dark:text-gray-400 font-medium">{percentage}%</span>
      </div>
    );
  };

  const style = getInsightStyle();
  const priority = getPriorityBadge();
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      <div
        className={`
          rounded-lg border-2 ${style.border} ${style.bg}
          shadow-sm hover:shadow-md transition-all duration-200
          ${onClick || expandable ? 'cursor-pointer' : ''}
          overflow-hidden
        `}
        onClick={() => {
          if (expandable) setExpanded(!expanded);
          if (onClick) onClick(insight);
        }}
      >
        {/* Priority indicator stripe */}
        <div className={`h-1 ${priority.color} ${priority.pulse ? 'animate-pulse' : ''}`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2 rounded-lg ${style.iconBg} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${style.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                  {insight.title}
                </h3>

                <span
                  className={`
                    ${priority.color} text-white text-[10px] font-bold
                    px-2 py-0.5 rounded-full whitespace-nowrap
                  `}
                >
                  {priority.text}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {insight.message}
              </p>
            </div>
          </div>

          {/* Metrics/Details */}
          {(insight.metric || insight.value !== undefined || insight.change) && (
            <div className="flex items-center gap-3 mb-3 text-xs">
              {insight.metric && (
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {insight.metric.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
              {insight.value !== undefined && (
                <span className="font-bold text-gray-900 dark:text-white">
                  {typeof insight.value === 'number'
                    ? insight.value.toLocaleString()
                    : insight.value}
                </span>
              )}
              {insight.change && (
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    insight.change.startsWith('+')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {insight.change.startsWith('+') ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {insight.change}
                </span>
              )}
            </div>
          )}

          {/* Confidence indicator */}
          {insight.confidence && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Confidence</span>
                {getConfidenceBadge()}
              </div>
            </div>
          )}

          {/* Impact indicator */}
          {insight.impact && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Expected Impact:</span>
                <span
                  className={`text-xs font-bold ${
                    insight.impact === 'high'
                      ? 'text-green-600 dark:text-green-400'
                      : insight.impact === 'medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {insight.impact.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && insight.actionable && insight.actions && insight.actions.length > 0 && (
            <div className={`${expanded ? 'block' : 'hidden'} space-y-2`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Recommended Actions:
                </span>
              </div>
              <ul className="space-y-1.5">
                {insight.actions.map((action, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <ChevronRight className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expandable toggle */}
          {expandable && insight.actions && insight.actions.length > 0 && (
            <button
              className="mt-3 w-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? 'Show Less' : 'Show Actions'}
              <ChevronRight
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default InsightCard;
