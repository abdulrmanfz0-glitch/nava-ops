// NAVA OPS - Menu Engineering Matrix Component
// BCG Matrix visualization for menu item analysis

import React, { useMemo, useState } from 'react';
import { TrendingUp, DollarSign, Users, Target, AlertCircle, Star, Gem, HelpCircle, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { logger } from '../lib/logger';

/**
 * Menu Engineering Matrix - BCG Matrix Analysis
 *
 * Categorizes menu items into 4 quadrants:
 * - ⭐ Stars: High popularity + High profitability
 * - 💎 Hidden Gems: Low popularity + High profitability
 * - ❓ Question Marks: High popularity + Low profitability
 * - 🗑️ Dogs: Low popularity + Low profitability
 *
 * @param {Object} props
 * @param {Array} props.menuItems - Array of menu items with sales/profit data
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onItemClick - Callback when item is clicked
 */
export default function MenuEngineeringMatrix({
  menuItems = [],
  loading = false,
  onItemClick
}) {
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  /**
   * Calculate popularity and profitability metrics
   */
  const analysis = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      return { items: [], avgPopularity: 0, avgProfitability: 0 };
    }

    // Calculate totals
    const totalSales = menuItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalRevenue = menuItems.reduce((sum, item) => sum + (item.revenue || 0), 0);

    // Calculate averages
    const avgPopularity = totalSales / menuItems.length;
    const avgProfitability = totalRevenue / menuItems.length;

    // Categorize items
    const items = menuItems.map(item => {
      const popularity = item.quantity || 0;
      const profitability = item.revenue || 0;
      const contributionMargin = item.profit || (item.revenue - (item.cost || 0));

      // Determine quadrant
      let quadrant, category, icon, color, recommendation;

      if (popularity >= avgPopularity && profitability >= avgProfitability) {
        quadrant = 'stars';
        category = '⭐ Stars';
        icon = Star;
        color = 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
        recommendation = 'Maintain quality and promote heavily. These are your best performers.';
      } else if (popularity < avgPopularity && profitability >= avgProfitability) {
        quadrant = 'gems';
        category = '💎 Hidden Gems';
        icon = Gem;
        color = 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200';
        recommendation = 'Increase visibility through marketing and menu placement.';
      } else if (popularity >= avgPopularity && profitability < avgProfitability) {
        quadrant = 'questions';
        category = '❓ Question Marks';
        icon = HelpCircle;
        color = 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
        recommendation = 'Reduce costs, increase prices, or improve recipe quality.';
      } else {
        quadrant = 'dogs';
        category = '🗑️ Dogs';
        icon = Trash2;
        color = 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200';
        recommendation = 'Consider removing or repositioning. Low return on investment.';
      }

      return {
        ...item,
        popularity,
        profitability,
        contributionMargin,
        quadrant,
        category,
        icon,
        color,
        recommendation,
        // Calculate position on matrix (0-100 scale for visualization)
        x: (popularity / (totalSales / menuItems.length * 2)) * 100,
        y: (profitability / (totalRevenue / menuItems.length * 2)) * 100
      };
    });

    logger.info('Menu engineering analysis completed', {
      totalItems: items.length,
      avgPopularity,
      avgProfitability
    });

    return { items, avgPopularity, avgProfitability };
  }, [menuItems]);

  /**
   * Filter items by quadrant
   */
  const filteredItems = useMemo(() => {
    if (!selectedQuadrant) return analysis.items;
    return analysis.items.filter(item => item.quadrant === selectedQuadrant);
  }, [analysis.items, selectedQuadrant]);

  /**
   * Get quadrant statistics
   */
  const quadrantStats = useMemo(() => {
    const stats = {
      stars: { count: 0, revenue: 0 },
      gems: { count: 0, revenue: 0 },
      questions: { count: 0, revenue: 0 },
      dogs: { count: 0, revenue: 0 }
    };

    analysis.items.forEach(item => {
      stats[item.quadrant].count++;
      stats[item.quadrant].revenue += item.revenue || 0;
    });

    return stats;
  }, [analysis.items]);

  if (loading) {
    return (
      <div className="card p-8 animate-pulse">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Menu Data Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Add menu items with sales data to see the BCG matrix analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Menu Engineering Matrix
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              BCG Matrix analysis of menu items by popularity and profitability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.items.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quadrant Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { key: 'stars', label: '⭐ Stars', color: 'yellow', icon: Star },
          { key: 'gems', label: '💎 Hidden Gems', color: 'purple', icon: Gem },
          { key: 'questions', label: '❓ Questions', color: 'orange', icon: HelpCircle },
          { key: 'dogs', label: '🗑️ Dogs', color: 'red', icon: Trash2 }
        ].map(({ key, label, color, icon: Icon }) => {
          const stats = quadrantStats[key];
          const isActive = selectedQuadrant === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedQuadrant(isActive ? null : key)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200
                ${isActive
                  ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 text-${color}-500`} />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {label}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.count}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatCurrency(stats.revenue)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* BCG Matrix Scatter Plot */}
      <div className="card p-6">
        <div className="relative w-full" style={{ height: '500px' }}>
          {/* Axes Labels */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Profitability (Revenue) →
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Popularity (Sales Volume) →
            </div>
          </div>

          {/* Matrix Container */}
          <div className="relative w-full h-full border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Quadrant Background */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {/* Bottom Left - Dogs */}
              <div className="bg-red-50/50 dark:bg-red-900/10 border-r border-t border-gray-300 dark:border-gray-700"></div>
              {/* Bottom Right - Question Marks */}
              <div className="bg-orange-50/50 dark:bg-orange-900/10 border-t border-gray-300 dark:border-gray-700"></div>
              {/* Top Left - Hidden Gems */}
              <div className="bg-purple-50/50 dark:bg-purple-900/10 border-r border-gray-300 dark:border-gray-700"></div>
              {/* Top Right - Stars */}
              <div className="bg-yellow-50/50 dark:bg-yellow-900/10"></div>
            </div>

            {/* Quadrant Labels */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
              <div className="flex items-start justify-start p-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                  🗑️ Dogs
                </span>
              </div>
              <div className="flex items-start justify-end p-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                  ❓ Questions
                </span>
              </div>
              <div className="flex items-end justify-start p-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                  💎 Gems
                </span>
              </div>
              <div className="flex items-end justify-end p-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">
                  ⭐ Stars
                </span>
              </div>
            </div>

            {/* Data Points (Menu Items) */}
            {filteredItems.map((item, index) => {
              const size = Math.min(Math.max((item.revenue || 0) / 100, 20), 60);
              const isHovered = hoveredItem === item.id;

              return (
                <div
                  key={item.id || index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                  style={{
                    left: `${Math.min(Math.max(item.x, 5), 95)}%`,
                    bottom: `${Math.min(Math.max(item.y, 5), 95)}%`,
                    zIndex: isHovered ? 20 : 10
                  }}
                  onClick={() => onItemClick?.(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Bubble */}
                  <div
                    className={`
                      rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${item.color}
                      ${isHovered ? 'scale-125 shadow-lg' : 'shadow-md'}
                      border-2
                    `}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>

                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-30 animate-fade-in">
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {item.name}
                        </h4>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${item.color}`}>
                          {item.category}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Sales:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.quantity || 0} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.revenue || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Profit:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.contributionMargin || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          {item.recommendation}
                        </p>
                      </div>

                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-8 border-transparent border-t-white dark:border-t-gray-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Center Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recommended Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              quadrant: 'stars',
              title: '⭐ Stars Strategy',
              actions: [
                'Maintain high quality and consistency',
                'Feature prominently on menu',
                'Consider premium positioning',
                'Use in marketing campaigns'
              ],
              color: 'yellow'
            },
            {
              quadrant: 'gems',
              title: '💎 Hidden Gems Strategy',
              actions: [
                'Increase menu visibility',
                'Server recommendations',
                'Social media promotion',
                'Bundle with popular items'
              ],
              color: 'purple'
            },
            {
              quadrant: 'questions',
              title: '❓ Question Marks Strategy',
              actions: [
                'Reduce portion costs',
                'Adjust pricing strategy',
                'Improve recipe quality',
                'Reposition or remove'
              ],
              color: 'orange'
            },
            {
              quadrant: 'dogs',
              title: '🗑️ Dogs Strategy',
              actions: [
                'Consider menu removal',
                'Major recipe overhaul',
                'Significant price reduction',
                'Replace with new items'
              ],
              color: 'red'
            }
          ].map(({ quadrant, title, actions, color }) => {
            const count = quadrantStats[quadrant].count;

            return (
              <div
                key={quadrant}
                className={`p-4 rounded-lg border-2 border-${color}-200 dark:border-${color}-800 bg-${color}-50/50 dark:bg-${color}-900/10`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-300`}>
                    {count} items
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* RTL Support */}
      <style jsx>{`
        [dir="rtl"] .grid {
          direction: rtl;
        }
      `}</style>
    </div>
  );
}
