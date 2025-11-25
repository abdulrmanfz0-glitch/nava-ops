import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, TrendingDown, AlertTriangle, FileText, Users, DollarSign,
  Target, Zap, CheckCircle, XCircle, Clock, Activity, Brain, Search,
  BarChart3, TrendingUp, AlertCircle
} from 'lucide-react';
import deliveryOpsAPI from '../services/deliveryOpsAPI';
import ModernCard from '../components/nava-ui/ModernCard';
import KPIWidget from '../components/nava-ui/KPIWidget';
import NeoButton from '../components/nava-ui/NeoButton';
import DataTable from '../components/nava-ui/DataTable';

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
      const result = await deliveryOpsAPI.dashboard.getDashboardData();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
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
  return (
    <ModernCard title="👥 Customer Intelligence" icon={Users}>
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">🧠 AI Customer Profiling</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fraud Suspects</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">28</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Repeat Offenders</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Value</div>
            </div>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Customer analysis tools coming soon...</p>
        </div>
      </div>
    </ModernCard>
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
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {dispute.objectionText}
          </div>
          <div className="mt-6 flex space-x-3">
            <NeoButton variant="primary" fullWidth>
              Copy to Clipboard
            </NeoButton>
            <NeoButton variant="secondary" fullWidth>
              Submit to Platform
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOpsMAX;
