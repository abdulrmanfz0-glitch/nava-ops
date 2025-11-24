/**
 * AI Chat Context
 * Global state management for the AI Chat Sidebar and Assistant
 * Provides chat functionality accessible from anywhere in the app
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { aiClient } from '@/services/aiClient';

const AIChatContext = createContext(null);

// Chat message types
export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error',
};

// Initial welcome message
const WELCOME_MESSAGE = {
  id: 'welcome',
  type: MESSAGE_TYPES.ASSISTANT,
  content: `Hello! I'm your **Senior Advisor** for NAVA OPS - think of me as your trusted business partner who's here to help you understand your restaurant, make better decisions, and increase profitability.

**I'm here to help you with:**

💡 **Understanding Your Business**
• Explain financial concepts in simple terms (What does revenue mean? How do refunds affect profit?)
• Break down your numbers and show where your money goes
• Answer any questions about your restaurant operations

📊 **Making Sense of Changes**
• Why did sales drop yesterday?
• What's driving your revenue growth?
• Understanding patterns and trends in your data

🎯 **Growing Your Profit**
• Actionable recommendations with real financial impact
• Finding opportunities to increase revenue
• Reducing costs and improving margins

📈 **Business Performance**
• Daily revenue and order analysis
• Branch comparisons and insights
• Forecasting and planning for the future

**You can ask me anything!** I'll explain everything in simple, clear language - no confusing jargon. Whether you want to understand what "profit margin" means or need help figuring out why sales changed, I'm here to help.

What would you like to know about your business today?`,
  timestamp: new Date(),
  metadata: {
    source: 'system',
    confidence: 1.0,
  },
};

export function AIChatProvider({ children }) {
  // Chat state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Context state (for providing business context to AI)
  const [businessContext, setBusinessContext] = useState({
    currentBranch: null,
    currentPage: null,
    selectedDateRange: null,
    filters: {},
  });

  // Language preference
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to English
    return localStorage.getItem('nava_ai_language') || 'en';
  });

  // Session state
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messageIdRef = useRef(0);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    messageIdRef.current += 1;
    return `msg_${Date.now()}_${messageIdRef.current}`;
  }, []);

  // Open the chat sidebar
  const openChat = useCallback((context = {}) => {
    setIsOpen(true);
    if (context) {
      setBusinessContext(prev => ({ ...prev, ...context }));
    }
  }, []);

  // Close the chat sidebar
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle chat visibility
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Add a message to the chat
  const addMessage = useCallback((message) => {
    const newMessage = {
      id: generateMessageId(),
      timestamp: new Date(),
      ...message,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [generateMessageId]);

  // Clear all messages and reset to welcome
  const clearMessages = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setError(null);
  }, []);

  // Toggle language
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('nava_ai_language', newLanguage);
  }, [language]);

  // Set specific language
  const setAILanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('nava_ai_language', lang);
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(async (content, options = {}) => {
    if (!content.trim()) return null;

    setError(null);
    setIsLoading(true);

    // Add user message
    const userMessage = addMessage({
      type: MESSAGE_TYPES.USER,
      content: content.trim(),
      metadata: {
        context: businessContext,
        options,
      },
    });

    try {
      // Get AI response
      const response = await aiClient.chat({
        message: content.trim(),
        sessionId,
        context: { ...businessContext, language }, // Include language in context
        history: messages.slice(-10), // Send last 10 messages for context
        ...options,
      });

      // Add assistant message
      const assistantMessage = addMessage({
        type: MESSAGE_TYPES.ASSISTANT,
        content: response.content,
        metadata: {
          source: response.source || 'ai',
          confidence: response.confidence,
          insights: response.insights,
          actions: response.actions,
          followUps: response.followUps,
          visualizations: response.visualizations,
          usage: response.usage,
        },
      });

      setIsLoading(false);
      return assistantMessage;

    } catch (err) {
      console.error('AI Chat Error:', err);

      // Add error message
      addMessage({
        type: MESSAGE_TYPES.ERROR,
        content: err.message || 'Sorry, I encountered an error. Please try again.',
        metadata: {
          error: true,
          originalMessage: content,
        },
      });

      setError(err.message);
      setIsLoading(false);
      return null;
    }
  }, [addMessage, businessContext, messages, sessionId, language]);

  // Quick action handler
  const sendQuickAction = useCallback(async (action) => {
    const quickActionQueries = {
      forecast: 'What is my revenue forecast for the next 30 days?',
      recommendations: 'What are my top recommendations to improve performance?',
      performance: 'How is my business performing this month?',
      anomalies: 'Are there any unusual patterns or anomalies in my data?',
      comparison: 'Compare performance across all my branches',
      trends: 'Show me the key trends from the past week',
      insights: 'What are the most important insights I should know about?',
      help: 'What can you help me with?',
    };

    const query = quickActionQueries[action] || action;
    return sendMessage(query);
  }, [sendMessage]);

  // Update business context
  const updateContext = useCallback((newContext) => {
    setBusinessContext(prev => ({ ...prev, ...newContext }));
  }, []);

  // Keyboard shortcut handler (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleChat();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleChat, closeChat]);

  const value = {
    // State
    isOpen,
    messages,
    isLoading,
    error,
    inputValue,
    businessContext,
    sessionId,
    language,

    // Actions
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    sendQuickAction,
    clearMessages,
    updateContext,
    setInputValue,
    toggleLanguage,
    setAILanguage,

    // Helpers
    addMessage,
    generateMessageId,
  };

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
}

/**
 * Hook to use AI Chat functionality
 * @returns {Object} AI Chat context value
 */
export function useAIChat() {
  const context = useContext(AIChatContext);

  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }

  return context;
}

export default AIChatContext;
