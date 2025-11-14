import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';
import { useData } from '../../contexts/DataContext';
import { processQuery, getSampleQueries } from '../../utils/intentDetector';
import { analyzeData } from '../../utils/dataAnalyzer';
import { generateResponse } from '../../utils/responseGenerator';

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hi! I'm your AI assistant. Ask me anything about your restaurant operations!",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { menuItems, categories } = useMenu();
  const { branches } = useData();

  const sampleQueries = getSampleQueries();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (query = inputValue) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Process the query
      const processed = processQuery(query);

      // Analyze data based on query
      const analysis = analyzeData(processed, {
        menuItems,
        branches,
        categories
      });

      // Generate response
      const response = generateResponse(analysis, processed);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.text,
        data: response.data,
        insights: response.insights,
        visualization: response.visualization,
        responseType: response.type,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);

      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: "⚠️ Sorry, I encountered an error processing your request. Please try rephrasing your question.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    }

    setIsThinking(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (query) => {
    setInputValue(query);
    handleSendMessage(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-lg h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
              AI Assistant
            </h3>
            <p className="text-xs text-white/80">Powered by Restalyze Intelligence</p>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isThinking && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 mt-3">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries[0].queries.slice(0, 3).map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(query)}
                className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isThinking}
            className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Press Enter to send • AI responses are based on current data
        </p>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }) {
  const { type, text, insights, timestamp } = message;

  const isUser = type === 'user';

  if (isUser) {
    return (
      <div className="flex items-start justify-end space-x-3">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          U
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 max-w-[80%]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
          {/* Main text - Support markdown-style formatting */}
          <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
            {text.split('\n').map((line, index) => {
              // Bold text **text**
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={index} className="my-1">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i}>{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                );
              }
              // Headers
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-md font-semibold mt-2 mb-1">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-lg font-bold mt-3 mb-2">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              return line ? (
                <p key={index} className="my-1">
                  {line}
                </p>
              ) : (
                <br key={index} />
              );
            })}
          </div>
        </div>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div className="mt-2 ml-2 space-y-1">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"
              >
                <span className="text-blue-600 dark:text-blue-400 font-bold">💡</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-2">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}

// Floating Button Component (exported separately)
export function AIAssistantButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40 animate-float"
      title="AI Assistant"
    >
      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
    </button>
  );
}
