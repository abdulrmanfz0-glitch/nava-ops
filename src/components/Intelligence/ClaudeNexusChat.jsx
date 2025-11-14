/**
 * Claude Nexus Chat Component
 * Conversational AI interface for restaurant intelligence
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Trash2,
  BarChart3
} from 'lucide-react';
import { claudeNexus } from '@/services/claudeNexusAPI';
import { useAuth } from '@/contexts/AuthContext';

export default function ClaudeNexusChat({ branchIds = [], className = '' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm Claude Nexus, your restaurant intelligence assistant. I can help you understand your business performance, identify trends, and make data-driven decisions.\n\nTry asking me:\n• How did we perform this week?\n• Which branch is doing best?\n• What should I focus on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await claudeNexus.chat(user?.id || 'demo', input.trim(), {
        branchIds
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.narrative,
        insights: response.insights,
        actions: response.actions,
        followUps: response.followUps,
        visualizations: response.visualizations,
        timestamp: new Date(),
        error: !response.success
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please make sure your API key is configured correctly in .env.local",
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle suggestion click
  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Clear conversation
  const handleClear = () => {
    if (confirm('Clear conversation history?')) {
      setMessages([messages[0]]); // Keep welcome message
      claudeNexus.clearHistory(user?.id || 'demo');
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Claude Nexus
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                POC
              </span>
            </h3>
            <p className="text-xs text-gray-400">Your Intelligence Assistant</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onSuggestionClick={handleSuggestion}
            />
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about performance, trends, forecasts..."
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

/**
 * Individual message bubble component
 */
function MessageBubble({ message, onSuggestionClick }) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[85%] ${isAssistant ? 'order-1' : 'order-2'}`}>
        {/* Message Content */}
        <div
          className={`rounded-2xl p-4 ${
            isAssistant
              ? message.error
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-white/5 border border-white/10'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        >
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isAssistant ? 'text-gray-200' : 'text-white'
          }`}>
            {message.content}
          </div>

          {/* Insights */}
          {message.insights && message.insights.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                Key Insights
              </div>
              {message.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-300 bg-white/5 rounded-lg p-2 border border-white/10"
                >
                  • {insight}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {message.actions && message.actions.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-semibold">
                <TrendingUp className="w-4 h-4" />
                Recommended Actions
              </div>
              {message.actions.map((action, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-300 bg-white/5 rounded-lg p-2 border border-white/10"
                >
                  {idx + 1}. {action.text}
                </div>
              ))}
            </div>
          )}

          {/* Visualizations */}
          {message.visualizations && message.visualizations.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                <BarChart3 className="w-4 h-4" />
                Suggested Visualizations
              </div>
              <div className="flex flex-wrap gap-2">
                {message.visualizations.map((viz, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/20"
                  >
                    {viz.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {message.followUps && message.followUps.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs text-gray-400 font-semibold">
                Follow-up questions:
              </div>
              {message.followUps.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(question)}
                  className="block w-full text-left text-sm text-purple-300 hover:text-purple-200 bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 px-2 ${
          isAssistant ? 'text-left' : 'text-right'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Typing indicator component
 */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span className="text-sm text-gray-400">Claude is thinking...</span>
        </div>
      </div>
    </motion.div>
  );
}
