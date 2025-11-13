// src/components/Intelligence/HealthScoreWidget.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

/**
 * Business Health Score Widget
 * Displays comprehensive health score with visual indicators
 */
const HealthScoreWidget = ({ healthData, className = '' }) => {
  if (!healthData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading health score...
        </div>
      </div>
    );
  }

  const { overallScore, grade, status, scores } = healthData;

  // Circular progress component
  const CircularProgress = ({ value, size = 180, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getColor = (score) => {
      if (score >= 85) return '#10b981'; // green
      if (score >= 70) return '#3b82f6'; // blue
      if (score >= 55) return '#f59e0b'; // yellow
      if (score >= 40) return '#f97316'; // orange
      return '#ef4444'; // red
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(value)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {overallScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              / 100
            </div>
            <div className="text-2xl font-bold mt-1" style={{ color: getColor(overallScore) }}>
              {grade}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Individual metric bar
  const MetricBar = ({ label, score, icon: Icon, delay = 0 }) => {
    const getColor = (score) => {
      if (score >= 75) return 'bg-green-500';
      if (score >= 60) return 'bg-blue-500';
      if (score >= 45) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {score}/100
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${getColor(score)} rounded-full`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Business Health Score</h2>
        </div>
        <p className="text-blue-100 text-sm">
          Comprehensive analysis of your business performance
        </p>
      </div>

      <div className="p-6">
        {/* Overall Score */}
        <div className="flex flex-col items-center mb-8">
          <CircularProgress value={overallScore} />

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4 flex items-center gap-2"
          >
            <span className="text-2xl">{status.icon}</span>
            <span
              className="text-xl font-bold"
              style={{
                color:
                  status.color === 'green'
                    ? '#10b981'
                    : status.color === 'blue'
                    ? '#3b82f6'
                    : status.color === 'yellow'
                    ? '#f59e0b'
                    : status.color === 'orange'
                    ? '#f97316'
                    : '#ef4444',
              }}
            >
              {status.status}
            </span>
          </motion.div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
            Score Breakdown
          </h3>

          {scores && (
            <div className="space-y-4">
              {scores.revenue && (
                <MetricBar
                  label={scores.revenue.label}
                  score={scores.revenue.score}
                  icon={DollarSign}
                  delay={0.1}
                />
              )}
              {scores.profitability && (
                <MetricBar
                  label={scores.profitability.label}
                  score={scores.profitability.score}
                  icon={TrendingUp}
                  delay={0.2}
                />
              )}
              {scores.growth && (
                <MetricBar
                  label={scores.growth.label}
                  score={scores.growth.score}
                  icon={Target}
                  delay={0.3}
                />
              )}
              {scores.efficiency && (
                <MetricBar
                  label={scores.efficiency.label}
                  score={scores.efficiency.score}
                  icon={Zap}
                  delay={0.4}
                />
              )}
              {scores.customerHealth && (
                <MetricBar
                  label={scores.customerHealth.label}
                  score={scores.customerHealth.score}
                  icon={Users}
                  delay={0.5}
                />
              )}
              {scores.operationalHealth && (
                <MetricBar
                  label={scores.operationalHealth.label}
                  score={scores.operationalHealth.score}
                  icon={Activity}
                  delay={0.6}
                />
              )}
            </div>
          )}
        </div>

        {/* Insights */}
        {healthData.insights && healthData.insights.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Key Insights
            </h3>
            <div className="space-y-2">
              {healthData.insights.slice(0, 3).map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  {insight.type === 'opportunity' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">{insight.message}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {healthData.recommendations && healthData.recommendations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {healthData.recommendations.slice(0, 3).map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {rec.message}
                  </div>
                  {rec.actions && rec.actions.length > 0 && (
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      • {rec.actions[0]}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthScoreWidget;
