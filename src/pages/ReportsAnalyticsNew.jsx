// NAVA OPS - Enterprise Reports & Analytics Hub
// Comprehensive reporting platform with AI insights and advanced analytics

import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import PageHeader from '@/components/UI/PageHeader';
import {
  BarChart3, Download, Calendar, TrendingUp, FileText, DollarSign,
  Users, Package, Target, AlertTriangle, Crown, Layers, GitCompare,
  Clock, Settings, Play, Eye, ChevronRight, Sparkles, Printer, Share2
} from 'lucide-react';
import { reportEngine } from '@/lib/reportEngine';
import { REPORT_TYPES, REPORT_CATEGORIES, getReportsByCategory } from '@/lib/reportTypes';
import { exportReport } from '@/lib/exportEngine';
import ReportFilters from '@/components/Reports/ReportFilters';
import FinancialOverview from '@/components/Reports/FinancialOverview';
import MenuEngineering from '@/components/Reports/MenuEngineering';
import ChannelPerformanceReport from '@/components/Reports/ChannelPerformanceReport';

export default function ReportsAnalyticsNew() {
  const { addNotification } = useNotification();
  const reportRef = useRef(null);
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [filters, setFilters] = useState({
    period: 'LAST_30_DAYS',
    branchId: null,
    category: null
  });
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [restaurantInfo] = useState({
    name: 'Restaurant Name',
    logo: null,
    branch: 'Main Branch'
  });

  useEffect(() => {
    // Load recent reports from localStorage
    const saved = localStorage.getItem('nava_recent_reports');
    if (saved) {
      setRecentReports(JSON.parse(saved));
    }
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      addNotification({
        title: 'Warning',
        message: 'Please select a report type',
        type: 'warning'
      });
      return;
    }

    try {
      setIsGenerating(true);
      addNotification({
        title: 'Info',
        message: 'Generating report with AI insights...',
        type: 'info'
      });

      // Generate report using the engine
      const report = await reportEngine.generateReport(selectedReportType, filters);
      setGeneratedReport(report);

      // Save to recent reports
      const recent = [
        { ...report, timestamp: new Date().toISOString() },
        ...recentReports.slice(0, 9)
      ];
      setRecentReports(recent);
      localStorage.setItem('nava_recent_reports', JSON.stringify(recent));

      // Switch to view tab
      setActiveTab('view');

      addNotification({
        title: 'Success',
        message: 'Report generated successfully with AI insights',
        type: 'success'
      });
    } catch (error) {
      console.error('Report generation failed:', error);
      addNotification({
        title: 'Error',
        message: `Failed to generate report: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format) => {
    if (!generatedReport) return;

    try {
      addNotification({
        title: 'Info',
        message: `Exporting report as ${format.toUpperCase()}...`,
        type: 'info'
      });

      const filename = `${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
      await exportReport(generatedReport, format, filename, restaurantInfo);

      addNotification({
        title: 'Success',
        message: 'Report exported successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to export report',
        type: 'error'
      });
    }
  };

  const handlePrintReport = () => {
    if (!reportRef.current) return;

    try {
      const printWindow = window.open('', '', 'height=800,width=1000');
      const reportContent = reportRef.current.innerHTML;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${generatedReport.title}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none !important; }
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .report-header {
                border-bottom: 3px solid #0088ff;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .report-title {
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
              }
              .report-meta {
                font-size: 12px;
                color: #666;
                margin: 10px 0;
              }
              .report-branding {
                font-size: 10px;
                text-align: right;
                color: #999;
                margin-top: 10px;
              }
              .section {
                margin: 30px 0;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #0088ff;
                margin: 20px 0 15px 0;
                border-left: 4px solid #0088ff;
                padding-left: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="report-header">
              <div class="report-branding">Restalyze • Professional Report Hub</div>
              <h1 class="report-title">${generatedReport.title}</h1>
              <div class="report-meta">${restaurantInfo.name} | ${restaurantInfo.branch}</div>
              <div class="report-meta">Generated: ${new Date(generatedReport.generatedAt).toLocaleString()}</div>
              <div class="report-meta">Report ID: ${generatedReport.id}</div>
            </div>
            ${reportContent}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center;">
              <p>This report was generated by Restalyze • Premium Restaurant Analytics Platform</p>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);

      addNotification({
        title: 'Success',
        message: 'Print dialog opened',
        type: 'success'
      });
    } catch (error) {
      console.error('Print failed:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to open print dialog',
        type: 'error'
      });
    }
  };

  const handleViewReport = (report) => {
    setGeneratedReport(report);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 space-y-6 pb-12">
      <PageHeader
        title="Restalyze Report Hub"
        subtitle="Professional reporting with AI insights, advanced analytics, and client-ready exports"
        icon={BarChart3}
        badge={{
          text: 'Premium Reports',
          icon: Sparkles,
          color: 'blue'
        }}
      />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <TabButton
              active={activeTab === 'builder'}
              onClick={() => setActiveTab('builder')}
              icon={Settings}
              label="Report Builder"
            />
            <TabButton
              active={activeTab === 'view'}
              onClick={() => setActiveTab('view')}
              icon={Eye}
              label="View Report"
              disabled={!generatedReport}
            />
            <TabButton
              active={activeTab === 'templates'}
              onClick={() => setActiveTab('templates')}
              icon={FileText}
              label="Templates"
            />
            <TabButton
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              icon={Clock}
              label="History"
            />
          </nav>
        </div>

        <div className="p-6">
          {/* Report Builder Tab */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Type Selection */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Select Report Type
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(REPORT_CATEGORIES).map(([key, category]) => {
                        const reports = getReportsByCategory(category);
                        if (reports.length === 0) return null;

                        return (
                          <div key={key}>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase">
                              {category.replace('_', ' ')} Reports
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {reports.map(report => (
                                <ReportTypeCard
                                  key={report.id}
                                  report={report}
                                  selected={selectedReportType === report.id}
                                  onClick={() => setSelectedReportType(report.id)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Filters & Actions */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Report Configuration
                    </h3>

                    {selectedReportType && (
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                          Selected Report
                        </div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          {REPORT_TYPES[selectedReportType.toUpperCase()]?.name}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          {REPORT_TYPES[selectedReportType.toUpperCase()]?.description}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleGenerateReport}
                      disabled={!selectedReportType || isGenerating}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                               text-white rounded-lg transition-colors duration-200 flex items-center
                               justify-center gap-2 font-medium disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Generate Report
                        </>
                      )}
                    </button>

                    {selectedReportType && REPORT_TYPES[selectedReportType.toUpperCase()]?.aiInsights && (
                      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-200">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium">AI Insights Enabled</span>
                        </div>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                          This report includes automated insights and recommendations
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <ReportFilters
                filters={filters}
                onFilterChange={setFilters}
                onApply={() => {}}
              />
            </div>
          )}

          {/* View Report Tab */}
          {activeTab === 'view' && generatedReport && (
            <div className="space-y-6">
              {/* Report Header with Branding */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">R</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Restalyze Professional Report
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{restaurantInfo.name} • {restaurantInfo.branch}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {generatedReport.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{generatedReport.subtitle}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white dark:bg-gray-800/50 rounded p-2">
                      <span className="text-gray-600 dark:text-gray-400">Generated</span>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">{new Date(generatedReport.generatedAt).toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 rounded p-2">
                      <span className="text-gray-600 dark:text-gray-400">Report ID</span>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">{generatedReport.id.substring(0, 8)}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 rounded p-2">
                      <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                      <p className="font-semibold text-green-600 dark:text-green-400 text-xs">{generatedReport.metadata.confidence}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 rounded p-2">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <p className="font-semibold text-blue-600 dark:text-blue-400 text-xs">Ready</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Export & Share:</span>
                </div>
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg
                           transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Download as PDF"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg
                           transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Download as Excel"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                           transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Download as CSV"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-2"></div>
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                           transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                           text-gray-900 dark:text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Share Report (Coming Soon)"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Report Content */}
              <div ref={reportRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                {generatedReport.type === 'financial_overview' && (
                  <FinancialOverview reportData={generatedReport} />
                )}
                {generatedReport.type === 'menu_engineering' && (
                  <MenuEngineering reportData={generatedReport} />
                )}
                {generatedReport.type === 'channel_performance' && (
                  <ChannelPerformanceReport reportData={generatedReport} />
                )}

                {/* Default Report View for other types */}
                {!['financial_overview', 'menu_engineering', 'channel_performance'].includes(generatedReport.type) && (
                  <div className="space-y-6">
                    {generatedReport.executiveSummary && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Executive Summary
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {generatedReport.executiveSummary}
                        </p>
                      </div>
                    )}

                    {generatedReport.insights && generatedReport.insights.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          AI-Generated Insights
                        </h3>
                        <div className="space-y-3">
                          {generatedReport.insights.map((insight, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {insight.title}
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {insight.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Report Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Daily Flash Report', category: 'executive', icon: Crown },
                  { name: 'Weekly Performance', category: 'performance', icon: TrendingUp },
                  { name: 'Monthly Financial', category: 'financial', icon: DollarSign },
                  { name: 'Branch Comparison', category: 'comparative', icon: GitCompare },
                  { name: 'Customer Insights', category: 'customer', icon: Users },
                  { name: 'Anomaly Detection', category: 'anomaly', icon: AlertTriangle }
                ].map((template, index) => (
                  <button
                    key={index}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                             hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <template.icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {template.category} report template
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Reports
              </h3>
              {recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between
                               hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {report.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(report.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recent reports</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors
        ${active
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function ReportTypeCard({ report, selected, onClick }) {
  const iconMap = {
    DollarSign, TrendingUp, Users, Package, Target, AlertTriangle, Crown, Layers, GitCompare, FileText
  };
  const Icon = iconMap[report.icon] || FileText;

  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-300',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-300',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-300',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-300',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-300',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-300',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-300',
    violet: 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-300',
    lime: 'bg-lime-100 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400 border-lime-300',
    gold: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-300',
    gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-300'
  };

  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200 text-left
        ${selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[report.color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
        {report.name}
      </h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {report.description}
      </p>
      {report.aiInsights && (
        <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
          <Sparkles className="w-3 h-3" />
          AI Insights
        </div>
      )}
    </button>
  );
}
