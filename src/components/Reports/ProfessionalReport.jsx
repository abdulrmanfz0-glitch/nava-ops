/**
 * Professional Report Component
 * AI-powered report for executive insights and strategic recommendations
 * Features: Revenue growth, cost optimization, and branch performance analysis

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, Award, Zap, Target, TrendingDown, Users, Truck, Building } from 'lucide-react';
import {
  analyzeRevenueGrowth,
  analyzeCostOptimization,
  analyzeCommissionImpact,
  generateProfitabilityRecommendations,
  generateExecutiveSummary
} from '@/lib/aiIntelligence/professionalInsights';

/**
 * Professional Report Component
 * AI-powered insights on revenue growth, cost optimization, and commission impact
 */
const ProfessionalReport = ({ reportData, isLoading }) => {
  const [revenueInsights, setRevenueInsights] = useState([]);
  const [costInsights, setCostInsights] = useState([]);
  const [commissionInsights, setCommissionInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (reportData && !isLoading) {
      generateAnalytics();
    }
  }, [reportData, isLoading]);

  const generateAnalytics = async () => {
    try {
      const revenue = analyzeRevenueGrowth(reportData);
      const costs = analyzeCostOptimization(reportData);
      const commission = analyzeCommissionImpact(reportData);
      const recs = generateProfitabilityRecommendations(reportData);
      const summary = generateExecutiveSummary(reportData);

      setRevenueInsights(revenue);
      setCostInsights(costs);
      setCommissionInsights(commission);
      setRecommendations(recs);
      setExecutiveSummary(summary);
    } catch (error) {
      console.error('Error generating professional report analytics:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Generating AI-powered insights...</div>

/**
 * NAVA OPS - Professional Report Component
 * Premium, branded report generation and viewing
 
 */

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle,
  Zap, Users, BarChart3, CheckCircle, Clock, Briefcase, Award,
  ChevronDown, ChevronUp, Eye, FileDown
} from 'lucide-react';
import { RevenueTrendChart } from '@/components/UI/Charts';

export default function ProfessionalReport({ reportData }) {
  const {
    metrics,
    sections,
    insights,
    recommendations = [],
    executiveSummary,
    revenueRecommendations = [],
    costRecommendations = [],
    branchRecommendations = [],
    totalImpact = {}
  } = reportData;

  const [expandedRecs, setExpandedRecs] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleRec = (id) => {
    setExpandedRecs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter recommendations by category
  const allRecommendations = [
    ...revenueRecommendations,
    ...costRecommendations,
    ...branchRecommendations
  ];

  const filteredRecommendations = selectedCategory === 'all'
    ? allRecommendations
    : allRecommendations.filter(rec => rec.category === selectedCategory);

  const revenueMetric = metrics?.find(m => m.label === 'Total Revenue')?.value || 'N/A';
  const revenueNum = typeof revenueMetric === 'string'
    ? parseFloat(revenueMetric.replace(/[^0-9.-]+/g, ''))
    : revenueMetric;

  return (
    <div className="space-y-8">
      {/* ===== HEADER & SUMMARY ===== */}
      <div className="space-y-6">
        {/* Executive Summary */}
        {executiveSummary && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50
                        dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30
                        rounded-xl p-8 border border-indigo-200 dark:border-indigo-700/50 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600 rounded-lg flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Professional Report
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {executiveSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics?.slice(0, 4).map((metric, idx) => (
            <MetricBox key={idx} metric={metric} />
          ))}
        </div>

        {/* Impact Summary */}
        {Object.keys(totalImpact).length > 0 && (
          <ImpactSummaryBox impact={totalImpact} />
        )}
      </div>

      {/* ===== AI INSIGHTS ===== */}
      {insights && insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI-Powered Insights
            </h3>
            <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {insights.length} insights
            </span>
          </div>
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* ===== REVENUE TRENDS ===== */}
      {sections?.find(s => s.chart) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Revenue Trend Analysis
          </h3>
          <RevenueTrendChart
            data={sections.find(s => s.chart)?.chart?.data || []}
            loading={false}
          />
        </div>
      )}

      {/* ===== RECOMMENDATIONS SECTION ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Strategic Recommendations
            </h3>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredRecommendations.length} recommendations
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <CategoryButton
            label="All"
            value="all"
            selected={selectedCategory === 'all'}
            count={allRecommendations.length}
            onClick={() => setSelectedCategory('all')}
          />
          <CategoryButton
            label="Revenue Growth"
            value="Revenue Growth"
            selected={selectedCategory === 'Revenue Growth'}
            count={revenueRecommendations.length}
            onClick={() => setSelectedCategory('Revenue Growth')}
            color="green"
          />
          <CategoryButton
            label="Cost Optimization"
            value="Cost Optimization"
            selected={selectedCategory === 'Cost Optimization'}
            count={costRecommendations.length}
            onClick={() => setSelectedCategory('Cost Optimization')}
            color="blue"
          />
          <CategoryButton
            label="Branch Performance"
            value="Branch Performance"
            selected={selectedCategory === 'Branch Performance'}
            count={branchRecommendations.length}
            onClick={() => setSelectedCategory('Branch Performance')}
            color="purple"
          />
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map(rec => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isExpanded={expandedRecs[rec.id]}
                onToggle={() => toggleRec(rec.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recommendations in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== EXPORT SECTION ===== */}
      <div className="flex gap-3 justify-end">
        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
                         rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                         flex items-center gap-2 font-medium">
          <Eye className="w-4 h-4" />
          Preview PDF
        </button>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                         transition-colors flex items-center gap-2 font-medium">
          <FileDown className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
}

// ===== SUBCOMPONENTS =====

function MetricBox({ metric }) {
  const getIcon = (label) => {
    const icons = {
      'Total Revenue': DollarSign,
      'Total Orders': BarChart3,
      'Avg Order Value': TrendingUp,
      'Completed Orders': CheckCircle
    };
    return icons[label] || Target;
  };

  const Icon = getIcon(metric.label);
  const trendIsUp = metric.trend?.direction === 'up';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50
                      dark:from-indigo-900/30 dark:to-indigo-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        {metric.trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trendIsUp ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendIsUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {metric.trend.value}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
    </div>
  );
}

function ImpactSummaryBox({ impact }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50
                  dark:from-green-900/20 dark:to-emerald-900/20
                  rounded-xl p-8 border border-green-200 dark:border-green-800/50 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Potential Annual Savings
            </p>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            SAR {parseInt(impact.totalSavings || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Potential Revenue Growth
            </p>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            SAR {parseInt(impact.totalRevenueBenefit || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bottom-Line Impact
            </p>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            SAR {parseInt(impact.totalIncreaseToBottom || 0).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-700 dark:text-gray-300">
        <strong>{impact.recommendationCount || 0} strategic recommendations</strong> identified to drive business growth and operational efficiency
      </p>
    </div>
  );
}

function InsightCard({ insight }) {
  const severityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    medium: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    info: 'border-green-500 bg-green-50 dark:bg-green-900/10'
  };

  const severityIcons = {
    high: AlertTriangle,
    warning: AlertTriangle,
    medium: Zap,
    info: CheckCircle
  };

  const Icon = severityIcons[insight.severity] || Zap;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[insight.severity] || severityColors.info}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {insight.description}
          </p>
          {insight.metric && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <strong>Metric:</strong> {insight.metric}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryButton({ label, value, selected, count, color, onClick }) {
  const baseColors = {
    green: 'indigo',
    blue: 'blue',
    purple: 'purple'
  };

  const bgColor = baseColors[color] || 'indigo';
  const bgClass = selected
    ? `bg-${bgColor}-600 text-white`
    : `bg-${bgColor}-100 dark:bg-${bgColor}-900/20 text-${bgColor}-700 dark:text-${bgColor}-400`;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2
                  ${selected ? 'ring-2 ring-offset-2 ring-' + bgColor + '-500' : ''} ${bgClass}`}
    >
      {label}
      <span className="ml-1 text-xs opacity-75">({count})</span>
    </button>
  );
}

function RecommendationCard({ recommendation, isExpanded, onToggle }) {
  const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    low: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700'
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  const categoryColors = {
    'Revenue Growth': 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10',
    'Cost Optimization': 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10',
    'Branch Performance': 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
  };

  const categoryIcons = {
    'Revenue Growth': TrendingUp,
    'Cost Optimization': DollarSign,
    'Branch Performance': Users
  };

  const CategoryIcon = categoryIcons[recommendation.category] || Target;

  return (
    <div className={`border-l-4 rounded-lg overflow-hidden transition-all
                   ${categoryColors[recommendation.category] || 'border-gray-200 bg-gray-50 dark:bg-gray-900/10'}`}>
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CategoryIcon className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  {recommendation.title}
                </h4>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border
                              ${priorityColors[recommendation.priority]}`}>
                  {priorityLabels[recommendation.priority]}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {recommendation.description}
              </p>
            </div>
            <button className="ml-4 flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Impact Preview */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {recommendation.impact.potentialIncrease && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Potential Increase</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {typeof recommendation.impact.potentialIncrease === 'string'
                    ? recommendation.impact.potentialIncrease
                    : `+${recommendation.impact.potentialIncrease}%`}
                </p>
              </div>
            )}
            {recommendation.impact.expectedRevenue && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expected Revenue</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  SAR {parseInt(recommendation.impact.expectedRevenue).toLocaleString()}
                </p>
              </div>
            )}
            {recommendation.impact.potentialSavings && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Potential Savings</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  SAR {parseInt(recommendation.impact.potentialSavings).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-current opacity-20 px-6 py-6 bg-white/30 dark:bg-white/10">
          {/* Action Items */}
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Recommended Actions
            </h5>
            <ul className="space-y-2">
              {recommendation.actions.map((action, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-current opacity-20">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Timeline
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {recommendation.timeline}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Difficulty</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {recommendation.difficulty}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {recommendation.confidence}
              </p>
            </div>
          </div>

          {/* Related Metrics */}
          {recommendation.relatedMetrics && recommendation.relatedMetrics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-current opacity-20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Related Metrics to Monitor</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.relatedMetrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium
                             bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                             border border-gray-300 dark:border-gray-600"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

  Download, Printer, Share2, FileText, Crown, CheckCircle,
  AlertCircle, TrendingUp, BarChart3, Calendar, Eye, Sparkles
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { generateProfessionalPDF } from '@/lib/pdfGenerator';
import { exportReport } from '@/lib/exportEngine';

const NAVA_BRANDING = {
  colors: {
    primary: '#0088FF',
    secondary: '#6B7280',
    accent: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  fonts: {
    primary: 'Helvetica',
    mono: 'Courier'
  },
  logo: 'NAVA OPS',
  tagline: 'Smart Decisions, Smarter Results'
};

export default function ProfessionalReport({ report, onClose }) {
  const { addNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    executiveSummary: true,
    metrics: true,
    insights: true,
    anomalies: true,
    recommendations: true,
    visualizations: true
  });

  if (!report) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No report to display</p>
 
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available for report</div>
      </div>
    );
  }

  const { orderStats = {}, trends = [] } = reportData;
  const { totalRevenue = 0, totalOrders = 0, averageOrderValue = 0 } = orderStats;

  // Chart data preparation
  const revenueChartData = trends.slice(-30).map(t => ({
    date: t.date?.split('-')[2] || '',
    revenue: Math.round(t.revenue / 1000)
  }));

  const costDistributionData = [
    { name: 'COGS', value: totalRevenue * 0.28, fill: '#f87171' },
    { name: 'Labor', value: totalRevenue * 0.25, fill: '#fbbf24' },
    { name: 'Overhead', value: totalRevenue * 0.15, fill: '#a78bfa' },
    { name: 'Profit', value: totalRevenue * 0.32, fill: '#34d399' }
  ];

  const commissionImpactData = [
    { name: 'Dine-in', orders: Math.round(totalOrders * 0.4), revenue: Math.round(totalRevenue * 0.4), commission: 0 },
    { name: 'Takeout', orders: Math.round(totalOrders * 0.25), revenue: Math.round(totalRevenue * 0.25), commission: 0 },
    { name: 'Online', orders: Math.round(totalOrders * 0.35), revenue: Math.round(totalRevenue * 0.35), commission: Math.round(totalRevenue * 0.35 * 0.25) }
  ];

  const getInsightIcon = (type) => {
    const icons = {
      growth_analysis: <TrendingUp className="w-5 h-5" />,
      revenue_volatility: <AlertTriangle className="w-5 h-5" />,
      growth_opportunity: <Zap className="w-5 h-5" />,
      cost_per_order: <DollarSign className="w-5 h-5" />,
      labor_efficiency: <Users className="w-5 h-5" />,
      overhead_analysis: <Building className="w-5 h-5" />,
      savings_opportunity: <TrendingDown className="w-5 h-5" />,
      delivery_commission: <Truck className="w-5 h-5" />,
      net_revenue_impact: <Award className="w-5 h-5" />,
      channel_profitability: <Target className="w-5 h-5" />,
      commission_efficiency: <Award className="w-5 h-5" />
    };
    return icons[type] || <AlertTriangle className="w-5 h-5" />;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200',
      medium: 'bg-yellow-50 border-yellow-200',
      warning: 'bg-orange-50 border-orange-200',
      high: 'bg-red-50 border-red-200'
    };
    return colors[severity] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Report</h1>
        <p className="text-gray-600 mb-4">AI-Powered Insights: Revenue Growth • Cost Optimization • Commission Impact</p>

        {/* Executive Summary Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-emerald-900 mb-2">Executive Summary</h2>
          <p className="text-emerald-800">{executiveSummary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">SAR {Math.round(totalRevenue).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-600 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-emerald-900">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-purple-900">SAR {averageOrderValue.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">Est. Net Margin</p>
            <p className="text-2xl font-bold text-orange-900">{((totalRevenue * 0.32) / totalRevenue * 100).toFixed(0)}%</p>

  const handleExport = async (format) => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      setExportFormat(format);

      addNotification({
        title: 'Generating',
        message: `Generating professional ${format.toUpperCase()} report with branding...`,
        type: 'info'
      });

      let result;
      if (format === 'pdf') {
        // Generate professional PDF with branding
        result = await generateProfessionalPDF(report, {
          branding: NAVA_BRANDING,
          sections: selectedSections,
          quality: 'premium'
        });

        if (result.success) {
          result.pdf.save(result.filename);
        }
      } else {
        // Use standard export engine for other formats
        const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
        await exportReport(report, format, filename);
      }

      addNotification({
        title: 'Success',
        message: `Professional report exported as ${format.toUpperCase()}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        title: 'Error',
        message: `Failed to export report: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const handlePrint = () => {
    window.print();
    addNotification({
      title: 'Print',
      message: 'Print dialog opened',
      type: 'info'
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: report.title,
          text: `Check out this professional report: ${report.title}`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        addNotification({
          title: 'Copied',
          message: 'Report link copied to clipboard',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const toggleSection = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getConfidenceColor = (confidence) => {
    const level = parseInt(confidence);
    if (level >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (level >= 75) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (level >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  const getAnomalyIcon = (severity) => {
    return severity === 'critical' || severity === 'high' ? (
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Header with Branding */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-300" />
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                Premium Report
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{report.title}</h2>
            <p className="text-blue-100 mb-4">{NAVA_BRANDING.tagline}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-blue-200">Period:</span> {report.subtitle}
              </div>
              <div>
                <span className="text-blue-200">Generated:</span> {new Date(report.generatedAt).toLocaleString()}
              </div>
              <div>
                <span className="text-blue-200">Report ID:</span> {report.id}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-400
                       rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              {isExporting && exportFormat === 'pdf' ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg
                       transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-sm">
              <span className="font-semibold">Data Quality:</span> {report.metadata.confidence} confidence •
              {report.metadata.completeness} completeness • {report.metadata.dataPoints} data points
            </span>
 
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['overview', 'revenue', 'costs', 'commission', 'recommendations'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Trend Chart */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Revenue (SAR 000s)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `SAR ${value}K`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={costDistributionData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${((entry.value / totalRevenue) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {costDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `SAR ${Math.round(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Revenue & Commission</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={commissionImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (SAR)" />
                  <Bar dataKey="commission" fill="#ef4444" name="Commission (SAR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

      {/* Report Configuration Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Report Sections
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(selectedSections).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleSection(key)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      {selectedSections.executiveSummary && report.executiveSummary && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Executive Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      {selectedSections.metrics && report.metrics && Object.keys(report.metrics).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Key Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.metrics).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
 
          </div>
        </div>
      )}

      {/* Revenue Growth Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          {revenueInsights.length > 0 ? (
            revenueInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-blue-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No revenue insights available</div>
          )}
        </div>
      )}

      {/* Cost Optimization Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-4">
          {costInsights.length > 0 ? (
            costInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-amber-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-amber-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No cost insights available</div>
          )}
        </div>
      )}

      {/* Commission Impact Tab */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          {commissionInsights.length > 0 ? (
            commissionInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-rose-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-rose-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No commission insights available</div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <div key={idx} className={`border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} p-4 rounded-r-lg border border-gray-200`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${rec.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.action}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">{rec.timeframe}</p>
                    <p className="text-xs text-gray-500">{rec.effort}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                  <strong>Impact:</strong> {rec.impact}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No recommendations available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalReport;

      {/* AI Insights */}
      {selectedSections.insights && report.insights && report.insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Generated Insights
          </h3>
          <div className="space-y-3">
            {report.insights.map((insight, index) => (
              <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anomalies Detection */}
      {selectedSections.anomalies && report.anomalies && report.anomalies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Detected Anomalies
          </h3>
          <div className="space-y-3">
            {report.anomalies.map((anomaly, index) => (
              <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex gap-3">
                {getAnomalyIcon(anomaly.severity)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {anomaly.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {anomaly.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {selectedSections.recommendations && report.recommendations && report.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Actionable Recommendations
          </h3>
          <div className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {index + 1}. {rec.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {rec.description}
                </p>
                {rec.action && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Action: {rec.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Export Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg hover:border-red-500
                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-red-600 dark:text-red-400 font-semibold">PDF</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Professional</div>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-500
                     hover:bg-green-50 dark:hover:bg-green-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-green-600 dark:text-green-400 font-semibold">Excel</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Data</div>
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-500
                     hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-blue-600 dark:text-blue-400 font-semibold">CSV</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Spreadsheet</div>
          </button>

          <button
            onClick={handleShare}
            className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-500
                     hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            <div className="text-purple-600 dark:text-purple-400 font-semibold">Share</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Link</div>
          </button>
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-1">
          <span className="font-semibold text-gray-900 dark:text-white">{NAVA_BRANDING.logo}</span> - {NAVA_BRANDING.tagline}
        </p>
        <p>
          This professional report includes premium analytics, AI insights, and actionable recommendations.
          Generated on {new Date().toLocaleString()}.
        </p>
      </div>
    </div>
  );
}
 
 
