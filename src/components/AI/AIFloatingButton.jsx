/**
 * AI Floating Button
 * Always-visible floating action button to trigger the AI assistant
 * Features beautiful animations and hover effects
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  X,
  TrendingUp,
  Lightbulb,
  BarChart3,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';

// Quick action mini menu items
const QUICK_ACTIONS = [
  {
    id: 'forecast',
    icon: TrendingUp,
    label: 'Forecast',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'recommendations',
    icon: Lightbulb,
    label: 'Tips',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'performance',
    icon: BarChart3,
    label: 'Stats',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'anomalies',
    icon: AlertCircle,
    label: 'Alerts',
    color: 'from-red-500 to-pink-500',
  },
];

const AIFloatingButton = () => {
  const { isOpen, openChat, sendQuickAction } = useAIChat();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Don't show button if sidebar is open
  if (isOpen) return null;

  const handleMainClick = () => {
    if (showQuickMenu) {
      setShowQuickMenu(false);
    }
    openChat();
  };

  const handleQuickAction = (actionId) => {
    openChat();
    setTimeout(() => {
      sendQuickAction(actionId);
    }, 100);
    setShowQuickMenu(false);
  };

  const toggleQuickMenu = (e) => {
    e.stopPropagation();
    setShowQuickMenu(!showQuickMenu);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Quick action menu */}
      <AnimatePresence>
        {showQuickMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 bg-gray-900 border border-gray-700 rounded-2xl p-3 shadow-2xl shadow-purple-500/20 min-w-[180px]"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-gray-400">Quick Actions</span>
            </div>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuickAction(action.id)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl transition-colors group"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <button
                onClick={handleMainClick}
                className="w-full flex items-center justify-center gap-2 p-2 text-purple-400 hover:text-purple-300 text-xs transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                Open full chat
              </button>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.5 }}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl"
        />

        {/* Pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        />

        {/* Button container */}
        <div className="relative flex items-center">
          {/* Expanded label on hover */}
          <AnimatePresence>
            {isHovered && !showQuickMenu && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="absolute right-full mr-3 whitespace-nowrap"
              >
                <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Ask NAVA AI</span>
                    <kbd className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                      Ctrl+K
                    </kbd>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMainClick}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleQuickMenu(e);
            }}
            className="relative w-14 h-14 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center group overflow-hidden"
          >
            {/* Inner gradient animation */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 rounded-full opacity-50"
            />

            {/* Icon */}
            <motion.div
              animate={{
                rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 2,
              }}
              className="relative z-10"
            >
              {showQuickMenu ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </motion.div>

            {/* Shine effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </motion.button>

          {/* Quick menu toggle button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleQuickMenu}
            className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full shadow-lg flex items-center justify-center"
          >
            <Zap className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Keyboard shortcut hint (appears briefly on page load) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
        transition={{ times: [0, 0.1, 0.9, 1], duration: 5, delay: 2 }}
        className="absolute bottom-full right-0 mb-2 pointer-events-none"
      >
        <div className="bg-gray-900/90 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>Press</span>
            <kbd className="px-2 py-0.5 bg-gray-800 text-purple-400 rounded font-mono">
              Ctrl+K
            </kbd>
            <span>for AI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIFloatingButton;
