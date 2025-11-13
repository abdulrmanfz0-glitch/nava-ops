// src/pages/Intelligence.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Target,
  Activity,
  MessageCircle,
  BarChart3,
  Zap,
  RefreshCw,
} from 'lucide-react';

// Intelligence Components
import InsightCard from '../components/Intelligence/InsightCard';
import RecommendationCard from '../components/Intelligence/RecommendationCard';
import HealthScoreWidget from '../components/Intelligence/HealthScoreWidget';
import PredictionChart from '../components/Intelligence/PredictionChart';
import ScenarioSimulator from '../components/Intelligence/ScenarioSimulator';
import AICopilot from '../components/Intelligence/AICopilot';

// Intelligence Engine
import intelligenceEngine from '../lib/intelligenceEngine';
import logger from '../lib/logger';

/**
 * Intelligence Dashboard
 * Next-generation AI-powered business intelligence hub
 */
const Intelligence = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Intelligence Data
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState(null);

  // Mock data (in production, fetch from API)
  const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: 25000 + Math.random() * 10000 + i * 200,
    orders: 150 + Math.floor(Math.random() * 50),
    costs: 18000 + Math.random() * 5000,
  }));

  const mockCurrentMetrics = {
    revenue: 42000,
    costs: 28000,
    profit: 14000,
    orders: 245,
    customers: 180,
    newCustomers: 65,
    returningCustomers: 115,
    averageOrderValue: 171.43,
    completedOrders: 238,
    totalOrders: 245,
    customerSatisfaction: 4.3,
    volume: 1200,
    staffCosts: 8400,
    revenuePerStaff: 6000,
  };

  // Load intelligence data
  useEffect(() => {
    loadIntelligenceData();
  }, []);

  const loadIntelligenceData = async () => {
    setLoading(true);

    try {
      // Generate business insights
      const insightsResult = intelligenceEngine.generateBusinessInsights(
        mockCurrentMetrics,
        mockHistoricalData
      );
      if (insightsResult.success) {
        setInsights(insightsResult.insights || []);
      }

      // Generate recommendations
      const recsResult = intelligenceEngine.generateRecommendations({
        metrics: mockCurrentMetrics,
        historical: mockHistoricalData,
        goals: { revenue: 50000 },
      });
      if (recsResult.success) {
        setRecommendations(recsResult.recommendations || []);
      }

      // Calculate health score
      const healthResult = intelligenceEngine.calculateHealthScore(
        mockCurrentMetrics,
        mockHistoricalData
      );
      if (healthResult.success) {
        setHealthScore(healthResult);
      }

      // Generate revenue forecast
      const forecastResult = intelligenceEngine.advancedRevenueForecast(mockHistoricalData, {
        daysToForecast: 30,
        includeSeasonality: true,
      });
      if (forecastResult.success) {
        setForecast(forecastResult);
      }

      // Detect anomalies
      const anomalyData = mockHistoricalData.map((d) => ({
        value: d.revenue,
        timestamp: d.date,
      }));
      const anomalyResult = intelligenceEngine.detectAdvancedAnomalies(anomalyData, {
        sensitivity: 'medium',
      });
      if (anomalyResult.success) {
        setAnomalies(anomalyResult.anomalies || []);
      }

      // Generate executive summary
      const summaryResult = intelligenceEngine.generateExecutiveSummary({
        metrics: mockCurrentMetrics,
        historical: mockHistoricalData,
        insights: insightsResult.insights,
        recommendations: recsResult.recommendations,
        healthScore: healthResult,
      });
      if (summaryResult.success) {
        setExecutiveSummary(summaryResult.summary);
      }

      logger.info('Intelligence data loaded successfully');
    } catch (error) {
      logger.error('Failed to load intelligence data', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadIntelligenceData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Intelligence Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
                <Brain className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                  Intelligence Hub
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </h1>
                <p className="text-blue-100 text-lg">
                  AI-Powered Business Intelligence & Predictive Analytics
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <button
                onClick={() => setShowCopilot(true)}
                className="px-4 py-2 bg-white text-purple-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>AI Copilot</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Banner */}
          {executiveSummary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20"
            >
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{executiveSummary.headline}</h3>
                  <p className="text-blue-100 text-sm">{executiveSummary.outlook}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div>
                      <span className="text-blue-200">Health Score: </span>
                      <span className="font-bold">{executiveSummary.healthScore}/100</span>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                      <span className="text-blue-200">Period: </span>
                      <span className="font-bold">{executiveSummary.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Health Score */}
        <div className="xl:col-span-1">
          <HealthScoreWidget healthData={healthScore} />
        </div>

        {/* Right Column - Revenue Forecast */}
        <div className="xl:col-span-2">
          {forecast && (
            <PredictionChart
              historicalData={mockHistoricalData}
              predictions={forecast.predictions}
              title="30-Day Revenue Forecast"
            />
          )}
        </div>
      </div>

      {/* Critical Insights */}
      {insights.filter((i) => i.priority === 'critical' || i.priority === 'high').length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Critical Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights
              .filter((i) => i.priority === 'critical' || i.priority === 'high')
              .slice(0, 4)
              .map((insight, index) => (
                <InsightCard key={index} insight={insight} expandable showActions />
              ))}
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Recommendations
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.slice(0, 4).map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Scenario Simulator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            What-If Scenarios
          </h2>
        </div>
        <ScenarioSimulator baseMetrics={mockCurrentMetrics} />
      </div>

      {/* All Insights Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Insights</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({insights.length} total)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} expandable showActions />
          ))}
        </div>
      </div>

      {/* Anomalies Detection */}
      {anomalies.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detected Anomalies
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({anomalies.length} detected)
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-3">
              {anomalies.slice(0, 10).map((anomaly, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 ${
                    anomaly.severity === 'severe'
                      ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
                      : 'border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            anomaly.type === 'spike'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {anomaly.type.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            anomaly.severity === 'severe'
                              ? 'bg-red-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {anomaly.timestamp}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Value: <span className="font-bold">${anomaly.value.toLocaleString()}</span>
                        {' | '}
                        Expected: <span className="font-bold">${anomaly.expected.toLocaleString()}</span>
                        {' | '}
                        Deviation: <span className="font-bold">${Math.abs(anomaly.deviation).toLocaleString()}</span>
                      </div>
                      {anomaly.method && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Detection method: {anomaly.method}
                        </div>
                      )}
                    </div>
                    {anomaly.confidence && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {(anomaly.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      {executiveSummary && executiveSummary.nextSteps && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Next Steps</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {executiveSummary.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {step.action}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.reason}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Priority: <span className="font-semibold">{step.priority}</span>
                      </span>
                      {step.expectedImpact && (
                        <span className="text-gray-500 dark:text-gray-400">
                          Impact: <span className="font-semibold">{step.expectedImpact}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Copilot */}
      {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCopilot(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-shadow z-40"
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>
    </div>
  );
};

export default Intelligence;
