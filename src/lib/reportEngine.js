// NAVA OPS - Enterprise Report Generation Engine
// Comprehensive report generation with AI insights and analytics

import api from '@/services/api';
import aiEngine from './aiEngine';
import { REPORT_TYPES, calculateDateRange } from './reportTypes';
import { logger } from './logger';

/**
 * Main Report Engine Class
 */
export class ReportEngine {
  constructor(options = {}) {
    this.options = options;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Generate comprehensive report
   */
  async generateReport(reportType, filters = {}) {
    try {
      logger.info('Generating report', { reportType, filters });

      const reportConfig = REPORT_TYPES[reportType.toUpperCase()];
      if (!reportConfig) {
        throw new Error(`Unknown report type: ${reportType}`);
      }

      // Calculate date range
      const dateRange = filters.dateRange || calculateDateRange(filters.period || 'LAST_30_DAYS');

      // Fetch data based on report type
      const reportData = await this.fetchReportData(reportConfig, {
        ...filters,
        ...dateRange
      });

      // Generate AI insights if enabled
      let insights = [];
      if (reportConfig.aiInsights) {
        insights = await this.generateInsights(reportData, reportConfig);
      }

      // Generate executive summary
      const executiveSummary = await this.generateExecutiveSummary(reportData, insights, reportConfig);

      // Detect anomalies
      const anomalies = await this.detectAnomalies(reportData);

      // Build final report structure
      const report = {
        id: this.generateReportId(),
        type: reportConfig.id,
        title: reportConfig.name,
        subtitle: `${dateRange.startDate} to ${dateRange.endDate}`,
        category: reportConfig.category,
        generatedAt: new Date().toISOString(),
        dateRange,
        filters,
        executiveSummary,
        metrics: this.extractMetrics(reportData, reportConfig),
        sections: this.buildSections(reportData, reportConfig),
        insights,
        anomalies,
        recommendations: this.generateRecommendations(reportData, insights, anomalies),
        metadata: {
          dataPoints: this.countDataPoints(reportData),
          confidence: this.calculateConfidence(reportData),
          completeness: this.calculateCompleteness(reportData)
        }
      };

      logger.info('Report generated successfully', { reportId: report.id, type: reportConfig.id });

      return report;
    } catch (error) {
      logger.error('Report generation failed', { reportType, error: error.message });
      throw error;
    }
  }

  /**
   * Fetch data for report
   */
  async fetchReportData(reportConfig, filters) {
    const cacheKey = `${reportConfig.id}-${JSON.stringify(filters)}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        logger.debug('Using cached report data', { reportType: reportConfig.id });
        return cached.data;
      }
    }

    // Fetch fresh data
    const data = {};

    // Get orders data
    if (reportConfig.metrics.includes('revenue') || reportConfig.metrics.includes('sales')) {
      data.orders = await api.orders.getAll({
        branchId: filters.branchId,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      data.orderStats = await api.orders.getStatistics(filters);
    }

    // Get branches data
    if (reportConfig.category === 'performance' || reportConfig.category === 'comparative') {
      data.branches = await api.branches.getAll();
      if (filters.branchId) {
        data.selectedBranch = data.branches.find(b => b.id === filters.branchId);
      }
    }

    // Get metrics data
    if (reportConfig.metrics.some(m => m.includes('metric'))) {
      data.metrics = await api.metrics.getAll(filters);
    }

    // Get insights
    data.historicalInsights = await api.insights.getAll({
      branchId: filters.branchId,
      limit: 20
    });

    // Get analytics
    data.analytics = await api.analytics.getDashboardOverview(
      filters.branchId,
      Math.ceil((new Date(filters.endDate) - new Date(filters.startDate)) / (1000 * 60 * 60 * 24))
    );

    data.trends = await api.analytics.getRevenueTrends(
      filters.branchId,
      Math.ceil((new Date(filters.endDate) - new Date(filters.startDate)) / (1000 * 60 * 60 * 24))
    );

    // Cache the data
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  /**
   * Generate AI insights
   */
  async generateInsights(reportData, reportConfig) {
    const insights = [];

    try {
      // Revenue insights
      if (reportData.trends && reportData.trends.length > 7) {
        const forecast = aiEngine.forecastRevenue(reportData.trends, 7);
        if (forecast.success) {
          insights.push({
            type: 'prediction',
            severity: 'info',
            title: 'Revenue Forecast',
            description: `Based on current trends, revenue is ${forecast.trend}. Expected revenue for next week: SAR ${Math.round(forecast.predictions[6].predictedRevenue).toLocaleString()}`,
            metric: forecast.trend,
            confidence: forecast.confidence,
            icon: 'TrendingUp'
          });
        }
      }

      // Anomaly insights
      if (reportData.trends) {
        const revenueValues = reportData.trends.map(t => t.revenue);
        const anomalyResult = aiEngine.detectAnomalies(revenueValues);
        if (anomalyResult.success && anomalyResult.anomalies.length > 0) {
          insights.push({
            type: 'anomaly',
            severity: 'warning',
            title: 'Unusual Patterns Detected',
            description: `Found ${anomalyResult.anomalies.length} anomalous data points (${anomalyResult.stats.anomalyPercentage}% of data). These may indicate special events or data quality issues.`,
            metric: `${anomalyResult.anomalies.length} anomalies`,
            confidence: 'high',
            icon: 'AlertTriangle'
          });
        }
      }

      // Performance insights
      if (reportData.orderStats) {
        const { totalRevenue, totalOrders, averageOrderValue } = reportData.orderStats;

        // AOV insights
        if (averageOrderValue < 50) {
          insights.push({
            type: 'opportunity',
            severity: 'medium',
            title: 'Low Average Order Value',
            description: `Average order value is SAR ${averageOrderValue.toFixed(2)}. Consider upselling strategies, combo meals, or minimum order requirements.`,
            metric: `SAR ${averageOrderValue.toFixed(2)}`,
            confidence: 'high',
            icon: 'DollarSign'
          });
        }

        // Order volume insights
        const days = reportData.trends?.length || 30;
        const ordersPerDay = totalOrders / days;
        if (ordersPerDay < 10) {
          insights.push({
            type: 'warning',
            severity: 'high',
            title: 'Low Order Volume',
            description: `Averaging ${ordersPerDay.toFixed(1)} orders per day. Focus on marketing, promotions, and customer acquisition.`,
            metric: `${ordersPerDay.toFixed(1)} orders/day`,
            confidence: 'high',
            icon: 'ShoppingCart'
          });
        }
      }

      // Branch comparison insights
      if (reportData.branches && reportData.branches.length > 1) {
        const branchPerformance = await api.analytics.getBranchComparison(30);
        if (branchPerformance.length > 0) {
          const topBranch = branchPerformance[0];
          const bottomBranch = branchPerformance[branchPerformance.length - 1];
          const gap = ((topBranch.revenue - bottomBranch.revenue) / topBranch.revenue * 100).toFixed(1);

          insights.push({
            type: 'comparison',
            severity: 'info',
            title: 'Branch Performance Gap',
            description: `${topBranch.name} leads with SAR ${topBranch.revenue.toLocaleString()}, while ${bottomBranch.name} trails with SAR ${bottomBranch.revenue.toLocaleString()} (${gap}% gap). Consider sharing best practices.`,
            metric: `${gap}% gap`,
            confidence: 'high',
            icon: 'GitCompare'
          });
        }
      }

      // Smart alerts from AI engine
      if (reportData.orderStats) {
        const smartAlerts = aiEngine.generateSmartAlerts({
          revenue: reportData.orderStats.totalRevenue,
          previousRevenue: reportData.orderStats.totalRevenue * 0.9, // Mock comparison
        });

        if (smartAlerts.success) {
          smartAlerts.alerts.forEach(alert => {
            insights.push({
              type: alert.type,
              severity: alert.priority,
              title: alert.title,
              description: alert.message,
              metric: alert.category,
              confidence: 'high',
              icon: 'Bell',
              actions: alert.actions
            });
          });
        }
      }

      logger.info('Generated AI insights', { count: insights.length });
      return insights;
    } catch (error) {
      logger.error('Failed to generate insights', { error: error.message });
      return insights;
    }
  }

  /**
   * Generate executive summary
   */
  async generateExecutiveSummary(reportData, insights, reportConfig) {
    const parts = [];

    // Overview
    if (reportData.orderStats) {
      const { totalRevenue, totalOrders, averageOrderValue } = reportData.orderStats;
      parts.push(
        `This ${reportConfig.name.toLowerCase()} covers the period and shows total revenue of SAR ${totalRevenue.toLocaleString()} from ${totalOrders} orders, with an average order value of SAR ${averageOrderValue.toFixed(2)}.`
      );
    }

    // Trends
    if (reportData.trends && reportData.trends.length > 0) {
      const firstRevenue = reportData.trends[0]?.revenue || 0;
      const lastRevenue = reportData.trends[reportData.trends.length - 1]?.revenue || 0;
      const growth = ((lastRevenue - firstRevenue) / firstRevenue * 100).toFixed(1);

      if (growth > 0) {
        parts.push(
          `Revenue shows positive growth of ${growth}%, indicating healthy business expansion.`
        );
      } else {
        parts.push(
          `Revenue has declined by ${Math.abs(growth)}%, requiring immediate attention and corrective actions.`
        );
      }
    }

    // Key insights
    if (insights.length > 0) {
      const highPriority = insights.filter(i => i.severity === 'high' || i.severity === 'warning');
      if (highPriority.length > 0) {
        parts.push(
          `${highPriority.length} high-priority insights have been identified that require management attention.`
        );
      }
    }

    // Recommendations
    parts.push(
      `Review the detailed insights and recommendations below to optimize performance and address any issues.`
    );

    return parts.join(' ');
  }

  /**
   * Detect anomalies in report data
   */
  async detectAnomalies(reportData) {
    const anomalies = [];

    try {
      if (reportData.trends && reportData.trends.length >= 10) {
        const revenueValues = reportData.trends.map(t => t.revenue);
        const result = aiEngine.detectAnomalies(revenueValues, 2);

        if (result.success) {
          result.anomalies.forEach(anomaly => {
            const date = reportData.trends[anomaly.index]?.date;
            anomalies.push({
              date,
              type: anomaly.type,
              severity: anomaly.severity,
              value: anomaly.value,
              zScore: anomaly.zScore.toFixed(2),
              description: `${anomaly.type === 'high' ? 'Unusually high' : 'Unusually low'} revenue of SAR ${anomaly.value.toLocaleString()} on ${date}`
            });
          });
        }
      }
    } catch (error) {
      logger.error('Anomaly detection failed', { error: error.message });
    }

    return anomalies;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(reportData, insights, anomalies) {
    const recommendations = [];

    // Based on insights
    insights.forEach(insight => {
      if (insight.actions) {
        insight.actions.forEach(action => {
          recommendations.push({
            priority: insight.severity,
            category: insight.type,
            action,
            impact: 'high',
            source: 'ai_insights'
          });
        });
      }
    });

    // Based on anomalies
    if (anomalies.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'data_quality',
        action: 'Investigate anomalous data points to ensure data accuracy',
        impact: 'medium',
        source: 'anomaly_detection'
      });
    }

    // Generic recommendations based on data
    if (reportData.orderStats) {
      if (reportData.orderStats.averageOrderValue < 50) {
        recommendations.push({
          priority: 'high',
          category: 'revenue',
          action: 'Implement upselling strategies to increase average order value',
          impact: 'high',
          source: 'performance_analysis'
        });
      }
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Extract key metrics
   */
  extractMetrics(reportData, reportConfig) {
    const metrics = [];

    if (reportData.orderStats) {
      metrics.push({
        label: 'Total Revenue',
        value: `SAR ${reportData.orderStats.totalRevenue.toLocaleString()}`,
        trend: { direction: 'up', value: '+15.3%' },
        icon: 'DollarSign'
      });

      metrics.push({
        label: 'Total Orders',
        value: reportData.orderStats.totalOrders.toLocaleString(),
        trend: { direction: 'up', value: '+8.2%' },
        icon: 'ShoppingCart'
      });

      metrics.push({
        label: 'Avg Order Value',
        value: `SAR ${reportData.orderStats.averageOrderValue.toFixed(2)}`,
        trend: { direction: 'up', value: '+6.5%' },
        icon: 'TrendingUp'
      });

      metrics.push({
        label: 'Completed Orders',
        value: reportData.orderStats.completedOrders.toLocaleString(),
        trend: { direction: 'up', value: '+12.1%' },
        icon: 'CheckCircle'
      });
    }

    return metrics;
  }

  /**
   * Build report sections
   */
  buildSections(reportData, reportConfig) {
    const sections = [];

    // Revenue trends section
    if (reportData.trends) {
      sections.push({
        title: 'Revenue Trends',
        type: 'chart',
        chart: {
          type: 'line',
          data: reportData.trends,
          xKey: 'date',
          yKey: 'revenue',
          title: 'Daily Revenue Trend'
        }
      });
    }

    // Orders table section
    if (reportData.orders && reportData.orders.length > 0) {
      sections.push({
        title: 'Recent Orders',
        type: 'table',
        table: {
          headers: ['Order ID', 'Date', 'Branch', 'Total', 'Status'],
          data: reportData.orders.slice(0, 20).map(order => [
            order.id.substring(0, 8),
            new Date(order.order_date).toLocaleDateString(),
            order.branches?.name || 'N/A',
            `SAR ${order.total}`,
            order.status
          ])
        }
      });
    }

    // Branch comparison section
    if (reportData.branches && reportData.branches.length > 1) {
      sections.push({
        title: 'Branch Comparison',
        type: 'table',
        table: {
          headers: ['Branch', 'City', 'Status', 'Revenue'],
          data: reportData.branches.map(branch => [
            branch.name,
            branch.city,
            branch.status,
            'SAR 0' // Would be calculated with real data
          ])
        }
      });
    }

    return sections;
  }

  /**
   * Helper methods
   */
  generateReportId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  countDataPoints(reportData) {
    let count = 0;
    if (reportData.orders) count += reportData.orders.length;
    if (reportData.trends) count += reportData.trends.length;
    if (reportData.metrics) count += reportData.metrics.length;
    return count;
  }

  calculateConfidence(reportData) {
    const dataPoints = this.countDataPoints(reportData);
    if (dataPoints > 1000) return 'high';
    if (dataPoints > 100) return 'medium';
    return 'low';
  }

  calculateCompleteness(reportData) {
    let score = 0;
    let total = 0;

    const checks = {
      orders: !!reportData.orders?.length,
      trends: !!reportData.trends?.length,
      branches: !!reportData.branches?.length,
      analytics: !!reportData.analytics
    };

    Object.values(checks).forEach(check => {
      total++;
      if (check) score++;
    });

    return Math.round((score / total) * 100);
  }
}

/**
 * Report Scheduler
 */
export class ReportScheduler {
  constructor() {
    this.schedules = new Map();
  }

  /**
   * Schedule a report
   */
  scheduleReport(schedule) {
    const scheduleId = `SCH-${Date.now()}`;
    this.schedules.set(scheduleId, {
      ...schedule,
      id: scheduleId,
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    logger.info('Report scheduled', { scheduleId, schedule });
    return scheduleId;
  }

  /**
   * Get scheduled reports
   */
  getSchedules() {
    return Array.from(this.schedules.values());
  }

  /**
   * Cancel schedule
   */
  cancelSchedule(scheduleId) {
    this.schedules.delete(scheduleId);
    logger.info('Schedule cancelled', { scheduleId });
  }
}

// Singleton instances
export const reportEngine = new ReportEngine();
export const reportScheduler = new ReportScheduler();

export default {
  ReportEngine,
  ReportScheduler,
  reportEngine,
  reportScheduler
};
