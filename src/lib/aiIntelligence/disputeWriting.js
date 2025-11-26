/**
 * Dispute Writing AI
 * DeliveryOps MAX AI - Automated professional objection generation
 *
 * 5 Levels of Objections:
 * 1. Light - Polite and understanding
 * 2. Moderate - Evidence-based and factual
 * 3. Strong - Policy-focused with documentation
 * 4. Hard - Defensive with comprehensive evidence
 * 5. Aggressive - Used only for clear fraud cases
 */

/**
 * Generates a professional dispute objection
 * @param {Object} refund - Refund request data
 * @param {Object} analysis - AI analysis of the refund
 * @param {Object} customerBehavior - Customer behavior data
 * @param {Object} evidence - Supporting evidence
 * @param {String} level - Objection level (light, moderate, strong, hard, aggressive)
 * @param {String} platform - Platform name (jahez, hungerstation, etc.)
 * @returns {Object} Generated dispute objection
 */
export function generateDispute(refund, analysis, customerBehavior, evidence, level = 'moderate', platform = '') {
  const dispute = {
    objectionText: '',
    level,
    confidence: 0,
    evidenceItems: [],
    recommendedLevel: '',
    alternativeLevels: []
  };

  // Determine recommended level if not specified
  if (!level || level === 'auto') {
    level = determineOptimalObjectionLevel(analysis, customerBehavior, refund);
  }

  dispute.recommendedLevel = level;

  // Generate objection based on level
  switch (level) {
    case 'light':
      dispute.objectionText = generateLightObjection(refund, analysis, evidence, platform);
      dispute.confidence = 60;
      break;
    case 'moderate':
      dispute.objectionText = generateModerateObjection(refund, analysis, evidence, platform);
      dispute.confidence = 75;
      break;
    case 'strong':
      dispute.objectionText = generateStrongObjection(refund, analysis, evidence, platform);
      dispute.confidence = 85;
      break;
    case 'hard':
      dispute.objectionText = generateHardObjection(refund, analysis, evidence, platform);
      dispute.confidence = 90;
      break;
    case 'aggressive':
      dispute.objectionText = generateAggressiveObjection(refund, analysis, evidence, platform);
      dispute.confidence = 95;
      break;
    default:
      dispute.objectionText = generateModerateObjection(refund, analysis, evidence, platform);
      dispute.confidence = 75;
  }

  // Collect evidence items
  dispute.evidenceItems = collectEvidenceItems(refund, analysis, evidence);

  // Generate alternative levels
  dispute.alternativeLevels = generateAlternativeVersions(refund, analysis, evidence, platform, level);

  return dispute;
}

/**
 * Determines the optimal objection level based on analysis
 */
function determineOptimalObjectionLevel(analysis, customerBehavior, refund) {
  const fraudScore = analysis.fraudScore || 0;
  const refundAmount = refund.refund_amount || 0;

  // Aggressive - Clear fraud cases
  if (fraudScore >= 80 || (customerBehavior?.refund_rate >= 60 && fraudScore >= 60)) {
    return 'aggressive';
  }

  // Hard - High fraud with significant amount
  if (fraudScore >= 65 || (refundAmount > 300 && fraudScore >= 50)) {
    return 'hard';
  }

  // Strong - Medium-high fraud or policy violations
  if (fraudScore >= 45 || customerBehavior?.refund_rate >= 30) {
    return 'strong';
  }

  // Moderate - Standard disputes
  if (fraudScore >= 25 || refundAmount > 100) {
    return 'moderate';
  }

  // Light - Low fraud, maintain relationship
  return 'light';
}

/**
 * Level 1: Light - Polite and Understanding
 */
function generateLightObjection(refund, analysis, evidence, platform) {
  const platformGreeting = getPlatformGreeting(platform);
  const orderRef = refund.platform_order_id || 'N/A';
  const timestamp = formatTimestamp(refund.order_time);

  const objection = `${platformGreeting}

**Subject: Refund Request Review - Order #${orderRef}**

Thank you for bringing this matter to our attention. We take customer satisfaction very seriously and want to ensure a fair resolution for all parties.

**Order Details:**
- Order Number: ${orderRef}
- Order Time: ${timestamp}
- Refund Reason: ${refund.refund_reason}
- Amount Requested: ${refund.refund_amount} SAR

**Our Review:**
We have thoroughly reviewed this order and found the following:

${generateEvidenceSummary(evidence)}

**Quality Confirmation:**
- Our kitchen team confirmed the meal was prepared according to our standard recipes
- Quality control checks were completed before dispatch
- Food temperature was maintained throughout preparation

**Timeline Analysis:**
- Order preparation completed: ${formatDuration(refund.preparation_duration_minutes)}
- Delivery time: ${formatDuration(refund.delivery_duration_minutes)}
- Total time within acceptable service standards

**Our Position:**
While we understand the customer's concern, our internal review shows that the order was prepared and delivered according to our quality standards. We believe this may be a misunderstanding or a case of differing expectations.

**Proposed Resolution:**
We would like to offer the customer a ${getCompensationOffer(refund.refund_amount, 'light')} discount voucher for their next order as a gesture of goodwill, while respectfully declining the full refund request.

We value our partnership with ${platform || 'your platform'} and appreciate your fair consideration of this case.

Best regards,
Restaurant Management Team`;

  return objection;
}

/**
 * Level 2: Moderate - Evidence-Based and Factual
 */
function generateModerateObjection(refund, analysis, evidence, platform) {
  const platformGreeting = getPlatformGreeting(platform);
  const orderRef = refund.platform_order_id || 'N/A';
  const timestamp = formatTimestamp(refund.order_time);
  const deliveryTime = formatTimestamp(refund.delivery_time);

  const objection = `${platformGreeting}

**Subject: Formal Objection to Refund Request - Order #${orderRef}**

We are writing to formally dispute the refund request for the above-referenced order based on documented evidence and operational records.

**ORDER INFORMATION**
- Order ID: ${orderRef}
- Platform: ${platform || refund.platform_name}
- Order Timestamp: ${timestamp}
- Delivery Timestamp: ${deliveryTime}
- Customer: ${refund.customer_name || 'Customer ID: ' + refund.customer_id}

**REFUND CLAIM**
- Claimed Issue: ${refund.refund_reason}
- Amount Requested: ${refund.refund_amount} SAR
- Order Total: ${refund.original_order_amount} SAR

**DOCUMENTED EVIDENCE**

${generateDetailedEvidence(evidence, refund)}

**OPERATIONAL VERIFICATION**

1. **Kitchen Preparation:**
   - Start Time: ${timestamp}
   - Completion Time: ${formatDuration(refund.preparation_duration_minutes)} minutes
   - Quality checks: ✓ Passed
   - Temperature verification: ✓ Confirmed

2. **Order Accuracy:**
   - Items prepared: ${getItemsList(refund.refunded_items)}
   - Packaging checklist: ✓ Completed
   - Double-verification: ✓ Confirmed

3. **Delivery Process:**
   - Assigned driver: ${refund.driver_name || 'Driver ID: ' + refund.driver_id}
   - Delivery duration: ${formatDuration(refund.delivery_duration_minutes)} minutes
   - Delivery confirmation: ✓ Customer signed/confirmed

**POLICY COMPLIANCE**

Our records demonstrate full compliance with ${platform || 'platform'} service standards:
- Preparation time within acceptable range (< 30 minutes)
- Delivery time within standard window (< 60 minutes)
- All quality protocols followed
- Complete order fulfillment verified

**CUSTOMER PATTERN ANALYSIS**

${generateCustomerPatternStatement(analysis, refund)}

**OUR POSITION**

Based on the evidence presented, we respectfully request that this refund claim be **DENIED**. Our operational records show that we fulfilled our obligations according to platform standards and delivered a quality product in a timely manner.

The claim appears to be based on subjective preference rather than legitimate service failure.

**SUPPORTING DOCUMENTATION**

We can provide the following upon request:
${evidence.photos ? '✓ Photographic evidence of meal preparation' : ''}
${evidence.timestamps ? '✓ Complete timestamp logs' : ''}
${evidence.driverStatement ? '✓ Driver delivery confirmation' : ''}
${evidence.qualityChecks ? '✓ Quality control documentation' : ''}

We trust you will review this case fairly and uphold the evidence-based approach to dispute resolution.

Respectfully,
Operations Management Team`;

  return objection;
}

/**
 * Level 3: Strong - Policy-Focused with Documentation
 */
function generateStrongObjection(refund, analysis, evidence, platform) {
  const platformGreeting = getPlatformGreeting(platform);
  const orderRef = refund.platform_order_id || 'N/A';

  const objection = `${platformGreeting}

**RE: FORMAL DISPUTE AND OBJECTION - Order #${orderRef}**
**Case Priority: HIGH**

This letter serves as our formal and comprehensive objection to the refund request referenced above. We have conducted a thorough investigation and present substantial evidence demonstrating that this claim lacks merit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**CASE SUMMARY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: ${orderRef}
Platform: ${platform || refund.platform_name}
Date/Time: ${formatTimestamp(refund.order_time)}
Refund Claim: ${refund.refund_reason}
Amount in Dispute: ${refund.refund_amount} SAR
Fraud Risk Assessment: ${analysis.fraudScore}/100 (${analysis.riskLevel})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**GROUNDS FOR OBJECTION**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. COMPLETE ORDER FULFILLMENT - VERIFIED**

We have irrefutable evidence that this order was:
✓ Prepared according to exact specifications
✓ Quality-checked at multiple stages
✓ Packaged securely with proper materials
✓ Delivered within acceptable timeframe
✓ Confirmed received by customer

**2. COMPLIANCE WITH PLATFORM POLICIES**

Our service delivery met or exceeded ALL platform standards:

| Metric | Standard | Our Performance | Status |
|--------|----------|-----------------|--------|
| Prep Time | < 30 min | ${refund.preparation_duration_minutes || 'N/A'} min | ${refund.preparation_duration_minutes < 30 ? '✓ PASS' : '⚠ See Note*'} |
| Delivery | < 60 min | ${refund.delivery_duration_minutes || 'N/A'} min | ${refund.delivery_duration_minutes < 60 ? '✓ PASS' : '⚠ See Note*'} |
| Quality | High | Verified | ✓ PASS |
| Accuracy | 100% | Verified | ✓ PASS |

${refund.preparation_duration_minutes >= 30 || refund.delivery_duration_minutes >= 60 ? '*Note: Any delays were communicated to customer in advance as per protocol' : ''}

**3. DOCUMENTED EVIDENCE PACKAGE**

${generateComprehensiveEvidence(evidence, refund)}

**4. CUSTOMER BEHAVIOR PATTERN ANALYSIS**

${generateDetailedCustomerAnalysis(analysis, refund)}

**5. QUALITY ASSURANCE VERIFICATION**

Meal Quality Confirmation:
- Fresh ingredients used: ✓ Verified
- Proper cooking temperatures maintained: ✓ Verified (${evidence.temperature || '65°C+'})
- Hygiene standards exceeded: ✓ Verified
- Presentation standards met: ✓ Verified
- Packaging integrity: ✓ Verified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**POLICY VIOLATIONS BY CUSTOMER**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${generatePolicyViolations(refund, analysis, evidence)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**LEGAL AND CONTRACTUAL POSITION**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Per ${platform || 'platform'} Merchant Agreement Section [X]:
- Refunds require substantiated evidence of service failure
- Subjective taste preferences do not constitute grounds for refund
- Merchant has right to dispute unsubstantiated claims
- Customer misrepresentation may result in account review

**OUR DEMAND:**

We formally request that this refund claim be **REJECTED IN FULL** based on:
1. Complete fulfillment of service obligations
2. Lack of legitimate grounds for refund
3. Substantial contradicting evidence
4. Pattern of questionable customer behavior

**ALTERNATIVE RESOLUTION:**

Should ${platform || 'the platform'} wish to maintain customer relations, we propose:
- Customer receives warning regarding false claims
- No refund issued to restaurant
- Platform may offer customer credit at platform's expense
- Case documented for future reference

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**SUPPORTING DOCUMENTATION ATTACHED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${listAvailableEvidence(evidence)}

We expect a thorough review of this case and a decision based on facts and evidence, not unsubstantiated customer claims. We reserve all rights under our merchant agreement and applicable regulations.

This matter requires urgent attention. We request a response within 48 hours.

Respectfully but firmly,
Senior Management Team

CC: Merchant Relations Department
CC: Dispute Resolution Team`;

  return objection;
}

/**
 * Level 4: Hard - Defensive with Comprehensive Evidence
 */
function generateHardObjection(refund, analysis, evidence, platform) {
  const platformGreeting = getPlatformGreeting(platform);
  const orderRef = refund.platform_order_id || 'N/A';

  const objection = `${platformGreeting}

**⚠️ URGENT: FRAUDULENT REFUND CLAIM - IMMEDIATE ACTION REQUIRED**

**Case #${orderRef} - FORMAL DISPUTE AND FRAUD ALERT**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**EXECUTIVE SUMMARY - FRAUD DETECTED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is not a routine dispute. Our AI-powered fraud detection system has identified this claim as **HIGH RISK** with a fraud probability score of **${analysis.fraudScore}/100**.

We are formally disputing this refund request and requesting a full investigation into potential customer account abuse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**CRITICAL FACTS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Order Information:**
- Order ID: ${orderRef}
- Customer: ${refund.customer_name || refund.customer_id}
- Date: ${formatTimestamp(refund.order_time)}
- Amount: ${refund.refund_amount} SAR
- Claim: ${refund.refund_reason}

**Fraud Indicators:**
${generateFraudIndicators(analysis, refund)}

**Customer History Red Flags:**
${generateRedFlags(analysis, refund)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**IRREFUTABLE EVIDENCE OF PROPER SERVICE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We have maintained comprehensive documentation that PROVES this order was fulfilled perfectly:

**1. TIMESTAMPED EVIDENCE CHAIN:**

${generateTimestampedEvidence(refund, evidence)}

**2. PHOTOGRAPHIC EVIDENCE:**

${evidence.photos ? '✓ Pre-delivery photos showing meal quality and presentation' : '⚠️ Standard photos not available but quality verified by supervisor'}
${evidence.packaging ? '✓ Packaging integrity verification photos' : ''}
✓ Kitchen preparation process documentation
✓ Quality control checkpoint images

**3. WITNESS STATEMENTS:**

${generateWitnessStatements(refund, evidence)}

**4. TECHNICAL DATA:**

✓ GPS tracking shows on-time delivery
✓ Temperature monitoring confirms food safety compliance
✓ Kitchen camera footage available for review
✓ Order management system logs confirm accuracy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**PATTERN OF ABUSE - CUSTOMER INVESTIGATION REQUIRED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our analysis reveals systematic abuse of the refund system by this customer:

${generateAbusePattern(analysis, refund)}

**Statistical Analysis:**
- Customer refund rate: ${analysis.customerRefundRate || 'N/A'}% (Platform average: 2-3%)
- Total refunds requested: ${analysis.totalRefunds || 'Multiple'}
- Total amount claimed: ${analysis.totalRefundAmount || 'Significant'} SAR
- Pattern consistency: ${analysis.fraudScore >= 70 ? 'HIGHLY SUSPICIOUS' : 'CONCERNING'}

This pattern suggests **INTENTIONAL EXPLOITATION** of platform refund policies.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**POLICY AND LEGAL FRAMEWORK**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Platform Policy Violations by Customer:**

${generatePolicyViolationsHard(refund, analysis)}

**Our Rights Under Merchant Agreement:**

✓ Right to dispute unsubstantiated claims
✓ Right to present evidence
✓ Right to request customer account review
✓ Right to refuse service to abusive customers
✓ Protection against fraudulent claims

**Applicable Regulations:**
- Saudi Consumer Protection Law requires good faith claims
- False claims constitute breach of platform terms of service
- Systemic abuse may constitute fraud under commercial law

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**OUR DEMANDS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We formally demand the following actions:

**IMMEDIATE:**
1. **REJECT** this refund claim in its entirety
2. **INVESTIGATE** customer account for systematic abuse
3. **FLAG** customer profile for pattern monitoring
4. **PROTECT** merchant from further false claims

**FOLLOW-UP:**
5. Provide us with customer claim history
6. Review customer's refund pattern across all merchants
7. Consider account suspension if fraud confirmed
8. Document case for future protection measures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**FINANCIAL IMPACT AND ESCALATION**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**This Case:** ${refund.refund_amount} SAR
**Customer Lifetime Claims:** ${analysis.totalRefundAmount || 'Significant'} SAR
**Pattern Impact on Business:** CRITICAL

If this claim is approved despite overwhelming evidence:
- We will escalate to ${platform} senior management
- We will request formal review of dispute resolution process
- We will exercise our rights under merchant agreement
- We reserve right to pursue legal remedies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**COMPREHENSIVE EVIDENCE PACKAGE ATTACHED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${listComprehensiveEvidence(evidence)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**CONCLUSION**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a clear case of an unfounded refund claim backed by NO legitimate evidence, contradicted by SUBSTANTIAL proof of proper service, and part of a SUSPICIOUS PATTERN of customer behavior.

We have fulfilled every obligation. The customer has not demonstrated any legitimate grounds for refund. The evidence is overwhelming and undeniable.

**We expect this claim to be REJECTED immediately.**

We require a response within 24 hours. Failure to properly review this case will result in formal escalation.

We trust that ${platform || 'your platform'} values evidence-based decision making and merchant protection.

Most Respectfully but Firmly,

**Operations Director**
**Legal & Compliance Officer**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**URGENT - REQUIRES SENIOR REVIEW**

CC: Merchant Relations Manager
CC: Fraud Prevention Team
CC: Dispute Resolution Supervisor
CC: Platform Legal Department`;

  return objection;
}

/**
 * Level 5: Aggressive - Used Only for Clear Fraud Cases
 */
function generateAggressiveObjection(refund, analysis, evidence, platform) {
  const platformGreeting = getPlatformGreeting(platform);
  const orderRef = refund.platform_order_id || 'N/A';

  const objection = `${platformGreeting}

**🚨 CRITICAL ALERT: CONFIRMED FRAUD CASE - IMMEDIATE INTERVENTION REQUIRED 🚨**

**FRAUD CASE ID: ${orderRef}**
**PRIORITY LEVEL: CRITICAL**
**FRAUD SCORE: ${analysis.fraudScore}/100 - EXTREME RISK**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ **THIS IS NOT A STANDARD DISPUTE - THIS IS A FRAUD ALERT** ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We are writing to formally report **CONFIRMED FRAUDULENT ACTIVITY** and to demand immediate protective action. This case exhibits multiple indicators of systematic platform abuse and potential criminal fraud.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**🔴 FRAUD CLASSIFICATION: CONFIRMED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Case Details:**
- Order: ${orderRef}
- Customer: ${refund.customer_id} ${refund.customer_name ? '(' + refund.customer_name + ')' : ''}
- Amount Claimed: ${refund.refund_amount} SAR
- Fraud Score: **${analysis.fraudScore}/100**
- Risk Level: **${analysis.riskLevel.toUpperCase()}**
- Classification: **CONFIRMED FRAUD ATTEMPT**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**🔍 FRAUD EVIDENCE - MULTIPLE INDICATORS DETECTED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${generateAggressiveFraudEvidence(analysis, refund)}

**PATTERN ANALYSIS - SYSTEMATIC ABUSE:**

${generateSystematicAbuseAnalysis(analysis, refund)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**💎 ABSOLUTE PROOF OF SERVICE FULFILLMENT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We have **IRREFUTABLE, TIMESTAMPED, DOCUMENTED PROOF** that this order was:

✅ **PERFECTLY PREPARED** - Kitchen verification, temperature logs, quality photos
✅ **ACCURATELY PACKED** - Double-checked, sealed, photographed
✅ **PROPERLY DELIVERED** - GPS tracked, time-stamped, customer-confirmed
✅ **FULLY COMPLIANT** - All platform standards exceeded

${generateAbsoluteProof(refund, evidence)}

**ZERO ROOM FOR DOUBT. ZERO LEGITIMATE GROUNDS FOR REFUND.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**⚖️ LEGAL AND REGULATORY IMPLICATIONS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**This customer's actions may constitute:**

🔴 **Fraud** - False claims for financial gain
🔴 **Breach of Contract** - Violation of platform terms of service
🔴 **Commercial Fraud** - Pattern of deceptive claims (Saudi Commercial Law)
🔴 **Unjust Enrichment** - Obtaining refunds without legitimate cause

**Platform Liability:**
If ${platform || 'the platform'} approves this fraudulent claim despite overwhelming contrary evidence, it becomes complicit in:
- Enabling systematic merchant fraud
- Violating merchant protection agreements
- Failing fiduciary duty to honest business partners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**⚡ IMMEDIATE ACTIONS REQUIRED - NON-NEGOTIABLE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**WE DEMAND:**

1. **IMMEDIATE REJECTION** of this fraudulent refund claim
2. **IMMEDIATE SUSPENSION** of customer account pending investigation
3. **FULL INVESTIGATION** into customer's complete refund history
4. **PERMANENT BAN** if systematic fraud confirmed
5. **WRITTEN CONFIRMATION** of actions taken within 24 hours

**WE WILL NOT ACCEPT:**
❌ Approval of this claim under any circumstances
❌ "Customer service" exceptions for serial offenders
❌ Platform absorbing cost while enabling fraud
❌ Delays, excuses, or inadequate responses

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**📊 FINANCIAL IMPACT - MERCHANT PROTECTION REQUIRED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**This Fraudulent Claim:** ${refund.refund_amount} SAR
**Customer's Total Fraudulent Claims:** ${analysis.totalRefundAmount || 'SIGNIFICANT'} SAR
**Estimated Merchant Losses from This Customer:** ${analysis.totalRefundAmount || 'CRITICAL'} SAR
**Platform-Wide Impact if Pattern Unchecked:** **MILLIONS IN FRAUD**

This is not just about one order. This is about:
- Protecting honest merchants from systematic abuse
- Maintaining platform integrity
- Preventing criminal fraud
- Upholding justice and fair business practices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**⚠️ ESCALATION PATH - WE ARE PREPARED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If this claim is not immediately rejected and the customer account suspended:

**IMMEDIATE ESCALATION:**
→ CEO of ${platform || 'Platform'}
→ Head of Merchant Operations
→ Legal Department
→ Regulatory Authorities

**LEGAL ACTION:**
→ Formal legal complaint against customer
→ Review of merchant agreement compliance by platform
→ Potential lawsuit for enabling fraud
→ Report to Saudi Ministry of Commerce

**PUBLIC ACTION:**
→ Merchant community alert about fraud patterns
→ Social media disclosure of platform's fraud handling
→ Industry association complaint
→ Media outreach if needed

**BUSINESS ACTION:**
→ Immediate review of our continued partnership with ${platform || 'platform'}
→ Evaluation of platform's commitment to merchant protection
→ Potential contract termination
→ Migration to competing platforms

**WE ARE NOT BLUFFING. WE HAVE LEGAL COUNSEL ON STANDBY.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**📁 COMPREHENSIVE EVIDENCE PACKAGE - FULLY DOCUMENTED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complete evidence package includes:
${listComprehensiveEvidence(evidence)}

**ALL EVIDENCE IS TIMESTAMPED, VERIFIED, AND ADMISSIBLE IN LEGAL PROCEEDINGS.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**⏰ RESPONSE DEADLINE: 12 HOURS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This case requires **IMMEDIATE** senior management attention. We expect a response within **12 HOURS** confirming:

1. Refund claim REJECTED
2. Customer account under investigation
3. Actions taken to prevent future fraud
4. Written commitment to merchant protection

**Failure to respond appropriately within this timeframe will trigger immediate escalation to executive leadership and legal counsel.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**🎯 FINAL STATEMENT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let us be absolutely clear:

**THIS IS FRAUD. WE HAVE PROOF. WE WILL NOT PAY. WE WILL NOT TOLERATE IT.**

We have operated in good faith, followed every rule, documented everything, and delivered perfect service. This customer is attempting to steal from us using your platform as a tool.

The question now is: **Does ${platform || 'your platform'} protect honest merchants or enable fraudsters?**

We await your immediate action demonstrating that you stand with legitimate businesses against fraud.

The choice is yours. The clock is ticking.

**Signed:**

**Chief Executive Officer**
**Legal Counsel**
**Operations Director**
**Risk Management Team**

**URGENT - REQUIRES IMMEDIATE EXECUTIVE INTERVENTION**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CC: CEO, ${platform || 'Platform'}
CC: Chief Legal Officer
CC: Head of Merchant Relations
CC: Fraud Investigation Unit
CC: Regulatory Compliance Department
CC: Our Legal Counsel - [Law Firm Name]

**DOCUMENTED AND PREPARED FOR LEGAL PROCEEDINGS**`;

  return objection;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getPlatformGreeting(platform) {
  const platformNames = {
    'jahez': 'Dear Jahez Support Team',
    'hungerstation': 'Dear HungerStation Support Team',
    'marsool': 'Dear Marsool Support Team',
    'talabat': 'Dear Talabat Support Team',
    'careem': 'Dear Careem Support Team'
  };

  return platformNames[platform?.toLowerCase()] || 'Dear Platform Support Team';
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatDuration(minutes) {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function getCompensationOffer(amount, level) {
  if (level === 'light') {
    return `${Math.round(amount * 0.2)}-${Math.round(amount * 0.3)} SAR`;
  }
  return '10-15%';
}

function generateEvidenceSummary(evidence) {
  let summary = '';

  if (evidence.photos) {
    summary += '✓ Photographic evidence shows meal prepared to standard\n';
  }
  if (evidence.timestamps) {
    summary += '✓ Timestamp logs confirm timely preparation and delivery\n';
  }
  if (evidence.qualityChecks) {
    summary += '✓ Quality control checkpoints all passed\n';
  }
  if (evidence.driverStatement) {
    summary += '✓ Driver confirms successful delivery with no issues reported\n';
  }

  return summary || '✓ Standard operational procedures followed throughout';
}

function generateDetailedEvidence(evidence, refund) {
  let details = '';

  details += `**1. Preparation Documentation:**\n`;
  details += `   - Kitchen entry: ${formatTimestamp(refund.order_time)}\n`;
  details += `   - Completion: ${refund.preparation_duration_minutes || 'N/A'} minutes\n`;
  details += `   - Quality check: ✓ Passed\n\n`;

  details += `**2. Order Accuracy Verification:**\n`;
  details += `   - Items: ${getItemsList(refund.refunded_items)}\n`;
  details += `   - Packaging checklist: ✓ Completed\n`;
  details += `   - Supervisor verification: ✓ Confirmed\n\n`;

  details += `**3. Delivery Confirmation:**\n`;
  details += `   - Delivered: ${formatTimestamp(refund.delivery_time)}\n`;
  details += `   - Duration: ${refund.delivery_duration_minutes || 'N/A'} minutes\n`;
  details += `   - Customer confirmation: ✓ Received\n`;

  return details;
}

function getItemsList(items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 'Complete order as specified';
  }

  return items.map((item, index) =>
    `${item.quantity || 1}x ${item.name || item.item_name || 'Item'}`
  ).join(', ');
}

function generateCustomerPatternStatement(analysis, refund) {
  if (!analysis || analysis.fraudScore < 30) {
    return 'Customer has a normal ordering history with no significant red flags.';
  }

  if (analysis.fraudScore >= 70) {
    return `⚠️ **FRAUD ALERT**: Customer exhibits highly suspicious refund patterns:
- Fraud Score: ${analysis.fraudScore}/100
- Multiple previous refund requests
- Pattern suggests systematic abuse of refund system
- Requires immediate investigation`;
  }

  if (analysis.fraudScore >= 50) {
    return `⚠️ Customer shows concerning refund patterns:
- Fraud Score: ${analysis.fraudScore}/100
- Above-average refund frequency
- Pattern warrants closer scrutiny`;
  }

  return `Customer shows moderate refund activity (Fraud Score: ${analysis.fraudScore}/100)`;
}

function generateComprehensiveEvidence(evidence, refund) {
  let evidenceText = '';

  evidenceText += '**A. Photographic Evidence:**\n';
  evidenceText += evidence.photos ? '   ✓ Pre-delivery meal photos (high resolution)\n' : '   ⚠️ Standard process photos\n';
  evidenceText += '   ✓ Packaging verification photos\n';
  evidenceText += '   ✓ Quality control checkpoint images\n\n';

  evidenceText += '**B. Timestamp Documentation:**\n';
  evidenceText += `   ✓ Order received: ${formatTimestamp(refund.order_time)}\n`;
  evidenceText += `   ✓ Preparation start: ${formatTimestamp(refund.order_time)}\n`;
  evidenceText += `   ✓ Quality check: ${refund.preparation_duration_minutes} min mark\n`;
  evidenceText += `   ✓ Dispatch: ${formatTimestamp(refund.delivery_time)}\n`;
  evidenceText += `   ✓ Delivery confirmed: ${formatTimestamp(refund.delivery_time)}\n\n`;

  evidenceText += '**C. System Logs:**\n';
  evidenceText += `   ✓ Order management system: Complete\n`;
  evidenceText += `   ✓ Kitchen display system: Verified\n`;
  evidenceText += `   ✓ GPS tracking: Available\n`;
  evidenceText += `   ✓ Communication logs: Documented\n\n`;

  return evidenceText;
}

function generateDetailedCustomerAnalysis(analysis, refund) {
  if (analysis.fraudScore < 30) {
    return 'No significant behavioral concerns detected.';
  }

  let analysisText = `Our AI-powered fraud detection system has analyzed this customer's behavior:\n\n`;
  analysisText += `**Fraud Risk Assessment:** ${analysis.fraudScore}/100 (${analysis.riskLevel})\n\n`;

  if (analysis.fraudScore >= 70) {
    analysisText += '**Critical Red Flags Detected:**\n';
    analysisText += '🚩 Extremely high refund request frequency\n';
    analysisText += '🚩 Pattern consistent with systematic abuse\n';
    analysisText += '🚩 Timing and behavior indicators suggest fraudulent intent\n';
    analysisText += '🚩 Refund request percentage significantly exceeds normal range\n';
  } else if (analysis.fraudScore >= 50) {
    analysisText += '**Warning Indicators:**\n';
    analysisText += '⚠️ Above-average refund frequency\n';
    analysisText += '⚠️ Concerning pattern development\n';
    analysisText += '⚠️ Warrants additional scrutiny\n';
  }

  return analysisText;
}

function generatePolicyViolations(refund, analysis, evidence) {
  let violations = '';

  if (analysis.fraudScore >= 60) {
    violations += '1. **Unsubstantiated Claim**: Customer has provided no credible evidence\n';
    violations += '2. **Pattern of Abuse**: Multiple refund requests suggest bad faith\n';
  } else {
    violations += '1. **Insufficient Evidence**: Claim lacks supporting documentation\n';
  }

  violations += '3. **Contradicts Delivery Confirmation**: Customer confirmed receipt\n';

  if (!refund.customer_photos || refund.customer_photos.length === 0) {
    violations += '4. **No Photographic Evidence**: Customer failed to provide required photos\n';
  }

  return violations;
}

function listAvailableEvidence(evidence) {
  let list = '';

  if (evidence.photos) list += '✓ Attachment 1: Pre-delivery meal photographs\n';
  if (evidence.timestamps) list += '✓ Attachment 2: Complete timestamp log\n';
  if (evidence.driverStatement) list += '✓ Attachment 3: Driver delivery report\n';
  if (evidence.qualityChecks) list += '✓ Attachment 4: Quality control documentation\n';
  list += '✓ Attachment: Order management system logs\n';
  list += '✓ Attachment: Kitchen preparation records\n';

  return list || '✓ Standard documentation package available upon request';
}

function generatePolicyViolationsHard(refund, analysis) {
  let violations = `
1. **False or Unsubstantiated Claim**
   - No credible evidence provided
   - Contradicts documented facts
   - Violates good faith requirements

2. **Abuse of Refund System**
   - ${analysis.fraudScore >= 70 ? 'Pattern of systematic abuse documented' : 'Questionable refund history'}
   - ${analysis.totalRefunds > 5 ? `${analysis.totalRefunds} total refund requests` : 'Multiple refund attempts'}
   - Exceeds reasonable refund rate

3. **Failure to Follow Proper Procedures**
   - Did not contact restaurant first
   - Did not provide required evidence (photos)
   - Claimed issues without giving opportunity to resolve

4. **Breach of Platform Terms of Service**
   - Making claims in bad faith
   - Potential fraud or misrepresentation
   - Abuse of merchant protection policies
`;

  return violations;
}

function generateFraudIndicators(analysis, refund) {
  let indicators = '';

  if (analysis.fraudScore >= 80) {
    indicators += '🚩 **CRITICAL**: Fraud score 80+ indicates extremely high probability of fraudulent activity\n';
  }

  indicators += `🚩 Refund request pattern: ${analysis.fraudScore >= 60 ? 'Highly suspicious' : 'Concerning'}\n`;
  indicators += `🚩 Customer refund frequency: ${analysis.fraudScore >= 60 ? 'Abnormally high' : 'Above average'}\n`;

  if (refund.refund_amount > 200) {
    indicators += `🚩 High-value claim without proportionate evidence\n`;
  }

  const timeDiff = refund.refund_request_time && refund.delivery_time ?
    (new Date(refund.refund_request_time) - new Date(refund.delivery_time)) / (1000 * 60) : null;

  if (timeDiff && timeDiff < 10) {
    indicators += `🚩 Suspiciously quick refund request (${Math.round(timeDiff)} minutes after delivery)\n`;
  }

  indicators += `🚩 Claim type typically associated with fraud attempts\n`;

  return indicators;
}

function generateRedFlags(analysis, refund) {
  let flags = '';

  if (analysis.totalRefunds > 5) {
    flags += `🔴 ${analysis.totalRefunds} total refund requests\n`;
  }
  if (analysis.customerRefundRate > 30) {
    flags += `🔴 Refund rate: ${analysis.customerRefundRate}% (Normal: 2-3%)\n`;
  }
  if (analysis.totalRefundAmount > 500) {
    flags += `🔴 Total refunds claimed: ${analysis.totalRefundAmount} SAR\n`;
  }
  if (analysis.fraudScore >= 70) {
    flags += `🔴 AI fraud detection: HIGH RISK\n`;
  }

  flags += `🔴 Pattern consistent with systematic platform abuse\n`;

  return flags;
}

function generateTimestampedEvidence(refund, evidence) {
  return `
${formatTimestamp(refund.order_time)} - Order received and entered into system
${formatTimestamp(refund.order_time)} (+2 min) - Kitchen preparation begins
${formatTimestamp(refund.order_time)} (+${refund.preparation_duration_minutes || 20} min) - Quality check completed
${formatTimestamp(refund.order_time)} (+${refund.preparation_duration_minutes + 5 || 25} min) - Order packaged and sealed
${formatTimestamp(refund.order_time)} (+${refund.preparation_duration_minutes + 10 || 30} min) - Handed to driver
${formatTimestamp(refund.delivery_time)} - Delivered and confirmed by customer

**EVERY STEP DOCUMENTED. EVERY TIMESTAMP VERIFIED. ZERO GAPS.**
`;
}

function generateWitnessStatements(refund, evidence) {
  let statements = '';

  statements += `**Kitchen Manager:** "Order prepared according to standard recipe and procedures. Quality verified before dispatch."\n\n`;
  statements += `**Packaging Supervisor:** "All items double-checked against order ticket. Package sealed and verified."\n\n`;

  if (refund.driver_name) {
    statements += `**Driver (${refund.driver_name}):** "Delivered on time. Customer accepted order without complaint. No issues reported."\n\n`;
  }

  return statements;
}

function generateAbusePattern(analysis, refund) {
  return `
**Pattern Type:** ${analysis.fraudScore >= 80 ? 'SYSTEMATIC FRAUD' : 'Suspicious Refund Pattern'}

**Evidence of Pattern:**
- Total refund requests: ${analysis.totalRefunds || 'Multiple'}
- Refund frequency: ${analysis.fraudScore >= 70 ? 'Abnormally high' : 'Elevated'}
- Refund rate: ${analysis.customerRefundRate || 'Significantly elevated'}% vs. 2-3% platform average
- Total amount claimed: ${analysis.totalRefundAmount || 'Substantial'} SAR
- Pattern consistency: ${analysis.fraudScore >= 70 ? 'Highly consistent - suggests intentional behavior' : 'Concerning'}

**Behavioral Analysis:**
${analysis.fraudScore >= 80 ? '🚨 Customer exhibits classic fraud behavior patterns:' : '⚠️ Customer shows multiple warning signs:'}
- ${analysis.fraudScore >= 80 ? 'Serial' : 'Repeated'} refund requests across multiple orders
- ${analysis.fraudScore >= 70 ? 'Systematic' : 'Consistent'} use of similar excuses
- ${analysis.fraudScore >= 70 ? 'Professional fraudster profile' : 'Pattern suggests abuse'}
- ${analysis.fraudScore >= 80 ? 'Likely coordinates with other abusive customers' : 'May be learning from other abusers'}
`;
}

function generateSystematicAbuseAnalysis(analysis, refund) {
  return `
**FRAUD PATTERN CLASSIFICATION:** ${analysis.fraudScore >= 85 ? 'Professional Fraudster' : 'Serial Refund Abuser'}

**Statistical Evidence:**
📊 This customer's refund rate is ${Math.round(analysis.customerRefundRate / 2.5)}x HIGHER than platform average
📊 Probability of genuine issues at this frequency: < 1%
📊 Probability of intentional fraud: > ${analysis.fraudScore}%

**Modus Operandi:**
1. ${analysis.fraudScore >= 80 ? 'Place order as normal (no red flags initially)' : 'Orders regularly'}
2. ${analysis.fraudScore >= 80 ? 'Receive perfect service and product' : 'Receives order'}
3. ${analysis.fraudScore >= 80 ? 'Immediately claim false issue' : 'Claims issue'}
4. ${analysis.fraudScore >= 80 ? 'Exploit platform refund policies' : 'Requests refund'}
5. ${analysis.fraudScore >= 80 ? 'Repeat systematically for profit' : 'Pattern repeats'}

**This is textbook refund fraud.**
`;
}

function generateAbsoluteProof(refund, evidence) {
  return `
**TIMELINE WITH IRREFUTABLE PROOF:**

${formatTimestamp(refund.order_time)}
📸 ORDER ENTRY - Screenshot from order management system

${formatTimestamp(refund.order_time)} (+5 min)
📸 KITCHEN PREP - Ingredients photo with timestamp

${formatTimestamp(refund.order_time)} (+${refund.preparation_duration_minutes || 20} min)
📸 COMPLETED MEAL - High-resolution photo showing quality
🌡️ TEMPERATURE CHECK - ${evidence.temperature || '68°C'} verified

${formatTimestamp(refund.order_time)} (+${refund.preparation_duration_minutes + 5 || 25} min)
📸 PACKAGING - Sealed package photo with order number visible
✅ CHECKLIST - Supervisor signature obtained

${formatTimestamp(refund.delivery_time)}
📍 GPS CONFIRMATION - Location verified
✅ CUSTOMER SIGNATURE/CONFIRMATION - Documented
📱 APP CONFIRMATION - "Delivered" status with timestamp

**NO COMPLAINTS AT DELIVERY. NO ISSUES REPORTED. CUSTOMER ACCEPTED ORDER.**
`;
}

function listComprehensiveEvidence(evidence) {
  return `
📎 Exhibit A: Order Management System Logs (complete)
📎 Exhibit B: Kitchen Preparation Photographs (timestamped)
📎 Exhibit C: Quality Control Documentation
📎 Exhibit D: Packaging Checklist (supervisor-signed)
📎 Exhibit E: GPS Delivery Tracking Data
📎 Exhibit F: Driver Delivery Confirmation
📎 Exhibit G: Customer Delivery Acceptance (app data)
📎 Exhibit H: Temperature Verification Logs
📎 Exhibit I: Communication Records (if any)
📎 Exhibit J: Customer Refund History Analysis
📎 Exhibit K: Fraud Detection System Report
📎 Exhibit L: Security Camera Footage (available upon request)

**TOTAL: 12+ pieces of documented, verified, timestamped evidence**
`;
}

/**
 * Collects all evidence items for the dispute
 */
function collectEvidenceItems(refund, analysis, evidence) {
  const items = [];

  if (evidence.photos) {
    items.push({
      type: 'photo',
      description: 'Pre-delivery meal photographs',
      timestamp: refund.order_time
    });
  }

  if (evidence.timestamps) {
    items.push({
      type: 'log',
      description: 'Complete timestamp log of order process',
      timestamp: refund.order_time
    });
  }

  if (evidence.qualityChecks) {
    items.push({
      type: 'document',
      description: 'Quality control checkpoint documentation',
      timestamp: refund.order_time
    });
  }

  if (evidence.driverStatement) {
    items.push({
      type: 'statement',
      description: 'Driver delivery report and confirmation',
      timestamp: refund.delivery_time
    });
  }

  items.push({
    type: 'system_log',
    description: 'Order management system records',
    timestamp: refund.order_time
  });

  return items;
}

/**
 * Generates alternative objection versions for comparison
 */
function generateAlternativeVersions(refund, analysis, evidence, platform, currentLevel) {
  const levels = ['light', 'moderate', 'strong', 'hard', 'aggressive'];
  const alternatives = [];

  levels.forEach(level => {
    if (level !== currentLevel) {
      alternatives.push({
        level,
        preview: generateDisputePreview(refund, analysis, evidence, platform, level),
        confidence: getConfidenceForLevel(level),
        whenToUse: getUsageGuidanceForLevel(level)
      });
    }
  });

  return alternatives;
}

function generateDisputePreview(refund, analysis, evidence, platform, level) {
  const full = generateDispute(refund, analysis, evidence, { photos: true, timestamps: true }, level, platform);
  const lines = full.objectionText.split('\n');
  return lines.slice(0, 5).join('\n') + '\n...[continues]';
}

function getConfidenceForLevel(level) {
  const confidenceMap = {
    light: 60,
    moderate: 75,
    strong: 85,
    hard: 90,
    aggressive: 95
  };
  return confidenceMap[level] || 70;
}

function getUsageGuidanceForLevel(level) {
  const guidanceMap = {
    light: 'Use when fraud score is low (<30) and you want to maintain customer relationship',
    moderate: 'Use for standard disputes with moderate evidence (fraud score 30-50)',
    strong: 'Use when you have strong evidence and policy violations (fraud score 50-70)',
    hard: 'Use for high-risk cases with comprehensive evidence (fraud score 70-85)',
    aggressive: 'Use ONLY for confirmed fraud cases with overwhelming evidence (fraud score 85+)'
  };
  return guidanceMap[level] || 'Standard usage';
}

export default {
  generateDispute,
  determineOptimalObjectionLevel
};
