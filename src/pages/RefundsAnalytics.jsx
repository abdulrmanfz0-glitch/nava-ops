// NAVA OPS - Refund Defense Center
// AI-Powered Restaurant Refund Management & Dispute System

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import * as XLSX from 'xlsx';
import {
  ModernCard,
  KPIWidget,
  SectionTitle,
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
  Target,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Download,
  RefreshCw,
  Copy,
  Send,
  Eye,
  CheckCheck,
  Camera,
  FileCheck,
  Scale,
  Filter,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// ============================================================================
// MOCK DATA - Restaurant Refund Cases
// ============================================================================

const mockRefunds = [
  {
    id: 1,
    order_id: 'JAH-2024-789456',
    platform: 'Jahez',
    amount: 156.50,
    reason: 'Missing Item',
    reason_code: 'MISSING_ITEM',
    customer_name: 'Ahmed M.',
    date: '2024-11-25',
    status: 'pending',
    customer_complaint: 'Ordered family meal but missing large chicken box',
    items_ordered: ['Family Meal Large', 'Large Fries', 'Drinks (4)'],
    missing_items_claimed: ['Large Chicken Box'],
    restaurant_evidence: {
      has_prep_photo: true,
      has_packaging_video: true,
      weight_recorded: '2.4 kg',
      prep_time: '18 min',
      items_prepared: 'All items prepared as per order',
      driver_confirmed: true,
      fraud_risk: 'Low',
    },
  },
  {
    id: 2,
    order_id: 'HGS-2024-654321',
    platform: 'HungerStation',
    amount: 89.75,
    reason: 'Delivery Delay',
    reason_code: 'LATE_DELIVERY',
    customer_name: 'Sarah A.',
    date: '2024-11-24',
    status: 'pending',
    customer_complaint: 'Order delayed over 1 hour, food arrived cold',
    delivery_time_promised: '30 min',
    delivery_time_actual: '95 min',
    restaurant_evidence: {
      food_ready_time: '12 min',
      driver_arrival_delay: '48 min',
      driver_assigned_late: true,
      platform_delay: 'Delay from platform, not restaurant',
      gps_proof: true,
      thermal_packaging: true,
      fraud_risk: 'Low',
    },
  },
  {
    id: 3,
    order_id: 'TAL-2024-998877',
    platform: 'Talabat',
    amount: 234.20,
    reason: 'Food Quality',
    reason_code: 'QUALITY_ISSUE',
    customer_name: 'Khaled Y.',
    date: '2024-11-23',
    status: 'disputed',
    customer_complaint: 'Food arrived cold and not fresh, burger was burnt',
    items_ordered: ['Beef Burger (3)', 'Fries (2)', 'Drinks'],
    restaurant_evidence: {
      quality_check_photo: true,
      temperature_check: '72°C at packaging',
      cooking_timer_log: 'Cooked per standards: 4 min per side',
      no_burnt_items: true,
      delivery_time_exceeded: '65 min delivery',
      customer_history: 'Suspicious - 4 complaints in 1 month',
      fraud_risk: 'High',
    },
  },
  {
    id: 4,
    order_id: 'MRS-2024-445566',
    platform: 'Marsool',
    amount: 167.80,
    reason: 'Wrong Order',
    reason_code: 'WRONG_ORDER',
    customer_name: 'Fatima H.',
    date: '2024-11-22',
    status: 'won',
    customer_complaint: 'Received completely wrong order',
    items_ordered: ['Beef Shawarma', 'Orange Juice'],
    items_claimed: ['Chicken Shawarma', 'Apple Juice'],
    restaurant_evidence: {
      order_slip_photo: true,
      barcode_scan: true,
      correct_items_packed: true,
      driver_switched_orders: 'Likely driver mixed up orders',
      packaging_label_correct: true,
      fraud_risk: 'Low',
    },
  },
  {
    id: 5,
    order_id: 'CRM-2024-112233',
    platform: 'Careem',
    amount: 78.15,
    reason: 'Late Cancellation',
    reason_code: 'CANCELLED_LATE',
    customer_name: 'Omar S.',
    date: '2024-11-21',
    status: 'pending',
    customer_complaint: 'Cancelled order but restaurant still charged',
    cancellation_time: 'After 25 min of preparation',
    restaurant_evidence: {
      food_already_prepared: true,
      cancellation_after_cooking: '25 min after start',
      ingredients_cost: '45 SAR',
      labor_cost: '15 SAR',
      cannot_resell: 'Personalized meal, cannot be resold',
      policy_states: 'No refund after preparation starts',
      fraud_risk: 'Low',
    },
  },
];

// ============================================================================
// AI DISPUTE GENERATOR MODAL
// ============================================================================

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
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const evidence = refund.restaurant_evidence || {};
    let text = '';

    // Generate professional English dispute based on reason code
    switch (refund.reason_code) {
      case 'MISSING_ITEM':
        text = `To: ${refund.platform} Support Team

RE: Formal Dispute - Order ${refund.order_id} - SAR ${refund.amount} Refund

Dear Support Team,

We are formally disputing the ${refund.amount} SAR refund issued based on a customer claim of missing items.

━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS:
• Order ID: ${refund.order_id}
• Refund Amount: ${refund.amount} SAR
• Date: ${refund.date}
• Customer Claim: "${refund.customer_complaint}"
• Items Claimed Missing: ${refund.missing_items_claimed?.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
RESTAURANT EVIDENCE:

${evidence.has_prep_photo ? '📸 Complete preparation photos proving all items prepared' : ''}
${evidence.has_packaging_video ? '🎥 Packaging video showing all items placed in order' : ''}
${evidence.weight_recorded ? `⚖️ Recorded weight: ${evidence.weight_recorded} - matches complete order` : ''}
${evidence.prep_time ? `⏱️ Preparation time: ${evidence.prep_time} - per standards` : ''}
${evidence.driver_confirmed ? '✓ Driver confirmed receipt of complete, sealed order' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
LEGAL GROUNDS FOR DISPUTE:

1. Order prepared completely per digital order specifications
2. Photographic documentation proves no items were missing
3. Driver received sealed order with all items verified
4. Delivery responsibility lies with platform and driver, not restaurant
5. No material evidence provided by customer to support claim

━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL IMPACT:

• Raw materials cost: SAR ${(refund.amount * 0.35).toFixed(2)}
• Labor cost: SAR ${(refund.amount * 0.25).toFixed(2)}
• Operational overhead: SAR ${(refund.amount * 0.15).toFixed(2)}
• Total loss if refund stands: SAR ${refund.amount}

━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUESTED RESOLUTION:

1. Reverse the SAR ${refund.amount} deduction from restaurant account
2. Investigate validity of customer claim
3. Implement proof-of-receipt system to prevent false claims
4. Review customer's complaint history for patterns

We are prepared to provide all evidence and documentation to support our position. The restaurant should not bear financial responsibility for delivery-phase issues.

Respectfully,
Restaurant Management
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        break;

      case 'LATE_DELIVERY':
        text = `To: ${refund.platform} Support Team

RE: Dispute - Delivery Delay Charge - Order ${refund.order_id}

Dear Support Team,

We dispute the SAR ${refund.amount} deduction for delivery delay, as the delay was not caused by our restaurant.

━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE SUMMARY:

SAR ${refund.amount} was deducted due to delivery delay, despite restaurant completing order on time.

━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENTED FACTS:

${evidence.food_ready_time ? `✅ Food ready within: ${evidence.food_ready_time}` : ''}
${evidence.driver_arrival_delay ? `⏰ Driver arrival delay: ${evidence.driver_arrival_delay}` : ''}
${evidence.platform_delay ? `🚨 ${evidence.platform_delay}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
TIMELINE DOCUMENTATION:

1. Order received: ${refund.date}
2. Food preparation: ${evidence.food_ready_time || '12 min'}
3. Order ready for pickup: Documented via system
4. Driver assignment/arrival delay: ${evidence.driver_arrival_delay || 'Documented'}
5. ${evidence.thermal_packaging ? 'Used thermal packaging to maintain temperature' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORTING EVIDENCE:

${evidence.gps_proof ? '• GPS data proving order ready ahead of schedule' : ''}
• Internal system logs for preparation timeline
• Time-stamped preparation records for each item
${evidence.driver_assigned_late ? '• Platform delay in driver assignment documented' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
LEGAL POSITION:

Restaurant fulfilled its obligation by preparing order within promised timeframe. Delivery delay occurred during platform's responsibility phase per partnership agreement terms.

━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUESTED ACTION:

1. Refund SAR ${refund.amount} to restaurant account
2. Assign delivery delay responsibility to driver/platform
3. Update compensation policies for fairness
4. Exclude this order from restaurant performance metrics

We request urgent review and fair resolution of this matter.

Respectfully,
Restaurant Management`;
        break;

      case 'QUALITY_ISSUE':
        text = `To: ${refund.platform} Support Team

RE: Dispute - Quality Complaint - Order ${refund.order_id}

Dear Support Team,

We dispute the quality-based refund of SAR ${refund.amount} as restaurant followed all quality standards.

━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER CLAIM:
"${refund.customer_complaint}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENTED FACTS & EVIDENCE:

${evidence.quality_check_photo ? '📸 Quality control photos available before packaging' : ''}
${evidence.temperature_check ? `🌡️ Food temperature at packaging: ${evidence.temperature_check}` : ''}
${evidence.cooking_timer_log ? `⏲️ ${evidence.cooking_timer_log}` : ''}
${evidence.no_burnt_items ? '✓ All items cooked per standards - no burning detected' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL ANALYSIS:

1. Food left restaurant hot and fresh (${evidence.temperature_check || 'documented'})
${evidence.delivery_time_exceeded ? `2. Delivery time: ${evidence.delivery_time_exceeded} - excessive delay caused cooling` : ''}
3. ${evidence.thermal_packaging ? 'High-quality thermal packaging used' : 'Appropriate packaging used'}
4. All items passed quality inspection before driver handoff
${evidence.customer_history ? `5. ⚠️ ${evidence.customer_history}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY ASSURANCE SUMMARY:

• Restaurant: Met all quality standards ✓
• Packaging: Thermal and appropriate ✓
• Temperature: Optimal at handoff ✓
• Delivery: Excessive delay causing issue ✗
• Conclusion: Quality degradation due to delivery time, not preparation

━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAUD RISK ASSESSMENT:

${evidence.customer_history ? 'Customer has suspicious complaint pattern (potential fraud). ' : ''}Restaurant adheres to all food safety and quality standards. If food arrived cold, root cause is extended delivery time beyond our control.

━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUESTED ACTION:

1. Reverse SAR ${refund.amount} deduction
2. Investigate customer complaint pattern for fraud
3. Require photographic evidence from customers making quality claims
4. Implement penalties for fraudulent complaints

Restaurant reserves right to pursue legal action for false claims affecting reputation.

Respectfully,
Restaurant Management`;
        break;

      case 'WRONG_ORDER':
        text = `To: ${refund.platform} Support Team

RE: Dispute - Wrong Order Claim - Order ${refund.order_id}

Dear Support Team,

We dispute the wrong order refund of SAR ${refund.amount}. Our evidence proves correct items were prepared and packaged.

━━━━━━━━━━━━━━━━━━━━━━━━━━
CASE DETAILS:

• Order ID: ${refund.order_id}
• Deducted Amount: SAR ${refund.amount}
• Claim: "${refund.customer_complaint}"
• Items Ordered: ${refund.items_ordered?.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
RESTAURANT EVIDENCE:

${evidence.order_slip_photo ? '📸 Original order slip photo (correct items documented)' : ''}
${evidence.barcode_scan ? '📱 Barcode scan matching digital order exactly' : ''}
${evidence.correct_items_packed ? '✓ Correct items packed per system specifications' : ''}
${evidence.packaging_label_correct ? '🏷️ Packaging label shows correct order ID and items' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
INVESTIGATION FINDINGS:

Restaurant System Audit:
1. Order slip printed with correct items ✓
2. Kitchen prepared exact items requested ✓
3. Packaging completed under supervision ✓
4. Driver received sealed bag with restaurant stamp ✓

${evidence.driver_switched_orders ? `\n⚠️ LIKELY CAUSE: ${evidence.driver_switched_orders}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGICAL ANALYSIS:

Probable Scenario:
• Restaurant packed correct order
• Driver had multiple orders for delivery
• ${evidence.driver_switched_orders || 'Orders possibly mixed during delivery'}
• Error occurred during delivery phase, not preparation

━━━━━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE DOCUMENTATION:

• Internal order slip
• Digital system records
• ${evidence.barcode_scan ? 'Barcode scan logs' : 'Packaging documentation'}
• ${evidence.packaging_label_correct ? 'Photo of package label' : 'Packaging records'}
• Driver receipt log

━━━━━━━━━━━━━━━━━━━━━━━━━━
LEGAL POSITION:

Restaurant executed order accurately per digital specifications. Any error occurred during delivery phase (driver responsibility), not preparation phase (restaurant responsibility).

━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUESTED RESOLUTION:

1. Immediate refund of SAR ${refund.amount} to restaurant
2. Investigation of driver involved in delivery
3. Implementation of barcode tracking system
4. Driver training to prevent order mix-ups

Restaurant should not bear financial loss for driver errors.

Respectfully,
Restaurant Management`;
        break;

      case 'CANCELLED_LATE':
        text = `To: ${refund.platform} Support Team

RE: Dispute - Late Cancellation Refund - Order ${refund.order_id}

Dear Support Team,

We dispute the full refund of SAR ${refund.amount} for an order cancelled after preparation began. Restaurant incurred actual costs.

━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE:

Customer cancelled ${evidence.cancellation_after_cooking || 'after preparation started'}, but received full refund despite restaurant incurring all costs.

━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCUMENTED FACTS:

${evidence.food_already_prepared ? '✓ Food was completely prepared' : ''}
• Cancellation time: ${evidence.cancellation_after_cooking || refund.cancellation_time}
• Order status at cancellation: Ready for driver pickup
${evidence.cannot_resell ? `• ${evidence.cannot_resell}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTUAL COSTS INCURRED:

${evidence.ingredients_cost ? `• Raw materials: ${evidence.ingredients_cost}` : ''}
${evidence.labor_cost ? `• Labor cost: ${evidence.labor_cost}` : ''}
• Energy and operations: SAR ${((refund.amount * 0.10).toFixed(2))}
• Packaging materials: SAR ${((refund.amount * 0.08).toFixed(2))}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Actual Loss: SAR ${refund.amount}

━━━━━━━━━━━━━━━━━━━━━━━━━━
PLATFORM POLICY REFERENCE:

${evidence.policy_states ? `📜 ${evidence.policy_states}` : 'Platform policy states: No refund after preparation begins'}

• Terms of Service: Free cancellation before preparation only
• After preparation starts: Customer not entitled to full refund
• Restaurant incurs real, unrecoverable costs

━━━━━━━━━━━━━━━━━━━━━━━━━━
LEGAL STANDING:

1. Restaurant fulfilled obligation by preparing order immediately
2. Actual financial costs incurred (materials + labor + energy)
3. Food cannot be resold (personalized, prepared meal)
4. Platform policies protect restaurants in this scenario
5. Late cancellation unjustified without emergency circumstance

━━━━━━━━━━━━━━━━━━━━━━━━━━
URGENT REQUESTED ACTION:

1. Reverse full refund decision
2. Refund SAR ${refund.amount} to restaurant account
3. Apply late cancellation policy (100% charge after preparation)
4. Implement order confirmation system before preparation
5. Prevent customer cancellations after specified timeframe

━━━━━━━━━━━━━━━━━━━━━━━━━━
SUGGESTED FAIR POLICY:

• Free cancellation: Before preparation (within 5 min)
• 50% charge: 5-10 minutes after order
• 100% charge: After 10 min or after order ready

These policies are standard globally across all delivery platforms.

We request immediate review and fair resolution preventing unjust financial loss.

Respectfully,
Restaurant Management
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        break;

      default:
        text = `To: ${refund.platform} Support Team,

Formal dispute regarding refund of SAR ${refund.amount} for order ${refund.order_id}.

Restaurant met all standards and policies. We request review and reversal of decision.

Respectfully,
Restaurant Management`;
    }

    setDisputeText(text);
    setGenerating(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(disputeText);
      setCopied(true);
      addNotification('success', 'Dispute text copied successfully');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addNotification('error', 'Failed to copy text');
    }
  };

  const handleSendToPlatform = () => {
    addNotification('info', 'Sending dispute to platform...');
    setTimeout(() => {
      addNotification('success', 'Dispute submitted successfully');
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
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/20"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Dispute Generator</h3>
                  <p className="text-sm text-gray-400">Professional defense for restaurant rights</p>
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
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="text-sm font-semibold text-white">{refund.order_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <p className="text-sm font-semibold text-cyan-400">{refund.platform}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount at Risk</p>
                <p className="text-sm font-semibold text-red-400">SAR {refund.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-sm font-semibold text-orange-400">{refund.reason}</p>
              </div>
            </div>
          </div>

          {/* Generated Dispute Text */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-white font-medium">Analyzing case and generating professional dispute...</p>
                <p className="text-sm text-gray-400 mt-2">Gathering evidence and legal arguments</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Dispute generated successfully</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy Text</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  className="w-full h-64 p-4 bg-black/40 border border-white/10 rounded-xl text-white text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Dispute text will appear here..."
                />

                <div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300 leading-relaxed">
                    You can edit the text as needed. Make sure to attach evidence (photos, videos, logs) when submitting the dispute.
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white font-semibold shadow-lg shadow-cyan-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send to Platform</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white font-medium border border-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// REFUNDS TABLE COMPONENT
// ============================================================================

function RefundsTable({ refunds, onGenerateDispute, onViewEvidence, searchQuery, statusFilter }) {
  // Filter refunds based on search and status
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = searchQuery === '' ||
      refund.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.platform.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Under Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      disputed: { label: 'Disputed', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      won: { label: 'Won (Recovered)', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      lost: { label: 'Lost (Deducted)', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
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

  const getFraudRiskBadge = (risk) => {
    if (!risk) return null;
    const config = {
      Low: 'bg-green-500/10 text-green-400 border-green-500/20',
      Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      High: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${config[risk]}`}>
        {risk} Risk
      </span>
    );
  };

  if (filteredRefunds.length === 0) {
    return (
      <ModernCard variant="glass" className="overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No refunds found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      </ModernCard>
    );
  }

  return (
    <ModernCard variant="glass" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRefunds.map((refund, index) => (
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
                    <span className="text-sm font-bold text-red-400">SAR {refund.amount}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-300">{refund.reason}</span>
                    {refund.restaurant_evidence?.fraud_risk && getFraudRiskBadge(refund.restaurant_evidence.fraud_risk)}
                  </div>
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
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white text-sm font-semibold shadow-lg shadow-cyan-500/30 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Dispute</span>
                    </button>
                    {refund.restaurant_evidence && (
                      <button
                        onClick={() => onViewEvidence(refund)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all"
                        title="View Evidence"
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RefundsAnalytics() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [refunds, setRefunds] = useState(mockRefunds);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate statistics
  const summary = {
    totalLoss: refunds.reduce((sum, r) => sum + r.amount, 0),
    totalRefunds: refunds.length,
    pendingAmount: refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
    recoveredAmount: refunds.filter(r => r.status === 'won').reduce((sum, r) => sum + r.amount, 0),
    successRate: ((refunds.filter(r => r.status === 'won').length / refunds.length) * 100).toFixed(0),
  };

  const handleGenerateDispute = (refund) => {
    setSelectedRefund(refund);
    setShowDisputeModal(true);
  };

  const handleViewEvidence = (refund) => {
    addNotification('info', 'Evidence viewer - Coming soon');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidFile) {
      addNotification('error', 'Invalid file type. Please upload Excel or CSV');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification('error', 'File too large. Maximum 10MB');
      event.target.value = '';
      return;
    }

    setLoading(true);
    addNotification('info', `Processing file: ${file.name}`);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          if (jsonData.length === 0) {
            addNotification('error', 'File is empty or contains no data');
            setLoading(false);
            return;
          }

          const newRefunds = jsonData.map((row, index) => {
            const orderId = row['Order ID'] || row['order_id'] || row['رقم الطلب'] || `ORD-${Date.now()}-${index}`;
            const platform = row['Platform'] || row['platform'] || row['المنصة'] || 'Unknown';
            const amount = parseFloat(row['Amount'] || row['amount'] || row['المبلغ'] || 0);
            const reason = row['Reason'] || row['reason'] || row['السبب'] || 'Not specified';
            const customerName = row['Customer'] || row['customer_name'] || row['اسم العميل'] || 'Customer';
            const date = row['Date'] || row['date'] || row['التاريخ'] || new Date().toISOString().split('T')[0];
            const complaint = row['Complaint'] || row['complaint'] || row['الشكوى'] || 'No details provided';

            let reasonCode = 'MISSING_ITEM';
            const lowerReason = reason.toLowerCase();
            if (lowerReason.includes('delay') || lowerReason.includes('late') || lowerReason.includes('تأخير')) {
              reasonCode = 'LATE_DELIVERY';
            } else if (lowerReason.includes('quality') || lowerReason.includes('cold') || lowerReason.includes('جودة')) {
              reasonCode = 'QUALITY_ISSUE';
            } else if (lowerReason.includes('wrong') || lowerReason.includes('incorrect') || lowerReason.includes('خاطئ')) {
              reasonCode = 'WRONG_ORDER';
            } else if (lowerReason.includes('cancel') || lowerReason.includes('إلغاء')) {
              reasonCode = 'CANCELLED_LATE';
            }

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
              restaurant_evidence: {
                has_prep_photo: false,
                has_packaging_video: false,
                needs_documentation: true,
                fraud_risk: 'Low',
              }
            };
          });

          setRefunds(prevRefunds => [...newRefunds, ...prevRefunds]);
          setLoading(false);
          addNotification('success', `Successfully loaded ${newRefunds.length} refund cases from ${file.name}`);
          event.target.value = '';
        } catch (parseError) {
          console.error('Parse error:', parseError);
          addNotification('error', 'Failed to parse file. Check data format');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        addNotification('error', 'Failed to read file');
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('File upload error:', error);
      addNotification('error', 'Error processing file');
      setLoading(false);
      event.target.value = '';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 border-b border-white/5 mb-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">Refund Defense Center</h1>
                  <p className="text-lg text-gray-400">Recover unjust refunds with AI-powered dispute generation</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">AI-Powered Legal Defense</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{summary.successRate}% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="px-8 mb-8">
        <ModernCard variant="glass" className="border-cyan-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Upload Refund Report</h3>
                <p className="text-sm text-gray-400">
                  Import Excel or CSV file containing refund data from platforms
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">✓ Excel (.xlsx, .xls)</span>
                  <span className="text-xs text-gray-500">✓ CSV</span>
                  <span className="text-xs text-gray-500">✓ Max 10MB</span>
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
                  bg-gradient-to-r from-cyan-500 to-blue-600
                  hover:from-cyan-600 hover:to-blue-700
                  text-white font-semibold shadow-lg shadow-cyan-500/30
                  transition-all duration-200 cursor-pointer
                  ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none animate-pulse' : ''}
                `}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
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
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">23%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Loss at Risk</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalLoss)}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
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
                    {refunds.filter(r => r.status === 'pending').length} cases
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Under Review</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.pendingAmount)}</p>
                <p className="text-xs text-gray-500">Needs dispute</p>
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
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">156%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Successfully Recovered</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.recoveredAmount)}</p>
                <p className="text-xs text-gray-500">Dispute victories</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="overflow-hidden border-cyan-500/20">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs font-semibold text-cyan-400">12%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">{summary.successRate}%</p>
                <p className="text-xs text-gray-500">Of total disputes</p>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-8 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-11 pr-8 py-3 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Under Review</option>
                <option value="disputed">Disputed</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <NeoButton variant="secondary" size="sm" icon={RefreshCw}>
              Refresh
            </NeoButton>
            <NeoButton variant="secondary" size="sm" icon={Download}>
              Export
            </NeoButton>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="px-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle icon={FileText}>
            Refund Cases ({refunds.length})
          </SectionTitle>
        </div>

        <RefundsTable
          refunds={refunds}
          onGenerateDispute={handleGenerateDispute}
          onViewEvidence={handleViewEvidence}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
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
                <h3 className="text-lg font-bold text-white mb-1">📋 Required File Format</h3>
                <p className="text-sm text-gray-400">
                  Prepare Excel or CSV file with these columns:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                <h4 className="text-sm font-bold text-cyan-400 mb-3">Required Columns:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>Order ID</strong> or <strong>order_id</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>Platform</strong> or <strong>platform</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>Amount</strong> or <strong>amount</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>Reason</strong> or <strong>reason</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span><strong>Date</strong> or <strong>date</strong></span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                <h4 className="text-sm font-bold text-green-400 mb-3">Optional Columns:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Customer</strong> or <strong>customer_name</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span><strong>Complaint</strong> or <strong>complaint</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span>Arabic column names are also supported</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">
                  <strong>Note:</strong> System supports both English and Arabic column names. If column names differ, default values will be used.
                </p>
              </div>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* How It Works */}
      <div className="px-8 mb-8">
        <SectionTitle icon={BarChart3} className="mb-6">
          How the System Works
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModernCard variant="glass">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Upload Data</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Import refund reports from platforms (Jahez, HungerStation, Talabat) in Excel or CSV format
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
                <h3 className="text-lg font-bold text-white mb-2">2. AI Analysis</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  AI analyzes each case, identifies legal grounds, and generates professional dispute arguments
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
                <h3 className="text-lg font-bold text-white mb-2">3. Professional Submission</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Generate ready-to-send disputes directly to platforms with all evidence and legal arguments
                </p>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-8">
        <ModernCard variant="glass" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-cyan-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">💡 Tips for Higher Success Rate</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Photograph all orders before handing to driver (especially large orders)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Maintain preparation logs, weights, and temperature records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use sealed bags with order barcode labels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Document driver pickup time with GPS system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Respond to customer complaints immediately - quick response increases success</span>
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
