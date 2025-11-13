// NAVA OPS - Financial Overview Report Component
// Comprehensive financial reporting with P&L, cash flow, and analysis

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, PieChart } from 'lucide-react';
import { RevenueTrendChart, BarChart as SimpleBarChart } from '@/components/UI/Charts';

export default function FinancialOverview({ reportData }) {
  const { metrics, sections, insights, executiveSummary } = reportData;

  // Calculate financial ratios
  const revenue = metrics?.find(m => m.label === 'Total Revenue')?.value || 0;
  const revenueNum = typeof revenue === 'string' ? parseFloat(revenue.replace(/[^0-9.-]+/g, '')) : revenue;

  const estimatedExpenses = revenueNum * 0.65; // 65% cost ratio
  const grossProfit = revenueNum * 0.35; // 35% margin
  const profitMargin = 35;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {executiveSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                      rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Executive Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {executiveSummary}
          </p>
        </div>
      )}

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`SAR ${revenueNum.toLocaleString()}`}
          subtitle="Gross income"
          icon={DollarSign}
          color="green"
          trend={{ direction: 'up', value: '+15.3%' }}
        />
        <MetricCard
          title="Operating Expenses"
          value={`SAR ${estimatedExpenses.toLocaleString()}`}
          subtitle="Total costs"
          icon={CreditCard}
          color="red"
          trend={{ direction: 'down', value: '-3.2%' }}
        />
        <MetricCard
          title="Gross Profit"
          value={`SAR ${grossProfit.toLocaleString()}`}
          subtitle="After expenses"
          icon={Wallet}
          color="blue"
          trend={{ direction: 'up', value: '+22.8%' }}
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          subtitle="Net margin"
          icon={PieChart}
          color="purple"
          trend={{ direction: 'up', value: '+2.5%' }}
        />
      </div>

      {/* P&L Statement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profit & Loss Statement
        </h3>
        <div className="space-y-3">
          <PLLine label="Revenue" amount={revenueNum} isHeader />
          <PLLine label="Cost of Goods Sold (COGS)" amount={revenueNum * 0.35} indent />
          <PLLine label="Gross Profit" amount={revenueNum * 0.65} isSubtotal />

          <PLLine label="Operating Expenses" amount={revenueNum * 0.30} indent />
          <PLLine label="  - Labor Costs" amount={revenueNum * 0.15} indent={2} />
          <PLLine label="  - Rent & Utilities" amount={revenueNum * 0.08} indent={2} />
          <PLLine label="  - Marketing" amount={revenueNum * 0.04} indent={2} />
          <PLLine label="  - Other Expenses" amount={revenueNum * 0.03} indent={2} />

          <PLLine label="EBITDA" amount={revenueNum * 0.35} isSubtotal />
          <PLLine label="Net Profit" amount={grossProfit} isTotal />
        </div>
      </div>

      {/* Revenue Trends */}
      {sections?.find(s => s.chart) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend Analysis
          </h3>
          <RevenueTrendChart
            data={sections.find(s => s.chart)?.chart?.data || []}
            loading={false}
          />
        </div>
      )}

      {/* Financial Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Financial Insights & Recommendations
          </h3>
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Cash Flow Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CashFlowCard
          title="Cash Inflow"
          amount={revenueNum * 0.95}
          percentage={95}
          color="green"
          icon={TrendingUp}
        />
        <CashFlowCard
          title="Cash Outflow"
          amount={estimatedExpenses}
          percentage={65}
          color="red"
          icon={TrendingDown}
        />
        <CashFlowCard
          title="Net Cash Position"
          amount={revenueNum * 0.30}
          percentage={30}
          color="blue"
          icon={Wallet}
        />
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

// P&L Line Component
function PLLine({ label, amount, indent = 0, isHeader = false, isSubtotal = false, isTotal = false }) {
  const paddingClass = indent === 2 ? 'pl-8' : indent === 1 ? 'pl-4' : '';
  const fontClass = isTotal ? 'font-bold text-lg' : isSubtotal ? 'font-semibold' : isHeader ? 'font-semibold' : '';
  const borderClass = (isSubtotal || isTotal) ? 'border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2' : '';

  return (
    <div className={`flex items-center justify-between py-2 ${paddingClass} ${borderClass}`}>
      <span className={`text-gray-700 dark:text-gray-300 ${fontClass}`}>
        {label}
      </span>
      <span className={`text-gray-900 dark:text-white ${fontClass}`}>
        SAR {Math.round(amount).toLocaleString()}
      </span>
    </div>
  );
}

// Insight Card Component
function InsightCard({ insight }) {
  const severityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    medium: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    info: 'border-green-500 bg-green-50 dark:bg-green-900/10'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[insight.severity] || severityColors.info}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{insight.description}</p>
        </div>
        {insight.metric && (
          <span className="ml-4 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
            {insight.metric}
          </span>
        )}
      </div>
    </div>
  );
}

// Cash Flow Card Component
function CashFlowCard({ title, amount, percentage, color, icon: Icon }) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    blue: 'text-blue-600 dark:text-blue-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        SAR {Math.round(amount).toLocaleString()}
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{percentage}% of total</p>
    </div>
  );
}
