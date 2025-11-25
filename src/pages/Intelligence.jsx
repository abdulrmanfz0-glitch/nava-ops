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

// NAVA UI Components
import {
  Sidebar,
  TopNavbar,
  ModernCard,
  SectionTitle,
  NeoButton,
  StatBadge
} from '@/components/nava-ui';

// Intelligence Components
import InsightCard from '../components/Intelligence/InsightCard';
import RecommendationCard from '../components/Intelligence/RecommendationCard';
import HealthScoreWidget from '../components/Intelligence/HealthScoreWidget';
import PredictionChart from '../components/Intelligence/PredictionChart';
import ScenarioSimulator from '../components/Intelligence/ScenarioSimulator';

// Global AI Chat
import { useAIChat } from '../contexts/AIChatContext';

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
  const { openChat } = useAIChat();

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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E1A]">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading Intelligence Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0E1A]">
      {/* Sidebar */}
      <Sidebar defaultCollapsed={false} />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[280px] transition-all duration-300">
        {/* Top Navbar */}
        <TopNavbar
          user={{ name: 'Admin User', email: 'admin@navaops.com' }}
          notificationCount={3}
        />

        {/* Page Content */}
        <div className="p-6 space-y-6 mt-20">
          {/* Header */}
          <ModernCard variant="gradient" className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 border-purple-500/30">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-500/20 rounded-xl backdrop-blur border border-purple-400/30 shadow-lg shadow-purple-500/20">
                    <Brain className="w-10 h-10 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
                      Intelligence Hub
                      <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </h1>
                    <p className="text-blue-200 text-lg">
                      AI-Powered Business Intelligence & Predictive Analytics
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <NeoButton
                    variant="glass"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    icon={RefreshCw}
                    className={refreshing ? 'animate-spin' : ''}
                  >
                    Refresh
                  </NeoButton>
                  <NeoButton
                    variant="primary"
                    onClick={openChat}
                    icon={MessageCircle}
                  >
                    Ask AI
                  </NeoButton>
                </div>
              </div>

              {/* Executive Summary Banner */}
              {executiveSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 flex-shrink-0 mt-1 text-cyan-400" />
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white mb-2">{executiveSummary.headline}</h3>
                      <p className="text-blue-100">{executiveSummary.outlook}</p>
                      <div className="mt-4 flex gap-6 text-sm">
                        <div>
                          <span className="text-blue-200">Health Score: </span>
                          <span className="font-bold text-white text-lg">{executiveSummary.healthScore}/100</span>
                        </div>
                        <div className="border-l border-white/20 pl-6">
                          <span className="text-blue-200">Period: </span>
                          <span className="font-bold text-white">{executiveSummary.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ModernCard>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
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
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">
                What-If Scenarios
              </h2>
            </div>
            <ScenarioSimulator baseMetrics={mockCurrentMetrics} />
          </div>

          {/* All Insights Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">All Insights</h2>
              <StatBadge label={`${insights.length} total`} variant="info" glow />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} expandable showActions />
              ))}
            </div>
          </div>

          {/* Anomalies Detection */}
          {anomalies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">
                  Detected Anomalies
                </h2>
                <StatBadge label={`${anomalies.length} detected`} variant="danger" glow />
              </div>
              <ModernCard variant="glass">
                <div className="p-6">
                  <div className="space-y-3">
                    {anomalies.slice(0, 10).map((anomaly, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border-2 ${
                          anomaly.severity === 'severe'
                            ? 'border-red-500/30 bg-red-500/10'
                            : 'border-yellow-500/30 bg-yellow-500/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <StatBadge
                                label={anomaly.type}
                                variant={anomaly.type === 'spike' ? 'success' : 'danger'}
                                size="sm"
                              />
                              <StatBadge
                                label={anomaly.severity}
                                variant={anomaly.severity === 'severe' ? 'danger' : 'warning'}
                                size="sm"
                              />
                              <span className="text-xs text-gray-400">
                                {anomaly.timestamp}
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              Value: <span className="font-bold text-white">${anomaly.value.toLocaleString()}</span>
                              {' | '}
                              Expected: <span className="font-bold text-white">${anomaly.expected.toLocaleString()}</span>
                              {' | '}
                              Deviation: <span className="font-bold text-white">${Math.abs(anomaly.deviation).toLocaleString()}</span>
                            </div>
                            {anomaly.method && (
                              <div className="text-xs text-gray-500 mt-1">
                                Detection method: {anomaly.method}
                              </div>
                            )}
                          </div>
                          {anomaly.confidence && (
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Confidence</div>
                              <div className="text-2xl font-bold text-white">
                                {(anomaly.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ModernCard>
            </div>
          )}

          {/* Executive Summary - Next Steps */}
          {executiveSummary && executiveSummary.nextSteps && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Next Steps</h2>
              </div>
              <ModernCard variant="glass">
                <div className="p-6">
                  <div className="space-y-4">
                    {executiveSummary.nextSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">
                            {step.action}
                          </h4>
                          <p className="text-sm text-gray-300">{step.reason}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs">
                            <StatBadge
                              label={`Priority: ${step.priority}`}
                              variant={
                                step.priority === 'high' ? 'danger' :
                                step.priority === 'medium' ? 'warning' :
                                'info'
                              }
                              size="sm"
                            />
                            {step.expectedImpact && (
                              <span className="text-gray-400">
                                Impact: <span className="font-semibold text-white">{step.expectedImpact}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ModernCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
