// src/pages/Dashboard.jsx - SaaS Multi-Branch Analytics Dashboard
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  TrendingUp, TrendingDown, Activity, BarChart3, Users,
  Building2, Award, Zap, Brain, Target, AlertTriangle,
  Sparkles, ArrowUpRight, ArrowDownRight, Crown, Clock,
  Download, RefreshCw, MapPin, Star, Package

// NAVA OPS - Enterprise Dashboard
// Professional SaaS Analytics Dashboard with real-time insights

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import logger from '@/lib/logger';
import PageHeader from '@/components/UI/PageHeader';
import StatCard, { StatCardSkeleton } from '@/components/UI/StatCard';
import { RevenueTrendChart, OrdersBarChart, BranchComparisonChart } from '@/components/UI/Charts';
import DateRangePicker from '@/components/UI/DateRangePicker';
import EmptyState from '@/components/UI/EmptyState';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Store,
  AlertCircle,
  Users,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Zap
 
} from 'lucide-react';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { dataEntries, branches, getStatistics, getBranchStatistics } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [animatedValues, setAnimatedValues] = useState({
    totalSold: 0,
    activeEntries: 0,
    avgRating: 0,
    avgPopularity: 0
  });

  const stats = getStatistics();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Utility functions
  const formatNumber = (num) => (num || 0).toLocaleString();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Animate counter values
  useEffect(() => {
    const targets = {
      totalSold: stats.totalSold,
      activeEntries: stats.activeEntries,
      avgRating: stats.avgRating,
      avgPopularity: stats.avgPopularity
    };

    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);

      setAnimatedValues({
        totalSold: Math.floor(targets.totalSold * easeOutQuad),
        activeEntries: Math.floor(targets.activeEntries * easeOutQuad),
        avgRating: targets.avgRating * easeOutQuad,
        avgPopularity: targets.avgPopularity * easeOutQuad
      });

      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stats]);

  // Top performing entries
  const topEntries = useMemo(() => {
    return dataEntries
      .filter(entry => selectedBranch === 'all' || entry.branchId === parseInt(selectedBranch))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [dataEntries, selectedBranch]);

  // Branch performance
  const branchPerformance = useMemo(() => {
    return branches.map(branch => {
      const branchStats = getBranchStatistics(branch.id);
      return {
        ...branch,
        ...branchStats,
        growth: (Math.random() * 30 - 5).toFixed(1)
      };
    }).sort((a, b) => b.performanceScore - a.performanceScore);
  }, [branches, dataEntries]);

  // Category distribution
  const categoryDistribution = useMemo(() => {
    const cats = {};
    const filteredEntries = selectedBranch === 'all'
      ? dataEntries
      : dataEntries.filter(e => e.branchId === parseInt(selectedBranch));

    filteredEntries.forEach(entry => {
      if (!cats[entry.category]) {
        cats[entry.category] = { count: 0, sold: 0 };
      }
      cats[entry.category].count += 1;
      cats[entry.category].sold += entry.sold;
    });

    const total = Object.values(cats).reduce((sum, cat) => sum + cat.sold, 0);

    return Object.entries(cats)
      .map(([name, data]) => ({
        name,
        ...data,
        percentage: total > 0 ? ((data.sold / total) * 100).toFixed(1) : 0,
        change: (Math.random() * 40 - 10).toFixed(1)
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);
  }, [dataEntries, selectedBranch]);

  // AI Insights
  const aiInsights = useMemo(() => {
    const insights = [];

    // Top performer
    const topEntry = topEntries[0];
    if (topEntry) {
      insights.push({
        type: 'success',
        icon: Sparkles,
        title: `Top Performer: ${topEntry.name}`,
        description: `Leading with ${topEntry.sold} units. ${topEntry.rating.toFixed(1)}★ rating and ${topEntry.popularity}% popularity score.`,
        action: 'Analyze success factors and replicate across other products'
      });
    }

    // Low performers
    const lowPerformers = dataEntries.filter(entry => {
      const avgSold = stats.totalSold / dataEntries.length;
      return entry.sold < avgSold * 0.3;
    });

    if (lowPerformers.length > 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `${lowPerformers.length} Items Need Attention`,
        description: `Entries performing below 30% of average. Review and optimize or consider discontinuation.`,
        action: 'Conduct performance review and implement improvement strategies'
      });
    }

    // Branch performance
    const topBranch = branchPerformance[0];
    if (topBranch) {
      insights.push({
        type: 'info',
        icon: Building2,
        title: `Best Branch: ${topBranch.name}`,
        description: `${topBranch.performanceScore}% performance score with ${topBranch.totalEntries} active entries and ${parseFloat(topBranch.growth) > 0 ? '+' : ''}${topBranch.growth}% growth.`,
        action: 'Share best practices with other branches'
      });
    }

    // Category insight
    const topCategory = categoryDistribution[0];
    if (topCategory) {
      insights.push({
        type: 'prediction',
        icon: Brain,
        title: `Category Leader: ${topCategory.name}`,
        description: `Accounts for ${topCategory.percentage}% of total activity with ${topCategory.count} entries.`,
        action: 'Expand offerings in this category to maximize growth'
      });
    }

    return insights;
  }, [topEntries, dataEntries, stats, branchPerformance, categoryDistribution]);

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon size={24} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
            parseFloat(trend) > 0
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {parseFloat(trend) > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {parseFloat(trend) > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success': return 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'info': return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'prediction': return 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-l-4 border-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SaaS Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 dark:from-blue-950 dark:via-purple-950 dark:to-blue-950 rounded-lg shadow-2xl border border-blue-800 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
              <Activity size={36} className="animate-pulse text-blue-300" />
              NAVA Operations Analytics
            </h1>
            <p className="text-blue-200 text-sm flex items-center gap-2">
              <Clock size={14} className="animate-pulse" />
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-blue-200 mb-1">Welcome back,</div>
            <div className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Crown size={24} className="text-amber-400" />
              {userProfile?.full_name || 'Admin'}
            </div>
            <div className="flex gap-2 mt-3">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-lg text-white text-sm"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-lg hover:bg-blue-700 transition text-sm">
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg text-sm">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Target size={22} className="text-slate-600 dark:text-slate-400" />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Transactions"
            value={formatNumber(animatedValues.totalSold)}
            icon={Activity}
            color="emerald"
            trend="12.4"
          />
          <MetricCard
            title="Active Entries"
            value={formatNumber(animatedValues.activeEntries)}
            icon={Package}
            color="blue"
            trend="8.7"
          />
          <MetricCard
            title="Average Rating"
            value={animatedValues.avgRating.toFixed(1) + '★'}
            icon={Star}
            color="amber"
            trend="4.2"
          />
          <MetricCard
            title="Popularity Index"
            value={Math.round(animatedValues.avgPopularity) + '%'}
            icon={Zap}
            color="purple"
            trend="6.8"
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Brain size={24} className="text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Insights</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Strategic recommendations from your data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className={`${getInsightStyle(insight.type)} rounded-lg p-5 transition-all hover:shadow-md`}>
                <div className="flex items-start gap-3">
                  <Icon size={20} className={
                    insight.type === 'success' ? 'text-emerald-600 dark:text-emerald-500' :
                    insight.type === 'warning' ? 'text-amber-600 dark:text-amber-500' :
                    insight.type === 'info' ? 'text-blue-600 dark:text-blue-500' :
                    'text-purple-600 dark:text-purple-500'
                  } />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">{insight.title}</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="bg-white dark:bg-slate-800/50 rounded px-3 py-2 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span className="text-purple-600 dark:text-purple-500">→</span> {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Branch Performance & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Performance */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Building2 size={20} className="text-slate-600 dark:text-slate-400" />
            Branch Performance Overview
          </h3>

          <div className="space-y-4">
            {branchPerformance.map((branch, index) => (
              <div key={branch.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-amber-100 dark:bg-amber-900/30' :
                      index === 1 ? 'bg-slate-200 dark:bg-slate-700' :
                      'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      <span className="text-lg font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white block">{branch.name}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />
                        {branch.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Score: {branch.performanceScore}%
                    </span>
                    <span className={`text-xs font-bold ${
                      parseFloat(branch.growth) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {parseFloat(branch.growth) > 0 ? <ArrowUpRight className="inline" size={10} /> : <ArrowDownRight className="inline" size={10} />}
                      {parseFloat(branch.growth) > 0 ? '+' : ''}{branch.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      branch.performanceScore >= 90 ? 'bg-emerald-500' :
                      branch.performanceScore >= 80 ? 'bg-blue-500' :
                      branch.performanceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${branch.performanceScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-amber-600 dark:text-amber-500" />
            Top Performers
          </h3>

          <div className="space-y-3">
            {topEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:shadow-md transition-all">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                  index === 1 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400' :
                  index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{entry.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{entry.sold} transactions</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{entry.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
=======
  const { addNotification } = useNotification();

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [insights, setInsights] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);

  // Date range (default: last 30 days)
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  // Calculate days between dates
  const getDaysBetween = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = getDaysBetween(dateRange.startDate, dateRange.endDate);

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      // Fetch all data in parallel
      const [overviewData, trendsData, branchesData, insightsData, branchCompData] = await Promise.all([
        api.analytics.getDashboardOverview(selectedBranch, days),
        api.analytics.getRevenueTrends(selectedBranch, days),
        api.branches.getAll(),
        api.insights.getAll({ limit: 5, status: 'new' }),
        api.analytics.getBranchComparison(days)
      ]);

      setOverview(overviewData.overview);
      setRevenueTrends(trendsData);
      setBranches(branchesData);
      setInsights(insightsData);
      setBranchComparison(branchCompData);

      if (!showLoader) {
        addNotification({
          title: 'Success',
          message: 'Dashboard refreshed successfully',
          type: 'success'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to load dashboard data',
        type: 'error'
      });
      logger.error('Dashboard error', { error: error.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [selectedBranch, dateRange]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  // Handle branch selection
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value || null);
  };

  // Handle date range change
  const handleDateRangeChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${userProfile?.full_name || 'User'}! Here's your business overview.`}
        icon={BarChart3}
        actions={
          <>
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={handleDateRangeChange}
            />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                       text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </>
        }
      />

      {/* Branch Filter */}
      <div className="flex items-center gap-4">
        <select
          value={selectedBranch || ''}
          onChange={handleBranchChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} {branch.code ? `(${branch.code})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`SAR ${overview?.totalRevenue?.toLocaleString() || 0}`}
              subtitle={`Last ${days} days`}
              icon={DollarSign}
              color="green"
              trend="up"
              trendValue="+12.5%"
            />
            <StatCard
              title="Total Orders"
              value={overview?.totalOrders?.toLocaleString() || 0}
              subtitle={`Last ${days} days`}
              icon={ShoppingCart}
              color="blue"
              trend="up"
              trendValue="+8.3%"
            />
            <StatCard
              title="Active Branches"
              value={`${overview?.activeBranches || 0} / ${overview?.totalBranches || 0}`}
              subtitle="Branch locations"
              icon={Store}
              color="purple"
              trend="neutral"
              trendValue="Stable"
            />
            <StatCard
              title="Avg Order Value"
              value={`SAR ${overview?.averageOrderValue?.toFixed(2) || 0}`}
              subtitle="Per transaction"
              icon={TrendingUp}
              color="orange"
              trend="up"
              trendValue="+4.2%"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <RevenueTrendChart data={revenueTrends} loading={loading} />
        </div>

        {/* Branch Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Branch Performance
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Compare All
            </button>
          </div>
          <BranchComparisonChart data={branchComparison.slice(0, 5)} loading={loading} />
        </div>
      </div>

      {/* Insights and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI Insights & Recommendations
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {insights.length} new
              </span>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : insights.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="No Insights Yet"
                message="AI insights will appear here as your data grows."
              />
            ) : (
              <div className="space-y-4">
                {insights.slice(0, 5).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg
                             hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg
                        ${insight.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : ''}
                        ${insight.severity === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' : ''}
                        ${insight.severity === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : ''}
                      `}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {insight.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {insight.insight_type}
                          </span>
                          {insight.confidence_score && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(insight.confidence_score * 100).toFixed(0)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600
                               hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
                               transition-all duration-200 transform hover:scale-105">
                <Download className="w-5 h-5" />
                <span className="font-medium">Generate Report</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700
                               hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg
                               transition-colors duration-200">
                <Store className="w-5 h-5" />
                <span className="font-medium">Add Branch</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700
                               hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg
                               transition-colors duration-200">
                <Users className="w-5 h-5" />
                <span className="font-medium">Invite Team Member</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Sync</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">● Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">● Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
              </div>
            </div>
 
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 size={22} className="text-slate-600 dark:text-slate-400" />
          Category Distribution Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryDistribution.map((cat) => (
            <div key={cat.name} className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-5 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  parseFloat(cat.change) > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  parseFloat(cat.change) > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {parseFloat(cat.change) > 0 ? '+' : ''}{cat.change}%
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Entries</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{cat.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Transactions</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-500">{formatNumber(cat.sold)}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                  {cat.percentage}% of total activity
                </div>
              </div>
            </div>
          ))}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New order received', branch: 'Downtown Branch', time: '2 minutes ago', icon: ShoppingCart, color: 'blue' },
              { action: 'Monthly report generated', branch: 'All Branches', time: '1 hour ago', icon: Download, color: 'green' },
              { action: 'Inventory alert', branch: 'Westside Branch', time: '3 hours ago', icon: AlertCircle, color: 'orange' },
              { action: 'Team member joined', branch: 'System', time: '5 hours ago', icon: Users, color: 'purple' }
            ].map((activity, index) => {
              const colorClasses = {
                blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400' },
                green: { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400' },
                orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400' },
                purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400' }
              };
              const colors = colorClasses[activity.color] || colorClasses.blue;

              return (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <activity.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.branch}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              );
            })}
          </div>
 
        </div>
      </div>
    </div>
  );
}
