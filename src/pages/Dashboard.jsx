// src/pages/Dashboard.jsx - Restaurant Analytics Dashboard
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import AIAssistant, { AIAssistantButton } from '../components/AIAssistant/AIAssistant';
import {
  TrendingUp, TrendingDown, Activity, BarChart3,
  Award, Zap, Brain, Target, AlertTriangle,
  Sparkles, ArrowUpRight, ArrowDownRight, Crown, Clock,
  Download, RefreshCw, Star, DollarSign, ShoppingCart, Package
} from 'lucide-react';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { menuItems, getStatistics } = useMenu();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalSold: 0,
    totalRevenue: 0,
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
    const avgPopularity = menuItems.length > 0
      ? menuItems.reduce((sum, item) => sum + item.popularity, 0) / menuItems.length
      : 0;

    const targets = {
      totalSold: stats.totalSold,
      totalRevenue: stats.totalRevenue,
      avgRating: stats.avgRating,
      avgPopularity: avgPopularity
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
        totalRevenue: Math.floor(targets.totalRevenue * easeOutQuad),
        avgRating: targets.avgRating * easeOutQuad,
        avgPopularity: targets.avgPopularity * easeOutQuad
      });

      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stats, menuItems]);

  // Top performing menu items by sold
  const topEntries = useMemo(() => {
    return menuItems
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);
  }, [menuItems]);


  // Category distribution based on sold items
  const categoryDistribution = useMemo(() => {
    const cats = {};

    menuItems.forEach(item => {
      if (!cats[item.category]) {
        cats[item.category] = { count: 0, sold: 0, revenue: 0 };
      }
      cats[item.category].count += 1;
      cats[item.category].sold += item.sold || 0;
      cats[item.category].revenue += (item.price * item.sold) || 0;
    });

    const totalSold = Object.values(cats).reduce((sum, cat) => sum + cat.sold, 0);

    return Object.entries(cats)
      .map(([name, data]) => ({
        name,
        ...data,
        percentage: totalSold > 0 ? ((data.sold / totalSold) * 100).toFixed(1) : 0,
        change: (Math.random() * 40 - 10).toFixed(1)
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);
  }, [menuItems]);

  // AI Insights based on restaurant metrics
  const aiInsights = useMemo(() => {
    const insights = [];

    // Top performer by sales
    const topEntry = topEntries[0];
    if (topEntry) {
      const revenue = topEntry.price * topEntry.sold;
      insights.push({
        type: 'success',
        icon: Sparkles,
        title: `Top Seller: ${topEntry.name}`,
        description: `Leading with ${topEntry.sold} units sold. ${topEntry.rating.toFixed(1)}★ rating and SAR ${revenue.toFixed(0)} revenue generated.`,
        action: 'Analyze success factors and promote similar items'
      });
    }

    // Low performers
    const avgSold = menuItems.length > 0 ? stats.totalSold / menuItems.length : 0;
    const lowPerformers = menuItems.filter(item => (item.sold || 0) < avgSold * 0.3);

    if (lowPerformers.length > 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `${lowPerformers.length} Items Need Attention`,
        description: `Menu items performing below 30% of average sales. Review pricing, quality, or consider menu optimization.`,
        action: 'Conduct performance review and implement improvement strategies'
      });
    }

    // Profit analysis
    if (stats.profitMargin < 40) {
      insights.push({
        type: 'warning',
        icon: DollarSign,
        title: `Profit Margin Alert`,
        description: `Current profit margin is ${stats.profitMargin.toFixed(1)}%. Industry standard is 40-60%. Review costs and pricing strategy.`,
        action: 'Optimize ingredient costs or adjust menu pricing'
      });
    } else {
      insights.push({
        type: 'success',
        icon: DollarSign,
        title: `Healthy Profit Margin`,
        description: `Excellent profit margin of ${stats.profitMargin.toFixed(1)}%. Your pricing strategy is working well.`,
        action: 'Maintain current strategy and monitor market trends'
      });
    }

    // Category insight
    const topCategory = categoryDistribution[0];
    if (topCategory) {
      insights.push({
        type: 'prediction',
        icon: Brain,
        title: `Category Leader: ${topCategory.name}`,
        description: `Accounts for ${topCategory.percentage}% of total sales with ${topCategory.count} items. Revenue: SAR ${topCategory.revenue.toFixed(0)}.`,
        action: 'Expand offerings in this category to maximize growth'
      });
    }

    return insights;
  }, [topEntries, menuItems, stats, categoryDistribution]);

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
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 dark:from-blue-950 dark:via-purple-950 dark:to-blue-950 rounded-lg shadow-2xl border border-blue-800 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
              <Activity size={36} className="animate-pulse text-blue-300" />
              Restaurant Analytics Dashboard
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
            title="Total Revenue (SAR)"
            value={formatNumber(animatedValues.totalRevenue)}
            icon={DollarSign}
            color="emerald"
            trend="12.4"
          />
          <MetricCard
            title="Total Profit (SAR)"
            value={formatNumber(stats.totalProfit)}
            icon={TrendingUp}
            color="blue"
            trend="8.7"
          />
          <MetricCard
            title="Items Sold"
            value={formatNumber(animatedValues.totalSold)}
            icon={ShoppingCart}
            color="purple"
            trend="15.2"
          />
          <MetricCard
            title="Average Rating"
            value={animatedValues.avgRating.toFixed(1) + '★'}
            icon={Star}
            color="amber"
            trend="4.2"
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

      {/* Top Selling Items */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Award size={20} className="text-amber-600 dark:text-amber-500" />
          Top Selling Menu Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topEntries.map((entry, index) => (
            <div key={entry.id} className="relative bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 hover:shadow-lg transition-all border border-slate-200 dark:border-slate-600">
              <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-4 ring-amber-500/30' :
                index === 1 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400 ring-4 ring-slate-500/30' :
                index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-4 ring-orange-500/30' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                #{index + 1}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{entry.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{entry.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ShoppingCart size={12} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{entry.sold} sold</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{entry.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-500">SAR {(entry.price * entry.sold).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-600 dark:text-slate-400">Popularity:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-500">{entry.popularity}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 size={22} className="text-slate-600 dark:text-slate-400" />
          Category Performance Analysis
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
                  <span className="text-sm text-slate-600 dark:text-slate-400">Menu Items</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{cat.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Items Sold</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-500">{formatNumber(cat.sold)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Revenue</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-500">SAR {formatNumber(cat.revenue)}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                  {cat.percentage}% of total sales
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      {!isAIAssistantOpen && (
        <AIAssistantButton onClick={() => setIsAIAssistantOpen(true)} />
      )}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
}
