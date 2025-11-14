// src/pages/MenuPerformance.jsx - Menu Intelligence
import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Activity, AlertTriangle, Award, Target, Filter, Download,
  BarChart3, PieChart, Brain, Zap, RefreshCw, Package, Clock, Database,
  Sparkles, ArrowUpRight, ArrowDownRight, Star, DollarSign, ShoppingCart
} from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';

export default function MenuPerformance() {
  const { menuItems: contextMenuItems, categories: contextCategories } = useMenu();
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [viewMode, setViewMode] = useState('grid');
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    profit: 0,
    sold: 0,
    rating: 0
  });

  // Utility function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Utility function to format currency (SAR)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Enhanced data with analytics - calculated from context
  const menuItems = useMemo(() => contextMenuItems.map(item => {
    // Calculate financial metrics
    const revenue = (item.price || 0) * (item.sold || 0);
    const totalCost = (item.cost || 0) * (item.sold || 0);
    const profit = revenue - totalCost;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // Calculate trend based on popularity and sales
    const trendValue = (item.popularity || 0) >= 90 ? 15 :
                       (item.popularity || 0) >= 80 ? 10 :
                       (item.popularity || 0) >= 70 ? 5 :
                       (item.popularity || 0) >= 60 ? 0 : -5;
    const trend = trendValue >= 0 ? `+${trendValue}%` : `${trendValue}%`;

    // Determine prediction based on popularity and trend
    const prediction = trendValue > 10 ? 'rising' :
                       trendValue < 0 ? 'declining' : 'stable';

    // Activity level based on sold count
    const activityLevel = (item.sold || 0) > 100 ? 'high' :
                          (item.sold || 0) > 50 ? 'medium' : 'low';

    return {
      ...item,
      revenue,
      totalCost,
      profit,
      profitMargin,
      trend,
      trendValue,
      prediction,
      activityLevel,
      image: item.image || '🍽️'
    };
  }), [contextMenuItems]);

  // BCG Matrix classification (Restaurant Menu Analytics)
  const classifyItem = (item) => {
    const avgRevenue = menuItems.reduce((sum, i) => sum + (i.revenue || 0), 0) / menuItems.length;
    const avgProfit = menuItems.reduce((sum, i) => sum + (i.profit || 0), 0) / menuItems.length;

    const highRevenue = (item.revenue || 0) > avgRevenue;
    const highProfit = (item.profit || 0) > avgProfit;

    if (highRevenue && highProfit) return {
      type: 'star',
      label: 'Star Item',
      color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30',
      icon: '⭐',
      borderColor: 'border-emerald-500',
      description: 'High revenue & high profit - Keep promoting this dish'
    };
    if (highRevenue && !highProfit) return {
      type: 'workhorse',
      label: 'Cash Cow',
      color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30',
      icon: '💰',
      borderColor: 'border-amber-500',
      description: 'High revenue but lower profit - Consider cost optimization'
    };
    if (!highRevenue && highProfit) return {
      type: 'puzzle',
      label: 'Hidden Gem',
      color: 'text-blue-700 bg-blue-100 dark:bg-blue-900/30',
      icon: '💎',
      borderColor: 'border-blue-500',
      description: 'High profit margin but lower sales - Boost marketing'
    };
    return {
      type: 'dog',
      label: 'Needs Review',
      color: 'text-red-700 bg-red-100 dark:bg-red-900/30',
      icon: '⚠️',
      borderColor: 'border-red-500',
      description: 'Low revenue & low profit - Consider menu changes'
    };
  };

  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    if (filterCategory !== 'all') {
      items = items.filter(item => item.category === filterCategory);
    }

    items.sort((a, b) => {
      if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
      if (sortBy === 'profit') return (b.profit || 0) - (a.profit || 0);
      if (sortBy === 'sold') return (b.sold || 0) - (a.sold || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'trend') return b.trendValue - a.trendValue;
      return 0;
    });

    return items;
  }, [menuItems, filterCategory, sortBy]);

  const totalRevenue = menuItems.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalProfit = menuItems.reduce((sum, item) => sum + (item.profit || 0), 0);
  const totalSold = menuItems.reduce((sum, item) => sum + (item.sold || 0), 0);
  const avgRating = menuItems.length > 0 ? (menuItems.reduce((sum, item) => sum + (item.rating || 0), 0) / menuItems.length) : 0;
  const overallProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Category performance
  const categoryPerformance = useMemo(() => {
    const cats = {};
    menuItems.forEach(item => {
      if (!cats[item.category]) {
        cats[item.category] = { revenue: 0, profit: 0, items: 0, sold: 0 };
      }
      cats[item.category].revenue += item.revenue || 0;
      cats[item.category].profit += item.profit || 0;
      cats[item.category].sold += item.sold || 0;
      cats[item.category].items += 1;
    });
    return Object.entries(cats)
      .map(([name, data]) => ({
        name,
        ...data,
        avgRevenue: data.revenue / data.items,
        avgProfit: data.profit / data.items,
        profitMargin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [menuItems]);

  // Dynamic AI Insights based on real data
  const aiInsights = useMemo(() => {
    const insights = [];

    // Find top revenue generator
    const topItem = [...menuItems].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0];
    if (topItem) {
      insights.push({
        type: 'success',
        icon: Sparkles,
        title: `Top Revenue: ${topItem.name}`,
        description: `Leading with ${formatCurrency(topItem.revenue)} revenue from ${(topItem.sold || 0)} units sold. ${(topItem.rating || 0).toFixed(1)}★ customer rating with ${topItem.profitMargin.toFixed(1)}% profit margin.`,
        action: 'Feature this dish prominently and maintain quality standards',
        priority: 'high'
      });
    }

    // Find declining items
    const decliningItems = menuItems.filter(item => item.prediction === 'declining');
    if (decliningItems.length > 0) {
      const worstItem = decliningItems[0];
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `Attention Needed: ${worstItem.name}`,
        description: `Sales declining with only ${(worstItem.sold || 0)} units sold at ${formatCurrency(worstItem.price)}. Consider recipe refresh or promotional pricing.`,
        action: 'Review menu item and consider improvements or removal',
        priority: 'medium'
      });
    }

    // Find rising stars
    const risingItems = menuItems.filter(item => item.prediction === 'rising');
    if (risingItems.length > 0) {
      insights.push({
        type: 'prediction',
        icon: TrendingUp,
        title: `Rising Stars Detected (${risingItems.length})`,
        description: risingItems.slice(0, 3).map(i => i.name).join(', ') + ' showing strong upward sales trends.',
        action: 'Increase promotion and ensure consistent availability',
        priority: 'high'
      });
    }

    // Category insight
    const topCategory = categoryPerformance[0];
    if (topCategory) {
      const categoryShare = ((topCategory.revenue / totalRevenue) * 100).toFixed(1);
      insights.push({
        type: 'info',
        icon: Brain,
        title: 'Category Performance',
        description: `${topCategory.name} leads with ${categoryShare}% of total revenue (${formatCurrency(topCategory.revenue)} from ${topCategory.sold} items sold).`,
        action: 'Maintain focus on high-performing categories',
        priority: 'medium'
      });
    }

    return insights;
  }, [menuItems, categoryPerformance, totalRevenue]);

  // Animate counter values
  useEffect(() => {
    const targets = {
      revenue: totalRevenue,
      profit: totalProfit,
      sold: totalSold,
      rating: avgRating
    };

    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);

      setAnimatedValues({
        revenue: Math.floor(targets.revenue * easeOutQuad),
        profit: Math.floor(targets.profit * easeOutQuad),
        sold: Math.floor(targets.sold * easeOutQuad),
        rating: (targets.rating * easeOutQuad)
      });

      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalRevenue, totalProfit, totalSold, avgRating]);

  const getPredictionBadge = (prediction) => {
    switch (prediction) {
      case 'rising':
        return <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center gap-1">
          <ArrowUpRight size={12} /> Rising
        </span>;
      case 'declining':
        return <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full flex items-center gap-1">
          <ArrowDownRight size={12} /> Declining
        </span>;
      default:
        return <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400 rounded-full">
          Stable
        </span>;
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 dark:text-red-500';
      case 'optimal': return 'text-emerald-600 dark:text-emerald-500';
      case 'high': return 'text-amber-600 dark:text-amber-500';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success': return 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'info': return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'prediction': return 'border-l-4 border-slate-500 bg-slate-50 dark:bg-slate-800/50';
      default: return 'border-l-4 border-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Classic Header - Navy Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-lg shadow-lg border border-slate-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Menu Intelligence
            </h1>
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <Activity size={14} className="animate-pulse" />
              AI-powered insights to optimize menu performance & profitability
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600 transition">
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Classic KPI Cards - Slate Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp size={14} />
              +12%
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(animatedValues.revenue)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Target size={24} className="text-blue-600 dark:text-blue-500" />
            </div>
            <div className="text-blue-600 dark:text-blue-500 text-sm font-medium">
              {overallProfitMargin.toFixed(1)}%
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Profit</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(animatedValues.profit)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <ShoppingCart size={24} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              {menuItems.length} items
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Items Sold</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {animatedValues.sold.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Star size={24} className="text-amber-600 dark:text-amber-500" />
            </div>
            <div className="text-amber-600 dark:text-amber-500 text-sm font-medium">
              Excellent
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Average Rating</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {animatedValues.rating.toFixed(1)} ⭐
          </p>
        </div>
      </div>

      {/* AI Insights - Classic Theme */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <Brain size={20} className="text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
              AI-Powered Insights
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Strategic recommendations from your menu analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`${getInsightStyle(insight.type)} rounded-lg p-5 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={20} className={
                    insight.type === 'success' ? 'text-emerald-600 dark:text-emerald-500' :
                    insight.type === 'warning' ? 'text-amber-600 dark:text-amber-500' :
                    insight.type === 'info' ? 'text-blue-600 dark:text-blue-500' :
                    'text-slate-600 dark:text-slate-400'
                  } />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">{insight.title}</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="bg-white dark:bg-slate-800/50 rounded px-3 py-2 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span className="text-amber-600 dark:text-amber-500">→</span> {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance - Classic Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
          <BarChart3 size={22} className="text-slate-600 dark:text-slate-400" />
          Category Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryPerformance.map((cat, index) => (
            <div key={cat.name} className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-5 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">{cat.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Revenue</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-500">{formatCurrency(cat.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Profit</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-500">{formatCurrency(cat.profit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Profit Margin</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-500">{cat.profitMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Items Sold</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(cat.sold)}</span>
                </div>

                {/* Amber Progress Bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000"
                    style={{ width: `${(cat.revenue / totalRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                  {((cat.revenue / totalRevenue) * 100).toFixed(1)}% of total revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Controls - Classic Styling */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter & Sort:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all hover:border-amber-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all hover:border-amber-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="profit">Sort by Profit</option>
            <option value="sold">Sort by Items Sold</option>
            <option value="rating">Sort by Rating</option>
            <option value="trend">Sort by Growth Trend</option>
          </select>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                viewMode === 'grid'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Data Items Grid - Classic Cards */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {filteredItems.map((item, index) => {
          const classification = classifyItem(item);
          const isTrending = item.trend.startsWith('+');

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border-l-4 ${classification.borderColor} border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all`}
            >
              <div className="p-6">
                {/* Header with Image/Icon and Classification */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.image && item.image.startsWith('http') ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-600" />
                    ) : (
                      <div className="text-4xl">{item.image}</div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {item.name}
                        {index < 3 && (
                          <span className="text-base">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${classification.color}`}>
                      {classification.icon} {classification.label}
                    </div>
                    {getPredictionBadge(item.prediction)}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(item.price || 0)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sold</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatNumber(item.sold || 0)}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mb-1">Revenue</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(item.revenue || 0)}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">Profit ({item.profitMargin.toFixed(1)}%)</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatCurrency(item.profit || 0)}</p>
                  </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500" />
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{(item.rating || 0).toFixed(1)}</span>
                  </div>

                  <div className={`flex items-center gap-1 font-semibold text-sm ${isTrending ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isTrending ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {item.trend}
                  </div>

                  <div className="flex items-center gap-1">
                    <Activity size={14} className="text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium capitalize">{item.activityLevel}</span>
                  </div>
                </div>

                {/* Classification Description */}
                <div className="mt-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <span className="font-medium text-amber-600 dark:text-amber-500">💡 Strategy:</span> {classification.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Database size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Menu Items Found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or add new menu items to get started.
          </p>
        </div>
      )}
    </div>
  );
}
