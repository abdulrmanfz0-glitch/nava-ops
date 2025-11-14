// NAVA OPS - Metric Widget
// Wrapper for StatCardV2 with data fetching and real-time updates

import React, { useState, useEffect } from 'react';
import BaseWidget from '../Widget/BaseWidget';
import StatCardV2 from '../StatCardV2';
import { useDashboard } from '../../../contexts/DashboardContext';
import api from '../../../services/api';
import logger from '../../../lib/logger';

export default function MetricWidget({
  widgetId,
  config = {},
  onRemove,
  onConfigure,
  dragHandleProps
}) {
  const { dateRange, selectedBranch } = useDashboard();
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [sparklineData, setSparklineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    metric = 'revenue',
    format = 'number',
    showTrend = true,
    showSparkline = true,
    color = 'blue'
  } = config;

  // Fetch metric data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate days between dates
      const days = getDaysBetween(dateRange.startDate, dateRange.endDate);

      // Fetch current period data
      const overview = await api.analytics.getDashboardOverview(selectedBranch, days);

      // Fetch previous period data for comparison
      const previousEnd = new Date(dateRange.startDate);
      previousEnd.setDate(previousEnd.getDate() - 1);
      const previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - days);

      const previousOverview = await api.analytics.getDashboardOverview(
        selectedBranch,
        days,
        previousStart.toISOString().split('T')[0],
        previousEnd.toISOString().split('T')[0]
      );

      // Fetch sparkline data (last 30 days)
      const trends = await api.analytics.getRevenueTrends(selectedBranch, 30);

      // Extract metric values
      const currentValue = extractMetricValue(overview.overview, metric);
      const previousValue = extractMetricValue(previousOverview.overview, metric);
      const sparkline = extractSparklineData(trends, metric);

      setData(currentValue);
      setPreviousData(previousValue);
      setSparklineData(sparkline);
    } catch (err) {
      logger.error('Failed to fetch metric data', { metric, error: err.message });
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh on dependencies change
  useEffect(() => {
    fetchData();
  }, [metric, dateRange, selectedBranch]);

  // Get metric metadata
  const metricMeta = getMetricMetadata(metric);

  return (
    <BaseWidget
      id={widgetId}
      title={metricMeta.title}
      subtitle={metricMeta.subtitle}
      icon={metricMeta.icon}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      onRemove={onRemove}
      onConfigure={onConfigure}
      dragHandleProps={dragHandleProps}
      size="small"
      variant="flat"
    >
      <StatCardV2
        title={metricMeta.title}
        value={data}
        previousValue={previousData}
        subtitle={metricMeta.subtitle}
        icon={metricMeta.icon}
        color={color}
        format={format}
        sparklineData={showSparkline ? sparklineData : []}
        showTrend={showTrend}
        showSparkline={showSparkline}
      />
    </BaseWidget>
  );
}

// Helper: Calculate days between dates
function getDaysBetween(start, end) {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Extract metric value from overview data
function extractMetricValue(overview, metric) {
  if (!overview) return 0;

  const metricMap = {
    revenue: overview.totalRevenue || 0,
    orders: overview.totalOrders || 0,
    activeBranches: overview.activeBranches || 0,
    totalBranches: overview.totalBranches || 0,
    averageOrderValue: overview.averageOrderValue || 0,
    activeCustomers: overview.activeCustomers || 0
  };

  return metricMap[metric] || 0;
}

// Helper: Extract sparkline data from trends
function extractSparklineData(trends, metric) {
  if (!trends || !Array.isArray(trends)) return [];

  return trends.slice(-30).map(item => {
    switch (metric) {
      case 'revenue':
        return item.revenue || 0;
      case 'orders':
        return item.orders || 0;
      case 'averageOrderValue':
        return item.averageOrderValue || item.revenue / (item.orders || 1);
      default:
        return item.revenue || 0;
    }
  });
}

// Helper: Get metric metadata
function getMetricMetadata(metric) {
  const metadata = {
    revenue: {
      title: 'Total Revenue',
      subtitle: 'Sales performance',
      icon: null // Will be set from widget registry
    },
    orders: {
      title: 'Total Orders',
      subtitle: 'Order volume',
      icon: null
    },
    activeBranches: {
      title: 'Active Branches',
      subtitle: 'Operational locations',
      icon: null
    },
    averageOrderValue: {
      title: 'Avg Order Value',
      subtitle: 'Per transaction',
      icon: null
    },
    activeCustomers: {
      title: 'Active Customers',
      subtitle: 'Customer base',
      icon: null
    }
  };

  return metadata[metric] || metadata.revenue;
}
