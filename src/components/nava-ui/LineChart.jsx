import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import theme from '../../styles/navaUITheme';

/**
 * LineChart - Modern line chart with gradients and animations
 *
 * @param {array} data - Chart data
 * @param {array} lines - Line configurations [{ dataKey, name, color, gradient }]
 * @param {string} xAxisKey - X-axis data key
 * @param {boolean} showGrid - Show grid lines
 * @param {boolean} showLegend - Show legend
 * @param {boolean} showTooltip - Show tooltip
 * @param {boolean} smooth - Smooth curves
 * @param {boolean} gradient - Fill gradient under line
 * @param {number} height - Chart height
 */
const LineChart = ({
  data = [],
  lines = [],
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  smooth = true,
  gradient = false,
  height = 300,
  className = '',
}) => {
  // Default line config if not provided
  const defaultLines = lines.length > 0 ? lines : [
    {
      dataKey: 'value',
      name: 'Value',
      color: theme.colors.primary[500],
      gradient: gradient,
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        className="px-4 py-3 backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm font-semibold text-white/60 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: entry.color }}
              />
              <span className="text-sm text-white/80">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
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

  // Custom dot
  const CustomDot = ({ cx, cy, stroke, index }) => {
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={4}
        fill={stroke}
        stroke="#0A0E14"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: index * 0.05,
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      />
    );
  };

  const ChartComponent = gradient ? ComposedChart : RechartsLineChart;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            {defaultLines.map((line, index) => (
              line.gradient && (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`lineGradient-${line.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              )
            ))}
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
          )}

          <XAxis
            dataKey={xAxisKey}
            stroke="rgba(255, 255, 255, 0.3)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
          />

          <YAxis
            stroke="rgba(255, 255, 255, 0.3)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
          />

          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />}

          {showLegend && <Legend content={<CustomLegend />} />}

          {defaultLines.map((line, index) => (
            <React.Fragment key={`line-${index}`}>
              {line.gradient && gradient && (
                <Area
                  type={smooth ? 'monotone' : 'linear'}
                  dataKey={line.dataKey}
                  fill={`url(#lineGradient-${line.dataKey})`}
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
              <Line
                type={smooth ? 'monotone' : 'linear'}
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{
                  r: 6,
                  fill: line.color,
                  stroke: '#0A0E14',
                  strokeWidth: 3,
                }}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </React.Fragment>
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
