import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChartIcon,
  Activity,
  ChevronDown,
  Download,
  Maximize2,
  MoreHorizontal,
} from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * DynamicChartWidget - Interactive chart component with multiple visualization types
 * Features: Animated transitions, tooltips, multiple chart types, responsive
 */
const DynamicChartWidget = ({
  title,
  subtitle,
  data = [],
  type = 'area',
  dataKeys = ['value'],
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true,
  delay = 0,
  onExpand,
  onDownload,
  className = '',
}) => {
  const [chartType, setChartType] = useState(type);
  const [hoveredData, setHoveredData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Chart type options
  const chartTypes = [
    { id: 'area', label: 'Area Chart', icon: Activity },
    { id: 'line', label: 'Line Chart', icon: TrendingUp },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', label: 'Pie Chart', icon: PieChartIcon },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <motion.div
        className="
          bg-gray-900/95 backdrop-blur-xl
          border border-white/[0.1] rounded-xl
          p-4 shadow-2xl
        "
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-300">{entry.name}:</span>
            <span className="text-sm font-semibold text-white">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    );
  };

  // Gradient definitions for charts
  const GradientDefs = () => (
    <defs>
      {colors.map((color, index) => (
        <linearGradient
          key={index}
          id={`gradient-${index}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      ))}
    </defs>
  );

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const gridProps = showGrid ? {
      stroke: 'rgba(255,255,255,0.05)',
      strokeDasharray: '3 3',
    } : {};

    const axisProps = {
      stroke: 'rgba(255,255,255,0.1)',
      tick: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 },
      tickLine: false,
      axisLine: false,
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <GradientDefs />
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={`url(#gradient-${index})`}
                strokeWidth={2}
                animationBegin={delay * 1000}
                animationDuration={1500}
              />
            ))}
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{
                  fill: colors[index % colors.length],
                  strokeWidth: 0,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: colors[index % colors.length],
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                animationBegin={delay * 1000}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                animationBegin={delay * 1000}
                animationDuration={1500}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        // Transform data for pie chart
        const pieData = dataKeys.length === 1
          ? data.map((item, index) => ({
              name: item.name,
              value: item[dataKeys[0]],
              color: colors[index % colors.length],
            }))
          : dataKeys.map((key, index) => ({
              name: key,
              value: data.reduce((sum, item) => sum + (item[key] || 0), 0),
              color: colors[index % colors.length],
            }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={delay * 1000}
              animationDuration={1500}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <GlassCard
      className={className}
      padding="none"
      animate={animate}
      delay={delay}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="relative">
            <motion.button
              className="
                flex items-center gap-2 px-3 py-2
                bg-white/[0.05] hover:bg-white/[0.1]
                border border-white/[0.08] rounded-lg
                text-sm text-gray-300 hover:text-white
                transition-all duration-200
              "
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {chartTypes.find(t => t.id === chartType)?.icon &&
                (() => {
                  const Icon = chartTypes.find(t => t.id === chartType).icon;
                  return <Icon className="w-4 h-4" />;
                })()
              }
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="
                    absolute top-full right-0 mt-2 w-40
                    bg-gray-900/95 backdrop-blur-xl
                    border border-white/[0.1] rounded-xl
                    overflow-hidden shadow-2xl z-50
                  "
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {chartTypes.map((option) => (
                    <button
                      key={option.id}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5
                        text-sm text-left
                        transition-colors duration-150
                        ${chartType === option.id
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                        }
                      `}
                      onClick={() => {
                        setChartType(option.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <motion.button
            className="
              p-2 rounded-lg
              bg-white/[0.05] hover:bg-white/[0.1]
              border border-white/[0.08]
              text-gray-400 hover:text-white
              transition-all duration-200
            "
            onClick={onExpand}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            className="
              p-2 rounded-lg
              bg-white/[0.05] hover:bg-white/[0.1]
              border border-white/[0.08]
              text-gray-400 hover:text-white
              transition-all duration-200
            "
            onClick={onDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="px-2 pb-6" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default DynamicChartWidget;
