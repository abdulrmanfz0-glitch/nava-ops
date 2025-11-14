// src/components/Intelligence/PredictionChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

/**
 * Prediction Chart Component
 * Displays historical data with forecasted predictions and confidence intervals
 */
const PredictionChart = ({
  historicalData = [],
  predictions = [],
  title = 'Revenue Forecast',
  className = '',
  showConfidenceInterval = true,
}) => {
  // Combine historical and prediction data
  const chartData = [
    ...historicalData.map((d) => ({
      date: d.date,
      actual: d.revenue || d.value,
      type: 'historical',
    })),
    ...predictions.map((p) => ({
      date: p.date,
      predicted: p.predictedRevenue || p.value,
      upperBound: p.upperBound,
      lowerBound: p.lowerBound,
      confidence: p.confidence,
      type: 'prediction',
    })),
  ];

  // Calculate trend
  const getTrend = () => {
    if (predictions.length < 2) return null;

    const first = predictions[0]?.predictedRevenue || predictions[0]?.value || 0;
    const last =
      predictions[predictions.length - 1]?.predictedRevenue ||
      predictions[predictions.length - 1]?.value ||
      0;

    const change = ((last - first) / first) * 100;

    return {
      direction: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
      percentage: Math.abs(change).toFixed(1),
    };
  };

  const trend = getTrend();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const isHistorical = data.type === 'historical';
    const isPrediction = data.type === 'prediction';

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>

        {isHistorical && (
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">Actual:</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                ${data.actual?.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {isPrediction && (
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">Predicted:</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                ${data.predicted?.toLocaleString()}
              </span>
            </div>

            {showConfidenceInterval && data.upperBound && data.lowerBound && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Upper Bound:</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    ${data.upperBound?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Lower Bound:</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    ${data.lowerBound?.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {data.confidence && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Confidence:</span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    {(data.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Historical data with AI-powered predictions
          </p>
        </div>

        {trend && (
          <div className="flex items-center gap-2">
            {trend.direction === 'up' && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-bold">+{trend.percentage}%</span>
              </div>
            )}
            {trend.direction === 'down' && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-bold">-{trend.percentage}%</span>
              </div>
            )}
            {trend.direction === 'stable' && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Minus className="w-5 h-5" />
                <span className="text-sm font-bold">Stable</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
              formatter={(value) => (
                <span className="text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />

            {/* Confidence Interval */}
            {showConfidenceInterval && (
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#confidenceGradient)"
                name="Confidence Range"
              />
            )}

            {/* Historical Data */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#actualGradient)"
              name="Actual"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* Predictions */}
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#predictedGradient)"
              name="Predicted"
              dot={{ fill: '#a855f7', r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* Dividing line between historical and predictions */}
            {historicalData.length > 0 && predictions.length > 0 && (
              <ReferenceLine
                x={historicalData[historicalData.length - 1]?.date}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: 'Forecast Start',
                  position: 'top',
                  fontSize: 11,
                  fill: '#ef4444',
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Historical Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">AI Prediction</span>
        </div>
        {showConfidenceInterval && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">95% Confidence Range</span>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Predictions are generated using ensemble machine learning models combining linear regression,
          moving averages, and exponential smoothing with seasonality adjustments. Confidence decreases
          with forecast horizon.
        </p>
      </div>
    </div>
  );
};

export default PredictionChart;
