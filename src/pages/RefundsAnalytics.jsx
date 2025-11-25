// NAVA OPS - Refunds & Adjustments Analytics
// AI-Powered Revenue Leakage Analysis System

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { createRefundProcessor } from '@/lib/refundProcessingService';
import PageHeader from '@/components/UI/PageHeader';
import StatCard from '@/components/UI/StatCard';
import EmptyState from '@/components/UI/EmptyState';
import {
  AlertCircle,
  TrendingDown,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  Package,
  Truck,
  Users,
  AlertTriangle
} from 'lucide-react';

// File Upload Component
function FileUploadZone({ onFileSelect, processing }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${processing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Settlement Report
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your file here, or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: PDF, Excel (.xlsx, .xls), CSV (Max 10MB)
        </p>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.xlsx,.xls,.csv"
          onChange={handleFileInput}
          disabled={processing}
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose File
        </label>

        {selectedFile && (
          <div className="mt-4 p-3 bg-green-50 rounded-md text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {processing && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                  <span className="text-sm text-blue-600">Processing...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Platform Selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform (Optional)
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={processing}
        >
          <option value="">Auto-detect</option>
          <option value="jahez">Jahez (جاهز)</option>
          <option value="hungerstation">HungerStation (هنقرستيشن)</option>
          <option value="toyo">ToYou (توصيل)</option>
          <option value="chefz">The Chefz (ذا شيفز)</option>
          <option value="mrsool">Mrsool (مرسول)</option>
          <option value="careem">Careem (كريم)</option>
        </select>
      </div>
    </div>
  );
}

// Processing Status Component
function ProcessingStatus({ status, result }) {
  if (!status) return null;

  const statusConfig = {
    processing: {
      icon: Clock,
      color: 'blue',
      title: 'Processing Settlement File...',
      description: 'AI is analyzing your file and extracting refund data'
    },
    completed: {
      icon: CheckCircle,
      color: 'green',
      title: 'Processing Complete!',
      description: result?.message || 'Successfully processed settlement file'
    },
    duplicate: {
      icon: AlertTriangle,
      color: 'yellow',
      title: 'Duplicate File Detected',
      description: 'This file has already been processed'
    },
    error: {
      icon: XCircle,
      color: 'red',
      title: 'Processing Failed',
      description: result?.message || 'An error occurred during processing'
    }
  };

  const config = statusConfig[status] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-lg p-6`}>
      <div className="flex items-start">
        <Icon className={`w-6 h-6 text-${config.color}-600 mr-3 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`text-lg font-semibold text-${config.color}-900 mb-1`}>
            {config.title}
          </h4>
          <p className={`text-sm text-${config.color}-700 mb-4`}>
            {config.description}
          </p>

          {status === 'completed' && result?.data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-md p-3">
                <p className="text-xs text-gray-500">Refunds Extracted</p>
                <p className="text-xl font-bold text-gray-900">
                  {result.data.refundsExtracted}
                </p>
              </div>
              <div className="bg-white rounded-md p-3">
                <p className="text-xs text-gray-500">Orders Matched</p>
                <p className="text-xl font-bold text-green-600">
                  {result.data.matchingSummary?.matched || 0}
                </p>
              </div>
              <div className="bg-white rounded-md p-3">
                <p className="text-xs text-gray-500">Unmatched</p>
                <p className="text-xl font-bold text-orange-600">
                  {result.data.matchingSummary?.unmatched || 0}
                </p>
              </div>
              <div className="bg-white rounded-md p-3">
                <p className="text-xs text-gray-500">Processing Time</p>
                <p className="text-xl font-bold text-blue-600">
                  {(result.data.processing?.totalDuration / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Refunds Summary Component
function RefundsSummary({ data, loading }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue Loss"
        value={formatCurrency(data?.totalLoss)}
        subtitle="From refunds & adjustments"
        icon={TrendingDown}
        color="red"
        loading={loading}
      />
      <StatCard
        title="Total Refunds"
        value={data?.totalRefunds || 0}
        subtitle="Across all platforms"
        icon={AlertCircle}
        color="orange"
        loading={loading}
      />
      <StatCard
        title="Quality Issues"
        value={formatCurrency(data?.qualityLoss)}
        subtitle={`${data?.qualityCount || 0} incidents`}
        icon={Package}
        color="purple"
        loading={loading}
      />
      <StatCard
        title="Operations Issues"
        value={formatCurrency(data?.operationsLoss)}
        subtitle={`${data?.operationsCount || 0} incidents`}
        icon={Target}
        color="blue"
        loading={loading}
      />
    </div>
  );
}

// Main Component
export default function RefundsAnalytics() {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);

  const [summaryData, setSummaryData] = useState(null);
  const [recentRefunds, setRecentRefunds] = useState([]);

  // Load summary data
  useEffect(() => {
    if (user) {
      loadSummaryData();
    }
  }, [user]);

  const loadSummaryData = async () => {
    try {
      setLoading(true);

      // Get summary from database
      const { data, error } = await supabase
        .from('refunds_adjustments')
        .select('amount_deducted, reason_category')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate summary
      const summary = {
        totalLoss: data.reduce((sum, r) => sum + parseFloat(r.amount_deducted), 0),
        totalRefunds: data.length,
        qualityLoss: data
          .filter(r => r.reason_category === 'quality')
          .reduce((sum, r) => sum + parseFloat(r.amount_deducted), 0),
        qualityCount: data.filter(r => r.reason_category === 'quality').length,
        operationsLoss: data
          .filter(r => r.reason_category === 'operations')
          .reduce((sum, r) => sum + parseFloat(r.amount_deducted), 0),
        operationsCount: data.filter(r => r.reason_category === 'operations').length
      };

      setSummaryData(summary);
    } catch (error) {
      console.error('Failed to load summary:', error);
      addNotification('error', 'Failed to load refunds summary');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload and processing
  const handleFileSelect = async (file) => {
    try {
      setProcessing(true);
      setProcessingStatus('processing');
      setProcessingResult(null);

      addNotification('info', 'Processing settlement file...');

      // Create processor
      const processor = createRefundProcessor(user.id);

      // Process file
      const result = await processor.processSettlementFile(file);

      setProcessingResult(result);
      setProcessingStatus(result.status);

      if (result.success) {
        addNotification('success', result.message);
        // Reload summary
        await loadSummaryData();
      } else {
        addNotification('error', result.message);
      }
    } catch (error) {
      console.error('Processing error:', error);
      addNotification('error', `Processing failed: ${error.message}`);
      setProcessingStatus('error');
      setProcessingResult({ message: error.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Refunds & Adjustments"
        subtitle="AI-Powered Revenue Leakage Analysis"
        icon={AlertCircle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards */}
        <RefundsSummary data={summaryData} loading={loading} />

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upload Settlement Report
          </h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            processing={processing}
          />
          <ProcessingStatus status={processingStatus} result={processingResult} />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <Upload className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              1. Upload Settlement File
            </h3>
            <p className="text-sm text-blue-700">
              Upload your settlement report from delivery platforms (PDF, Excel, or CSV)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <Target className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              2. AI Extraction
            </h3>
            <p className="text-sm text-green-700">
              Our AI engine automatically extracts refunds and identifies root causes
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              3. Get Insights
            </h3>
            <p className="text-sm text-purple-700">
              View detailed analytics on revenue leakage and actionable insights
            </p>
          </div>
        </div>

        {/* Empty State or Data Table */}
        {!loading && summaryData?.totalRefunds === 0 && (
          <EmptyState
            title="No Refunds Data Yet"
            description="Upload your first settlement report to start tracking revenue leakage"
            icon={FileText}
          />
        )}
      </div>
    </div>
  );
}
