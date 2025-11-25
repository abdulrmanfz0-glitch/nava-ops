/**
 * AI Intelligence Dashboard
 * Comprehensive AI-powered analytics and insights page
 */

import { useState, useEffect } from 'react';
import { useAI } from '@/contexts/AIContext';
import {
  Sidebar,
  TopNavbar,
  ModernCard,
  KPIWidget,
  SectionTitle,
  NeoButton,
  StatBadge
} from '@/components/nava-ui';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { SimpleLineChart as LineChart, SimpleBarChart as BarChart, SimplePieChart as PieChart } from '@/components/UI/Charts';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Activity,
  Calendar,
  Award,
  BarChart3,
  Zap
} from 'lucide-react';

export default function AIIntelligence() {
  const {
    analysisData,
    predictions,
    anomalies,
    recommendations,
    forecasts,
    alerts,
    healthScores,
    performanceScores,
    isLoading,
    error,
    runAnalysis,
    getInsightsSummary
  } = useAI();

  const [activeTab, setActiveTab] = useState('overview');
  const [insightsSummary, setInsightsSummary] = useState(null);

  // Load initial data
  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      // In a real app, fetch actual data from your API
      const mockData = {
        revenue: generateMockRevenueData(),
        orders: generateMockOrdersData(),
        costs: generateMockCostsData(),
        categories: generateMockCategoriesData(),
        branches: generateMockBranchesData(),
        customers: generateMockCustomersData()
      };

      await runAnalysis(mockData, {
        enablePredictions: true,
        enableAnomalies: true,
        enableRecommendations: true,
        enableForecasts: true,
        enableAlerts: true,
        enableScoring: true
      });

      const summary = await getInsightsSummary(mockData);
      setInsightsSummary(summary);
    } catch (err) {
      console.error('Failed to load AI data:', err);
    }
  };

  if (isLoading && !analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E1A]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Analyzing your data with AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0A0E1A]">
        <Sidebar defaultCollapsed={false} />
        <div className="flex-1 ml-0 lg:ml-[280px] transition-all duration-300">
          <TopNavbar user={{ name: 'Admin User', email: 'admin@navaops.com' }} notificationCount={3} />
          <div className="p-6 mt-20">
            <ModernCard variant="glass" className="bg-red-500/10 border-red-500/30">
              <div className="p-4">
                <p className="text-red-400">Error loading AI analysis: {error}</p>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'forecasts', label: 'Forecasts', icon: Calendar },
    { id: 'scores', label: 'Performance Scores', icon: Award }
  ];

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
          <SectionTitle
            title="AI Intelligence"
            subtitle="AI-powered insights, predictions, and recommendations"
            icon={Brain}
            accent="cyan"
          />

          {/* Quick Insights Summary */}
          {insightsSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ModernCard variant="glass" glow glowColor="cyan">
                <KPIWidget
                  title="Overall Health"
                  value={insightsSummary.overallHealth}
                  icon={Activity}
                  iconColor="text-green-400"
                  trend={insightsSummary.trendDirection === 'increasing' ? 'up' : 'down'}
                  animated
                />
              </ModernCard>
              <ModernCard variant="glass" glow glowColor={insightsSummary.criticalAlerts > 0 ? 'red' : 'teal'}>
                <KPIWidget
                  title="Active Alerts"
                  value={insightsSummary.criticalAlerts}
                  icon={AlertTriangle}
                  iconColor={insightsSummary.criticalAlerts > 0 ? 'text-red-400' : 'text-green-400'}
                  animated
                />
              </ModernCard>
              <ModernCard variant="glass" glow glowColor="purple">
                <KPIWidget
                  title="Recommendations"
                  value={insightsSummary.topRecommendations?.length || 0}
                  icon={Lightbulb}
                  iconColor="text-purple-400"
                  animated
                />
              </ModernCard>
              <ModernCard variant="glass" glow glowColor={insightsSummary.trendDirection === 'increasing' ? 'teal' : 'red'}>
                <KPIWidget
                  title="Trend Direction"
                  value={insightsSummary.trendDirection}
                  icon={insightsSummary.trendDirection === 'increasing' ? TrendingUp : TrendingDown}
                  iconColor={insightsSummary.trendDirection === 'increasing' ? 'text-green-400' : 'text-red-400'}
                  animated
                />
              </ModernCard>
            </div>
          )}

          {/* Tabs */}
          <ModernCard variant="glass">
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <NeoButton
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    icon={tab.icon}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </NeoButton>
                ))}
              </div>
            </div>
          </ModernCard>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <OverviewTab analysisData={analysisData} />}
            {activeTab === 'predictions' && <PredictionsTab predictions={predictions} />}
            {activeTab === 'anomalies' && <AnomaliesTab anomalies={anomalies} />}
            {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
            {activeTab === 'forecasts' && <ForecastsTab forecasts={forecasts} />}
            {activeTab === 'scores' && <ScoresTab scores={performanceScores} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analysisData }) {
  if (!analysisData) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No analysis data available</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
            <div className="space-y-3">
              {analysisData.predictions?.revenue && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Revenue Trend</p>
                    <p className="text-sm text-gray-400">
                      {analysisData.predictions.revenue.trend} (
                      {analysisData.predictions.revenue.changePercent.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              )}
              {analysisData.anomalies?.summary && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Anomalies Detected</p>
                    <p className="text-sm text-gray-400">
                      {analysisData.anomalies.summary.total} anomalies found
                    </p>
                  </div>
                </div>
              )}
              {analysisData.recommendations?.summary && (
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Action Items</p>
                    <p className="text-sm text-gray-400">
                      {analysisData.recommendations.summary.total} recommendations available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModernCard>

        {/* Health Score */}
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-2">
                  {analysisData.scores?.overallScore || 'N/A'}
                </div>
                <div className="text-gray-300">Overall Performance Score</div>
                {analysisData.scores?.grade && (
                  <StatBadge label={`Grade: ${analysisData.scores.grade}`} variant="success" glow className="mt-3" />
                )}
              </div>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Charts */}
      {analysisData.predictions?.revenue && (
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Prediction (30 Days)</h3>
            <div className="h-64">
              <LineChart
                data={analysisData.predictions.revenue.predictions.map((p) => ({
                  name: `Day ${p.day}`,
                  value: p.value,
                  upperBound: p.upperBound,
                  lowerBound: p.lowerBound
                }))}
                xKey="name"
                yKey="value"
              />
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
}

// Predictions Tab Component
function PredictionsTab({ predictions }) {
  if (!predictions) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No predictions available</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      {predictions.revenue && (
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Revenue Predictions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ModernCard variant="glass" className="bg-blue-500/10 border-blue-500/30">
                <div className="p-4">
                  <div className="text-sm text-gray-400">Current Value</div>
                  <div className="text-2xl font-bold text-blue-400">
                    ${predictions.revenue.currentValue?.toFixed(2) || 0}
                  </div>
                </div>
              </ModernCard>
              <ModernCard variant="glass" className="bg-green-500/10 border-green-500/30">
                <div className="p-4">
                  <div className="text-sm text-gray-400">Predicted Value</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${predictions.revenue.predictedValue?.toFixed(2) || 0}
                  </div>
                </div>
              </ModernCard>
              <ModernCard variant="glass" className="bg-purple-500/10 border-purple-500/30">
                <div className="p-4">
                  <div className="text-sm text-gray-400">Change</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {predictions.revenue.changePercent?.toFixed(1) || 0}%
                  </div>
                </div>
              </ModernCard>
            </div>
            <div className="h-64">
              <LineChart
                data={predictions.revenue.predictions.map((p) => ({
                  day: `Day ${p.day}`,
                  value: p.value,
                  confidence: p.confidence
                }))}
                xKey="day"
                yKey="value"
              />
            </div>
          </div>
        </ModernCard>
      )}

      {predictions.costs && (
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Cost Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm text-gray-400">Current Cost</div>
                <div className="text-2xl font-bold text-white">${predictions.costs.currentCost.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm text-gray-400">Projected Cost</div>
                <div className="text-2xl font-bold text-white">
                  ${predictions.costs.projectedCost.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="text-sm text-gray-400">Potential Savings</div>
                <div className="text-2xl font-bold text-green-400">
                  ${predictions.costs.potentialSavings.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
}

// Anomalies Tab Component
function AnomaliesTab({ anomalies }) {
  if (!anomalies || !anomalies.summary) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No anomalies detected</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernCard variant="glass" glow glowColor="cyan">
          <KPIWidget
            title="Total Anomalies"
            value={anomalies.summary.total}
            icon={AlertTriangle}
            iconColor="text-yellow-400"
            animated
          />
        </ModernCard>
        <ModernCard variant="glass" glow glowColor="red">
          <KPIWidget
            title="Critical"
            value={anomalies.summary.critical}
            icon={AlertTriangle}
            iconColor="text-red-400"
            animated
          />
        </ModernCard>
        <ModernCard variant="glass" glow glowColor="orange">
          <KPIWidget
            title="Warnings"
            value={anomalies.summary.warning}
            icon={AlertTriangle}
            iconColor="text-orange-400"
            animated
          />
        </ModernCard>
      </div>

      {anomalies.revenue?.anomalies && anomalies.revenue.anomalies.length > 0 && (
        <ModernCard variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Anomalies</h3>
            <div className="space-y-3">
              {anomalies.revenue.anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    anomaly.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white capitalize">{anomaly.type}</div>
                      <div className="text-sm text-gray-300">
                        Value: ${anomaly.value.toFixed(2)} (Expected: ${anomaly.expected.toFixed(2)})
                      </div>
                      {anomaly.date && (
                        <div className="text-xs text-gray-500 mt-1">Date: {anomaly.date}</div>
                      )}
                    </div>
                    <StatBadge
                      label={anomaly.severity}
                      variant={anomaly.severity === 'critical' ? 'danger' : 'warning'}
                      glow
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
}

// Recommendations Tab Component
function RecommendationsTab({ recommendations }) {
  if (!recommendations || !recommendations.recommendations) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No recommendations available</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ModernCard variant="glass" glow glowColor="cyan">
          <KPIWidget
            title="Total"
            value={recommendations.summary.total}
            icon={Lightbulb}
            iconColor="text-blue-400"
            animated
          />
        </ModernCard>
        <ModernCard variant="glass" glow glowColor="red">
          <KPIWidget
            title="Critical"
            value={recommendations.summary.critical}
            icon={Zap}
            iconColor="text-red-400"
            animated
          />
        </ModernCard>
        <ModernCard variant="glass" glow glowColor="orange">
          <KPIWidget
            title="High Priority"
            value={recommendations.summary.high}
            icon={Target}
            iconColor="text-orange-400"
            animated
          />
        </ModernCard>
        <ModernCard variant="glass" glow glowColor="yellow">
          <KPIWidget
            title="Medium Priority"
            value={recommendations.summary.medium}
            icon={Target}
            iconColor="text-yellow-400"
            animated
          />
        </ModernCard>
      </div>

      <div className="space-y-4">
        {recommendations.recommendations.map((rec) => (
          <ModernCard key={rec.id} variant="glass">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                <StatBadge
                  label={rec.priority}
                  variant={
                    rec.priority === 'critical' ? 'danger' :
                    rec.priority === 'high' ? 'warning' :
                    rec.priority === 'medium' ? 'info' :
                    'default'
                  }
                  glow
                />
              </div>
              <p className="text-gray-300 mb-4">{rec.description}</p>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-300 mb-2">Recommended Actions:</div>
                <ul className="space-y-1">
                  {rec.actions.map((action, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              {rec.potentialImpact && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-sm">
                  <span className="font-medium text-green-400">Potential Impact: </span>
                  <span className="text-green-300">{rec.potentialImpact}</span>
                </div>
              )}
            </div>
          </ModernCard>
        ))}
      </div>
    </div>
  );
}

// Forecasts Tab Component
function ForecastsTab({ forecasts }) {
  if (!forecasts || !forecasts.forecasts) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No forecasts available</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(forecasts.forecasts).map(([key, forecast]) => (
        <ModernCard key={key} variant="glass">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{forecast.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="text-sm text-gray-400">Total Projected</div>
                <div className="text-2xl font-bold text-blue-400">
                  ${forecast.summary.totalProjected.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <div className="text-sm text-gray-400">Daily Average</div>
                <div className="text-2xl font-bold text-purple-400">
                  ${forecast.summary.averageDaily.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="text-sm text-gray-400">Trend</div>
                <div className="text-2xl font-bold text-green-400 capitalize">
                  {forecast.summary.trend}
                </div>
              </div>
            </div>
            <div className="h-64">
              <LineChart
                data={forecast.forecast.slice(0, 30).map((f) => ({
                  date: f.date,
                  value: f.value,
                  upper: f.upperBound,
                  lower: f.lowerBound
                }))}
                xKey="date"
                yKey="value"
              />
            </div>
          </div>
        </ModernCard>
      ))}
    </div>
  );
}

// Scores Tab Component
function ScoresTab({ scores }) {
  if (!scores) {
    return (
      <ModernCard variant="glass">
        <div className="p-8 text-center text-gray-400">No performance scores available</div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
      <ModernCard variant="glass">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-cyan-400 mb-2">{scores.overallScore}</div>
            <div className="text-xl text-gray-300">Overall Performance Score</div>
            <StatBadge label={`Grade: ${scores.grade}`} variant="success" glow className="mt-3" />
          </div>
        </div>
      </ModernCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.components &&
          Object.entries(scores.components).map(([key, component]) => (
            <ModernCard key={key} variant="glass">
              <div className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{component.score}</div>
                  <div className="text-sm text-gray-400 capitalize">{key}</div>
                  <StatBadge label={component.grade} variant="info" glow className="mt-2" />
                </div>
              </div>
            </ModernCard>
          ))}
      </div>

      {scores.strengths && scores.strengths.length > 0 && (
        <ModernCard variant="glass" className="bg-green-500/10 border-green-500/30">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-400">Top Strengths</h3>
            <div className="space-y-2">
              {scores.strengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl">
                  <span className="text-gray-300 capitalize">
                    {strength.metric || strength.category}
                  </span>
                  <span className="font-bold text-green-400">{strength.score}</span>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}

      {scores.weaknesses && scores.weaknesses.length > 0 && (
        <ModernCard variant="glass" className="bg-red-500/10 border-red-500/30">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-400">Areas for Improvement</h3>
            <div className="space-y-2">
              {scores.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl">
                  <span className="text-gray-300 capitalize">
                    {weakness.metric || weakness.category}
                  </span>
                  <span className="font-bold text-red-400">{weakness.score}</span>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
}

// Mock data generators for demo purposes
function generateMockRevenueData() {
  const data = [];
  const baseRevenue = 5000;
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: baseRevenue + Math.random() * 2000 + i * 50
    });
  }
  return data;
}

function generateMockOrdersData() {
  const data = [];
  const baseOrders = 100;
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orders: Math.floor(baseOrders + Math.random() * 50 + i * 2)
    });
  }
  return data;
}

function generateMockCostsData() {
  const data = [];
  const baseCost = 1500;
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cost: baseCost + Math.random() * 500
    });
  }
  return data;
}

function generateMockCategoriesData() {
  return [
    { id: 1, name: 'Appetizers', revenue: 1200, orders: 45 },
    { id: 2, name: 'Main Courses', revenue: 3500, orders: 120 },
    { id: 3, name: 'Desserts', revenue: 800, orders: 60 },
    { id: 4, name: 'Beverages', revenue: 600, orders: 80 }
  ];
}

function generateMockBranchesData() {
  return [
    {
      id: 1,
      name: 'Downtown Branch',
      revenue: 8000,
      history: generateMockRevenueData()
    },
    {
      id: 2,
      name: 'Mall Branch',
      revenue: 6500,
      history: generateMockRevenueData()
    }
  ];
}

function generateMockCustomersData() {
  return [
    { id: 1, name: 'Customer 1', totalSpent: 500, orderCount: 10 },
    { id: 2, name: 'Customer 2', totalSpent: 1200, orderCount: 25 },
    { id: 3, name: 'Customer 3', totalSpent: 300, orderCount: 5 }
  ];
}
