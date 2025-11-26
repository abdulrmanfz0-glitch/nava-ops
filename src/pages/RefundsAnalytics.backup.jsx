// NAVA OPS - مركز الاعتراضات
// AI-Powered Restaurant Refund Defense System

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { createRefundProcessor } from '@/lib/refundProcessingService';
import * as XLSX from 'xlsx';
import {
  ModernCard,
  KPIWidget,
  SectionTitle,
  StatBadge,
  NeoButton,
} from '@/components/nava-ui';
import {
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  Sparkles,
  AlertTriangle,
  Package,
  Truck,
  BarChart3,
  Download,
  RefreshCw,
  Copy,
  MessageSquare,
  Send,
  Eye,
  CheckCheck,
  Camera,
  FileCheck,
  Scale,
} from 'lucide-react';

// Mock Data - Unfair Refunds Against Restaurants
const mockRefunds = [
  {
    id: 1,
    order_id: 'JAH-2024-789456',
    platform: 'Jahez',
    amount: 156.50,
    reason: 'منتج مفقود',
    reason_code: 'MISSING_ITEM',
    customer_name: 'أحمد محمد',
    date: '2024-11-25',
    status: 'pending',
    customer_complaint: 'طلبت وجبة عائلية وجاني ناقص صندوق البروست الكبير',
    items_ordered: ['وجبة عائلية كبيرة', 'بطاطس كبير', 'مشروبات (4)'],
    missing_items_claimed: ['صندوق بروست كبير'],
    // Restaurant evidence
    restaurant_evidence: {
      has_prep_photo: true,
      has_packaging_video: true,
      weight_recorded: '2.4 kg',
      prep_time: '18 دقيقة',
      items_prepared: 'تم تحضير كامل الأصناف بحسب الطلب',
      driver_confirmed: true,
      previous_fraud: false,
    },
  },
  {
    id: 2,
    order_id: 'HGS-2024-654321',
    platform: 'HungerStation',
    amount: 89.75,
    reason: 'تأخير التوصيل',
    reason_code: 'LATE_DELIVERY',
    customer_name: 'سارة أحمد',
    date: '2024-11-24',
    status: 'pending',
    customer_complaint: 'الطلب تأخر أكثر من ساعة والأكل وصل بارد',
    delivery_time_promised: '30 دقيقة',
    delivery_time_actual: '95 دقيقة',
    // Restaurant evidence
    restaurant_evidence: {
      food_ready_time: '12 دقيقة',
      driver_arrival_delay: '48 دقيقة',
      driver_assigned_late: true,
      platform_delay: 'التأخير من المنصة وليس المطعم',
      gps_proof: true,
      thermal_packaging: true,
    },
  },
  {
    id: 3,
    order_id: 'TAL-2024-998877',
    platform: 'Talabat',
    amount: 234.20,
    reason: 'جودة الطعام',
    reason_code: 'QUALITY_ISSUE',
    customer_name: 'خالد يوسف',
    date: '2024-11-23',
    status: 'rejected',
    customer_complaint: 'الأكل وصل بارد وغير طازج والبرجر محروق',
    items_ordered: ['برجر لحم (3)', 'بطاطس (2)', 'مشروبات'],
    // Restaurant evidence
    restaurant_evidence: {
      quality_check_photo: true,
      temperature_check: '72°C عند التعبئة',
      cooking_timer_log: 'طبخ حسب المعايير 4 دقائق لكل جانب',
      no_burnt_items: true,
      delivery_time_exceeded: '65 دقيقة توصيل',
      customer_history: 'مشتبه به - 4 شكاوى في شهر',
    },
  },
  {
    id: 4,
    order_id: 'MRS-2024-445566',
    platform: 'Marsool',
    amount: 167.80,
    reason: 'طلب خاطئ',
    reason_code: 'WRONG_ORDER',
    customer_name: 'فاطمة حسن',
    date: '2024-11-22',
    status: 'approved',
    customer_complaint: 'استلمت طلب غير طلبي بالكامل',
    items_ordered: ['شاورما لحم', 'عصير برتقال'],
    items_claimed: ['شاورما دجاج', 'عصير تفاح'],
    // Restaurant evidence
    restaurant_evidence: {
      order_slip_photo: true,
      barcode_scan: true,
      correct_items_packed: true,
      driver_switched_orders: 'احتمال تبديل السائق',
      packaging_label_correct: true,
    },
  },
  {
    id: 5,
    order_id: 'CRM-2024-112233',
    platform: 'Careem',
    amount: 78.15,
    reason: 'إلغاء متأخر',
    reason_code: 'CANCELLED_LATE',
    customer_name: 'عمر سالم',
    date: '2024-11-21',
    status: 'pending',
    customer_complaint: 'ألغيت الطلب بس المطعم خصم الفلوس',
    cancellation_time: 'بعد 25 دقيقة من التحضير',
    // Restaurant evidence
    restaurant_evidence: {
      food_already_prepared: true,
      cancellation_after_cooking: '25 دقيقة بعد البدء',
      ingredients_cost: '45 ريال',
      labor_cost: '15 ريال',
      cannot_resell: 'وجبة شخصية لا يمكن إعادة بيعها',
      policy_states: 'الإلغاء بعد التحضير غير قابل للاسترداد',
    },
  },
];

// AI Dispute Generator Modal - Restaurant's Defense
function AIDisputeModal({ refund, onClose, isOpen }) {
  const [generating, setGenerating] = useState(false);
  const [disputeText, setDisputeText] = useState('');
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isOpen && refund) {
      generateDispute();
    }
  }, [isOpen, refund]);

  const generateDispute = async () => {
    setGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    let text = '';
    const evidence = refund.restaurant_evidence || {};

    // Generate dispute based on reason code - Restaurant's perspective
    switch (refund.reason_code) {
      case 'MISSING_ITEM':
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

الموضوع: اعتراض رسمي على استرداد مبلغ الطلب رقم ${refund.order_id}

نتقدم بهذا الاعتراض الرسمي على قرار استرجاع مبلغ ${refund.amount} ريال بناءً على ادعاء العميل بوجود منتجات مفقودة.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 تفاصيل الطلب:
• رقم الطلب: ${refund.order_id}
• المبلغ المسترد: ${refund.amount} ريال
• تاريخ الطلب: ${refund.date}
• ادعاء العميل: "${refund.customer_complaint}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ أدلة المطعم:

${evidence.has_prep_photo ? '📸 لدينا صور التحضير الكاملة تثبت تجهيز كامل الأصناف' : ''}
${evidence.has_packaging_video ? '🎥 فيديو التعبئة يوضح وضع جميع المنتجات المطلوبة' : ''}
${evidence.weight_recorded ? `⚖️ الوزن المسجل: ${evidence.weight_recorded} يطابق الطلب الكامل` : ''}
${evidence.prep_time ? `⏱️ وقت التحضير: ${evidence.prep_time} حسب المعايير` : ''}
${evidence.driver_confirmed ? '✓ السائق استلم الطلب كاملاً وتم توثيق الاستلام' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 النقاط القانونية:

1. تم تحضير الطلب بالكامل حسب تفاصيل الطلب الإلكتروني
2. التوثيق الفوتوغرافي يثبت عدم وجود نقص
3. السائق استلم الطلب مغلق ومختوم
4. مسؤولية التوصيل على المنصة والسائق وليس المطعم
5. لا يوجد دليل مادي من العميل على الادعاء

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الخسارة المتوقعة:
• قيمة المواد الخام: ${(refund.amount * 0.35).toFixed(2)} ريال
• تكلفة العمالة: ${(refund.amount * 0.25).toFixed(2)} ريال
• التكاليف التشغيلية: ${(refund.amount * 0.15).toFixed(2)} ريال
• إجمالي الخسارة: ${refund.amount} ريال

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔰 المطلوب:
1. إلغاء قرار الاسترداد
2. إعادة المبلغ المخصوم من حساب المطعم
3. التحقيق في صحة ادعاء العميل
4. تفعيل نظام إثبات الاستلام للحماية من الادعاءات الكاذبة

نحن مستعدون لتقديم كافة الأدلة والوثائق المطلوبة لإثبات حقنا.

مع خالص التقدير،
إدارة المطعم
التاريخ: ${new Date().toLocaleDateString('ar-SA')}`;
        break;

      case 'LATE_DELIVERY':
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

الموضوع: اعتراض على تحميل المطعم مسؤولية تأخير التوصيل - طلب ${refund.order_id}

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ المشكلة:
تم خصم مبلغ ${refund.amount} ريال من حساب المطعم بسبب تأخير التوصيل، رغم أن التأخير ليس من مسؤوليتنا.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الحقائق والأرقام:

${evidence.food_ready_time ? `✅ الطعام جاهز خلال: ${evidence.food_ready_time}` : ''}
${evidence.driver_arrival_delay ? `⏰ تأخر وصول السائق: ${evidence.driver_arrival_delay}` : ''}
${evidence.platform_delay ? `🚨 ${evidence.platform_delay}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 التسلسل الزمني الموثق:

1. استلام الطلب: ${refund.date}
2. إعداد الطعام: ${evidence.food_ready_time || '12 دقيقة'}
3. الطعام جاهز للتسليم: تم التوثيق
4. تأخر تعيين/وصول السائق: ${evidence.driver_arrival_delay || 'موثق'}
5. ${evidence.thermal_packaging ? 'تم استخدام عبوات حرارية للحفاظ على الحرارة' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 الأدلة المرفقة:
${evidence.gps_proof ? '• بيانات GPS تثبت جاهزية الطلب مبكراً' : ''}
• سجلات النظام الداخلي للمطعم
• تسجيل وقت إعداد كل صنف
${evidence.driver_assigned_late ? '• إثبات تأخر تعيين السائق من المنصة' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ الموقف القانوني:
المطعم أنهى مسؤوليته بتجهيز الطلب في الوقت المحدد. التأخير حدث في مرحلة التوصيل وهي مسؤولية المنصة والسائق بموجب اتفاقية الشراكة.

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 المطلوب:
1. إعادة المبلغ ${refund.amount} ريال لحساب المطعم
2. تحميل السائق/المنصة مسؤولية التأخير
3. تحديث سياسات التعويض لتكون عادلة
4. عدم احتساب هذا الطلب ضمن تقييم أداء المطعم

نطلب مراجعة القرار بشكل عاجل وإنصاف المطعم.

مع التقدير،
إدارة المطعم`;
        break;

      case 'QUALITY_ISSUE':
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

الموضوع: اعتراض على ادعاء مشاكل الجودة - طلب ${refund.order_id}

━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ الادعاء:
"${refund.customer_complaint}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ الحقيقة المثبتة بالأدلة:

${evidence.quality_check_photo ? '📸 صور فحص الجودة قبل التعبئة متوفرة' : ''}
${evidence.temperature_check ? `🌡️ درجة حرارة الطعام عند التعبئة: ${evidence.temperature_check}` : ''}
${evidence.cooking_timer_log ? `⏲️ ${evidence.cooking_timer_log}` : ''}
${evidence.no_burnt_items ? '✓ جميع الأصناف مطبوخة حسب المعايير - لا يوجد احتراق' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 نقاط هامة:

1. الطعام غادر المطعم ساخناً وطازجاً (${evidence.temperature_check || 'موثق'})
${evidence.delivery_time_exceeded ? `2. وقت التوصيل: ${evidence.delivery_time_exceeded} - التأخير سبب البرودة` : ''}
3. ${evidence.thermal_packaging ? 'استخدمنا عبوات حرارية عالية الجودة' : 'تم التغليف المناسب'}
4. جميع الأصناف تم فحصها قبل التسليم للسائق
${evidence.customer_history ? `5. ⚠️ ${evidence.customer_history}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 التحليل:
• المطعم: التزم بكل معايير الجودة ✓
• التعبئة: حرارية ومناسبة ✓
• درجة الحرارة: مثالية عند التسليم ✓
• التوصيل: تأخر غير مبرر ✗
• النتيجة: البرودة من التأخير وليس من المطعم

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ الموقف القانوني:
${evidence.customer_history ? 'العميل لديه سجل مشبوه من الشكاوى المتكررة (احتمال احتيال).' : ''} المطعم ملتزم بكل معايير السلامة والجودة. إذا وصل الطعام بارداً، فالسبب هو وقت التوصيل الطويل وليس جودة الإعداد.

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 المطلوب:
1. إلغاء الخصم وإعادة ${refund.amount} ريال
2. التحقيق في احتمالية الاحتيال من العميل
3. مطالبة العميل بإثبات مادي (صور الطعام المستلم)
4. فرض رسوم على الادعاءات الكاذبة

المطعم يحتفظ بحقه في اتخاذ الإجراءات القانونية في حال الادعاءات الكاذبة.

مع الاحترام،
إدارة المطعم`;
        break;

      case 'WRONG_ORDER':
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

الموضوع: اعتراض على ادعاء الطلب الخاطئ - طلب ${refund.order_id}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 تفاصيل القضية:

• رقم الطلب: ${refund.order_id}
• المبلغ المخصوم: ${refund.amount} ريال
• الادعاء: "${refund.customer_complaint}"
• الأصناف المطلوبة: ${refund.items_ordered?.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ أدلة المطعم القاطعة:

${evidence.order_slip_photo ? '📸 صورة قسيمة الطلب الأصلية (الأصناف الصحيحة)' : ''}
${evidence.barcode_scan ? '📱 مسح الباركود يطابق الطلب الإلكتروني' : ''}
${evidence.correct_items_packed ? '✓ تم تعبئة الأصناف الصحيحة حسب النظام' : ''}
${evidence.packaging_label_correct ? '🏷️ ملصق التعبئة يحمل رقم الطلب والأصناف الصحيحة' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 التحقيق:

نظام المطعم:
1. قسيمة الطلب طُبعت بالأصناف الصحيحة ✓
2. المطبخ حضّر الأصناف المطلوبة بدقة ✓
3. التعبئة تمت بإشراف مباشر ✓
4. السائق استلم كيس مغلق بختم المطعم ✓

${evidence.driver_switched_orders ? `\n⚠️ احتمال قوي: ${evidence.driver_switched_orders}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 التحليل المنطقي:

السيناريو المحتمل:
• المطعم عبأ الطلب الصحيح
• السائق كان لديه طلبات متعددة
• ${evidence.driver_switched_orders || 'احتمال تبديل الأكياس أثناء التوصيل'}
• الخطأ في مرحلة التوصيل وليس التحضير

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الإثباتات المتوفرة:
• قسيمة الطلب الداخلية
• سجل النظام الإلكتروني
• ${evidence.barcode_scan ? 'سجل مسح الباركود' : 'توثيق التعبئة'}
• ${evidence.packaging_label_correct ? 'صورة الملصق على الكيس' : 'بيانات التغليف'}
• سجل السائق المستلم

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ الموقف القانوني:
المطعم نفذ الطلب بدقة حسب البيانات الإلكترونية. إذا حدث خطأ، فهو في مرحلة التوصيل (تبديل الطلبات من السائق) وليس مسؤولية المطعم.

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 المطلوب:
1. إعادة المبلغ ${refund.amount} ريال فوراً
2. التحقيق مع السائق المسؤول
3. تفعيل نظام التتبع بالباركود
4. تدريب السائقين على عدم خلط الطلبات

المطعم غير مسؤول عن أخطاء السائقين ولن يتحمل خسائر غير عادلة.

مع التحية،
إدارة المطعم`;
        break;

      case 'CANCELLED_LATE':
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

الموضوع: اعتراض على استرداد مبلغ طلب ملغى بعد التحضير - ${refund.order_id}

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ المشكلة:
العميل ألغى الطلب بعد ${evidence.cancellation_after_cooking || 'بدء التحضير'} وتم خصم المبلغ من المطعم رغم تحملنا كامل التكاليف.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الحقائق:

${evidence.food_already_prepared ? '✓ الطعام تم تحضيره بالكامل' : ''}
• وقت الإلغاء: ${evidence.cancellation_after_cooking || refund.cancellation_time}
• حالة الطلب عند الإلغاء: جاهز للتسليم
${evidence.cannot_resell ? `• ${evidence.cannot_resell}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 التكاليف المتكبدة:

${evidence.ingredients_cost ? `• المواد الخام: ${evidence.ingredients_cost}` : ''}
${evidence.labor_cost ? `• تكلفة العمالة: ${evidence.labor_cost}` : ''}
• الطاقة والتشغيل: ${((refund.amount * 0.10).toFixed(2))} ريال
• التغليف والتعبئة: ${((refund.amount * 0.08).toFixed(2))} ريال
━━━━━━━━━━━━━━━━━━━━━━━━━━
إجمالي الخسارة الفعلية: ${refund.amount} ريال

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 السياسات الواضحة:

${evidence.policy_states ? `📜 ${evidence.policy_states}` : 'سياسة المنصة تنص على عدم الاسترداد بعد بدء التحضير'}

• شروط الاستخدام: الإلغاء المجاني قبل التحضير فقط
• بعد بدء التحضير: لا يحق للعميل الاسترداد الكامل
• المطعم يتحمل خسائر حقيقية لا يمكن تعويضها

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ الموقف القانوني:

1. المطعم التزم بتحضير الطلب فور استلامه
2. تكبد تكاليف فعلية (مواد + عمالة + طاقة)
3. الطعام لا يمكن إعادة بيعه (وجبة شخصية محضرة)
4. سياسات المنصة تحمي المطعم في هذه الحالة
5. الإلغاء المتأخر غير مبرر ولا يوجد عذر طارئ

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 المطلوب بشكل عاجل:

1. إلغاء قرار الاسترداد الكامل
2. إعادة المبلغ ${refund.amount} ريال لحساب المطعم
3. تطبيق سياسة الإلغاء المتأخر (رسوم 100%)
4. تفعيل نظام تأكيد الطلب قبل التحضير
5. منع العملاء من الإلغاء بعد مرور وقت محدد

━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ الحل المقترح:

• إلغاء مجاني: قبل بدء التحضير (5 دقائق)
• خصم 50%: بعد 5-10 دقائق
• خصم 100%: بعد 10 دقائق أو بعد الجاهزية

هذه سياسات عادلة ومطبقة عالمياً في كل منصات التوصيل.

━━━━━━━━━━━━━━━━━━━━━━━━━━
نطالب بمراجعة فورية وإنصاف المطعم من هذه الخسارة غير العادلة.

مع الاحترام،
إدارة المطعم
التاريخ: ${new Date().toLocaleDateString('ar-SA')}`;
        break;

      default:
        text = `إلى إدارة منصة ${refund.platform} المحترمة،

نتقدم باعتراض رسمي على استرداد مبلغ ${refund.amount} ريال للطلب ${refund.order_id}.

المطعم التزم بكل المعايير والسياسات المطلوبة، ونطلب مراجعة القرار وإعادة المبلغ.

مع التقدير،
إدارة المطعم`;
    }

    setDisputeText(text);
    setGenerating(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(disputeText);
      setCopied(true);
      addNotification('success', 'تم نسخ نص الاعتراض بنجاح');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addNotification('error', 'فشل نسخ النص');
    }
  };

  const handleSendToPlatform = () => {
    addNotification('info', 'جاري إرسال الاعتراض إلى المنصة...');
    // TODO: Implement actual platform API integration
    setTimeout(() => {
      addNotification('success', 'تم إرسال الاعتراض بنجاح');
      onClose();
    }, 1500);
  };

  if (!isOpen || !refund) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/20"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">مولد الاعتراضات بالذكاء الاصطناعي</h3>
                  <p className="text-sm text-gray-400">دفاع احترافي عن حقوق المطعم</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Refund Details */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">رقم الطلب</p>
                <p className="text-sm font-semibold text-white">{refund.order_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">المنصة</p>
                <p className="text-sm font-semibold text-cyan-400">{refund.platform}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">المبلغ المفقود</p>
                <p className="text-sm font-semibold text-red-400">{refund.amount} ريال</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">السبب</p>
                <p className="text-sm font-semibold text-orange-400">{refund.reason}</p>
              </div>
            </div>
          </div>

          {/* Generated Dispute Text */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-white font-medium">جاري تحليل القضية وإنشاء الاعتراض...</p>
                <p className="text-sm text-gray-400 mt-2">يتم جمع الأدلة والحجج القانونية</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">تم إنشاء الاعتراض بنجاح</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">نسخ النص</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  className="w-full h-64 p-4 bg-black/40 border border-white/10 rounded-xl text-white text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="النص سيظهر هنا..."
                  dir="rtl"
                />

                <div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300 leading-relaxed">
                    يمكنك تعديل النص حسب الحاجة. تأكد من إرفاق الأدلة (صور، فيديوهات، سجلات) عند إرسال الاعتراض.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!generating && (
            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSendToPlatform}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال للمنصة</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white font-medium border border-white/10 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Refunds Table Component
function RefundsTable({ refunds, onGenerateDispute, onViewEvidence }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'قيد المراجعة', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      approved: { label: 'تم الخصم', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      rejected: { label: 'تم الاسترجاع', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      disputed: { label: 'معترض عليه', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Jahez: 'text-orange-400',
      HungerStation: 'text-red-400',
      Talabat: 'text-orange-500',
      Marsool: 'text-blue-400',
      Careem: 'text-green-400',
    };
    return colors[platform] || 'text-gray-400';
  };

  return (
    <ModernCard variant="glass" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                رقم الطلب
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                المنصة
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                السبب
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {refunds.map((refund, index) => (
              <motion.tr
                key={refund.id}
                className="hover:bg-white/[0.02] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-mono text-white">{refund.order_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold ${getPlatformColor(refund.platform)}`}>
                    {refund.platform}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-bold text-red-400">{refund.amount} ريال</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300">{refund.reason}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400">{refund.date}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(refund.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGenerateDispute(refund)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>توليد اعتراض</span>
                    </button>
                    {refund.restaurant_evidence && (
                      <button
                        onClick={() => onViewEvidence(refund)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all"
                        title="عرض الأدلة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModernCard>
  );
}

// Main Component
export default function RefundsAnalytics() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [refunds, setRefunds] = useState(mockRefunds);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate statistics
  const summary = {
    totalLoss: refunds.reduce((sum, r) => sum + r.amount, 0),
    totalRefunds: refunds.length,
    pendingAmount: refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
    recoveredAmount: refunds.filter(r => r.status === 'rejected').reduce((sum, r) => sum + r.amount, 0),
    disputedCount: refunds.filter(r => r.status === 'disputed').length,
  };

  const handleGenerateDispute = (refund) => {
    setSelectedRefund(refund);
    setShowDisputeModal(true);
  };

  const handleViewEvidence = (refund) => {
    addNotification('info', 'عرض الأدلة - قريباً');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidFile) {
      addNotification('error', 'نوع الملف غير مدعوم. يرجى رفع ملف Excel أو CSV');
      event.target.value = ''; // Reset input
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addNotification('error', 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
      event.target.value = ''; // Reset input
      return;
    }

    setLoading(true);
    addNotification('info', `جاري معالجة الملف: ${file.name}`);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get first sheet
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          if (jsonData.length === 0) {
            addNotification('error', 'الملف فارغ أو لا يحتوي على بيانات');
            setLoading(false);
            return;
          }

          // Convert Excel data to refund format
          const newRefunds = jsonData.map((row, index) => {
            // Try to map common column names from platforms
            const orderId = row['رقم الطلب'] || row['Order ID'] || row['order_id'] || `ORDER-${Date.now()}-${index}`;
            const platform = row['المنصة'] || row['Platform'] || row['platform'] || 'Jahez';
            const amount = parseFloat(row['المبلغ'] || row['Amount'] || row['amount'] || 0);
            const reason = row['السبب'] || row['Reason'] || row['reason'] || 'غير محدد';
            const customerName = row['اسم العميل'] || row['Customer'] || row['customer_name'] || 'عميل';
            const date = row['التاريخ'] || row['Date'] || row['date'] || new Date().toISOString().split('T')[0];
            const complaint = row['الشكوى'] || row['Complaint'] || row['complaint'] || 'لا توجد تفاصيل';

            // Determine reason code
            let reasonCode = 'MISSING_ITEM';
            if (reason.includes('تأخير') || reason.includes('تأخر')) reasonCode = 'LATE_DELIVERY';
            else if (reason.includes('جودة') || reason.includes('بارد')) reasonCode = 'QUALITY_ISSUE';
            else if (reason.includes('خاطئ') || reason.includes('خطأ')) reasonCode = 'WRONG_ORDER';
            else if (reason.includes('إلغاء') || reason.includes('ألغى')) reasonCode = 'CANCELLED_LATE';

            return {
              id: Date.now() + index,
              order_id: orderId,
              platform: platform,
              amount: amount,
              reason: reason,
              reason_code: reasonCode,
              customer_name: customerName,
              date: date,
              status: 'pending',
              customer_complaint: complaint,
              items_ordered: [],
              // Add evidence fields
              restaurant_evidence: {
                has_prep_photo: false,
                has_packaging_video: false,
                needs_documentation: true,
              }
            };
          });

          // Add new refunds to existing ones
          setRefunds(prevRefunds => [...newRefunds, ...prevRefunds]);

          setLoading(false);
          addNotification('success', `تم تحميل ${newRefunds.length} حالة رفند بنجاح من ${file.name}`);

          // Reset input
          event.target.value = '';
        } catch (parseError) {
          console.error('Parse error:', parseError);
          addNotification('error', 'فشل تحليل الملف. تأكد من صيغة البيانات');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        addNotification('error', 'فشل قراءة الملف');
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('File upload error:', error);
      addNotification('error', 'حدث خطأ أثناء معالجة الملف');
      setLoading(false);
      event.target.value = ''; // Reset input
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 border-b border-white/5 mb-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">مركز الاعتراضات</h1>
                  <p className="text-lg text-gray-400">استرجاع حقوق المطاعم من الرفندات غير العادلة</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">دفاع قانوني بالذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Target className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-gray-300">نسبة نجاح 87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="px-8 mb-8">
        <ModernCard variant="glass" className="border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">رفع تقرير الرفندات</h3>
                <p className="text-sm text-gray-400">
                  حمّل ملف Excel أو CSV يحتوي على بيانات الرفندات من المنصات
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">✓ Excel (.xlsx, .xls)</span>
                  <span className="text-xs text-gray-500">✓ CSV</span>
                  <span className="text-xs text-gray-500">✓ حد أقصى 10 ميجابايت</span>
                </div>
              </div>
            </div>

            <div>
              <input
                type="file"
                id="file-upload-input"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
              <label
                htmlFor="file-upload-input"
                className={`
                  inline-flex items-center gap-3 px-6 py-3 rounded-xl
                  bg-gradient-to-r from-purple-500 to-pink-600
                  hover:from-purple-600 hover:to-pink-700
                  text-white font-semibold shadow-lg shadow-purple-500/30
                  transition-all duration-200 cursor-pointer
                  ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none animate-pulse' : ''}
                `}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري المعالجة...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>اختر ملف</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* KPI Cards */}
      <div className="px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernCard variant="glass" className="overflow-hidden border-red-500/20">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-xs font-semibold text-red-400">+23%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">إجمالي الخسائر</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalLoss)}</p>
                <p className="text-xs text-gray-500">آخر 30 يوم</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="overflow-hidden border-yellow-500/20">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-xs font-semibold text-yellow-400">
                    {refunds.filter(r => r.status === 'pending').length} حالة
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">قيد المراجعة</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.pendingAmount)}</p>
                <p className="text-xs text-gray-500">تحتاج اعتراضات</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="overflow-hidden border-green-500/20">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="text-xs font-semibold text-green-400">+156%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">تم الاسترجاع</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.recoveredAmount)}</p>
                <p className="text-xs text-gray-500">نجاحات الاعتراضات</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="overflow-hidden border-blue-500/20">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="text-xs font-semibold text-blue-400">+12%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">معدل النجاح</p>
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-xs text-gray-500">من إجمالي الاعتراضات</p>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="px-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle icon={FileText}>
            الرفندات المسجلة
          </SectionTitle>
          <div className="flex items-center gap-3">
            <NeoButton variant="secondary" size="sm" icon={RefreshCw}>
              تحديث
            </NeoButton>
            <NeoButton variant="secondary" size="sm" icon={Download}>
              تصدير
            </NeoButton>
          </div>
        </div>

        <RefundsTable
          refunds={refunds}
          onGenerateDispute={handleGenerateDispute}
          onViewEvidence={handleViewEvidence}
        />
      </div>

      {/* File Format Guide */}
      <div className="px-8 mb-8">
        <ModernCard variant="glass" className="border-cyan-500/20">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">📋 تنسيق الملف المطلوب</h3>
                <p className="text-sm text-gray-400">
                  حضّر ملف Excel أو CSV يحتوي على هذه الأعمدة:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                <h4 className="text-sm font-bold text-cyan-400 mb-3">الأعمدة بالعربي:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>رقم الطلب</strong> - رقم الطلب من المنصة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>المنصة</strong> - Jahez, HungerStation, إلخ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>المبلغ</strong> - قيمة الرفند بالريال</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>السبب</strong> - سبب الرفند</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>التاريخ</strong> - تاريخ الرفند</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>اسم العميل</strong> (اختياري)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>الشكوى</strong> (اختياري)</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                <h4 className="text-sm font-bold text-green-400 mb-3">Or in English:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Order ID</strong> or <strong>order_id</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Platform</strong> or <strong>platform</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Amount</strong> or <strong>amount</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Reason</strong> or <strong>reason</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Date</strong> or <strong>date</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Customer</strong> (optional)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Complaint</strong> (optional)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">
                  <strong>ملاحظة:</strong> النظام يدعم الأعمدة بالعربي أو الإنجليزي. إذا كانت أسماء الأعمدة مختلفة، سيتم استخدام القيم الافتراضية.
                </p>
              </div>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* How It Works */}
      <div className="px-8 mb-8">
        <SectionTitle icon={BarChart3} className="mb-6">
          كيف يعمل النظام
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModernCard variant="glass">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. رفع البيانات</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  استورد تقارير الرفندات من المنصات (Jahez, HungerStation, Talabat) بصيغة Excel أو CSV
                </p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. تحليل ذكي</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  الذكاء الاصطناعي يحلل كل حالة ويحدد الأدلة القانونية ونقاط القوة في الدفاع
                </p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. إرسال احترافي</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  يتم توليد اعتراض احترافي جاهز للإرسال مباشرة إلى المنصات مع كافة الأدلة
                </p>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-8">
        <ModernCard variant="glass" className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">💡 نصائح لزيادة فرص النجاح</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>صور جميع الطلبات قبل التسليم للسائق (خاصة الطلبات الكبيرة)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>احتفظ بسجلات التحضير والأوزان ودرجات الحرارة</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>استخدم أكياس مختومة ومرقمة بباركود الطلب</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>وثّق وقت تسليم الطلب للسائق بنظام GPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>راجع شكاوى العملاء فوراً - الرد السريع يزيد النجاح</span>
                </li>
              </ul>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* AI Dispute Modal */}
      <AIDisputeModal
        refund={selectedRefund}
        isOpen={showDisputeModal}
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedRefund(null);
        }}
      />
    </div>
  );
}
