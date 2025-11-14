/**
 * Professional Report Component
 * AI-powered report for executive insights and strategic recommendations
 * Features: Revenue growth, cost optimization, and branch performance analysis
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
