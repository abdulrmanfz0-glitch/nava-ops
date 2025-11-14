import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, Award, Zap, Target, TrendingDown, Users, Truck, Building } from 'lucide-react';
import {
  analyzeRevenueGrowth,
  analyzeCostOptimization,
  analyzeCommissionImpact,
  generateProfitabilityRecommendations,
  generateExecutiveSummary
} from '@/lib/aiIntelligence/professionalInsights';

/**
 * Professional Report Component
 * AI-powered insights on revenue growth, cost optimization, and commission impact
 */
const ProfessionalReport = ({ reportData, isLoading }) => {
  const [revenueInsights, setRevenueInsights] = useState([]);
  const [costInsights, setCostInsights] = useState([]);
  const [commissionInsights, setCommissionInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (reportData && !isLoading) {
      generateAnalytics();
    }
  }, [reportData, isLoading]);

  const generateAnalytics = async () => {
    try {
      const revenue = analyzeRevenueGrowth(reportData);
      const costs = analyzeCostOptimization(reportData);
      const commission = analyzeCommissionImpact(reportData);
      const recs = generateProfitabilityRecommendations(reportData);
      const summary = generateExecutiveSummary(reportData);

      setRevenueInsights(revenue);
      setCostInsights(costs);
      setCommissionInsights(commission);
      setRecommendations(recs);
      setExecutiveSummary(summary);
    } catch (error) {
      console.error('Error generating professional report analytics:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Generating AI-powered insights...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available for report</div>
      </div>
    );
  }

  const { orderStats = {}, trends = [] } = reportData;
  const { totalRevenue = 0, totalOrders = 0, averageOrderValue = 0 } = orderStats;

  // Chart data preparation
  const revenueChartData = trends.slice(-30).map(t => ({
    date: t.date?.split('-')[2] || '',
    revenue: Math.round(t.revenue / 1000)
  }));

  const costDistributionData = [
    { name: 'COGS', value: totalRevenue * 0.28, fill: '#f87171' },
    { name: 'Labor', value: totalRevenue * 0.25, fill: '#fbbf24' },
    { name: 'Overhead', value: totalRevenue * 0.15, fill: '#a78bfa' },
    { name: 'Profit', value: totalRevenue * 0.32, fill: '#34d399' }
  ];

  const commissionImpactData = [
    { name: 'Dine-in', orders: Math.round(totalOrders * 0.4), revenue: Math.round(totalRevenue * 0.4), commission: 0 },
    { name: 'Takeout', orders: Math.round(totalOrders * 0.25), revenue: Math.round(totalRevenue * 0.25), commission: 0 },
    { name: 'Online', orders: Math.round(totalOrders * 0.35), revenue: Math.round(totalRevenue * 0.35), commission: Math.round(totalRevenue * 0.35 * 0.25) }
  ];

  const getInsightIcon = (type) => {
    const icons = {
      growth_analysis: <TrendingUp className="w-5 h-5" />,
      revenue_volatility: <AlertTriangle className="w-5 h-5" />,
      growth_opportunity: <Zap className="w-5 h-5" />,
      cost_per_order: <DollarSign className="w-5 h-5" />,
      labor_efficiency: <Users className="w-5 h-5" />,
      overhead_analysis: <Building className="w-5 h-5" />,
      savings_opportunity: <TrendingDown className="w-5 h-5" />,
      delivery_commission: <Truck className="w-5 h-5" />,
      net_revenue_impact: <Award className="w-5 h-5" />,
      channel_profitability: <Target className="w-5 h-5" />,
      commission_efficiency: <Award className="w-5 h-5" />
    };
    return icons[type] || <AlertTriangle className="w-5 h-5" />;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200',
      medium: 'bg-yellow-50 border-yellow-200',
      warning: 'bg-orange-50 border-orange-200',
      high: 'bg-red-50 border-red-200'
    };
    return colors[severity] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Report</h1>
        <p className="text-gray-600 mb-4">AI-Powered Insights: Revenue Growth • Cost Optimization • Commission Impact</p>

        {/* Executive Summary Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-emerald-900 mb-2">Executive Summary</h2>
          <p className="text-emerald-800">{executiveSummary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">SAR {Math.round(totalRevenue).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-600 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-emerald-900">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-purple-900">SAR {averageOrderValue.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">Est. Net Margin</p>
            <p className="text-2xl font-bold text-orange-900">{((totalRevenue * 0.32) / totalRevenue * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['overview', 'revenue', 'costs', 'commission', 'recommendations'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Trend Chart */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Revenue (SAR 000s)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `SAR ${value}K`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={costDistributionData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${((entry.value / totalRevenue) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {costDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `SAR ${Math.round(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Revenue & Commission</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={commissionImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (SAR)" />
                  <Bar dataKey="commission" fill="#ef4444" name="Commission (SAR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Growth Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          {revenueInsights.length > 0 ? (
            revenueInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-blue-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No revenue insights available</div>
          )}
        </div>
      )}

      {/* Cost Optimization Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-4">
          {costInsights.length > 0 ? (
            costInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-amber-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-amber-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No cost insights available</div>
          )}
        </div>
      )}

      {/* Commission Impact Tab */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          {commissionInsights.length > 0 ? (
            commissionInsights.map((insight, idx) => (
              <div key={idx} className={`border-l-4 border-rose-500 ${getSeverityColor(insight.severity)} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-rose-600">{getInsightIcon(insight.type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">Confidence: {insight.confidence}</span>
                </div>
                {insight.recommendation && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No commission insights available</div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <div key={idx} className={`border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} p-4 rounded-r-lg border border-gray-200`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${rec.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.action}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">{rec.timeframe}</p>
                    <p className="text-xs text-gray-500">{rec.effort}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                  <strong>Impact:</strong> {rec.impact}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No recommendations available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalReport;
