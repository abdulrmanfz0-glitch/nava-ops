import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Mail,
  MessageSquare,
  Globe,
  Edit3,
  Loader2
} from 'lucide-react';
import Modal from '../nava-ui/Modal';
import NeoButton from '../nava-ui/NeoButton';
import ModernCard from '../nava-ui/ModernCard';
import SectionTitle from '../nava-ui/SectionTitle';

/**
 * MessageModal - Generate and customize dispute messages
 */
const MessageModal = ({
  isOpen,
  onClose,
  refund,
  inspection,
  onGenerate,
  loading = false
}) => {
  const [language, setLanguage] = useState('ar');
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  // Generate message when modal opens
  useEffect(() => {
    if (isOpen && refund && inspection) {
      handleGenerate();
    }
  }, [isOpen, refund, inspection, language]);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    const result = await onGenerate(refund, inspection, null, language);
    if (result) {
      setMessage(result);
      setEditedSubject(result.subject);
      setEditedBody(result.body);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const fullMessage = `${editMode ? editedSubject : message?.subject}\n\n${editMode ? editedBody : message?.body}`;
    handleCopy(fullMessage, 'all');
  };

  if (!message && !loading) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="رسالة الاعتراض"
      footer={
        <div className="flex items-center gap-3 w-full">
          <NeoButton
            variant="primary"
            fullWidth
            icon={copiedField === 'all' ? Check : Copy}
            onClick={handleCopyAll}
          >
            {copiedField === 'all' ? 'تم النسخ!' : 'نسخ الرسالة كاملة'}
          </NeoButton>
          <NeoButton
            variant={editMode ? 'success' : 'secondary'}
            icon={editMode ? Check : Edit3}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'حفظ' : 'تعديل'}
          </NeoButton>
          <NeoButton
            variant="ghost"
            onClick={onClose}
          >
            إغلاق
          </NeoButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Language Selector */}
        <div>
          <label className="block text-white/60 text-sm mb-2">اللغة</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('ar')}
              className={`p-3 rounded-xl border transition-all ${
                language === 'ar'
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">العربية</span>
              </div>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border transition-all ${
                language === 'en'
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">English</span>
              </div>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Subject */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  الموضوع
                </label>
                <button
                  onClick={() => handleCopy(editMode ? editedSubject : message?.subject, 'subject')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedField === 'subject' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
              {editMode ? (
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              ) : (
                <ModernCard variant="glass" className="p-4">
                  <p className="text-white font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {message?.subject}
                  </p>
                </ModernCard>
              )}
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  نص الرسالة
                </label>
                <button
                  onClick={() => handleCopy(editMode ? editedBody : message?.body, 'body')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedField === 'body' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
              {editMode ? (
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-colors resize-none custom-scrollbar"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              ) : (
                <ModernCard variant="glass" className="p-4">
                  <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {message?.body}
                  </pre>
                </ModernCard>
              )}
            </div>

            {/* Template Info */}
            {message?.template_name && (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span>القالب المستخدم: {message.template_name}</span>
              </div>
            )}

            {/* Tips */}
            <ModernCard variant="glass" className="p-4 border-l-4 border-cyan-400">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                نصائح الإرسال
              </h4>
              <ul className="space-y-1 text-white/70 text-sm">
                <li>• قم بمراجعة الرسالة قبل الإرسال للتأكد من دقة المعلومات</li>
                <li>• أرفق جميع الأدلة الداعمة مع الرسالة</li>
                <li>• تأكد من إرسال الرسالة للقسم المختص في المنصة</li>
                <li>• احتفظ بنسخة من الرسالة للمتابعة</li>
              </ul>
            </ModernCard>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MessageModal;
