// NAVA OPS - Professional Branded Report Header
// Premium header with Restalyze branding, logo, and company identity

import React from 'react';
import { Download, Share2, Printer, MoreVertical } from 'lucide-react';

export default function BrandedReportHeader({
  title,
  subtitle,
  reportType,
  generatedDate,
  reportId,
  confidence,
  onExport,
  onPrint,
  onShare
}) {
  const [showMoreActions, setShowMoreActions] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Premium Header Section with Branding */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-blue-100 dark:border-gray-700">
        {/* Branding Row */}
        <div className="flex items-center justify-between mb-6">
          {/* Restalyze Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm flex items-center justify-center">
              <img
                src="/restalyze-logo.svg"
                alt="Restalyze"
                className="w-10 h-10"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">
                RESTALYZE
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Professional Analytics Platform
              </p>
            </div>
          </div>

          {/* Report Metadata Badges */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-600 dark:text-gray-400">Report ID</p>
              <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                {reportId}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-right">
              <p className="text-xs text-gray-600 dark:text-gray-400">Generated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(generatedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Report Title & Subtitle */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          {/* Report Type */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              Report Type:
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium capitalize">
              {reportType.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Confidence Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              Confidence:
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                {confidence}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              title="Print report"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button
              onClick={onShare}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              title="Share report"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
                title="More actions"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMoreActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={() => {
                      onExport('pdf');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      onExport('excel');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600 dark:text-green-400 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export as Excel
                  </button>
                  <button
                    onClick={() => {
                      onExport('csv');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium border-b border-gray-200 dark:border-gray-700"
                  >
                    <Download className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      onExport('json');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export as JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Quality Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Export Format
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Multi-Format Ready
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Print Quality
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Professional Grade
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Data Integrity
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Verified
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Branding
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Restalyze
          </p>
        </div>
      </div>
    </div>
  );
}
