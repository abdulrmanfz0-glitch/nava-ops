/**
 * Refund Inspection Logic
 * Automated scoring and decision engine for refund claims
 */

/**
 * Main inspection function
 * @param {Object} refund - The refund object
 * @param {Array} evidence - Array of evidence objects
 * @returns {Object} Inspection result with score, decision, checklist, bullets, ask
 */
export function inspectRefund(refund, evidence = []) {
  const checklist = buildChecklist(refund, evidence);
  const score = calculateScore(refund, evidence, checklist);
  const decision = determineDecision(score, checklist);
  const bullets = generateJustificationBullets(refund, evidence, checklist);
  const ask = generateAskStatement(refund, checklist);

  return {
    score,
    decision,
    checklist,
    bullets,
    ask
  };
}

/**
 * Build inspection checklist
 */
function buildChecklist(refund, evidence) {
  const checklist = {
    has_order_id: !!refund.platform_order_id,
    has_amount: !!(refund.refund_amount && refund.refund_amount > 0),
    has_reason: !!refund.refund_reason || !!refund.reason_code,
    has_receipt_evidence: evidence.some(e => e.type === 'RECEIPT'),
    has_photo_evidence: evidence.some(e => e.type === 'PHOTO' || e.type === 'PACKAGING'),
    has_time_evidence: evidence.some(e => e.type === 'PREP_TIME' || e.type === 'DELIVERY_TIME'),
    claim_matches_evidence: 'unknown',
    repeated_customer_pattern: false, // Placeholder for future customer behavior analysis
    internal_possible_fault: 'unknown',
    missing_required_info: []
  };

  // Check for missing required info
  if (!checklist.has_order_id) checklist.missing_required_info.push('order_id');
  if (!checklist.has_amount) checklist.missing_required_info.push('refund_amount');
  if (!checklist.has_reason) checklist.missing_required_info.push('refund_reason');

  // Analyze claim vs evidence match
  checklist.claim_matches_evidence = analyzeClaimEvidenceMatch(refund, evidence, checklist);

  // Check if internal fault is possible
  checklist.internal_possible_fault = checkInternalFault(refund, evidence);

  return checklist;
}

/**
 * Analyze if claim matches available evidence
 */
function analyzeClaimEvidenceMatch(refund, evidence, checklist) {
  const reason = (refund.refund_reason || refund.reason_code || '').toUpperCase();

  // MISSING_ITEM cases
  if (reason.includes('MISSING') || reason.includes('فقد') || reason.includes('ناقص')) {
    if (checklist.has_receipt_evidence && checklist.has_photo_evidence) {
      return true; // Strong evidence contradicts claim
    }
    if (checklist.has_receipt_evidence || checklist.has_photo_evidence) {
      return 'partial';
    }
    return false; // No evidence to contradict
  }

  // LATE delivery cases
  if (reason.includes('LATE') || reason.includes('تأخير') || reason.includes('متأخر')) {
    if (checklist.has_time_evidence) {
      return true; // Have timestamps to verify
    }
    return false;
  }

  // QUALITY cases
  if (reason.includes('QUALITY') || reason.includes('جودة') || reason.includes('سيء')) {
    if (checklist.has_photo_evidence) {
      return true; // Have photos to verify
    }
    return false;
  }

  // WRONG_ORDER cases
  if (reason.includes('WRONG') || reason.includes('خطأ') || reason.includes('خاطئ')) {
    if (checklist.has_receipt_evidence && checklist.has_photo_evidence) {
      return true;
    }
    return 'partial';
  }

  return 'unknown';
}

/**
 * Check if internal fault is possible
 */
function checkInternalFault(refund, evidence) {
  const reason = (refund.refund_reason || refund.reason_code || '').toUpperCase();

  // Kitchen/Prep issues are usually internal
  if (reason.includes('MISSING') || reason.includes('WRONG') || reason.includes('QUALITY')) {
    // But if we have strong evidence, it's likely not our fault
    const hasStrongEvidence = evidence.some(e =>
      e.type === 'RECEIPT' || e.type === 'PHOTO' || e.type === 'PACKAGING'
    );
    return hasStrongEvidence ? false : true;
  }

  // Driver issues are external
  if (reason.includes('LATE') && evidence.some(e => e.type === 'PREP_TIME')) {
    return false; // Not our fault if we prepped on time
  }

  // Customer issues are external
  if (reason.includes('CANCELLED') || reason.includes('ألغى')) {
    return false;
  }

  return 'unknown';
}

/**
 * Calculate dispute worthiness score (0-100)
 */
function calculateScore(refund, evidence, checklist) {
  let score = 0;

  // Base score for having required data (0-20 points)
  if (checklist.has_order_id) score += 5;
  if (checklist.has_amount) score += 5;
  if (checklist.has_reason) score += 10;

  // Evidence quality (0-40 points)
  const evidenceScore = calculateEvidenceScore(refund, evidence, checklist);
  score += evidenceScore;

  // Claim vs Evidence match (0-30 points)
  if (checklist.claim_matches_evidence === true) {
    score += 30; // Strong contradiction = high dispute potential
  } else if (checklist.claim_matches_evidence === 'partial') {
    score += 15;
  } else if (checklist.claim_matches_evidence === false) {
    score += 0; // No evidence to dispute
  } else {
    score += 5; // Unknown = slight benefit
  }

  // Internal fault analysis (0-10 points)
  if (checklist.internal_possible_fault === false) {
    score += 10; // Clearly not our fault
  } else if (checklist.internal_possible_fault === 'unknown') {
    score += 5;
  }

  // Penalize missing info
  const missingPenalty = checklist.missing_required_info.length * 10;
  score -= missingPenalty;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate evidence quality score (0-40)
 */
function calculateEvidenceScore(refund, evidence, checklist) {
  const reason = (refund.refund_reason || refund.reason_code || '').toUpperCase();
  let evidenceScore = 0;

  // MISSING_ITEM: Receipt + Photo = strong
  if (reason.includes('MISSING') || reason.includes('فقد')) {
    if (checklist.has_receipt_evidence) evidenceScore += 15;
    if (checklist.has_photo_evidence) evidenceScore += 15;
    if (evidence.some(e => e.type === 'PACKAGING')) evidenceScore += 10;
  }

  // LATE: Time evidence = strong
  else if (reason.includes('LATE') || reason.includes('تأخير')) {
    if (checklist.has_time_evidence) evidenceScore += 25;
    if (evidence.some(e => e.type === 'GPS')) evidenceScore += 15;
  }

  // QUALITY: Photos = strong
  else if (reason.includes('QUALITY') || reason.includes('جودة')) {
    if (checklist.has_photo_evidence) evidenceScore += 20;
    if (checklist.has_receipt_evidence) evidenceScore += 10;
  }

  // WRONG_ORDER: Receipt + Photo = strong
  else if (reason.includes('WRONG') || reason.includes('خطأ')) {
    if (checklist.has_receipt_evidence) evidenceScore += 20;
    if (checklist.has_photo_evidence) evidenceScore += 15;
  }

  // Generic evidence scoring
  else {
    evidenceScore = evidence.length * 8;
  }

  // Bonus for multiple evidence types
  const evidenceTypes = new Set(evidence.map(e => e.type));
  if (evidenceTypes.size >= 3) evidenceScore += 5;

  return Math.min(40, evidenceScore);
}

/**
 * Determine decision based on score and checklist
 */
function determineDecision(score, checklist) {
  // Missing critical info = NEED_INFO
  if (checklist.missing_required_info.length > 0) {
    return 'NEED_INFO';
  }

  // High score = worthy of dispute
  if (score >= 70) {
    return 'DISPUTE';
  }

  // Medium-low score with no evidence = might need more info
  if (score < 50 && !checklist.has_receipt_evidence && !checklist.has_photo_evidence) {
    return 'NEED_INFO';
  }

  // Low score = accept
  if (score < 50) {
    return 'ACCEPT';
  }

  // Medium score = might need more info
  return 'NEED_INFO';
}

/**
 * Generate justification bullet points
 */
function generateJustificationBullets(refund, evidence, checklist) {
  const bullets = [];
  const reason = (refund.refund_reason || refund.reason_code || '').toUpperCase();
  const reasonAr = refund.reason_raw || refund.refund_reason || '';

  // Order ID confirmation
  if (checklist.has_order_id) {
    bullets.push(`تم التأكد من رقم الطلب: ${refund.platform_order_id}`);
  }

  // Evidence-based bullets
  if (checklist.has_receipt_evidence) {
    bullets.push('لدينا إيصال كامل يوضح جميع الأصناف المطلوبة');
  }

  if (checklist.has_photo_evidence) {
    const photoCount = evidence.filter(e => e.type === 'PHOTO' || e.type === 'PACKAGING').length;
    bullets.push(`لدينا ${photoCount} صورة توضيحية للطلب قبل التسليم`);
  }

  if (checklist.has_time_evidence) {
    bullets.push('سجلات التوقيت تثبت التزامنا بوقت التحضير والتسليم');
  }

  // Reason-specific analysis
  if (reason.includes('MISSING') || reason.includes('فقد')) {
    if (checklist.claim_matches_evidence === true) {
      bullets.push('الإيصال والصور تثبت اكتمال جميع الأصناف');
      bullets.push('تم التحقق من التعبئة والتغليف قبل التسليم للسائق');
    } else {
      bullets.push('لا يوجد دليل قاطع على وجود أو عدم وجود الصنف');
    }
  }

  if (reason.includes('LATE') || reason.includes('تأخير')) {
    if (checklist.has_time_evidence) {
      bullets.push('وقت التحضير كان ضمن المدة المحددة (SLA)');
      bullets.push('تم تسليم الطلب للسائق في الوقت المناسب');
    }
  }

  if (reason.includes('QUALITY') || reason.includes('جودة')) {
    if (checklist.has_photo_evidence) {
      bullets.push('الصور توضح جودة التحضير والتقديم حسب المعايير');
    } else {
      bullets.push('لا توجد أدلة مصورة من العميل توضح مشكلة الجودة');
    }
  }

  if (reason.includes('WRONG') || reason.includes('خطأ')) {
    if (checklist.has_receipt_evidence) {
      bullets.push('الإيصال يطابق تفاصيل الطلب الأصلي بنسبة 100%');
    }
  }

  // Internal fault analysis
  if (checklist.internal_possible_fault === false) {
    bullets.push('الأدلة تشير إلى أن المشكلة خارج نطاق مسؤوليتنا');
  }

  // Add evidence count summary
  if (evidence.length > 0) {
    bullets.push(`إجمالي الأدلة المرفقة: ${evidence.length} مستند/صورة`);
  }

  // If no strong bullets, add generic one
  if (bullets.length === 0) {
    bullets.push('تم مراجعة الطلب ولم نجد أي إثبات واضح للمشكلة المزعومة');
  }

  return bullets;
}

/**
 * Generate "ask" statement for additional info needed
 */
function generateAskStatement(refund, checklist) {
  const missing = checklist.missing_required_info;
  const reason = (refund.refund_reason || refund.reason_code || '').toUpperCase();

  if (missing.length > 0) {
    const missingAr = missing.map(field => {
      switch(field) {
        case 'order_id': return 'رقم الطلب';
        case 'refund_amount': return 'قيمة الخصم';
        case 'refund_reason': return 'سبب الخصم';
        default: return field;
      }
    }).join('، ');
    return `يرجى تزويدنا بالبيانات التالية: ${missingAr}`;
  }

  // Reason-specific asks
  if (reason.includes('MISSING') || reason.includes('فقد')) {
    return 'يرجى تزويدنا بتفاصيل الصنف المفقود المحدد وصورة من العميل إن أمكن.';
  }

  if (reason.includes('LATE') || reason.includes('تأخير')) {
    return 'يرجى تزويدنا بسجل توقيتات السائق والتحديثات من جانبكم للمقارنة.';
  }

  if (reason.includes('QUALITY') || reason.includes('جودة')) {
    return 'يرجى تزويدنا بصور من العميل توضح المشكلة المزعومة للمراجعة والتقييم.';
  }

  if (reason.includes('WRONG') || reason.includes('خطأ')) {
    return 'يرجى تزويدنا بتفاصيل العناصر الخاطئة المزعومة للمقارنة مع إيصالنا.';
  }

  return 'يرجى تزويدنا بأي معلومات إضافية تساعدنا في تقييم هذه الحالة.';
}

/**
 * Export for testing
 */
export const testHelpers = {
  buildChecklist,
  calculateScore,
  determineDecision,
  generateJustificationBullets,
  analyzeClaimEvidenceMatch
};
