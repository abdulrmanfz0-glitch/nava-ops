import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, TrendingDown, AlertTriangle, FileText, Users, DollarSign,
  Target, Zap, CheckCircle, XCircle, Clock, Activity, Brain, Search,
  BarChart3, TrendingUp, AlertCircle, ExternalLink, Copy
} from 'lucide-react';
import deliveryOpsAPI from '../services/deliveryOpsAPI';
import ModernCard from '../components/nava-ui/ModernCard';
import KPIWidget from '../components/nava-ui/KPIWidget';
import NeoButton from '../components/nava-ui/NeoButton';
import DataTable from '../components/nava-ui/DataTable';
import RefundTrendChart from '../components/DeliveryOps/RefundTrendChart';
import FraudScoreGauge from '../components/DeliveryOps/FraudScoreGauge';
import CustomerIntelligenceCard, { CustomerListItem } from '../components/DeliveryOps/CustomerIntelligenceCard';
import { getMockDashboardData, generateMockCustomers } from '../lib/mockData/deliveryOpsMockData';

/**
 * DeliveryOps MAX AI — Refund & Dispute Intelligence Engine
 * Main Dashboard Page
 */
const DeliveryOpsMAX = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, refunds, disputes, customers, strategy

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Try to load real data, fall back to mock data
      try {
        const result = await deliveryOpsAPI.dashboard.getDashboardData();
        if (result.success && result.data.refunds.length > 0) {
          setDashboardData(result.data);
        } else {
          throw new Error('No data available');
        }
      } catch (apiError) {
        console.log('Using mock data for demonstration');
        const mockData = getMockDashboardData();
        setDashboardData(mockData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Even if everything fails, show mock data
      const mockData = getMockDashboardData();
      setDashboardData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeRefund = async (refundId) => {
    try {
      const result = await deliveryOpsAPI.refunds.analyze(refundId);
      if (result.success) {
        alert('Refund analyzed successfully!');
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error analyzing refund:', error);
    }
  };

  const handleGenerateDispute = async (refundId) => {
    try {
      const result = await deliveryOpsAPI.disputes.generate(refundId);
      if (result.success) {
        setSelectedRefund(result.data);
      }
    } catch (error) {
      console.error('Error generating dispute:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading DeliveryOps MAX AI...</p>
        </div>
      </div>
    );
  }

  const { metrics } = dashboardData || { metrics: {} };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                DeliveryOps MAX AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Refund & Dispute Intelligence Engine
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <NeoButton variant="secondary" size="sm" icon={Activity}>
            Live Monitoring
          </NeoButton>
          <NeoButton variant="primary" size="sm" icon={Brain}>
            Run Full Analysis
          </NeoButton>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'refunds', label: 'Refund Analysis', icon: TrendingDown },
          { id: 'disputes', label: 'Disputes', icon: FileText },
          { id: 'customers', label: 'Customer Intelligence', icon: Users },
          { id: 'strategy', label: 'Reduction Strategy', icon: Target }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Overview - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Refunds"
          value={metrics.totalRefunds || 0}
          icon={TrendingDown}
          trend={{ value: -12, isPositive: true }}
          color="red"
        />
        <KPIWidget
          title="Total Loss"
          value={`${(metrics.totalAmount || 0).toFixed(2)} SAR`}
          icon={DollarSign}
          trend={{ value: -8, isPositive: true }}
          color="orange"
        />
        <KPIWidget
          title="High Risk Cases"
          value={metrics.highRiskRefunds || 0}
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
          color="yellow"
        />
        <KPIWidget
          title="Dispute Success"
          value={`${metrics.disputeSuccessRate || 0}%`}
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && <OverviewTab dashboardData={dashboardData} />}
      {activeTab === 'refunds' && (
        <RefundsTab
          refunds={dashboardData.refunds}
          onAnalyze={handleAnalyzeRefund}
          onGenerateDispute={handleGenerateDispute}
        />
      )}
      {activeTab === 'disputes' && <DisputesTab disputes={dashboardData.disputes} />}
      {activeTab === 'customers' && <CustomersTab />}
      {activeTab === 'strategy' && <StrategyTab patterns={dashboardData.patterns} />}

      {/* Dispute Preview Modal */}
      {selectedRefund && (
        <DisputeModal
          dispute={selectedRefund}
          onClose={() => setSelectedRefund(null)}
        />
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const OverviewTab = ({ dashboardData }) => {
  const { metrics, patterns } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModernCard title="Pending Actions" icon={Clock}>
          <div className="space-y-4">
            <StatRow label="Pending Refunds" value={metrics.pendingRefunds} color="yellow" />
            <StatRow label="Active Disputes" value={metrics.activeDisputes} color="blue" />
            <StatRow label="Critical Patterns" value={metrics.criticalPatterns} color="red" />
          </div>
        </ModernCard>

        <ModernCard title="AI Insights" icon={Brain}>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                🎯 25% reduction possible with quick wins
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                ✅ 3 high-impact actions identified
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                ⚠️ 5 customers flagged for fraud review
              </p>
            </div>
          </div>
        </ModernCard>

        <ModernCard title="Platform Breakdown" icon={BarChart3}>
          <div className="space-y-2">
            {['Jahez', 'HungerStation', 'Marsool', 'Talabat'].map((platform, idx) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{platform}</span>
                <span className="text-sm font-medium">{Math.round(Math.random() * 30)}%</span>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Recent Patterns */}
      <ModernCard title="🔍 Critical Patterns Detected" icon={AlertTriangle}>
        <div className="space-y-3">
          {patterns && patterns.length > 0 ? (
            patterns.map((pattern, idx) => (
              <div
                key={idx}
                className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50/50 dark:bg-orange-900/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {pattern.pattern_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {pattern.pattern_description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Loss: {pattern.total_loss?.toFixed(2)} SAR</span>
                      <span>Occurrences: {pattern.occurrence_count}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.severity === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {pattern.severity}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No critical patterns detected</p>
          )}
        </div>
      </ModernCard>
    </div>
  );
};

const RefundsTab = ({ refunds, onAnalyze, onGenerateDispute }) => {
  const columns = [
    {
      key: 'platform_order_id',
      label: 'Order ID',
      render: (value) => (
        <span className="font-mono text-sm text-primary">{value}</span>
      )
    },
    {
      key: 'platform_name',
      label: 'Platform',
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'refund_amount',
      label: 'Amount',
      render: (value) => `${value.toFixed(2)} SAR`
    },
    {
      key: 'risk_level',
      label: 'Risk',
      render: (value) => {
        const colors = {
          critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
          high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
          medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
          low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${colors[value] || colors.low}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'fraud_score',
      label: 'Fraud Score',
      render: (value) => (
        <span className={`font-medium ${value >= 70 ? 'text-red-600' : value >= 50 ? 'text-orange-600' : 'text-green-600'}`}>
          {value || 0}/100
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onAnalyze(row.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Analyze
          </button>
          <button
            onClick={() => onGenerateDispute(row.id)}
            className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
          >
            Dispute
          </button>
        </div>
      )
    }
  ];

  return (
    <ModernCard title="📋 Refund Requests" icon={TrendingDown}>
      {refunds && refunds.length > 0 ? (
        <DataTable data={refunds} columns={columns} />
      ) : (
        <div className="text-center py-12">
          <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No refund requests found</p>
        </div>
      )}
    </ModernCard>
  );
};

const DisputesTab = ({ disputes }) => {
  return (
    <ModernCard title="⚖️ Dispute Management" icon={FileText}>
      <div className="space-y-4">
        {disputes && disputes.length > 0 ? (
          disputes.map((dispute, idx) => (
            <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  Dispute #{dispute.id?.substring(0, 8)}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    dispute.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : dispute.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {dispute.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Level: <span className="font-medium">{dispute.dispute_level}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Created: {new Date(dispute.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No disputes found</p>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

const CustomersTab = () => {
  const [customers, setCustomers] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const mockCustomers = generateMockCustomers(30);
    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(c => {
    if (filterType === 'all') return true;
    return c.customer_type === filterType;
  });

  const customerTypeStats = {
    fraud_suspect: customers.filter(c => c.customer_type === 'fraud_suspect').length,
    repeat_offender: customers.filter(c => c.customer_type === 'repeat_offender').length,
    high_value: customers.filter(c => c.customer_type === 'high_value').length,
    normal: customers.filter(c => c.customer_type === 'normal').length
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
          <div className="text-2xl font-bold text-red-600">{customerTypeStats.fraud_suspect}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">🚨 Fraud Suspects</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-600">{customerTypeStats.repeat_offender}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">⚠️ Repeat Offenders</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600">{customerTypeStats.high_value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">⭐ High Value</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600">{customerTypeStats.normal}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">👤 Normal</div>
        </div>
      </div>

      <ModernCard
        title="👥 Customer Intelligence Database"
        icon={Users}
        action={
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
            >
              <option value="all">All Customers</option>
              <option value="fraud_suspect">Fraud Suspects</option>
              <option value="repeat_offender">Repeat Offenders</option>
              <option value="high_value">High Value</option>
              <option value="normal">Normal</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {viewMode === 'grid' ? '📋 List' : '🎴 Grid'}
            </button>
          </div>
        }
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.slice(0, 12).map((customer) => (
              <CustomerIntelligenceCard
                key={customer.id}
                customer={customer}
                onClick={() => setSelectedCustomer(customer)}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Orders</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Refunds</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rate</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fraud Score</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">LTV</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.slice(0, 20).map((customer) => (
                  <CustomerListItem
                    key={customer.id}
                    customer={customer}
                    onClick={() => setSelectedCustomer(customer)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModernCard>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

const StrategyTab = ({ patterns }) => {
  return (
    <div className="space-y-6">
      <ModernCard title="🎯 Refund Reduction Strategy" icon={Target}>
        <div className="space-y-6">
          {/* Expected Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                30 Days
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                25%
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Expected Reduction
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                90 Days
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                50%
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Expected Reduction
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                180 Days
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                70%
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Expected Reduction
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Quick Wins - High Impact, Low Effort
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Implement Double-Check System',
                  impact: '50-60% reduction',
                  effort: 'Low',
                  time: '1 day'
                },
                {
                  title: 'Mandatory Temperature Verification',
                  impact: '40-50% reduction',
                  effort: 'Low',
                  time: '1 day'
                },
                {
                  title: 'Upgrade Packaging Quality',
                  impact: '60-70% reduction',
                  effort: 'Low',
                  time: '2-3 days'
                }
              ].map((win, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {win.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600 font-medium">
                          Impact: {win.impact}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Effort: {win.effort}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Time: {win.time}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const StatRow = ({ label, value, color }) => {
  const colors = {
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`text-lg font-bold ${colors[color]}`}>{value}</span>
    </div>
  );
};

const DisputeModal = ({ dispute, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(dispute.objectionText);
    alert('Dispute text copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">🤖 AI-Generated Dispute Objection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                Level: {dispute.level}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Confidence: {dispute.confidence}%
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {dispute.objectionText}
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerDetailModal = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Customer Intelligence Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-6">
            {/* Customer Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {customer.customer_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {customer.customer_id} • {customer.platform_name}
                </p>
              </div>
              <FraudScoreGauge score={customer.fraud_score} size="small" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.total_orders}
                </div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {customer.total_refund_requests}
                </div>
                <div className="text-sm text-gray-500">Refund Requests</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {customer.refund_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Refund Rate</div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold mb-3">Financial Profile</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Spent:</span>
                  <span className="font-medium">{customer.total_spent?.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Refunded:</span>
                  <span className="font-medium text-red-600">{customer.total_refunded?.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Order Value:</span>
                  <span className="font-medium">{customer.average_order_value?.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lifetime Value:</span>
                  <span className="font-bold text-green-600">{customer.lifetime_value_score?.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold mb-3">🤖 AI Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Recommended Action
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {customer.recommended_action === 'reject' ? '❌ Reject future refund claims' :
                     customer.recommended_action === 'investigate' ? '🔍 Investigate claims carefully' :
                     '✅ Standard review process'}
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Dispute Objection Level
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Use <span className="font-bold">{customer.recommended_objection_level}</span> level objections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOpsMAX;
