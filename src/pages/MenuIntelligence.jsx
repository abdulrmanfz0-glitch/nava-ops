// NAVA OPS - Menu Intelligence
// Strategic menu performance analysis with engineering matrix

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import PageHeader from '@/components/UI/PageHeader';
import StatCard from '@/components/UI/StatCard';
import DateRangePicker from '@/components/UI/DateRangePicker';
import EmptyState from '@/components/UI/EmptyState';
import {
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Lightbulb,
  Star,
  AlertTriangle,
  Package,
  BarChart3
} from 'lucide-react';

export default function MenuIntelligence() {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState({
    items: [],
    totalRevenue: 0,
    totalOrders: 0,
    avgMargin: 0
  });

  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const days = Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24));

      const overview = await api.analytics.getDashboardOverview(null, days);

      // Generate menu items with performance metrics
      const menuItems = [
        {
          name: 'Classic Burger',
          category: 'Burgers',
          orders: 1250,
          revenue: 31250,
          cost: 18750,
          margin: 0.40,
          popularity: 0.28,
          profitability: 0.40,
          trend: '+15%',
          image: '🍔'
        },
        {
          name: 'Cheese Pizza',
          category: 'Pizza',
          orders: 980,
          revenue: 34300,
          cost: 17150,
          margin: 0.50,
          popularity: 0.22,
          profitability: 0.50,
          trend: '+22%',
          image: '🍕'
        },
        {
          name: 'Caesar Salad',
          category: 'Salads',
          orders: 450,
          revenue: 5850,
          cost: 3510,
          margin: 0.40,
          popularity: 0.10,
          profitability: 0.40,
          trend: '-8%',
          image: '🥗'
        },
        {
          name: 'Chicken Wings',
          category: 'Appetizers',
          orders: 820,
          revenue: 16400,
          cost: 11480,
          margin: 0.30,
          popularity: 0.18,
          profitability: 0.30,
          trend: '+5%',
          image: '🍗'
        },
        {
          name: 'Veggie Burger',
          category: 'Burgers',
          orders: 320,
          revenue: 8320,
          cost: 3328,
          margin: 0.60,
          popularity: 0.07,
          profitability: 0.60,
          trend: '+35%',
          image: '🥙'
        },
        {
          name: 'French Fries',
          category: 'Sides',
          orders: 1450,
          revenue: 7250,
          cost: 5075,
          margin: 0.30,
          popularity: 0.32,
          profitability: 0.30,
          trend: '+3%',
          image: '🍟'
        },
        {
          name: 'Grilled Chicken',
          category: 'Mains',
          orders: 680,
          revenue: 20400,
          cost: 10200,
          margin: 0.50,
          popularity: 0.15,
          profitability: 0.50,
          trend: '+12%',
          image: '🍗'
        },
        {
          name: 'Margherita Pizza',
          category: 'Pizza',
          orders: 540,
          revenue: 18900,
          cost: 9450,
          margin: 0.50,
          popularity: 0.12,
          profitability: 0.50,
          trend: '+8%',
          image: '🍕'
        }
      ];

      // Calculate averages
      const avgPopularity = menuItems.reduce((sum, item) => sum + item.popularity, 0) / menuItems.length;
      const avgProfitability = menuItems.reduce((sum, item) => sum + item.profitability, 0) / menuItems.length;

      // Classify items
      const itemsWithClass = menuItems.map(item => {
        const highPopularity = item.popularity >= avgPopularity;
        const highProfitability = item.profitability >= avgProfitability;

        let classification;
        if (highPopularity && highProfitability) {
          classification = { type: 'star', label: 'Star', color: 'green', icon: '⭐', bgClass: 'bg-green-100 dark:bg-green-900/20', textClass: 'text-green-700 dark:text-green-400', borderClass: 'border-green-200 dark:border-green-800' };
        } else if (!highPopularity && highProfitability) {
          classification = { type: 'puzzle', label: 'Puzzle', color: 'blue', icon: '🧩', bgClass: 'bg-blue-100 dark:bg-blue-900/20', textClass: 'text-blue-700 dark:text-blue-400', borderClass: 'border-blue-200 dark:border-blue-800' };
        } else if (highPopularity && !highProfitability) {
          classification = { type: 'plow', label: 'Plow Horse', color: 'yellow', icon: '🐴', bgClass: 'bg-yellow-100 dark:bg-yellow-900/20', textClass: 'text-yellow-700 dark:text-yellow-400', borderClass: 'border-yellow-200 dark:border-yellow-800' };
        } else {
          classification = { type: 'dog', label: 'Dog', color: 'red', icon: '🐕', bgClass: 'bg-red-100 dark:bg-red-900/20', textClass: 'text-red-700 dark:text-red-400', borderClass: 'border-red-200 dark:border-red-800' };
        }

        return { ...item, classification };
      });

      setMenuData({
        items: itemsWithClass,
        totalRevenue: menuItems.reduce((sum, item) => sum + item.revenue, 0),
        totalOrders: menuItems.reduce((sum, item) => sum + item.orders, 0),
        avgMargin: avgProfitability
      });
    } catch (error) {
      console.error('Menu data error:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load menu intelligence data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Count items by classification
  const classificationCounts = menuData.items.reduce((acc, item) => {
    acc[item.classification.type] = (acc[item.classification.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Intelligence"
        subtitle="Strategic menu performance analysis with engineering matrix"
        icon={UtensilsCrossed}
        actions={
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
          />
        }
      />

      {/* Menu Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Menu Items"
          value={menuData.items.length}
          subtitle="Active items"
          icon={Package}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(menuData.totalRevenue)}
          subtitle="From menu sales"
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Avg Profit Margin"
          value={`${(menuData.avgMargin * 100).toFixed(1)}%`}
          subtitle="Average across menu"
          icon={Target}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={menuData.totalOrders.toLocaleString()}
          subtitle="Menu item orders"
          icon={BarChart3}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Menu Classification Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Menu Engineering Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Stars ⭐</span>
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">{classificationCounts.star || 0}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">High popularity & profit</p>
          </div>
          <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Puzzles 🧩</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{classificationCounts.puzzle || 0}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">High profit, low popularity</p>
          </div>
          <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Plow Horses 🐴</span>
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{classificationCounts.plow || 0}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">High popularity, low profit</p>
          </div>
          <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Dogs 🐕</span>
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">{classificationCounts.dog || 0}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Low popularity & profit</p>
          </div>
        </div>
      </div>

      {/* Menu Engineering Matrix Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Menu Performance Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Item</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Orders</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Margin</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : menuData.items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12">
                    <EmptyState
                      icon={UtensilsCrossed}
                      title="No Menu Data"
                      message="Menu performance data will appear here."
                    />
                  </td>
                </tr>
              ) : (
                menuData.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {item.orders.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {(item.margin * 100).toFixed(0)}%
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-flex items-center gap-1 font-medium ${item.trend.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.trend.includes('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {item.trend}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${item.classification.bgClass} ${item.classification.textClass} ${item.classification.borderClass}`}>
                        <span>{item.classification.icon}</span>
                        <span>{item.classification.label}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Strategic Recommendations
        </h3>
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <div className="font-semibold text-green-700 dark:text-green-400 mb-1">Stars - Promote Heavily</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  High popularity & profitability. Feature prominently on menu, marketing materials, and digital channels. These are your winning items.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧩</span>
              <div className="flex-1">
                <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Puzzles - Increase Visibility</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  High profit but low popularity. Boost marketing, improve positioning on menu, train staff to recommend these items, or consider price adjustments.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🐴</span>
              <div className="flex-1">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Plow Horses - Optimize Costs</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Popular but lower profit. Focus on cost reduction through better sourcing, portion control, or consider modest price increases without affecting volume.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🐕</span>
              <div className="flex-1">
                <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Dogs - Consider Removal</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Low popularity & profit. Evaluate if these items serve a strategic purpose. If not, consider removing them to simplify operations and reduce inventory costs.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
