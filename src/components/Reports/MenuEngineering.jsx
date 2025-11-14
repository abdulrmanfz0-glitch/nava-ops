// NAVA OPS - Menu Engineering Report Component
// BCG Matrix analysis for menu items with performance optimizations

import React, { useMemo } from 'react';
import { Star, AlertCircle, TrendingUp, ThumbsDown } from 'lucide-react';

function MenuEngineering({ reportData }) {
  // Use menu items from reportData if available, otherwise use default
  const menuItems = reportData?.menuItems || [];

  // Handle empty data
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No menu data available for this period</p>
      </div>
    );
  }

  // Memoized calculations for performance
  const { avgSales, avgProfit, categoryCounts, topStars, topPlowhorse, topPuzzle, topDogs } = useMemo(() => {
    const avgSales = menuItems.reduce((sum, item) => sum + item.sales, 0) / menuItems.length;
    const avgProfit = menuItems.reduce((sum, item) => sum + item.profit, 0) / menuItems.length;

    const categoryCounts = {
      star: menuItems.filter(i => i.category === 'star').length,
      puzzle: menuItems.filter(i => i.category === 'puzzle').length,
      plow_horse: menuItems.filter(i => i.category === 'plow_horse').length,
      dog: menuItems.filter(i => i.category === 'dog').length
    };

    // Get top performers for recommendations
    const topStars = menuItems.filter(i => i.category === 'star').slice(0, 2).map(i => i.name).join(' and ');
    const topPlowhorse = menuItems.filter(i => i.category === 'plow_horse').slice(0, 2).map(i => i.name).join(' and ');
    const topPuzzle = menuItems.filter(i => i.category === 'puzzle').slice(0, 2).map(i => i.name).join(' and ');
    const topDogs = menuItems.filter(i => i.category === 'dog').slice(0, 2).map(i => i.name).join(' and ');

    return { avgSales, avgProfit, categoryCounts, topStars, topPlowhorse, topPuzzle, topDogs };
  }, [menuItems]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CategoryCard
          title="Stars"
          count={categoryCounts.star}
          description="High sales, high profit"
          icon={Star}
          color="yellow"
          recommendation="Promote heavily!"
        />
        <CategoryCard
          title="Puzzles"
          count={categoryCounts.puzzle}
          description="Low sales, high profit"
          icon={AlertCircle}
          color="purple"
          recommendation="Increase visibility"
        />
        <CategoryCard
          title="Plow Horses"
          count={categoryCounts.plow_horse}
          description="High sales, low profit"
          icon={TrendingUp}
          color="blue"
          recommendation="Improve margins"
        />
        <CategoryCard
          title="Dogs"
          count={categoryCounts.dog}
          description="Low sales, low profit"
          icon={ThumbsDown}
          color="red"
          recommendation="Consider removing"
        />
      </div>

      {/* BCG Matrix Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Menu Engineering Matrix
        </h3>
        <div className="relative" style={{ height: '400px' }}>
          {/* Matrix Grid */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2">
            {/* Star Quadrant - Top Right */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Stars</h4>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === 'star').map(item => (
                  <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Puzzle Quadrant - Top Left */}
            <div className="bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Puzzles</h4>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === 'puzzle').map(item => (
                  <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Plow Horse Quadrant - Bottom Right */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Plow Horses</h4>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === 'plow_horse').map(item => (
                  <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Dog Quadrant - Bottom Left */}
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Dogs</h4>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === 'dog').map(item => (
                  <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Axis Labels */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20">
            <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
              Profit Margin →
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
            <div className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
              Sales Volume →
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Item Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Menu Item Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {menuItems.map(item => (
                <MenuItemRow key={item.id} item={item} avgSales={avgSales} avgProfit={avgProfit} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                    rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Strategic Recommendations
        </h3>
        <div className="space-y-3">
          {topStars && (
            <RecommendationItem
              title="Promote Star Items"
              description={`${topStars} are your top performers. Feature them prominently in marketing and promotions.`}
              priority="high"
            />
          )}
          {topPlowhorse && (
            <RecommendationItem
              title="Optimize Plow Horses"
              description={`Increase prices or reduce costs for ${topPlowhorse} to improve profit margins.`}
              priority="medium"
            />
          )}
          {topPuzzle && (
            <RecommendationItem
              title="Revive Puzzle Items"
              description={`${topPuzzle} have high margins but low sales. Improve visibility and marketing.`}
              priority="medium"
            />
          )}
          {topDogs && (
            <RecommendationItem
              title="Eliminate or Redesign Dogs"
              description={`Consider removing or completely redesigning ${topDogs}.`}
              priority="low"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MenuEngineering);

const CategoryCard = React.memo(function CategoryCard({ title, count, description, icon: Icon, color, recommendation }) {
  const colorClasses = {
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-transparent hover:shadow-lg transition-shadow">
      <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{count}</div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">→ {recommendation}</p>
    </div>
  );
});

const MenuItemRow = React.memo(function MenuItemRow({ item, avgSales, avgProfit }) {
  const getCategoryBadge = (category) => {
    const badges = {
      star: { label: 'Star', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
      puzzle: { label: 'Puzzle', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
      plow_horse: { label: 'Plow Horse', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
      dog: { label: 'Dog', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' }
    };
    const badge = badges[category] || badges.dog;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getRecommendation = (category) => {
    const recommendations = {
      star: 'Promote heavily',
      puzzle: 'Increase marketing',
      plow_horse: 'Improve margins',
      dog: 'Consider removing'
    };
    return recommendations[category] || 'Review performance';
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{item.sales}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {item.sales > avgSales ? '↑ Above avg' : '↓ Below avg'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">SAR {item.profit.toLocaleString()}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {item.profit > avgProfit ? '↑ Above avg' : '↓ Below avg'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        SAR {item.price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getCategoryBadge(item.category)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {getRecommendation(item.category)}
      </td>
    </tr>
  );
});

const RecommendationItem = React.memo(function RecommendationItem({ title, description, priority }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${priorityColors[priority]}`}>
        {priority}
      </span>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
});
