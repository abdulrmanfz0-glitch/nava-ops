// NAVA OPS - Commission Analysis Component
// Staff commissions, branch distributions, and commission analytics

import React, { useState } from 'react';
import StatCard from '@/components/UI/StatCard';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';

export default function CommissionAnalysis({ data }) {
  const { total, byStaff, byBranch, pending } = data;
  const [activeTab, setActiveTab] = useState('staff');

  if (!total) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No commission data available</p>
      </div>
    );
  }

  const paidCommissions = total - pending;

  return (
    <div className="space-y-6">
      {/* Commission Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Commission Analysis
        </h2>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Commissions"
          value={`SAR ${Math.round(total).toLocaleString()}`}
          subtitle="Period total"
          icon={DollarSign}
          color="indigo"
          trend="up"
          trendValue="+8.5%"
        />
        <StatCard
          title="Paid Commissions"
          value={`SAR ${Math.round(paidCommissions).toLocaleString()}`}
          subtitle="Already distributed"
          icon={TrendingUp}
          color="green"
          trend="up"
          trendValue="+12.3%"
        />
        <StatCard
          title="Pending Commissions"
          value={`SAR ${Math.round(pending).toLocaleString()}`}
          subtitle="Due for payment"
          icon={DollarSign}
          color="orange"
          trend="down"
          trendValue="-2.1%"
        />
        <StatCard
          title="Avg Commission"
          value={`SAR ${Math.round(total / (byStaff.length + byBranch.length)).toLocaleString()}`}
          subtitle="Per entity"
          icon={Users}
          color="blue"
          trend="up"
          trendValue="+5.7%"
        />
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'staff'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Staff Commissions
        </button>
        <button
          onClick={() => setActiveTab('branch')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'branch'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Building2 className="w-4 h-4 inline mr-2" />
          Branch Distribution
        </button>
      </div>

      {/* Staff Commissions */}
      {activeTab === 'staff' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Staff Commission Breakdown
          </h3>
          <div className="space-y-3">
            {byStaff.map((staff, index) => {
              const percentage = (staff.amount / total) * 100;
              const statusColor = staff.status === 'Paid' ? 'green' : 'amber';
              const statusBg = staff.status === 'Paid'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';

              return (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{staff.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commission Rate: {staff.rate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        SAR {Math.round(staff.amount).toLocaleString()}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                        {staff.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-10 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staff Commission Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Staff Count</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{byStaff.length}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Out</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                SAR {Math.round(byStaff.filter(s => s.status === 'Paid').reduce((acc, s) => acc + s.amount, 0)).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                SAR {Math.round(byStaff.filter(s => s.status === 'Pending').reduce((acc, s) => acc + s.amount, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Branch Commission Distribution */}
      {activeTab === 'branch' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Commission Distribution by Branch
          </h3>
          <div className="space-y-3">
            {byBranch.map((branch, index) => {
              const percentage = (branch.amount / total) * 100;

              return (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        {branch.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Growth: {branch.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        SAR {Math.round(branch.amount).toLocaleString()}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        {branch.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Branch Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Branches</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{byBranch.length}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Highest Commission</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                SAR {Math.round(Math.max(...byBranch.map(b => b.amount))).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Commission/Branch</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                SAR {Math.round(total / byBranch.length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Commission Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Performers</h4>
          <div className="space-y-2 text-sm">
            {byStaff
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 3)
              .map((staff, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {index + 1}. {staff.name}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {staff.rate}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Branches</h4>
          <div className="space-y-2 text-sm">
            {byBranch
              .sort((a, b) => b.amount - a.amount)
              .map((branch, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {index + 1}. {branch.name}
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {branch.growth}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
