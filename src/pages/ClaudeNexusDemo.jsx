/**
 * Claude Nexus Demo Page
 * Proof of Concept - Restaurant Intelligence Core
 *
 * This page showcases the conversational AI capabilities of Claude Nexus
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  TrendingUp,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ClaudeNexusChat from '@/components/Intelligence/ClaudeNexusChat';
import { claudeNexus } from '@/services/claudeNexusAPI';
import { useAuth } from '@/contexts/AuthContext';

export default function ClaudeNexusDemo() {
  const { user } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [branchIds, setBranchIds] = useState([]);

  useEffect(() => {
    setIsConfigured(claudeNexus.isConfigured());

    // Get user's branch IDs (you can customize this)
    // For demo, we'll use all branches
    setBranchIds([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Proof of Concept</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Claude Nexus
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            The Intelligence Core of Your Restaurant SaaS
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ask questions in natural language. Get insights backed by your real business data.
            Make decisions with confidence.
          </p>
        </motion.div>

        {/* Configuration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ConfigurationStatus isConfigured={isConfigured} />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="h-[700px]">
              <ClaudeNexusChat branchIds={branchIds} />
            </div>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Features */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Capabilities
              </h3>
              <div className="space-y-3">
                <Feature
                  icon={<BarChart3 className="w-4 h-4" />}
                  title="Business Intelligence"
                  description="Analyzes revenue, orders, trends, and performance metrics"
                />
                <Feature
                  icon={<TrendingUp className="w-4 h-4" />}
                  title="Predictive Insights"
                  description="Forecasts trends and identifies opportunities"
                />
                <Feature
                  icon={<Zap className="w-4 h-4" />}
                  title="Actionable Recommendations"
                  description="Provides specific actions to improve performance"
                />
                <Feature
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Natural Language"
                  description="Ask questions in plain English, get clear answers"
                />
              </div>
            </div>

            {/* Example Questions */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Try Asking</h3>
              <div className="space-y-2">
                <ExampleQuestion text="How did we perform last week?" />
                <ExampleQuestion text="Which branch is doing best?" />
                <ExampleQuestion text="What should I focus on today?" />
                <ExampleQuestion text="Show me revenue trends" />
                <ExampleQuestion text="Why did sales drop on Tuesday?" />
                <ExampleQuestion text="What's our forecast for next month?" />
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Technical Stack</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="text-purple-300">Claude 3.5 Sonnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="text-purple-300">Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span>Context Window:</span>
                  <span className="text-purple-300">200K tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-purple-300">&lt;3 seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3">The Vision</h2>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Claude Nexus isn't just an AI feature—it's the intelligence core of your restaurant SaaS.
            Every query should feel like consulting the world's most brilliant restaurant analyst who
            knows your business intimately. Every insight should be so obvious in hindsight that you
            wonder how you ever operated without it.
          </p>
          <p className="text-purple-300 mt-4 font-semibold">
            This is just the beginning.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Configuration status component
 */
function ConfigurationStatus({ isConfigured }) {
  if (isConfigured) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-green-300 font-semibold mb-1">Ready to Go!</h4>
          <p className="text-sm text-gray-300">
            Claude Nexus is configured and ready. Start asking questions about your business.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-amber-300 font-semibold mb-2">Configuration Required</h4>
        <p className="text-sm text-gray-300 mb-3">
          To use Claude Nexus, you need to add your Anthropic API key to your environment configuration.
        </p>
        <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
          <li>Get an API key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">console.anthropic.com</a></li>
          <li>Create a <code className="bg-white/10 px-2 py-0.5 rounded text-purple-300">.env.local</code> file in your project root</li>
          <li>Add: <code className="bg-white/10 px-2 py-0.5 rounded text-purple-300">VITE_ANTHROPIC_API_KEY=your-api-key-here</code></li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * Feature component
 */
function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-white text-sm font-semibold mb-1">{title}</h4>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );
}

/**
 * Example question component
 */
function ExampleQuestion({ text }) {
  return (
    <div className="text-sm text-gray-300 bg-white/5 rounded-lg px-3 py-2 border border-white/10 hover:border-purple-500/50 transition-colors cursor-default">
      "{text}"
    </div>
  );
}
