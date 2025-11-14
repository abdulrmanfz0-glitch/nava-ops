// NAVA OPS - Professional Export Dialog Component
// Unified export interface for all report formats

import React, { useState } from 'react';
import {
  Download, FileText, BarChart3, Share2, Printer, Copy, Mail, X, AlertCircle
} from 'lucide-react';
import { exportReport, printReport } from '@/lib/exportEngine';
import { useNotification } from '@/contexts/NotificationContext';

export default function ExportDialog({ report, isOpen, onClose }) {
  const { addNotification } = useNotification();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [customFilename, setCustomFilename] = useState(
    `${report?.title?.replace(/\s+/g, '_') || 'report'}_${new Date().toISOString().split('T')[0]}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);

  if (!isOpen || !report) return null;

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF with formatting',
      icon: FileText,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      ext: '.pdf'
    },
    {
      id: 'xlsx',
      name: 'Excel Spreadsheet',
      description: 'Multi-sheet Excel workbook',
      icon: BarChart3,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      ext: '.xlsx'
    },
    {
      id: 'csv',
      name: 'CSV File',
      description: 'Comma-separated values',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      ext: '.csv'
    },
    {
      id: 'json',
      name: 'JSON Format',
      description: 'Structured JSON data',
      icon: FileText,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      ext: '.json'
    }
  ];

  const actionItems = [
    {
      id: 'print',
      name: 'Print Report',
      description: 'Print directly to printer',
      icon: Printer,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      action: 'print'
    },
    {
      id: 'share',
      name: 'Share Internally',
      description: 'Send to team members',
      icon: Share2,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      action: 'share'
    }
  ];

  const selectedFormatInfo = exportFormats.find(f => f.id === selectedFormat);

  const handleExport = async () => {
    if (!customFilename.trim()) {
      addNotification({
        title: 'Error',
        message: 'Please enter a filename',
        type: 'error'
      });
      return;
    }

    try {
      setIsExporting(true);
      const filename = `${customFilename}${selectedFormatInfo.ext}`;

      addNotification({
        title: 'Exporting',
        message: `Generating ${selectedFormatInfo.name}...`,
        type: 'info'
      });

      await exportReport(report, selectedFormat, filename);

      addNotification({
        title: 'Success',
        message: `Report exported as ${selectedFormatInfo.name}`,
        type: 'success'
      });

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        title: 'Export Failed',
        message: `Failed to export report: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    try {
      printReport(report);
      addNotification({
        title: 'Success',
        message: 'Report opened in print preview',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to prepare print',
        type: 'error'
      });
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      addNotification({
        title: 'Error',
        message: 'Please enter an email address',
        type: 'error'
      });
      return;
    }

    try {
      // In a real implementation, this would send to your backend API
      // For now, we'll show a simulated action
      addNotification({
        title: 'Share Request',
        message: `Report will be shared with ${shareEmail}`,
        type: 'info'
      });

      // Reset form
      setShareEmail('');
      setShowShareForm(false);

      setTimeout(() => {
        addNotification({
          title: 'Success',
          message: 'Report shared successfully',
          type: 'success'
        });
      }, 1500);
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to share report',
        type: 'error'
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      // In a real implementation, this would generate a shareable link
      const shareUrl = `${window.location.origin}/reports/shared/${report.id || 'demo'}`;
      await navigator.clipboard.writeText(shareUrl);

      addNotification({
        title: 'Success',
        message: 'Share link copied to clipboard',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to copy link',
        type: 'error'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Export Report
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose how you want to export and share your report
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Export Formats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Export Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === format.id
                      ? `${format.color} border-current shadow-md`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <format.icon className={`w-5 h-5 mt-1 ${format.iconColor}`} />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {format.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filename
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter filename"
              />
              <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                {selectedFormatInfo.ext}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              File will be saved as: {customFilename}{selectedFormatInfo.ext}
            </p>
          </div>

          {/* Export Button */}
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                       text-white rounded-lg font-medium transition-colors flex items-center
                       justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download {selectedFormatInfo.name}
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                Or share and distribute
              </span>
            </div>
          </div>

          {/* Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actionItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action === 'print') {
                    handlePrint();
                  } else if (item.action === 'share') {
                    setShowShareForm(!showShareForm);
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left
                           ${item.color} border-current hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <item.icon className={`w-5 h-5 mt-1 ${item.iconColor}`} />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Share Form */}
          {showShareForm && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Member Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
                             font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200
                         dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-100 rounded-lg
                         font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Shareable Link
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Professional Communication</p>
              <p>Reports can be printed or shared with stakeholders and teams. All exports maintain
              professional formatting for official presentations.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100
                     dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
