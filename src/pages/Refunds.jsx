import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Upload,
  FileSpreadsheet,
  Download,
  RefreshCw,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react';
import SectionTitle from '../components/nava-ui/SectionTitle';
import NeoButton from '../components/nava-ui/NeoButton';
import ModernCard from '../components/nava-ui/ModernCard';
import RefundTable from '../components/refunds/RefundTable';
import RefundDetails from '../components/refunds/RefundDetails';
import MessageModal from '../components/refunds/MessageModal';
import refundsService from '../services/refundsService';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  // Load refunds
  useEffect(() => {
    loadRefunds();
    loadStats();
  }, []);

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const { data, error } = await refundsService.refunds.getAll();
      if (!error && data) {
        setRefunds(data);
      }
    } catch (error) {
      console.error('Failed to load refunds:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await refundsService.analytics.getStats();
      if (!error && data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleRefundClick = async (refund) => {
    setSelectedRefund(refund);
    setShowDetails(true);

    // Load full details
    const { data } = await refundsService.refunds.getById(refund.id);
    if (data) {
      setSelectedRefund(data);

      // Load latest inspection
      const { data: inspection } = await refundsService.inspection.getLatest(refund.id);
      setCurrentInspection(inspection);
    }
  };

  const handleRunInspection = async (refundId) => {
    try {
      const { data, error } = await refundsService.inspection.run(refundId);
      if (!error && data) {
        setCurrentInspection(data);
        // Reload refund details
        const { data: refundData } = await refundsService.refunds.getById(refundId);
        if (refundData) {
          setSelectedRefund(refundData);
        }
      }
    } catch (error) {
      console.error('Failed to run inspection:', error);
    }
  };

  const handleGenerateMessage = async (refund, inspection, templateId, language) => {
    try {
      const { data, error } = await refundsService.templates.generateMessage(
        refund,
        inspection,
        templateId,
        language
      );
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.error('Failed to generate message:', error);
    }
    return null;
  };

  const handleUploadEvidence = async (refundId, file, type) => {
    try {
      // Upload file
      const { data: uploadData, error: uploadError } = await refundsService.evidence.uploadFile(
        refundId,
        file
      );
      if (uploadError) throw uploadError;

      // Add evidence record
      const { data, error } = await refundsService.evidence.add(refundId, {
        ...uploadData,
        type
      });

      if (!error && data) {
        // Reload refund details
        const { data: refundData } = await refundsService.refunds.getById(refundId);
        if (refundData) {
          setSelectedRefund(refundData);
        }
      }
    } catch (error) {
      console.error('Failed to upload evidence:', error);
    }
  };

  const handleDeleteEvidence = async (evidenceId) => {
    try {
      const { error } = await refundsService.evidence.delete(evidenceId);
      if (!error && selectedRefund) {
        // Reload refund details
        const { data: refundData } = await refundsService.refunds.getById(selectedRefund.id);
        if (refundData) {
          setSelectedRefund(refundData);
        }
      }
    } catch (error) {
      console.error('Failed to delete evidence:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle
              title="مركز الريفندات"
              description="إدارة وتحليل ريفندات تطبيقات التوصيل"
            />
          </div>
          <div className="flex items-center gap-3">
            <NeoButton
              variant="ghost"
              icon={RefreshCw}
              onClick={loadRefunds}
              loading={loading}
            >
              تحديث
            </NeoButton>
            <NeoButton
              variant="secondary"
              icon={Upload}
              onClick={() => setShowCSVModal(true)}
            >
              رفع CSV/Excel
            </NeoButton>
            <NeoButton
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
            >
              إضافة ريفند
            </NeoButton>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ModernCard variant="glass" glow glowColor="error" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm mb-1">إجمالي الخسائر</div>
                  <div className="text-3xl font-bold text-white flex items-center gap-1">
                    <DollarSign className="w-6 h-6" />
                    {stats.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="p-4 bg-red-500/20 rounded-2xl">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm mb-1">عدد الريفندات</div>
                  <div className="text-3xl font-bold text-white">{stats.total || 0}</div>
                </div>
                <div className="p-4 bg-cyan-500/20 rounded-2xl">
                  <BarChart3 className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm mb-1">متوسط المبلغ</div>
                  <div className="text-3xl font-bold text-white">{stats.avgAmount?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" glow glowColor="warning" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm mb-1">تحتاج مراجعة</div>
                  <div className="text-3xl font-bold text-white">
                    {stats.byStatus?.pending || 0}
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </ModernCard>
          </div>
        )}

        {/* Refunds Table */}
        <RefundTable
          refunds={refunds}
          onRefundClick={handleRefundClick}
          loading={loading}
        />

        {/* Refund Details Modal */}
        {showDetails && selectedRefund && (
          <RefundDetails
            refund={selectedRefund}
            evidence={selectedRefund.evidence || []}
            inspection={currentInspection}
            onClose={() => {
              setShowDetails(false);
              setSelectedRefund(null);
              setCurrentInspection(null);
            }}
            onRunInspection={handleRunInspection}
            onGenerateMessage={(refund, inspection) => {
              setShowMessageModal(true);
            }}
            onUploadEvidence={handleUploadEvidence}
            onDeleteEvidence={handleDeleteEvidence}
          />
        )}

        {/* Message Generator Modal */}
        {showMessageModal && selectedRefund && currentInspection && (
          <MessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            refund={selectedRefund}
            inspection={currentInspection}
            onGenerate={handleGenerateMessage}
          />
        )}

        {/* CSV Upload Modal - Placeholder */}
        {showCSVModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <ModernCard variant="glass-strong" className="p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-white mb-4">رفع ملف CSV/Excel</h2>
              <p className="text-white/60 mb-4">قريباً: رفع ملفات CSV/Excel لاستيراد الريفندات بشكل دفعي</p>
              <NeoButton variant="ghost" onClick={() => setShowCSVModal(false)}>
                إغلاق
              </NeoButton>
            </ModernCard>
          </div>
        )}

        {/* Add Refund Modal - Placeholder */}
        {showAddModal && (
          <AddRefundModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              loadRefunds();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Simple Add Refund Modal Component
const AddRefundModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    platform_order_id: '',
    platform_name: 'Manual',
    refund_amount: '',
    refund_reason: '',
    reason_code: '',
    customer_name: '',
    customer_claim: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await refundsService.refunds.create(formData);
      if (!error && data) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Failed to create refund:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <ModernCard variant="glass-strong" className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">إضافة ريفند جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">رقم الطلب *</label>
            <input
              type="text"
              required
              value={formData.platform_order_id}
              onChange={(e) => setFormData({ ...formData, platform_order_id: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              placeholder="مثال: ORD-12345"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">المنصة *</label>
            <select
              required
              value={formData.platform_name}
              onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
            >
              <option value="Manual">Manual</option>
              <option value="Jahez">Jahez</option>
              <option value="HungerStation">HungerStation</option>
              <option value="Marsool">Marsool</option>
              <option value="Talabat">Talabat</option>
              <option value="Careem">Careem</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">المبلغ *</label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.refund_amount}
              onChange={(e) => setFormData({ ...formData, refund_amount: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">سبب الريفند *</label>
            <select
              required
              value={formData.reason_code}
              onChange={(e) => setFormData({ ...formData, reason_code: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
            >
              <option value="">اختر السبب</option>
              <option value="MISSING_ITEM">صنف مفقود</option>
              <option value="LATE">تأخير توصيل</option>
              <option value="QUALITY">مشكلة جودة</option>
              <option value="WRONG_ORDER">طلب خاطئ</option>
              <option value="CANCELLED">ملغي</option>
              <option value="OTHER">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">اسم العميل</label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">ادعاء العميل</label>
            <textarea
              rows={3}
              value={formData.customer_claim}
              onChange={(e) => setFormData({ ...formData, customer_claim: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <NeoButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              إضافة الريفند
            </NeoButton>
            <NeoButton
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </NeoButton>
          </div>
        </form>
      </ModernCard>
    </div>
  );
};

export default Refunds;
