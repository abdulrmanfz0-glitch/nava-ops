// NAVA OPS - Expenses Analysis Component
// Detailed expense breakdown, category analysis, and budget variance

import React, { useState } from 'react';
import { RevenueTrendChart, SimpleBarChart } from '@/components/UI/Charts';
import StatCard from '@/components/UI/StatCard';
import { CreditCard, AlertCircle, TrendingDown } from 'lucide-react';

export default function ExpensesAnalysis({ data }) {
  const { total, breakdown, trends, variance } = data;
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!total) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No expense data available</p>
      </div>
    );
  }

  const categoryTotals = {};
  breakdown.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.value;
  });

  return (
    <div className="space-y-6">
      {/* Expenses Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-red-600" />
          Expenses Analysis
        </h2>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Expenses"
          value={`SAR ${Math.round(total).toLocaleString()}`}
          subtitle="Operating costs"
          icon={CreditCard}
          color="red"
          trend="down"
          trendValue={`${variance}%`}
        />
        <StatCard
          title="Average Daily Expense"
          value={`SAR ${Math.round(total / 30).toLocaleString()}`}
          subtitle="Per day estimate"
          icon={TrendingDown}
          color="orange"
          trend="down"
          trendValue="-2.3%"
        />
        <StatCard
          title="Expense Ratio"
          value={`${((total / (total / 0.35)) * 100).toFixed(1)}%`}
          subtitle="Of revenue"
          icon={CreditCard}
          color="purple"
          trend="down"
          trendValue="-1.5%"
        />
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Breakdown Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detailed Expense Breakdown
          </h3>
          <div className="space-y-3">
            {breakdown.map((expense, index) => {
              const percentage = (expense.value / total) * 100;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedCategory(expense.category)}
                  className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{expense.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        SAR {Math.round(expense.value).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense by Category Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <SimpleBarChart
            data={Object.entries(categoryTotals).map(([category, value]) => ({
              name: category,
              value: value
            }))}
            loading={false}
          />
        </div>
      </div>

      {/* Expense Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expense Trends vs Budget
        </h3>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Your expenses are <strong>{variance}%</strong> below target. Continue optimizing operations.
          </p>
        </div>
        <RevenueTrendChart
          data={trends.map(t => ({
            date: t.date,
            value: t.value,
            target: t.target
          }))}
          loading={false}
        />
      </div>

      {/* Budget Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Major Expense Categories */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-red-600" />
            Major Expense Categories
          </h4>
          <div className="space-y-2 text-sm">
            {breakdown
              .sort((a, b) => b.value - a.value)
              .slice(0, 4)
              .map((exp, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{exp.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {((exp.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Variance Analysis */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-green-600" />
            Budget Variance
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Overall Variance</span>
              <span className={`font-semibold ${variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {variance}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Status</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                Under Budget
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Savings</span>
              <span className="font-semibold text-green-600">SAR {Math.round((total * Math.abs(variance)) / 100).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Optimization Opportunities
        </h3>
        <div className="space-y-3">
          <div className="p-4 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Labor Cost Optimization</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Potential savings of 3-5% through scheduling optimization and productivity improvements.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Supplier Negotiations</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Renegotiate contracts for bulk ingredients to reduce COGS by 2-4%.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Waste Reduction</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Implement inventory management system to reduce food waste by 5-8%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
