// NAVA OPS - Professional Report Hub (REBUILT with NAVA UI)
import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import {
  Sidebar,
  TopNavbar,
  ModernCard,
  KPIWidget,
  NeoButton,
  SectionTitle,
  StatBadge,
  InfoBlock,
} from '@/components/nava-ui';

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

  // State management (unchanged)
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [restaurantInfo] = useState({
    name: 'Restaurant Name',
    logo: null,
    branch: 'Main Branch'
  });

  // Load recent reports (unchanged)
  useEffect(() => {
    const saved = localStorage.getItem('nava_recent_reports');
    if (saved) {
      setRecentReports(JSON.parse(saved));
    }
  }, []);

  // Generate report (unchanged)
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

      const report = await reportEngine.generateReport(selectedReportType, filters);
      setGeneratedReport(report);

      const recent = [
        { ...report, timestamp: new Date().toISOString() },
        ...recentReports.slice(0, 9)
      ];
      setRecentReports(recent);
      localStorage.setItem('nava_recent_reports', JSON.stringify(recent));

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

  // Export handler (unchanged)
  const handleExport = async (format) => {
    if (!generatedReport) return;

    try {
      addNotification({
        title: 'Info',
        message: `Exporting report as ${format.toUpperCase()}...`,
        type: 'info'
      });

      const fileExtension = format === 'json' ? 'json' : format === 'excel' ? 'xlsx' : format;
      const filename = `NAVA_${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
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

  // Print handler (unchanged)
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
              * { box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .report-header { border-bottom: 3px solid #00C4FF; padding-bottom: 20px; margin-bottom: 30px; }
              .report-title { font-size: 28px; font-weight: bold; margin: 0 0 10px 0; }
              .report-meta { font-size: 12px; color: #666; margin: 10px 0; }
              .section { margin: 30px 0; page-break-inside: avoid; }
              .section-title { font-size: 18px; font-weight: 600; color: #00C4FF; margin: 20px 0 15px 0; border-left: 4px solid #00C4FF; padding-left: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="report-header">
              <div style="font-size: 10px; text-align: right; color: #999;">NAVA • Professional Report Hub</div>
              <h1 class="report-title">${generatedReport.title}</h1>
              <div class="report-meta">${restaurantInfo.name} | ${restaurantInfo.branch}</div>
              <div class="report-meta">Generated: ${new Date(generatedReport.generatedAt).toLocaleString()}</div>
              <div class="report-meta">Report ID: ${generatedReport.id}</div>
            </div>
            ${reportContent}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center;">
              <p>This report was generated by NAVA • Premium Restaurant Analytics Platform</p>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: generatedReport?.title || 'NAVA Report',
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

  const user = {
    name: 'Ahmed',
    email: 'ahmed@nava.com',
    role: 'Administrator',
  };

  return (
    <div className="min-h-screen bg-[#0A0E14]">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-mesh-cyber opacity-50 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar defaultCollapsed={false} />

      {/* TopNavbar */}
      <TopNavbar
        user={user}
        notificationCount={0}
        darkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <main className="pl-[280px] pt-[73px] p-8 space-y-8">
        {/* Page Header */}
        <SectionTitle
          title="Professional Report Hub"
          subtitle="Generate AI-powered reports with financial insights, menu performance, and channel analytics"
          icon={BarChart3}
          accent="primary"
          action={
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">AI-Powered</span>
            </div>
          }
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPIWidget
            title="Report Types"
            value={Object.keys(REPORT_TYPES).length}
            suffix="+"
            icon={BarChart3}
            iconColor="text-blue-400"
            variant="glass"
          />
          <KPIWidget
            title="AI Insights"
            value="Active"
            icon={Sparkles}
            iconColor="text-purple-400"
            variant="glass"
          />
          <KPIWidget
            title="Export Formats"
            value={4}
            icon={Download}
            iconColor="text-green-400"
            variant="glass"
          />
          <KPIWidget
            title="Recent Reports"
            value={recentReports.length}
            icon={Clock}
            iconColor="text-orange-400"
            variant="glass"
          />
        </div>

        {/* Tabs Navigation */}
        <ModernCard variant="glass" className="p-2">
          <div className="flex gap-2">
            <NeoButton
              variant={activeTab === 'builder' ? 'primary' : 'ghost'}
              size="md"
              icon={Settings}
              iconPosition="left"
              onClick={() => setActiveTab('builder')}
            >
              Report Generator
            </NeoButton>
            <NeoButton
              variant={activeTab === 'view' ? 'primary' : 'ghost'}
              size="md"
              icon={Eye}
              iconPosition="left"
              onClick={() => setActiveTab('view')}
              disabled={!generatedReport}
            >
              View Report
            </NeoButton>
            <NeoButton
              variant={activeTab === 'templates' ? 'primary' : 'ghost'}
              size="md"
              icon={Crown}
              iconPosition="left"
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </NeoButton>
            <NeoButton
              variant={activeTab === 'history' ? 'primary' : 'ghost'}
              size="md"
              icon={Clock}
              iconPosition="left"
              onClick={() => setActiveTab('history')}
            >
              History
            </NeoButton>
          </div>
        </ModernCard>

        {/* Tab Content */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Type Selection */}
            <div className="lg:col-span-2 space-y-6">
              <SectionTitle
                title="Generate Your Report"
                subtitle="Choose from 25+ professionally designed reports tailored for restaurant analytics"
                size="md"
              />

              <div className="space-y-6">
                {Object.entries(REPORT_CATEGORIES).map(([key, category]) => {
                  const reports = getReportsByCategory(category);
                  if (reports.length === 0) return null;

                  return (
                    <div key={key}>
                      <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1 h-4 bg-cyan-400 rounded"></div>
                        {category.replace('_', ' ')} Reports
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reports.map(report => (
                          <ModernCard
                            key={report.id}
                            variant={selectedReportType === report.id ? 'gradient' : 'glass'}
                            hoverable
                            glow={selectedReportType === report.id}
                            glowColor="primary"
                            className="p-4 cursor-pointer"
                            onClick={() => setSelectedReportType(report.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="text-sm font-semibold text-white">{report.name}</h5>
                              {selectedReportType === report.id && (
                                <StatBadge variant="success" size="sm" value="Selected" />
                              )}
                            </div>
                            <p className="text-xs text-white/50">{report.description}</p>
                          </ModernCard>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="space-y-6">
              <ModernCard variant="glass-strong" className="p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Configuration</h3>
                </div>

                {selectedReportType ? (
                  <div className="space-y-6">
                    <InfoBlock
                      variant="info"
                      title={REPORT_TYPES[selectedReportType.toUpperCase()]?.name}
                      message={REPORT_TYPES[selectedReportType.toUpperCase()]?.description}
                    />

                    <div>
                      <ReportFilters
                        filters={filters}
                        onChange={setFilters}
                      />
                    </div>

                    <NeoButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={Play}
                      iconPosition="left"
                      onClick={handleGenerateReport}
                      loading={isGenerating}
                    >
                      Generate Report
                    </NeoButton>
                  </div>
                ) : (
                  <InfoBlock
                    variant="info"
                    title="No Report Selected"
                    message="Please select a report type from the list to continue"
                  />
                )}
              </ModernCard>
            </div>
          </div>
        )}

        {activeTab === 'view' && generatedReport && (
          <div className="space-y-6">
            {/* Report Actions */}
            <ModernCard variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{generatedReport.title}</h3>
                  <p className="text-sm text-white/50">Generated: {new Date(generatedReport.generatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <NeoButton
                    variant="ghost"
                    size="md"
                    icon={Download}
                    onClick={() => setIsExportDialogOpen(true)}
                  >
                    Export
                  </NeoButton>
                  <NeoButton
                    variant="ghost"
                    size="md"
                    icon={Printer}
                    onClick={handlePrintReport}
                  >
                    Print
                  </NeoButton>
                  <NeoButton
                    variant="ghost"
                    size="md"
                    icon={Share2}
                    onClick={handleShare}
                  >
                    Share
                  </NeoButton>
                </div>
              </div>
            </ModernCard>

            {/* Report Content */}
            <div ref={reportRef}>
              <ProfessionalReport report={generatedReport} />
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <InfoBlock
            variant="info"
            title="Templates Coming Soon"
            message="Save your custom report configurations as templates for quick access"
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.map((report, index) => (
                <ModernCard
                  key={index}
                  variant="glass"
                  hoverable
                  className="p-6 cursor-pointer"
                  onClick={() => handleViewReport(report)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-white mb-1">{report.title}</h4>
                      <p className="text-sm text-white/50">Generated: {new Date(report.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatBadge variant="primary" size="sm" value={report.type} />
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                </ModernCard>
              ))
            ) : (
              <InfoBlock
                variant="info"
                title="No Reports Yet"
                message="Generate your first report to see it here"
              />
            )}
          </div>
        )}
      </main>

      {/* Export Dialog */}
      {isExportDialogOpen && (
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
