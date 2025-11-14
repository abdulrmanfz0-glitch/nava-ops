// NAVA OPS - AI-Driven Executive Summary Component
// Comprehensive executive insights with key metrics and recommendations

import React, { useState } from 'react';
import StatCard from '@/components/UI/StatCard';
import { AlertCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';

export default function ExecutiveSummary({ data }) {
  const { executiveInsights, keyMetrics, recommendations } = data;
  const [expandedInsight, setExpandedInsight] = useState(0);

  if (!keyMetrics || keyMetrics.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No summary data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Executive Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-driven insights and strategic recommendations for financial optimization
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.label}
            value={typeof metric.value === 'number' ? `${metric.value.toFixed(2)}${metric.unit}` : metric.value}
            subtitle={metric.unit || ''}
            icon={TrendingUp}
            color={metric.trend?.includes('+') ? 'green' : 'red'}
            trend={metric.trend?.includes('+') ? 'up' : 'down'}
            trendValue={metric.trend}
          />
        ))}
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-md p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          AI-Driven Insights
        </h3>
        <div className="space-y-3">
          {executiveInsights.map((insight, index) => {
            const severityColors = {
              success: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20',
              info: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
              warning: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
              error: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20'
            };

            const textColors = {
              success: 'text-green-900 dark:text-green-200',
              info: 'text-blue-900 dark:text-blue-200',
              warning: 'text-yellow-900 dark:text-yellow-200',
              error: 'text-red-900 dark:text-red-200'
            };

            const badgeColors = {
              success: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
              info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
              warning: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
              error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
            };

            return (
              <div
                key={index}
                onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${severityColors[insight.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${textColors[insight.severity]}`}>
                        {insight.title}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${badgeColors[insight.severity]}`}>
                        {insight.metric}
                      </span>
                    </div>
                    {(expandedInsight === index || true) && (
                      <p className={`text-sm ${textColors[insight.severity]} opacity-90`}>
                        {insight.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Strategic Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-purple-600 dark:text-purple-400">
                {rec.category}
              </h4>
              <ul className="space-y-2">
                {rec.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">→</span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Financial Health Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">A+</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Overall Score</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">A</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Revenue Health</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">B+</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Cost Control</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">A+</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Profitability</p>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Performance Indicators (KPIs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Financial KPIs</h4>
            <div className="space-y-3">
              <KPIRow label="Revenue Growth Rate" value="+15.3%" status="excellent" />
              <KPIRow label="Profit Margin" value="35%" status="excellent" />
              <KPIRow label="Operating Efficiency" value="65%" status="good" />
              <KPIRow label="Cost Control" value="3.2% Below Target" status="excellent" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Operational KPIs</h4>
            <div className="space-y-3">
              <KPIRow label="Labor Cost Ratio" value="22.5% of Revenue" status="good" />
              <KPIRow label="Inventory Turnover" value="8.2x" status="excellent" />
              <KPIRow label="Commission Utilization" value="92.3%" status="excellent" />
              <KPIRow label="Cash Flow Position" value="Positive" status="excellent" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            Review Q4 Budget Forecast
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            Schedule Strategy Review
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            Export Full Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// KPI Row Component
function KPIRow({ label, value, status }) {
  const statusColors = {
    excellent: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    good: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
  };

  const statusDots = {
    excellent: '🟢',
    good: '🔵',
    warning: '🟡'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
        <span className="text-lg">{statusDots[status]}</span>
      </div>
    </div>
  );
}
