import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import theme from '../../styles/navaUITheme';

/**
 * DonutChart - Modern donut chart with animations
 *
 * @param {array} data - Chart data [{ name, value, color }]
 * @param {number} innerRadius - Inner radius percentage (0-100)
 * @param {number} outerRadius - Outer radius percentage (0-100)
 * @param {boolean} showLegend - Show legend
 * @param {boolean} showTooltip - Show tooltip
 * @param {boolean} showLabels - Show value labels
 * @param {string} centerLabel - Center text label
 * @param {string} centerValue - Center value display
 */
const DonutChart = ({
  data = [],
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  centerLabel,
  centerValue,
  height = 300,
  className = '',
}) => {
  // Default colors if not provided
  const defaultColors = theme.chartColors.multi;

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];
    return (
      <motion.div
        className="px-4 py-3 backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm font-semibold text-white mb-1">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.payload.color }}>
          {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        </p>
        {data.payload.percentage && (
          <p className="text-xs text-white/60 mt-1">{data.payload.percentage}%</p>
        )}
      </motion.div>
    );
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <motion.div
        className="flex flex-wrap justify-center gap-3 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {payload.map((entry, index) => (
          <motion.div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-sm text-white/70">{entry.value}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Calculate total for center display
  const total = dataWithColors.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <defs>
            {dataWithColors.map((entry, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`donutGradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>

          {showTooltip && <Tooltip content={<CustomTooltip />} />}

          <Pie
            data={dataWithColors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={`${innerRadius}%`}
            outerRadius={`${outerRadius}%`}
            paddingAngle={2}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {dataWithColors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#donutGradient-${index})`}
                stroke="rgba(10, 14, 20, 0.5)"
                strokeWidth={2}
              />
            ))}
          </Pie>

          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      {(centerLabel || centerValue) && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          style={{ marginBottom: showLegend ? '20px' : '0' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {centerValue && (
            <div className="text-3xl font-bold text-white mb-1">
              {centerValue}
            </div>
          )}
          {centerLabel && (
            <div className="text-sm text-white/50">
              {centerLabel}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DonutChart;
