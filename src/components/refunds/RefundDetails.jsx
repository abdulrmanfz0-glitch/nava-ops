import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Upload,
  File,
  Image,
  Clock,
  MapPin,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Trash2,
  Play,
  Loader2
} from 'lucide-react';
import ModernCard from '../nava-ui/ModernCard';
import NeoButton from '../nava-ui/NeoButton';
import SectionTitle from '../nava-ui/SectionTitle';

/**
 * RefundDetails - Detailed view of a refund with evidence and inspection
 */
const RefundDetails = ({
  refund,
  evidence = [],
  inspection,
  onClose,
  onRunInspection,
  onGenerateMessage,
  onUploadEvidence,
  onDeleteEvidence,
  loading = false
}) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedEvidenceType, setSelectedEvidenceType] = useState('PHOTO');

  // Evidence type options
  const evidenceTypes = [
    { value: 'RECEIPT', label: 'إيصال', icon: FileText },
    { value: 'PHOTO', label: 'صورة', icon: Image },
    { value: 'PACKAGING', label: 'تغليف', icon: File },
    { value: 'PREP_TIME', label: 'وقت تحضير', icon: Clock },
    { value: 'DELIVERY_TIME', label: 'وقت توصيل', icon: Clock },
    { value: 'GPS', label: 'موقع GPS', icon: MapPin },
    { value: 'CHAT', label: 'محادثة', icon: MessageSquare },
    { value: 'OTHER', label: 'أخرى', icon: File },
  ];

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      await onUploadEvidence(refund.id, file, selectedEvidenceType);
    } finally {
      setUploadingFile(false);
    }
  };

  // Get decision badge
  const getDecisionBadge = (decision) => {
    const badges = {
      DISPUTE: { bg: 'bg-purple-500/20', text: 'text-purple-300', icon: AlertTriangle, label: 'يستحق الاعتراض' },
      ACCEPT: { bg: 'bg-red-500/20', text: 'text-red-300', icon: X, label: 'قبول الخصم' },
      NEED_INFO: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', icon: AlertCircle, label: 'يحتاج بيانات' },
    };

    const badge = badges[decision] || badges.NEED_INFO;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${badge.bg} ${badge.text} font-semibold`}>
        <Icon className="w-5 h-5" />
        {badge.label}
      </span>
    );
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <ModernCard variant="glass-strong" className="relative">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#1A1F2E]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">تفاصيل الريفند</h2>
              <p className="text-white/60 mt-1">طلب رقم: {refund.platform_order_id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <SectionTitle title="معلومات الطلب" />
                  <ModernCard variant="glass" className="p-4 space-y-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">المنصة:</span>
                      <span className="text-white font-semibold">{refund.platform_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">المبلغ:</span>
                      <span className="text-white font-semibold">{refund.refund_amount?.toFixed(2)} {refund.currency || 'SAR'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">السبب:</span>
                      <span className="text-white font-semibold">{refund.refund_reason || refund.reason_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">التاريخ:</span>
                      <span className="text-white font-semibold">
                        {new Date(refund.refund_request_time || refund.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    {refund.customer_name && (
                      <div className="flex justify-between">
                        <span className="text-white/60">العميل:</span>
                        <span className="text-white font-semibold">{refund.customer_name}</span>
                      </div>
                    )}
                    {refund.customer_claim && (
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-white/60 text-sm">ادعاء العميل:</span>
                        <p className="text-white mt-1">{refund.customer_claim}</p>
                      </div>
                    )}
                  </ModernCard>
                </div>

                {/* Evidence */}
                <div>
                  <SectionTitle title="الأدلة المرفقة" />

                  {/* Upload Evidence */}
                  <ModernCard variant="glass" className="p-4 mt-3">
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        value={selectedEvidenceType}
                        onChange={(e) => setSelectedEvidenceType(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400/50"
                      >
                        {evidenceTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*,application/pdf"
                          disabled={uploadingFile}
                        />
                        <NeoButton
                          variant="primary"
                          size="sm"
                          as="span"
                          icon={uploadingFile ? Loader2 : Upload}
                          loading={uploadingFile}
                          disabled={uploadingFile}
                        >
                          رفع دليل
                        </NeoButton>
                      </label>
                    </div>

                    {/* Evidence List */}
                    <div className="space-y-2">
                      {evidence.length === 0 ? (
                        <div className="text-center py-6 text-white/40">
                          <File className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>لا توجد أدلة مرفقة</p>
                        </div>
                      ) : (
                        evidence.map((item) => {
                          const EvidenceIcon = evidenceTypes.find(t => t.value === item.type)?.icon || File;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <EvidenceIcon className="w-5 h-5 text-cyan-400" />
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium truncate">{item.file_name || item.type}</div>
                                {item.notes && (
                                  <div className="text-white/60 text-xs mt-1">{item.notes}</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {item.file_url && (
                                  <a
                                    href={item.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                  >
                                    <Download className="w-4 h-4 text-white/60 hover:text-white" />
                                  </a>
                                )}
                                <button
                                  onClick={() => onDeleteEvidence && onDeleteEvidence(item.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ModernCard>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Inspection */}
                <div>
                  <SectionTitle title="نتيجة الفحص" />

                  {!inspection ? (
                    <ModernCard variant="glass" className="p-6 text-center mt-3">
                      <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">لم يتم الفحص بعد</h3>
                      <p className="text-white/60 mb-4">قم بإجراء فحص تلقائي لتقييم الريفند</p>
                      <NeoButton
                        variant="primary"
                        icon={Play}
                        onClick={() => onRunInspection && onRunInspection(refund.id)}
                        loading={loading}
                      >
                        إجراء فحص تلقائي
                      </NeoButton>
                    </ModernCard>
                  ) : (
                    <div className="space-y-4 mt-3">
                      {/* Score & Decision */}
                      <ModernCard variant="glass" className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/60">النتيجة:</span>
                          <span className={`text-3xl font-bold ${getScoreColor(inspection.score)}`}>
                            {inspection.score}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">القرار المقترح:</span>
                          {getDecisionBadge(inspection.decision)}
                        </div>
                      </ModernCard>

                      {/* Justification Bullets */}
                      <ModernCard variant="glass" className="p-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-cyan-400" />
                          التبرير
                        </h4>
                        <ul className="space-y-2">
                          {(inspection.justification || []).map((bullet, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-white/80 text-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span>{bullet}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </ModernCard>

                      {/* Checklist */}
                      <ModernCard variant="glass" className="p-4">
                        <h4 className="text-white font-semibold mb-3">قائمة التحقق</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {inspection.checklist && Object.entries(inspection.checklist).map(([key, value]) => {
                            if (key === 'missing_required_info' || typeof value === 'object') return null;
                            const isGood = value === true || value === 'true';
                            return (
                              <div key={key} className="flex items-center gap-2">
                                {isGood ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-red-400" />
                                )}
                                <span className="text-white/70 text-xs">
                                  {key.replace(/_/g, ' ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </ModernCard>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <NeoButton
                          variant="success"
                          fullWidth
                          onClick={() => onGenerateMessage && onGenerateMessage(refund, inspection)}
                        >
                          إنشاء رسالة اعتراض
                        </NeoButton>
                        <NeoButton
                          variant="secondary"
                          onClick={() => onRunInspection && onRunInspection(refund.id)}
                          loading={loading}
                        >
                          إعادة الفحص
                        </NeoButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModernCard>
      </motion.div>
    </div>
  );
};

export default RefundDetails;
