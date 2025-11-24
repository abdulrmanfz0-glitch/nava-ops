import React, { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Target,
  Plus,
  BarChart3,
  PieChart,
  Share2,
  Settings,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  Users,
  Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  exportToCSV,
  exportToPDF,
  exportToJSON,
  exportToExcel,
  formatMoney,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime
} from '../utils/exportUtils';
import { supabase } from '../lib/supabase';

const ReportHub = () => {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useNotification();
  const { entries, categories, branches } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [customReportBlocks, setCustomReportBlocks] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch platform data from Supabase
  useEffect(() => {
    fetchPlatformData();
  }, [selectedDateRange]);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPlatformData(data);
        generateReportData(data);
      }
    } catch (error) {
      console.error('Error fetching platform data:', error);
      showError('Error', 'Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (data) => {
    // Calculate aggregated metrics
    const totalGMV = data.reduce((sum, p) => sum + (p.gmv || 0), 0);
    const totalOrders = data.reduce((sum, p) => sum + (p.orders || 0), 0);
    const totalCommission = data.reduce((sum, p) => sum + (p.commission || 0), 0);
    const totalProfit = data.reduce((sum, p) => sum + (p.netProfit || 0), 0);
    const avgRating = data.length > 0
      ? data.reduce((sum, p) => sum + (p.customerRating || 0), 0) / data.length
      : 0;

    setReportData({
      summary: {
        totalGMV,
        totalOrders,
        totalCommission,
        totalProfit,
        avgRating,
        platformCount: data.length
      },
      platforms: data,
      generatedAt: new Date().toISOString()
    });
  };

  // Filter data based on selected filters
  const getFilteredData = () => {
    if (!reportData) return [];

    return reportData.platforms.filter(platform => {
      const matchesBranch = selectedBranch === 'all' || platform.branch === selectedBranch;
      const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
      const matchesPlatform = selectedPlatform === 'all' || platform.platform === selectedPlatform;
      const matchesSearch = searchQuery === '' ||
        platform.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesBranch && matchesCategory && matchesPlatform && matchesSearch;
    });
  };

  // Export handlers
  const handleExportPDF = () => {
    const filteredData = getFilteredData();
    exportToPDF('report-hub-content', `report-hub-${formatDate(new Date())}.pdf`, {
      title: 'Report Hub Export',
      data: filteredData
    });
    showSuccess('Success', 'Report exported as PDF');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const filteredData = getFilteredData();
    exportToExcel(filteredData, `report-hub-${formatDate(new Date())}.xlsx`);
    showSuccess('Success', 'Report exported as Excel');
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    const filteredData = getFilteredData();
    exportToCSV(filteredData, `report-hub-${formatDate(new Date())}.csv`);
    showSuccess('Success', 'Report exported as CSV');
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const filteredData = getFilteredData();
    exportToJSON(filteredData, `report-hub-${formatDate(new Date())}.json`);
    showSuccess('Success', 'Report exported as JSON');
    setShowExportMenu(false);
  };

  // Share handler
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Custom report block types
  const blockTypes = [
    { id: 'kpi', name: 'KPI Card', icon: Target },
    { id: 'chart', name: 'Chart', icon: BarChart3 },
    { id: 'table', name: 'Data Table', icon: FileText },
    { id: 'metric', name: 'Metric Comparison', icon: TrendingUp },
    { id: 'insight', name: 'Insights', icon: Activity }
  ];

  const addReportBlock = (blockType) => {
    const newBlock = {
      id: Date.now(),
      type: blockType,
      config: {}
    };
    setCustomReportBlocks([...customReportBlocks, newBlock]);
    showSuccess('Success', `${blockType.charAt(0).toUpperCase() + blockType.slice(1)} block added`);
  };

  const removeReportBlock = (blockId) => {
    setCustomReportBlocks(customReportBlocks.filter(b => b.id !== blockId));
  };

  // Render Dashboard Tab
  const renderDashboard = () => {
    if (!reportData) return <div className="text-center py-8">Loading data...</div>;

    const { summary } = reportData;
    const filteredData = getFilteredData();

    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total GMV"
            value={formatMoney(summary.totalGMV)}
            icon={DollarSign}
            color="green"
            trend="+12.5%"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(summary.totalOrders)}
            icon={Package}
            color="blue"
            trend="+8.3%"
          />
          <StatCard
            title="Net Profit"
            value={formatMoney(summary.totalProfit)}
            icon={TrendingUp}
            color="green"
            trend="+15.7%"
          />
          <StatCard
            title="Avg Rating"
            value={summary.avgRating.toFixed(1)}
            icon={Users}
            color="blue"
            trend="+2.1%"
          />
        </div>

        {/* Platform Performance */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Platform Performance
          </h3>
          <div className="space-y-3">
            {filteredData.slice(0, 5).map((platform, index) => (
              <PlatformPerformanceBar
                key={index}
                platform={platform}
              />
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Reports
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Monthly Performance Report', date: new Date(), status: 'completed' },
              { name: 'Delivery Analytics', date: new Date(Date.now() - 86400000), status: 'completed' },
              { name: 'Platform Comparison', date: new Date(Date.now() - 172800000), status: 'completed' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-400">{formatDate(report.date)}</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Generator Tab
  const renderGenerator = () => {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Custom Report Builder</h3>
          <p className="text-gray-400 mb-6">
            Drag and drop blocks to create your custom report with dynamic KPIs and visualizations.
          </p>

          {/* Block Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {blockTypes.map(block => (
              <button
                key={block.id}
                onClick={() => addReportBlock(block.id)}
                className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg hover:from-green-500/30 hover:to-blue-500/30 transition-all flex flex-col items-center gap-2"
              >
                <block.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{block.name}</span>
              </button>
            ))}
          </div>

          {/* Custom Report Canvas */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 min-h-[400px]">
            {customReportBlocks.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Add blocks to start building your custom report</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customReportBlocks.map(block => (
                  <div key={block.id} className="glass-card p-4 relative group">
                    <button
                      onClick={() => removeReportBlock(block.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                      {blockTypes.find(b => b.id === block.type)?.icon &&
                        React.createElement(blockTypes.find(b => b.id === block.type).icon, { className: "w-5 h-5 text-green-400" })
                      }
                      <h4 className="font-semibold">
                        {blockTypes.find(b => b.id === block.type)?.name}
                      </h4>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Configure your {block.type} block settings here
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {customReportBlocks.length > 0 && (
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Save Template
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Analytics Tab
  const renderAnalytics = () => {
    const filteredData = getFilteredData();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-400" />
              Performance Distribution
            </h3>
            <div className="space-y-3">
              {['Excellent', 'Very Good', 'Good', 'Acceptable'].map((level, index) => {
                const count = filteredData.filter(p => {
                  const score = p.performanceScore || 0;
                  if (level === 'Excellent') return score >= 90;
                  if (level === 'Very Good') return score >= 75 && score < 90;
                  if (level === 'Good') return score >= 60 && score < 75;
                  return score < 60;
                }).length;
                const percentage = filteredData.length > 0 ? (count / filteredData.length) * 100 : 0;
                const colors = ['green', 'blue', 'yellow', 'orange'];

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span>{level}</span>
                      <span className="text-gray-400">{count} platforms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-${colors[index]}-500 h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performers */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {filteredData
                .sort((a, b) => (b.gmv || 0) - (a.gmv || 0))
                .slice(0, 5)
                .map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{platform.platform || 'Unknown'}</p>
                        <p className="text-sm text-gray-400">{formatMoney(platform.gmv || 0)} GMV</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">
                      {formatPercent((platform.performanceScore || 0) / 100)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Detailed Platform Table */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-2">Platform</th>
                  <th className="text-right py-3 px-2">GMV</th>
                  <th className="text-right py-3 px-2">Orders</th>
                  <th className="text-right py-3 px-2">Commission</th>
                  <th className="text-right py-3 px-2">Net Profit</th>
                  <th className="text-right py-3 px-2">Rating</th>
                  <th className="text-right py-3 px-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((platform, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                    <td className="py-3 px-2 font-medium">{platform.platform || 'Unknown'}</td>
                    <td className="text-right py-3 px-2">{formatMoney(platform.gmv || 0)}</td>
                    <td className="text-right py-3 px-2">{formatNumber(platform.orders || 0)}</td>
                    <td className="text-right py-3 px-2">{formatMoney(platform.commission || 0)}</td>
                    <td className="text-right py-3 px-2 text-green-400">{formatMoney(platform.netProfit || 0)}</td>
                    <td className="text-right py-3 px-2">{(platform.customerRating || 0).toFixed(1)}</td>
                    <td className="text-right py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        (platform.performanceScore || 0) >= 90 ? 'bg-green-500/20 text-green-400' :
                        (platform.performanceScore || 0) >= 75 ? 'bg-blue-500/20 text-blue-400' :
                        (platform.performanceScore || 0) >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {(platform.performanceScore || 0).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Report Hub
              </h1>
              <p className="text-gray-400 mt-1">
                Centralized reporting, analytics, and insights for your delivery operations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl z-50">
                    <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-t-lg">
                      Export as PDF
                    </button>
                    <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10">
                      Export as Excel
                    </button>
                    <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10">
                      Export as CSV
                    </button>
                    <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-b-lg">
                      Export as JSON
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="glass-card p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search platforms..."
                      className="input-glass pl-10 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="all">All Branches</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="all">All Platforms</option>
                    {[...new Set(platformData.map(p => p.platform))].map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-700">
            {['dashboard', 'generator', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-green-400 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div id="report-hub-content">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading Report Hub data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'generator' && renderGenerator()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Share Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Share with team members</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message (optional)</label>
                <textarea
                  placeholder="Add a message..."
                  className="input-glass w-full h-24"
                />
              </div>
              <div className="flex gap-3">
                <button className="btn-primary flex-1">Send</button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-400">{title}</span>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    {trend && (
      <div className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
        {trend} from last period
      </div>
    )}
  </div>
);

// Platform Performance Bar Component
const PlatformPerformanceBar = ({ platform }) => {
  const score = platform.performanceScore || 0;
  const getColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 75) return 'blue';
    if (score >= 60) return 'yellow';
    return 'orange';
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{platform.platform || 'Unknown'}</span>
        <span className="text-gray-400">{formatMoney(platform.gmv || 0)}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`bg-${getColor(score)}-500 h-3 rounded-full transition-all flex items-center justify-end pr-2`}
          style={{ width: `${score}%` }}
        >
          <span className="text-xs font-semibold">{score.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ReportHub;
