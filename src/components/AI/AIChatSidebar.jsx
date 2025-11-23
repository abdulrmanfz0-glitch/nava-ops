/**
 * AI Chat Sidebar
 * Beautiful sliding sidebar for the global AI assistant
 * Accessible from anywhere via Ctrl+K or floating button
 */

import React, { useRef, useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  TrendingUp,
  Lightbulb,
  BarChart3,
  AlertCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  Brain,
  Target,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useAIChat, MESSAGE_TYPES } from '@/contexts/AIChatContext';

// Quick action buttons configuration
const QUICK_ACTIONS = [
  {
    id: 'forecast',
    icon: TrendingUp,
    label: 'Revenue Forecast',
    color: 'from-blue-500 to-cyan-500',
    query: 'What is my revenue forecast for the next 30 days?',
  },
  {
    id: 'recommendations',
    icon: Lightbulb,
    label: 'Get Recommendations',
    color: 'from-amber-500 to-orange-500',
    query: 'What are my top recommendations to improve performance?',
  },
  {
    id: 'performance',
    icon: BarChart3,
    label: 'Performance Check',
    color: 'from-green-500 to-emerald-500',
    query: 'How is my business performing this month?',
  },
  {
    id: 'anomalies',
    icon: AlertCircle,
    label: 'Detect Anomalies',
    color: 'from-red-500 to-pink-500',
    query: 'Are there any unusual patterns or anomalies in my data?',
  },
];

// Message component
const ChatMessage = memo(({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.type === MESSAGE_TYPES.USER;
  const isError = message.type === MESSAGE_TYPES.ERROR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div
        className={`relative max-w-[85%] ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : isError
            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
            : 'bg-white/5 border border-white/10 text-gray-200'
        } rounded-2xl px-4 py-3 shadow-lg`}
      >
        {/* Assistant header */}
        {!isUser && !isError && (
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-md bg-gradient-to-r from-purple-500 to-blue-500">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-purple-400">NAVA AI</span>
            {message.metadata?.confidence && (
              <span className="text-xs text-gray-500">
                {Math.round(message.metadata.confidence * 100)}% confidence
              </span>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="text-sm whitespace-pre-line leading-relaxed prose prose-invert prose-sm max-w-none">
          {message.content}
        </div>

        {/* Timestamp and actions */}
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs ${
              isUser ? 'text-blue-200' : 'text-gray-500'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {/* Copy button for assistant messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Follow-up questions */}
        {message.metadata?.followUps?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">Follow-up questions:</p>
            <div className="space-y-1">
              {message.metadata.followUps.map((question, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  onClick={() => onCopy && onCopy(question)}
                >
                  <ChevronRight className="w-3 h-3" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// Typing indicator
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-start"
  >
    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-gradient-to-r from-purple-500 to-blue-500">
          <Brain className="w-3 h-3 text-white animate-pulse" />
        </div>
        <span className="text-sm text-gray-400">NAVA AI is thinking</span>
        <div className="flex gap-1">
          <motion.span
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

// Main sidebar component
const AIChatSidebar = () => {
  const {
    isOpen,
    closeChat,
    messages,
    isLoading,
    sendMessage,
    sendQuickAction,
    clearMessages,
    inputValue,
    setInputValue,
  } = useAIChat();

  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle send
  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle follow-up click
  const handleFollowUp = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const sidebarWidth = isExpanded ? 'w-[600px]' : 'w-[420px]';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeChat}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full ${sidebarWidth} bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="p-2 bg-white/20 rounded-xl backdrop-blur"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    NAVA AI
                    <span className="px-2 py-0.5 text-[10px] bg-white/20 rounded-full">
                      Co-Pilot
                    </span>
                  </h2>
                  <p className="text-blue-100 text-xs">
                    Your intelligent operations assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={clearMessages}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && (
              <div className="p-4 border-b border-gray-700 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-gray-400">Quick Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendQuickAction(action.id)}
                        disabled={isLoading}
                        className={`flex items-center gap-2 p-3 bg-gradient-to-r ${action.color} bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed border border-white/5`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${action.color}`}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {action.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={handleFollowUp}
                />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about your business..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-white placeholder-gray-500 resize-none max-h-32"
                    disabled={isLoading}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
                    Ctrl+K
                  </kbd>
                  <span>to toggle</span>
                </span>
                <span>Powered by NAVA Intelligence Engine</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatSidebar;
