// RESTALYZE - Professional Report Hub
// Intelligent Command Center for Restaurant Financial Insights, Menu Performance & Channel Analytics
// Full-page branded design with AI-powered reporting and advanced analytics

import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

import PageHeader from '@/components/UI/PageHeader';
import BrandedReportHeader from '@/components/Reports/BrandedReportHeader';
 
import {
  BarChart3, Download, Calendar, TrendingUp, FileText, DollarSign,
  Users, Package, Target, AlertTriangle, Crown, Layers, GitCompare,
  Clock, Settings, Play, Eye, ChevronRight, Sparkles, Share2, Printer,
  Zap, ArrowRight, PieChart, TrendingDown, Activity
} from 'lucide-react';
import { reportEngine } from '@/lib/reportEngine';
import { REPORT_TYPES, REPORT_CATEGORIES, getReportsByCategory } from '@/lib/reportTypes';
import { exportReport } from '@/lib/exportEngine';
import ReportFilters from '@/components/Reports/ReportFilters';
import ExportDialog from '@/components/Reports/ExportDialog';

import ProfessionalReport from '@/components/Reports/ProfessionalReport';
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
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

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

      const fileExtension = format === 'json' ? 'json' : format === 'excel' ? 'xlsx' : format;
      const filename = `Restalyze_${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      await exportReport(generatedReport, format, filename, restaurantInfo);

      addNotification({
        title: 'Success',
        message: `Report exported successfully as ${format.toUpperCase()}`,
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: generatedReport?.title || 'Restalyze Report',
        text: generatedReport?.subtitle || 'Professional Analytics Report',
        url: window.location.href
      });
    } else {
      addNotification({
        title: 'Info',
        message: 'Copying report link to clipboard',
        type: 'info'
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleViewReport = (report) => {
    setGeneratedReport(report);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Professional Branded Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 text-white pt-8 pb-12 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Restalyze Branding */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">RESTALYZE</h1>
                <p className="text-blue-100 text-sm font-medium">Intelligent Command Center</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">AI-Powered</span>
            </div>
          </div>

          {/* Professional Tagline */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Professional Report Hub</h2>
            <p className="text-blue-100 max-w-2xl">
              Combine financial insights, menu performance, and channel analytics into one branded, professional platform. Generate AI-powered reports to drive strategic decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <TabButton
                active={activeTab === 'builder'}
                onClick={() => setActiveTab('builder')}
                icon={Settings}
                label="Report Generator"
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
                icon={Crown}
                label="Templates"
              />
              <TabButton
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                icon={Clock}
                label="Report History"
              />
            </nav>
          </div>

          <div className="p-8">
          {/* Report Generator Tab */}
          {activeTab === 'builder' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Report Types</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{Object.keys(REPORT_TYPES).length}+</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI Powered</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Insights</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Export To</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">4 Formats</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Recent Reports</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{recentReports.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Report Type Selection */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Generate Your Report
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                      Choose from 25+ professionally designed reports tailored for restaurant analytics
                    </p>
                    <div className="space-y-5">
                      {Object.entries(REPORT_CATEGORIES).map(([key, category]) => {
                        const reports = getReportsByCategory(category);
                        if (reports.length === 0) return null;

                        return (
                          <div key={key}>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                              <div className="w-1 h-4 bg-blue-600 rounded"></div>
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

                {/* Configuration Panel */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 sticky top-6 border border-gray-200 dark:border-gray-600 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Configuration
                    </h3>

                    {selectedReportType ? (
                      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border-l-4 border-blue-600">
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2 uppercase tracking-wide">
                          Selected Report
                        </div>
                        <div className="text-base font-bold text-blue-900 dark:text-blue-100 mb-2">
                          {REPORT_TYPES[selectedReportType.toUpperCase()]?.name}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                          {REPORT_TYPES[selectedReportType.toUpperCase()]?.description}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-600/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Select a report type to begin
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleGenerateReport}
                      disabled={!selectedReportType || isGenerating}
                      className={`w-full px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 font-bold text-white mb-4 ${
                        !selectedReportType || isGenerating
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>

                    {selectedReportType && REPORT_TYPES[selectedReportType.toUpperCase()]?.aiInsights && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-600 rounded-lg flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-purple-900 dark:text-purple-200 text-sm">
                              AI Insights Included
                            </p>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                              Automated analysis, trends, and strategic recommendations
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <ReportFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onApply={() => {}}
                />
              </div>
            </div>
          )}

          {/* View Report Tab - Professional Report */}
          {activeTab === 'view' && generatedReport && (
            <div className="space-y-6">
              {/* Report Header with Professional Branding */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                          {generatedReport.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Generated from Restalyze Command Center
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 mt-4">{generatedReport.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{new Date(generatedReport.generatedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">ID:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">{generatedReport.id}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-800">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 dark:text-green-300 font-semibold">{generatedReport.metadata.confidence} Confidence</span>
                      </div>
                    </div>
                  </div>

                  {/* Export Buttons - Professional Design */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Export Report</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg
                                 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        title="Export as PDF"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg
                                 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        title="Export as Excel"
                      >
                        <Download className="w-4 h-4" />
                        Excel
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                                 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        title="Export as CSV"
                      >
                        <Download className="w-4 h-4" />
                        CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Actions:</span>
                </div>
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
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                           text-gray-900 dark:text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                  title="Share Report"
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
                {generatedReport.type === 'professional_report' && (
                  <ProfessionalReport reportData={generatedReport} isLoading={false} />
                )}

                {/* Default Report View for other types */}
                {!['financial_overview', 'menu_engineering', 'channel_performance', 'professional_report'].includes(generatedReport.type) && (
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
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Professional Report Templates
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose from pre-designed templates optimized for restaurant management and strategic decision-making
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Daily Flash Report', category: 'executive', icon: Crown, description: 'Quick daily overview for management' },
                  { name: 'Weekly Performance', category: 'performance', icon: TrendingUp, description: 'Week-over-week performance analysis' },
                  { name: 'Monthly Financial', category: 'financial', icon: DollarSign, description: 'Comprehensive financial summary' },
                  { name: 'Branch Comparison', category: 'comparative', icon: GitCompare, description: 'Multi-location performance metrics' },
                  { name: 'Customer Insights', category: 'customer', icon: Users, description: 'Customer behavior and trends' },
                  { name: 'Anomaly Detection', category: 'anomaly', icon: AlertTriangle, description: 'Unusual patterns and alerts' }
                ].map((template, index) => (
                  <button
                    key={index}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                             hover:border-blue-500 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left bg-white dark:bg-gray-800"
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mb-4">
                      <template.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {template.description}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      Use Template <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Report History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your previously generated reports
                </p>
              </div>
              {recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div
                      key={index}
                      className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between
                               hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {report.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(report.timestamp).toLocaleString()}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                              {report.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Reports Yet</p>
                  <p className="text-gray-600 dark:text-gray-400">Generate your first report from the Report Generator tab to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        report={generatedReport}
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
      />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, disabled }) {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-6 py-4 border-b-3 font-bold text-sm transition-all duration-200 uppercase tracking-wide
        ${active
          ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
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
    BarChart3, DollarSign, TrendingUp, Users, Package, Target, AlertTriangle, Crown, Layers, GitCompare, FileText,
    PieChart, TrendingDown, Activity
  };
  const Icon = iconMap[report.icon] || FileText;

  const colorClasses = {
    green: 'bg-green-600 dark:bg-green-600 text-white',
    emerald: 'bg-emerald-600 dark:bg-emerald-600 text-white',
    blue: 'bg-blue-600 dark:bg-blue-600 text-white',
    red: 'bg-red-600 dark:bg-red-600 text-white',
    purple: 'bg-purple-600 dark:bg-purple-600 text-white',
    orange: 'bg-orange-600 dark:bg-orange-600 text-white',
    cyan: 'bg-cyan-600 dark:bg-cyan-600 text-white',
    teal: 'bg-teal-600 dark:bg-teal-600 text-white',
    pink: 'bg-pink-600 dark:bg-pink-600 text-white',
    yellow: 'bg-yellow-600 dark:bg-yellow-600 text-white',
    indigo: 'bg-indigo-600 dark:bg-indigo-600 text-white',
    violet: 'bg-violet-600 dark:bg-violet-600 text-white',
    lime: 'bg-lime-600 dark:bg-lime-600 text-white',
    gold: 'bg-yellow-600 dark:bg-yellow-600 text-white',
    gray: 'bg-gray-600 dark:bg-gray-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`
        p-5 rounded-xl border-2 transition-all duration-300 text-left h-full
        ${selected
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-xl scale-105'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg hover:scale-102 bg-white dark:bg-gray-800'
        }
      `}
    >
      <div className={`inline-flex p-3 rounded-lg mb-3 ${colorClasses[report.color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">
        {report.name}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
        {report.description}
      </p>
      {report.aiInsights && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded w-fit">
          <Sparkles className="w-3 h-3" />
          AI Insights
        </div>
      )}
    </button>
  );
}
