// src/components/Intelligence/RecommendationCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Clock,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

/**
 * Smart Recommendation Card
 * Displays AI-generated recommendations with impact estimates
 */
const RecommendationCard = ({ recommendation, onImplement, className = '' }) => {
  const [expanded, setExpanded] = React.useState(false);

  const getImpactStyle = (impact) => {
    const styles = {
      high: {
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-300 dark:border-green-700',
        badge: 'bg-green-500',
      },
      medium: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-300 dark:border-yellow-700',
        badge: 'bg-yellow-500',
      },
      low: {
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-300 dark:border-blue-700',
        badge: 'bg-blue-500',
      },
    };
    return styles[impact] || styles.medium;
  };

  const getTimeStyle = (time) => {
    const styles = {
      quick: { text: 'Quick Win', color: 'text-green-600 dark:text-green-400', icon: Zap },
      immediate: { text: 'Immediate', color: 'text-orange-600 dark:text-orange-400', icon: Zap },
      medium: { text: '1-2 Weeks', color: 'text-blue-600 dark:text-blue-400', icon: Clock },
      long: { text: '1+ Month', color: 'text-gray-600 dark:text-gray-400', icon: Clock },
    };
    return styles[time] || styles.medium;
  };

  const impactStyle = getImpactStyle(recommendation.expectedImpact);
  const timeStyle = getTimeStyle(recommendation.implementationTime);
  const TimeIcon = timeStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`${className}`}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-xl border-2 ${impactStyle.border}
          shadow-sm hover:shadow-lg transition-all duration-300
          overflow-hidden group
        `}
      >
        {/* Header Stripe */}
        <div className={`h-2 ${impactStyle.badge}`} />

        <div className="p-5">
          {/* Title and Impact Badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-5 h-5 ${impactStyle.color}`} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  {recommendation.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {recommendation.description}
              </p>
            </div>

            <div className={`${impactStyle.bg} px-3 py-1 rounded-lg flex-shrink-0`}>
              <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Impact
              </div>
              <div className={`text-lg font-bold ${impactStyle.color} leading-tight`}>
                {recommendation.expectedImpact?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Implementation Time */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <TimeIcon className={`w-4 h-4 ${timeStyle.color}`} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Timeline
                </div>
                <div className={`text-sm font-bold ${timeStyle.color}`}>
                  {timeStyle.text}
                </div>
              </div>
            </div>

            {/* Estimated Impact */}
            {(recommendation.estimatedRevenueLift || recommendation.estimatedCostSavings || recommendation.estimatedProfitIncrease) && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Estimated Gain
                  </div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">
                    {recommendation.estimatedRevenueLift ||
                      recommendation.estimatedCostSavings ||
                      recommendation.estimatedProfitIncrease}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Type Badge */}
          {recommendation.type && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                {recommendation.type.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          )}

          {/* Priority/Urgency */}
          {recommendation.urgency === 'immediate' && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <Zap className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                Immediate Action Required
              </span>
            </div>
          )}

          {/* Action Steps */}
          {recommendation.actions && recommendation.actions.length > 0 && (
            <div
              className={`transition-all duration-300 ${
                expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Action Steps:
                </h4>
                <ol className="space-y-2">
                  {recommendation.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Affected Items */}
          {recommendation.items && recommendation.items.length > 0 && expanded && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Affected Items:
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.items.slice(0, 5).map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                  >
                    {item}
                  </span>
                ))}
                {recommendation.items.length > 5 && (
                  <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                    +{recommendation.items.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show More
                </>
              )}
            </button>

            {onImplement && (
              <button
                onClick={() => onImplement(recommendation)}
                className={`
                  px-4 py-2 rounded-lg font-semibold text-sm
                  ${impactStyle.badge} text-white
                  hover:opacity-90 transition-all duration-200
                  flex items-center gap-2
                  transform hover:scale-105
                `}
              >
                <span>Implement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
