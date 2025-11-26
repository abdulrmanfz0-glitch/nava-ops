import React from 'react';
import { motion } from 'framer-motion';
import { useBrandTheme } from '../../contexts/BrandThemeContext';
import { loadingAnimations } from '../../utils/executiveAnimations';

/**
 * Smart Loading State
 * Context-aware skeleton screens that match final content
 *
 * Props:
 * - type: 'kpi' | 'chart' | 'table' | 'list' | 'dashboard' | 'page'
 * - count: Number of skeleton items (for list/table)
 * - message: Optional loading message
 * - showProgress: Show progress indicator
 * - className: Additional CSS classes
 */
const SmartLoadingState = ({
  type = 'page',
  count = 3,
  message,
  showProgress = false,
  className = ''
}) => {
  const { currentTheme } = useBrandTheme();

  // Shimmer effect
  const shimmerStyle = {
    backgroundImage: `linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite linear'
  };

  // KPI card skeleton
  if (type === 'kpi') {
    return (
      <div className={`rounded-xl p-6 ${className}`}>
        <motion.div
          className="space-y-4"
          {...loadingAnimations.pulse}
        >
          {/* Label */}
          <div
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"
            style={shimmerStyle}
          />

          {/* Value */}
          <div
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3"
            style={shimmerStyle}
          />

          {/* Trend */}
          <div className="flex items-center space-x-2">
            <div
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"
              style={shimmerStyle}
            />
            <div
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"
              style={shimmerStyle}
            />
          </div>

          {/* Insight */}
          <div className="space-y-2">
            <div
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"
              style={shimmerStyle}
            />
            <div
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5"
              style={shimmerStyle}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Chart skeleton
  if (type === 'chart') {
    return (
      <div className={`rounded-xl p-6 ${className}`}>
        <motion.div
          className="space-y-4"
          {...loadingAnimations.pulse}
        >
          {/* Title */}
          <div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"
            style={shimmerStyle}
          />

          {/* Chart area */}
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" style={shimmerStyle}>
            {/* Simple bar pattern */}
            <div className="h-full flex items-end justify-around p-4 space-x-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 dark:bg-gray-600 rounded-t"
                  style={{
                    width: '10%',
                    height: `${30 + Math.random() * 70}%`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"
                  style={shimmerStyle}
                />
                <div
                  className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"
                  style={shimmerStyle}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Table skeleton
  if (type === 'table') {
    return (
      <div className={`rounded-xl overflow-hidden ${className}`}>
        <motion.div {...loadingAnimations.pulse}>
          {/* Header */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="flex items-center space-x-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1"
                  style={shimmerStyle}
                />
              ))}
            </div>
          </div>

          {/* Rows */}
          {[...Array(count)].map((_, i) => (
            <div key={i} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"
                    style={shimmerStyle}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  // List skeleton
  if (type === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
            {...loadingAnimations.pulse}
          >
            <div className="flex items-center space-x-4">
              {/* Avatar/Icon */}
              <div
                className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"
                style={shimmerStyle}
              />

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div
                  className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"
                  style={shimmerStyle}
                />
                <div
                  className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
                  style={shimmerStyle}
                />
              </div>

              {/* Action */}
              <div
                className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                style={shimmerStyle}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="space-y-2">
          <div
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"
            style={shimmerStyle}
          />
          <div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"
            style={shimmerStyle}
          />
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SmartLoadingState key={i} type="kpi" />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <SmartLoadingState key={i} type="chart" />
          ))}
        </div>
      </div>
    );
  }

  // Page skeleton (default)
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        {/* Spinner */}
        <motion.div
          className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
          style={{
            borderColor: `${currentTheme.colors.primary}30`,
            borderTopColor: currentTheme.colors.primary
          }}
          {...loadingAnimations.spin}
        />

        {/* Message */}
        {message && (
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {message}
          </p>
        )}

        {/* Dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentTheme.colors.primary }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Progress */}
        {showProgress && (
          <div className="mt-6 w-64 mx-auto">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: currentTheme.colors.primary }}
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Inject shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartLoadingState;
