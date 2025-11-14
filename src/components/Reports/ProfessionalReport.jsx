/**
 * NAVA OPS - Professional Report Component
 * Premium, branded report generation and viewing
 */

import React, { useState } from 'react';
import {
  Download, Printer, Share2, FileText, Crown, CheckCircle,
  AlertCircle, TrendingUp, BarChart3, Calendar, Eye, Sparkles
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { generateProfessionalPDF } from '@/lib/pdfGenerator';
import { exportReport } from '@/lib/exportEngine';

const NAVA_BRANDING = {
  colors: {
    primary: '#0088FF',
    secondary: '#6B7280',
    accent: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  fonts: {
    primary: 'Helvetica',
    mono: 'Courier'
  },
  logo: 'NAVA OPS',
  tagline: 'Smart Decisions, Smarter Results'
};

export default function ProfessionalReport({ report, onClose }) {
  const { addNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    executiveSummary: true,
    metrics: true,
    insights: true,
    anomalies: true,
    recommendations: true,
    visualizations: true
  });

  if (!report) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No report to display</p>
      </div>
    );
  }

  const handleExport = async (format) => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      setExportFormat(format);

      addNotification({
        title: 'Generating',
        message: `Generating professional ${format.toUpperCase()} report with branding...`,
        type: 'info'
      });

      let result;
      if (format === 'pdf') {
        // Generate professional PDF with branding
        result = await generateProfessionalPDF(report, {
          branding: NAVA_BRANDING,
          sections: selectedSections,
          quality: 'premium'
        });

        if (result.success) {
          result.pdf.save(result.filename);
        }
      } else {
        // Use standard export engine for other formats
        const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
        await exportReport(report, format, filename);
      }

      addNotification({
        title: 'Success',
        message: `Professional report exported as ${format.toUpperCase()}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        title: 'Error',
        message: `Failed to export report: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const handlePrint = () => {
    window.print();
    addNotification({
      title: 'Print',
      message: 'Print dialog opened',
      type: 'info'
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: report.title,
          text: `Check out this professional report: ${report.title}`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        addNotification({
          title: 'Copied',
          message: 'Report link copied to clipboard',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const toggleSection = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getConfidenceColor = (confidence) => {
    const level = parseInt(confidence);
    if (level >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (level >= 75) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (level >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  const getAnomalyIcon = (severity) => {
    return severity === 'critical' || severity === 'high' ? (
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Header with Branding */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-300" />
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                Premium Report
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{report.title}</h2>
            <p className="text-blue-100 mb-4">{NAVA_BRANDING.tagline}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-blue-200">Period:</span> {report.subtitle}
              </div>
              <div>
                <span className="text-blue-200">Generated:</span> {new Date(report.generatedAt).toLocaleString()}
              </div>
              <div>
                <span className="text-blue-200">Report ID:</span> {report.id}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-400
                       rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              {isExporting && exportFormat === 'pdf' ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg
                       transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-sm">
              <span className="font-semibold">Data Quality:</span> {report.metadata.confidence} confidence •
              {report.metadata.completeness} completeness • {report.metadata.dataPoints} data points
            </span>
          </div>
        </div>
      </div>

      {/* Report Configuration Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Report Sections
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(selectedSections).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleSection(key)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      {selectedSections.executiveSummary && report.executiveSummary && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Executive Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      {selectedSections.metrics && report.metrics && Object.keys(report.metrics).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Key Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.metrics).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {selectedSections.insights && report.insights && report.insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Generated Insights
          </h3>
          <div className="space-y-3">
            {report.insights.map((insight, index) => (
              <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
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

      {/* Anomalies Detection */}
      {selectedSections.anomalies && report.anomalies && report.anomalies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Detected Anomalies
          </h3>
          <div className="space-y-3">
            {report.anomalies.map((anomaly, index) => (
              <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex gap-3">
                {getAnomalyIcon(anomaly.severity)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {anomaly.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {anomaly.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {selectedSections.recommendations && report.recommendations && report.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Actionable Recommendations
          </h3>
          <div className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {index + 1}. {rec.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {rec.description}
                </p>
                {rec.action && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Action: {rec.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Export Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg hover:border-red-500
                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-red-600 dark:text-red-400 font-semibold">PDF</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Professional</div>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-500
                     hover:bg-green-50 dark:hover:bg-green-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-green-600 dark:text-green-400 font-semibold">Excel</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Data</div>
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-500
                     hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
          >
            <div className="text-blue-600 dark:text-blue-400 font-semibold">CSV</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Spreadsheet</div>
          </button>

          <button
            onClick={handleShare}
            className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-500
                     hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            <div className="text-purple-600 dark:text-purple-400 font-semibold">Share</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Link</div>
          </button>
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-1">
          <span className="font-semibold text-gray-900 dark:text-white">{NAVA_BRANDING.logo}</span> - {NAVA_BRANDING.tagline}
        </p>
        <p>
          This professional report includes premium analytics, AI insights, and actionable recommendations.
          Generated on {new Date().toLocaleString()}.
        </p>
      </div>
    </div>
  );
}
