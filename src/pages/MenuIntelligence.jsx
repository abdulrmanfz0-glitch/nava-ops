// NAVA OPS - Menu Intelligence
// Strategic menu performance analysis & optimization recommendations

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import PageHeader from '@/components/UI/PageHeader';
import { UtensilsCrossed, TrendingUp, TrendingDown, Star, AlertTriangle, CheckCircle } from 'lucide-react';

// Menu Engineering Matrix Component
function MenuEngineering() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedBranch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const branchesData = await api.branches.getAll();
      setBranches(branchesData);

      // Generate sample menu items with performance metrics
      const sampleMenuItems = [
        {
          id: 1,
          name: 'Classic Burger',
          category: 'Burgers',
          orders: 1250,
          revenue: 31250,
          cost: 18750,
          margin: 0.40,
          popularity: 0.28,
          profitability: 0.40,
          trend: '+15%',
          classification: 'Star',
          image: '🍔'
        },
        {
          id: 2,
          name: 'Margherita Pizza',
          category: 'Pizza',
          orders: 980,
          revenue: 29400,
          cost: 14700,
          margin: 0.50,
          popularity: 0.22,
          profitability: 0.50,
          trend: '+8%',
          classification: 'Star',
          image: '🍕'
        },
        {
          id: 3,
          name: 'Caesar Salad',
          category: 'Salads',
          orders: 1120,
          revenue: 22400,
          cost: 11200,
          margin: 0.50,
          popularity: 0.25,
          profitability: 0.50,
          trend: '+12%',
          classification: 'Star',
          image: '🥗'
        },
        {
          id: 4,
          name: 'Chicken Wings',
          category: 'Appetizers',
          orders: 875,
          revenue: 21875,
          cost: 15312,
          margin: 0.30,
          popularity: 0.20,
          profitability: 0.30,
          trend: '-3%',
          classification: 'Plow Horse',
          image: '🍗'
        },
        {
          id: 5,
          name: 'Specialty Steak',
          category: 'Mains',
          orders: 245,
          revenue: 18375,
          cost: 9187,
          margin: 0.50,
          popularity: 0.05,
          profitability: 0.50,
          trend: '-8%',
          classification: 'Puzzle',
          image: '🥩'
        }
      ];

      setMenuItems(sampleMenuItems);
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Classify items into BCG matrix categories
  const getClassification = (item) => {
    const avgPopularity = 0.20;
    const avgProfitability = 0.40;

    if (item.popularity > avgPopularity && item.profitability > avgProfitability) {
      return { type: 'Star', color: 'green', icon: Star, recommendation: 'Maintain quality and promote heavily' };
    } else if (item.popularity > avgPopularity && item.profitability <= avgProfitability) {
      return { type: 'Plow Horse', color: 'blue', icon: TrendingUp, recommendation: 'Increase prices or reduce costs' };
    } else if (item.popularity <= avgPopularity && item.profitability > avgProfitability) {
      return { type: 'Puzzle', color: 'yellow', icon: AlertTriangle, recommendation: 'Increase marketing and visibility' };
    } else {
      return { type: 'Dog', color: 'red', icon: TrendingDown, recommendation: 'Consider removing or replacing' };
    }
  };

  if (!selectedBranch && branches.length > 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select a Branch
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please select a branch to view menu performance analysis
        </p>
        <select
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a branch...</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} {branch.code ? `(${branch.code})` : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Branch Selector */}
      {branches.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Branch
          </label>
          <select
            value={selectedBranch || ''}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} {branch.code ? `(${branch.code})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Stars</span>
            <Star className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {menuItems.filter(item => getClassification(item).type === 'Star').length}
          </div>
          <div className="text-sm opacity-90">High profit & popularity</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Plow Horses</span>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {menuItems.filter(item => getClassification(item).type === 'Plow Horse').length}
          </div>
          <div className="text-sm opacity-90">Popular but low margin</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Puzzles</span>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {menuItems.filter(item => getClassification(item).type === 'Puzzle').length}
          </div>
          <div className="text-sm opacity-90">High profit, low popularity</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Dogs</span>
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {menuItems.filter(item => getClassification(item).type === 'Dog').length}
          </div>
          <div className="text-sm opacity-90">Consider removing</div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu Performance Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No menu items found
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => {
                  const classification = getClassification(item);
                  const ClassIcon = classification.icon;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {item.orders.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        SAR {item.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {(item.margin * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`font-medium ${item.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {item.trend}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                          ${classification.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}
                          ${classification.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                          ${classification.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : ''}
                          ${classification.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : ''}
                        `}>
                          <ClassIcon className="w-4 h-4" />
                          {classification.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {classification.recommendation}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Engineering Matrix Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Menu Engineering Matrix Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10 rounded">
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Stars
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              High profitability and high popularity. These are your best performers - promote them heavily and maintain consistent quality.
            </p>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Plow Horses
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              High popularity but low profitability. Consider increasing prices slightly or reducing portion costs to improve margins.
            </p>
          </div>
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 rounded">
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Puzzles
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              High profitability but low popularity. Increase marketing efforts, improve placement on menu, or bundle with popular items.
            </p>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 rounded">
            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Dogs
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Low profitability and low popularity. Consider removing from menu or completely redesigning the dish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Menu Intelligence Component
export default function MenuIntelligence() {
  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6">
        <PageHeader
          title="Menu Intelligence"
          subtitle="Strategic menu performance analysis & optimization recommendations"
          icon={UtensilsCrossed}
          className="text-white"
        />
      </div>

      {/* Menu Engineering Content */}
      <MenuEngineering />
    </div>
  );
}
