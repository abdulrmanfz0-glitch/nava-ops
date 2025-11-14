// AI Recommendations Panel
// Provides intelligent, actionable recommendations based on menu performance data

import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AIRecommendationsPanel({ menuItems = [] }) {
  const recommendations = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];

    // Classify items
    const avgPopularity = menuItems.reduce((sum, item) => sum + item.popularity, 0) / menuItems.length;
    const avgProfitability = menuItems.reduce((sum, item) => sum + item.profitability, 0) / menuItems.length;

    const stars = menuItems.filter(item => item.popularity > avgPopularity && item.profitability > avgProfitability);
    const plowhorses = menuItems.filter(item => item.popularity > avgPopularity && item.profitability <= avgProfitability);
    const puzzles = menuItems.filter(item => item.popularity <= avgPopularity && item.profitability > avgProfitability);
    const dogs = menuItems.filter(item => item.popularity <= avgPopularity && item.profitability <= avgProfitability);

    const recs = [];

    // Priority 1: Dogs - Immediate Action Needed
    if (dogs.length > 0) {
      const topDog = dogs.reduce((max, item) => item.revenue > max.revenue ? item : max);
      recs.push({
        priority: 1,
        type: 'dog',
        title: 'Review Low-Performing Items',
        icon: AlertTriangle,
        color: 'red',
        description: `${dogs.length} item${dogs.length > 1 ? 's' : ''} showing low popularity and profitability. Prioritize ${topDog.name} for review.`,
        actions: [
          'Consider removing or significantly repositioning these items',
          'Analyze customer feedback for improvement opportunities',
          'Test price reductions to boost volume if margins allow',
          'Replace with high-demand alternatives'
        ],
        impact: 'high'
      });
    }

    // Priority 2: Puzzles - High Opportunity
    if (puzzles.length > 0) {
      const topPuzzle = puzzles.reduce((max, item) => item.revenue > max.revenue ? item : max);
      const potentialRevenue = puzzles.reduce((sum, item) => sum + item.revenue, 0) * 1.5;
      recs.push({
        priority: 2,
        type: 'puzzle',
        title: 'Boost Visibility of Hidden Gems',
        icon: Zap,
        color: 'yellow',
        description: `${puzzles.length} profitable item${puzzles.length > 1 ? 's' : ''} with high margins but low visibility. ${topPuzzle.name} is your top hidden gem.`,
        actions: [
          'Feature prominently on physical and digital menus',
          'Train staff to actively recommend these items',
          'Create promotional bundles pairing with popular items',
          `Potential revenue increase: SAR ${Math.round(potentialRevenue - puzzles.reduce((sum, item) => sum + item.revenue, 0)).toLocaleString()} if visibility improves by 50%`
        ],
        impact: 'high'
      });
    }

    // Priority 3: Plowhorses - Margin Optimization
    if (plowhorses.length > 0) {
      const totalPlowhorseRevenue = plowhorses.reduce((sum, item) => sum + item.revenue, 0);
      const potentialMarginIncrease = plowhorses.reduce((sum, item) => sum + item.revenue * 0.05, 0); // 5% margin improvement
      recs.push({
        priority: 3,
        type: 'plow',
        title: 'Optimize Plow Horse Margins',
        icon: TrendingUp,
        color: 'blue',
        description: `${plowhorses.length} popular item${plowhorses.length > 1 ? 's' : ''} with low margins. Your customers love these but they're not as profitable as they could be.`,
        actions: [
          'Negotiate better supplier pricing for key ingredients',
          'Implement portion control without sacrificing quality',
          'Test 5-10% price increases in phases',
          `Potential profit increase: SAR ${Math.round(potentialMarginIncrease).toLocaleString()} with optimized costs`,
          'Cross-sell higher-margin items with these products'
        ],
        impact: 'medium'
      });
    }

    // Priority 4: Stars - Maintain & Amplify
    if (stars.length > 0) {
      const starRevenue = stars.reduce((sum, item) => sum + item.revenue, 0);
      recs.push({
        priority: 4,
        type: 'star',
        title: 'Maximize Your Stars',
        icon: Target,
        color: 'green',
        description: `${stars.length} top performer${stars.length > 1 ? 's' : ''} generating SAR ${starRevenue.toLocaleString()} in revenue. These are your menu anchors.`,
        actions: [
          'Ensure consistent quality and availability',
          'Feature heavily in marketing campaigns',
          'Create signature variations to increase average order value',
          'Use as traffic drivers to promote other items',
          'Monitor for price elasticity before adjusting prices'
        ],
        impact: 'medium'
      });
    }

    // Additional metrics-based recommendations
    const avgOrders = menuItems.reduce((sum, item) => sum + item.orders, 0) / menuItems.length;
    const underPerformers = menuItems.filter(item => item.orders < avgOrders * 0.5);

    if (underPerformers.length > 0) {
      recs.push({
        priority: 5,
        type: 'performance',
        title: 'Address Order Volume Issues',
        icon: ArrowDownRight,
        color: 'orange',
        description: `${underPerformers.length} item${underPerformers.length > 1 ? 's' : ''} with significantly lower order volumes.`,
        actions: [
          'Review menu placement and descriptions',
          'Enhance product photos and descriptions',
          'Offer limited-time promotions to build interest',
          'Gather customer feedback on why items are less ordered'
        ],
        impact: 'medium'
      });
    }

    // Category analysis
    const categoryStats = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { items: [], totalRevenue: 0, avgMargin: 0 };
      }
      acc[item.category].items.push(item);
      acc[item.category].totalRevenue += item.revenue;
      acc[item.category].avgMargin += item.margin;
      return acc;
    }, {});

    Object.entries(categoryStats).forEach(([category, stats]) => {
      stats.avgMargin = stats.avgMargin / stats.items.length;
    });

    const weakCategory = Object.entries(categoryStats).reduce((min, [cat, stats]) =>
      stats.avgMargin < min.stats.avgMargin ? { category: cat, stats } : min,
      { category: '', stats: { avgMargin: Infinity } }
    );

    if (weakCategory.category && weakCategory.stats.avgMargin < avgProfitability * 0.75) {
      recs.push({
        priority: 6,
        type: 'category',
        title: 'Category Performance Imbalance',
        icon: TrendingDown,
        color: 'purple',
        description: `${weakCategory.category} category has significantly lower margins (${(weakCategory.stats.avgMargin * 100).toFixed(1)}%) compared to your average.`,
        actions: [
          `Review all ${weakCategory.category} items for cost optimization`,
          'Consider removing lowest-margin items from this category',
          'Develop premium versions at higher price points',
          'Analyze competitor pricing in this category'
        ],
        impact: 'medium'
      });
    }

    return recs.sort((a, b) => a.priority - b.priority);
  }, [menuItems]);

  const getColorClasses = (color) => {
    const colors = {
      red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
      yellow: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
      blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
      orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
      purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
    };
    return colors[color] || colors.blue;
  };

  const getTitleColor = (color) => {
    const colors = {
      red: 'text-red-700 dark:text-red-400',
      yellow: 'text-yellow-700 dark:text-yellow-400',
      blue: 'text-blue-700 dark:text-blue-400',
      green: 'text-green-700 dark:text-green-400',
      orange: 'text-orange-700 dark:text-orange-400',
      purple: 'text-purple-700 dark:text-purple-400'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
      green: 'text-green-500',
      orange: 'text-orange-500',
      purple: 'text-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        AI-Powered Recommendations
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Intelligent, actionable insights based on your menu performance data
      </p>

      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No data available to generate recommendations. Add menu items to get started.
            </p>
          </div>
        ) : (
          recommendations.map((rec, index) => {
            const IconComponent = rec.icon;
            return (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${getColorClasses(rec.color)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <IconComponent className={`w-6 h-6 mt-0.5 flex-shrink-0 ${getIconColor(rec.color)}`} />
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${getTitleColor(rec.color)}`}>
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {rec.description}
                    </p>
                  </div>
                  <div className="text-xs font-semibold">
                    <span className={`
                      px-2.5 py-1 rounded-full
                      ${rec.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
                      ${rec.impact === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : ''}
                      ${rec.impact === 'low' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : ''}
                    `}>
                      {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                    </span>
                  </div>
                </div>

                {/* Action items */}
                <div className="ml-9 space-y-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Recommended Actions
                  </div>
                  <ul className="space-y-1">
                    {rec.actions.map((action, actionIdx) => (
                      <li key={actionIdx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
                          ${rec.color === 'red' ? 'bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-400' : ''}
                          ${rec.color === 'yellow' ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' : ''}
                          ${rec.color === 'blue' ? 'bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400' : ''}
                          ${rec.color === 'green' ? 'bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-400' : ''}
                          ${rec.color === 'orange' ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400' : ''}
                          ${rec.color === 'purple' ? 'bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400' : ''}
                        `}>
                          ✓
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Key Metrics Summary */}
      {menuItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quick Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Menu Items</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{menuItems.length}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                SAR {(menuItems.reduce((sum, item) => sum + item.revenue, 0) / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Orders</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round(menuItems.reduce((sum, item) => sum + item.orders, 0) / menuItems.length).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Margin</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {((menuItems.reduce((sum, item) => sum + item.margin, 0) / menuItems.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
