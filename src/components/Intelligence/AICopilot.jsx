// src/components/Intelligence/AICopilot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  TrendingUp,
  Lightbulb,
  BarChart3,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';

/**
 * AI Business Copilot
 * Intelligent assistant that provides contextual insights and answers
 */
const AICopilot = ({ onClose, initialContext = {} }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Business Copilot. I can help you understand your data, identify opportunities, and make data-driven decisions. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    {
      icon: TrendingUp,
      label: 'Show revenue forecast',
      query: 'What is my revenue forecast for the next 30 days?',
    },
    {
      icon: Lightbulb,
      label: 'Get recommendations',
      query: 'What are my top 3 recommendations to improve performance?',
    },
    {
      icon: BarChart3,
      label: 'Analyze performance',
      query: 'How is my business performing this month?',
    },
    {
      icon: AlertCircle,
      label: 'Show anomalies',
      query: 'Are there any unusual patterns or anomalies in my data?',
    },
  ];

  // Simulate AI response (in production, this would call the intelligence engine)
  const generateResponse = async (userQuery) => {
    setIsThinking(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let response = '';

    // Simple keyword-based responses (in production, use actual AI engine)
    const query = userQuery.toLowerCase();

    if (query.includes('revenue') && query.includes('forecast')) {
      response = `Based on historical data analysis, I predict your revenue will grow by 12% over the next 30 days, reaching approximately $145,000. This forecast has an 85% confidence level.

Key drivers:
• Seasonal trends showing upward momentum
• Recent marketing campaign impact
• Increased customer retention rate

I recommend preparing for increased inventory demand and optimizing staffing for peak hours.`;
    } else if (query.includes('recommendation') || query.includes('improve')) {
      response = `Here are my top 3 recommendations to improve your performance:

1. **Menu Optimization** (High Impact)
   • 8 underperforming items are reducing profitability
   • Removing or reimagining these could increase profit by 15%

2. **Peak Hour Staffing** (Medium Impact)
   • Currently overstaffed during slow hours
   • Potential cost savings: $2,400/month

3. **Customer Retention Program** (High Impact)
   • 60% of customers don't return
   • Implementing loyalty program could boost repeat business by 25%

Would you like me to elaborate on any of these?`;
    } else if (query.includes('perform') || query.includes('doing')) {
      response = `Your business is performing well this month! Here's the summary:

**Overall Health Score: 78/100 (B)**

Strengths:
• Revenue is up 8.5% vs last month
• Profit margins healthy at 22%
• Customer satisfaction at 4.3/5

Areas for improvement:
• Order fulfillment at 92% (target: 95%)
• Inventory turnover could be optimized
• Peak hour dependency is high

You're on track to meet your monthly goals. Keep up the momentum!`;
    } else if (query.includes('anomal') || query.includes('unusual') || query.includes('pattern')) {
      response = `I've detected 3 anomalies worth investigating:

1. **Revenue Spike - March 15** (Moderate)
   • Revenue was 45% above normal
   • Likely caused by promotional campaign
   • Suggestion: Replicate successful strategies

2. **Order Drop - March 18** (Severe)
   • Orders decreased by 30%
   • Coincides with competitor promotion
   • Action: Review competitive positioning

3. **Inventory Pattern** (Mild)
   • Unusual stockout rate for Category A items
   • May indicate demand shift or supply issue

Would you like detailed analysis on any of these?`;
    } else if (query.includes('help') || query.includes('can you')) {
      response = `I can help you with many things:

**Analysis & Insights**
• Revenue forecasting and predictions
• Performance analysis and trends
• Anomaly detection and alerts
• Customer behavior analysis

**Recommendations**
• Menu optimization strategies
• Pricing recommendations
• Staffing optimization
• Inventory management

**Reporting**
• Executive summaries
• Custom reports and dashboards
• KPI tracking
• Competitive benchmarking

**What-If Scenarios**
• Revenue projections
• Cost-benefit analysis
• Growth simulations

Just ask me anything about your business!`;
    } else {
      response = `I understand you're asking about "${userQuery}".

Based on your current business data:
• Revenue trend: Positive (+8.5% this month)
• Business health score: 78/100 (Good)
• Active recommendations: 5 high-impact actions available

I can provide specific insights on:
• Financial performance and forecasts
• Operational efficiency
• Customer analytics
• Product performance
• Growth opportunities

Please ask me a more specific question, or try one of the quick actions above!`;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      },
    ]);

    setIsThinking(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: input,
        timestamp: new Date(),
      },
    ]);

    // Generate response
    generateResponse(input);

    setInput('');
  };

  const handleQuickAction = (query) => {
    setInput(query);
    handleSend();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">AI Business Copilot</h2>
              <p className="text-blue-100 text-xs">Powered by NAVA Intelligence Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                } rounded-2xl px-4 py-3 shadow-sm`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      AI Copilot
                    </span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-line leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user'
                      ? 'text-blue-200'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Quick Actions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(action.query);
                      setTimeout(handleSend, 100);
                    }}
                    className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your business..."
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              disabled={isThinking}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Powered by advanced predictive analytics and ML-inspired algorithms
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AICopilot;
