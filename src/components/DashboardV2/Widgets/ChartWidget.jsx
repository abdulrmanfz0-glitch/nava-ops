// NAVA OPS - Chart Widget
// Wrapper for chart components with data fetching

import React, { useState, useEffect } from 'react';
import BaseWidget from '../Widget/BaseWidget';
import { RevenueTrendChart, OrdersBarChart } from '../../UI/Charts';
import { BarChart3 } from 'lucide-react';
import { useDashboard } from '../../../contexts/DashboardContext';
import api from '../../../services/api';
import logger from '../../../lib/logger';

export default function ChartWidget({
  widgetId,
  config = {},
  onRemove,
  onConfigure,
  dragHandleProps
}) {
  const { dateRange, selectedBranch } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    chartType = 'line',
    metric = 'revenue',
    period = 'last_30_days'
  } = config;

  // Fetch chart data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = getDaysBetween(dateRange.startDate, dateRange.endDate);

      let chartData;
      if (metric === 'revenue') {
        chartData = await api.analytics.getRevenueTrends(selectedBranch, days);
      } else if (metric === 'orders') {
        chartData = await api.analytics.getRevenueTrends(selectedBranch, days);
      } else {
        chartData = await api.analytics.getRevenueTrends(selectedBranch, days);
      }

      setData(chartData || []);
    } catch (err) {
      logger.error('Failed to fetch chart data', { metric, error: err.message });
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [metric, chartType, dateRange, selectedBranch]);

  // Get title based on metric
  const getTitle = () => {
    if (metric === 'revenue') return 'Revenue Trend';
    if (metric === 'orders') return 'Orders Chart';
    return 'Performance Chart';
  };

  return (
    <BaseWidget
      id={widgetId}
      title={getTitle()}
      subtitle="Over time"
      icon={BarChart3}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      onRemove={onRemove}
      onConfigure={onConfigure}
      dragHandleProps={dragHandleProps}
      size="default"
    >
      {chartType === 'line' && metric === 'revenue' && (
        <RevenueTrendChart data={data} loading={loading} error={error} />
      )}
      {chartType === 'bar' && metric === 'orders' && (
        <OrdersBarChart data={data} loading={loading} error={error} />
      )}
      {chartType === 'line' && metric === 'orders' && (
        <OrdersBarChart data={data} loading={loading} error={error} />
      )}
    </BaseWidget>
  );
}

// Helper
function getDaysBetween(start, end) {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
