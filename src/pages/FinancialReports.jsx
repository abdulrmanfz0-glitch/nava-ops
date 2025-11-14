// src/pages/FinancialReports.jsx
import React from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

const FinancialReports = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Reports</h1>
          <p className="text-gray-400">View and analyze your financial performance</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 245,750</p>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Net Profit</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 98,300</p>
          <div className="flex items-center gap-1 text-blue-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>40% margin</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Expenses</span>
            <DollarSign className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">SAR 147,450</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span>60% of revenue</span>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Financial Overview</h3>
        <p className="text-gray-400">Detailed financial data will be displayed here.</p>
      </div>
    </div>
  );
};

export default FinancialReports;
