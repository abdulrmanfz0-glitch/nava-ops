// BCG Matrix Chart - Profitability vs Popularity Scatter Plot
// Visualizes menu items in 2D space showing performance quadrants

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

export default function BCGMatrixChart({ menuItems = [] }) {
  // Prepare data for scatter plot
  const chartData = menuItems.map(item => ({
    x: item.popularity,
    y: item.profitability,
    name: item.name,
    orders: item.orders,
    revenue: item.revenue,
    category: item.category,
    image: item.image,
    classification: item.classification,
    margin: item.margin
  }));

  // Calculate averages for reference lines
  const avgPopularity = menuItems.length > 0
    ? menuItems.reduce((sum, item) => sum + item.popularity, 0) / menuItems.length
    : 0.20;

  const avgProfitability = menuItems.length > 0
    ? menuItems.reduce((sum, item) => sum + item.profitability, 0) / menuItems.length
    : 0.40;

  // Custom tooltip to show item details
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{data.image}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.name}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div><span className="font-medium">Category:</span> {data.category}</div>
            <div><span className="font-medium">Orders:</span> {data.orders.toLocaleString()}</div>
            <div><span className="font-medium">Revenue:</span> SAR {data.revenue.toLocaleString()}</div>
            <div><span className="font-medium">Margin:</span> {(data.margin * 100).toFixed(0)}%</div>
            <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                data.classification === 'Star' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                data.classification === 'Plow Horse' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                data.classification === 'Puzzle' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {data.classification}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Color function for scatter points
  const getColor = (item) => {
    if (item.classification === 'Star') return '#22c55e'; // green
    if (item.classification === 'Plow Horse') return '#3b82f6'; // blue
    if (item.classification === 'Puzzle') return '#eab308'; // yellow
    return '#ef4444'; // red for Dogs
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        BCG Matrix - Profitability vs Popularity
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Strategic positioning of menu items across profitability and popularity dimensions
      </p>

      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />

            {/* Reference lines for average values */}
            <ReferenceLine
              x={avgPopularity}
              stroke="#999"
              strokeDasharray="5 5"
              label={{
                value: `Avg Popularity (${(avgPopularity * 100).toFixed(0)}%)`,
                position: 'top',
                fill: '#666',
                fontSize: 12
              }}
            />
            <ReferenceLine
              y={avgProfitability}
              stroke="#999"
              strokeDasharray="5 5"
              label={{
                value: `Avg Profitability (${(avgProfitability * 100).toFixed(0)}%)`,
                angle: 90,
                position: 'left',
                fill: '#666',
                fontSize: 12
              }}
            />

            <XAxis
              dataKey="x"
              name="Popularity"
              type="number"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{ value: 'Popularity', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              dataKey="y"
              name="Profitability"
              type="number"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{ value: 'Profitability', angle: -90, position: 'insideLeft' }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

            {/* Scatter plot with items colored by classification */}
            <Scatter name="Menu Items" data={chartData} fill="#8884d8">
              {chartData.map((item, index) => (
                <Cell key={`cell-${index}`} fill={getColor(item)} />
              ))}
            </Scatter>

            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              content={({ wrapperStyle, content }) => (
                <div style={wrapperStyle} className="flex flex-wrap gap-4 justify-center pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Star</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Plow Horse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Puzzle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dog</span>
                  </div>
                </div>
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Annotations */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Stars (Top Right)</h4>
          <p className="text-sm text-green-600 dark:text-green-300">High popularity & profitability. Your best performers.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Plow Horses (Top Left)</h4>
          <p className="text-sm text-blue-600 dark:text-blue-300">Popular but low margins. Optimize costs.</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Puzzles (Bottom Right)</h4>
          <p className="text-sm text-yellow-600 dark:text-yellow-300">Profitable but unpopular. Increase visibility.</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Dogs (Bottom Left)</h4>
          <p className="text-sm text-red-600 dark:text-red-300">Low popularity & profitability. Consider removing.</p>
        </div>
      </div>

      {/* Statistics */}
      {menuItems.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Total Items</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{menuItems.length}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Avg Popularity</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{(avgPopularity * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Avg Profitability</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{(avgProfitability * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Total Revenue</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                SAR {menuItems.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
