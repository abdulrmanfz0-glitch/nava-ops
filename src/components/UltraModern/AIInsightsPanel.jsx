import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * AIInsightsPanel - AI-powered insights with typing effect
 * Features: Typing animation, insight cards, feedback, real-time updates
 */
const AIInsightsPanel = ({
  insights = [],
  isLoading = false,
  onRefresh,
  onAction,
  delay = 0,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Insight type configurations
  const insightTypes = {
    growth: {
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-400',
      badge: 'Growth',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    warning: {
      icon: AlertCircle,
      color: 'from-amber-500 to-orange-400',
      badge: 'Attention',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    opportunity: {
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-400',
      badge: 'Opportunity',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    action: {
      icon: Target,
      color: 'from-blue-500 to-cyan-400',
      badge: 'Action',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    ai: {
      icon: Brain,
      color: 'from-cyan-500 to-blue-400',
      badge: 'AI Insight',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
  };

  // Default insights
  const defaultInsights = [
    {
      id: 1,
      type: 'growth',
      title: 'Revenue Trend Analysis',
      content: 'Your weekend revenue has increased by 23% compared to last month. Consider extending promotional offers to weekdays to maintain this growth momentum.',
      confidence: 94,
      action: 'View Analysis',
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Menu Optimization',
      content: 'The Truffle Risotto has a 78% profit margin but only 12% order frequency. Featuring it in a combo deal could boost both visibility and revenue.',
      confidence: 87,
      action: 'Create Deal',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Inventory Alert',
      content: 'Based on current consumption patterns, premium seafood stock will reach critical levels within 3 days. Consider placing an early order.',
      confidence: 91,
      action: 'Order Now',
    },
    {
      id: 4,
      type: 'action',
      title: 'Staff Scheduling',
      content: 'Peak hours analysis suggests adding one additional server between 7-9 PM on Fridays would reduce wait times by 34%.',
      confidence: 82,
      action: 'Adjust Schedule',
    },
  ];

  const displayInsights = insights.length ? insights : defaultInsights;

  // Typing effect
  useEffect(() => {
    displayInsights.forEach((insight, index) => {
      const text = insight.content;
      let currentIndex = 0;

      const timer = setTimeout(() => {
        const typeInterval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(prev => ({
              ...prev,
              [insight.id]: text.slice(0, currentIndex),
            }));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
          }
        }, 15);

        return () => clearInterval(typeInterval);
      }, delay * 1000 + index * 500);

      return () => clearTimeout(timer);
    });
  }, [displayInsights, delay]);

  // Copy to clipboard
  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle feedback
  const handleFeedback = (id, isPositive) => {
    setFeedbackGiven(prev => ({ ...prev, [id]: isPositive ? 'positive' : 'negative' }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay + 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <GlassCard className={className} padding="none" delay={delay}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <motion.div
            className="
              w-12 h-12 rounded-xl
              bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500
              flex items-center justify-center
              shadow-lg shadow-purple-500/30
            "
            animate={{
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.3)',
                '0 0 30px rgba(236, 72, 153, 0.3)',
                '0 0 20px rgba(34, 211, 238, 0.3)',
                '0 0 20px rgba(139, 92, 246, 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              AI Insights
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                BETA
              </span>
            </h3>
            <p className="text-xs text-gray-500">Powered by advanced analytics</p>
          </div>
        </div>

        <motion.button
          className="
            p-2.5 rounded-xl
            bg-white/[0.05] hover:bg-white/[0.1]
            border border-white/[0.08]
            text-gray-400 hover:text-white
            transition-all duration-200
          "
          onClick={onRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Insights List */}
      <motion.div
        className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.1]" />
                <div className="flex-1">
                  <div className="h-4 bg-white/[0.1] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/[0.05] rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/[0.05] rounded w-full" />
                <div className="h-3 bg-white/[0.05] rounded w-4/5" />
              </div>
            </div>
          ))
        ) : (
          displayInsights.map((insight) => {
            const config = insightTypes[insight.type] || insightTypes.ai;
            const Icon = config.icon;
            const text = displayedText[insight.id] || '';
            const isTyping = text.length < insight.content.length;

            return (
              <motion.div
                key={insight.id}
                className="
                  p-4 rounded-xl
                  bg-white/[0.02] hover:bg-white/[0.04]
                  border border-white/[0.06] hover:border-white/[0.1]
                  transition-all duration-300
                  group
                "
                variants={itemVariants}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`
                        w-10 h-10 rounded-lg
                        bg-gradient-to-br ${config.color}
                        flex items-center justify-center
                      `}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                      <span className={`
                        inline-block px-2 py-0.5 rounded-full text-[10px] font-medium
                        border ${config.badgeColor}
                      `}>
                        {config.badge}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  {insight.confidence && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05]">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs font-medium text-gray-400">
                        {insight.confidence}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Content with typing effect */}
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {text}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Action Button */}
                    {insight.action && (
                      <motion.button
                        className="
                          flex items-center gap-2 px-3 py-1.5
                          bg-cyan-500/10 hover:bg-cyan-500/20
                          border border-cyan-500/30
                          rounded-lg text-xs font-medium text-cyan-400
                          transition-all duration-200
                        "
                        onClick={() => onAction?.(insight)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {insight.action}
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>

                  {/* Feedback & Copy */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      className={`
                        p-1.5 rounded-lg transition-colors
                        ${feedbackGiven[insight.id] === 'positive'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'hover:bg-white/[0.05] text-gray-500 hover:text-gray-300'
                        }
                      `}
                      onClick={() => handleFeedback(insight.id, true)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                      className={`
                        p-1.5 rounded-lg transition-colors
                        ${feedbackGiven[insight.id] === 'negative'
                          ? 'bg-red-500/20 text-red-400'
                          : 'hover:bg-white/[0.05] text-gray-500 hover:text-gray-300'
                        }
                      `}
                      onClick={() => handleFeedback(insight.id, false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                      className="
                        p-1.5 rounded-lg
                        hover:bg-white/[0.05]
                        text-gray-500 hover:text-gray-300
                        transition-colors
                      "
                      onClick={() => handleCopy(insight.content, insight.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedId === insight.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Last updated: Just now
        </p>
        <motion.button
          className="
            flex items-center gap-2
            text-xs font-medium text-cyan-400 hover:text-cyan-300
            transition-colors
          "
          whileHover={{ x: 3 }}
        >
          View All Insights
          <ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default AIInsightsPanel;
