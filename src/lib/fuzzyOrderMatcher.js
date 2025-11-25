/**
 * NAVA OPS - Fuzzy Order Matching Engine
 * Matches refunds from delivery platforms to POS orders using multiple strategies
 *
 * Matching Priority:
 * 1. Exact Order ID match (100% confidence)
 * 2. Fuzzy Order ID match using Levenshtein distance (70-95% confidence)
 * 3. Date + Amount match as fallback (50-80% confidence)
 * 4. Unmatched (0% confidence)
 */

import { supabase } from './supabase.js'

/**
 * Levenshtein Distance Algorithm
 * Calculates edit distance between two strings
 */
export function levenshteinDistance(str1, str2) {
  const m = str1.length
  const n = str2.length

  // Create matrix
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  // Fill matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        )
      }
    }
  }

  return dp[m][n]
}

/**
 * Calculate similarity score between two strings
 * Returns 0.0 to 1.0 (1.0 = identical)
 */
export function stringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0

  // Normalize strings
  const s1 = normalizeOrderId(str1)
  const s2 = normalizeOrderId(str2)

  if (s1 === s2) return 1.0

  const distance = levenshteinDistance(s1, s2)
  const maxLength = Math.max(s1.length, s2.length)

  // Convert distance to similarity score
  const similarity = 1 - (distance / maxLength)

  return Math.max(0, Math.min(1, similarity))
}

/**
 * Normalize Order ID for comparison
 * Removes special characters, spaces, and converts to lowercase
 */
export function normalizeOrderId(orderId) {
  if (!orderId) return ''

  return orderId
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all special chars
    .trim()
}

/**
 * Fuzzy Order Matcher Class
 */
export class FuzzyOrderMatcher {
  constructor(userId, branchId = null) {
    this.userId = userId
    this.branchId = branchId

    // Matching thresholds
    this.thresholds = {
      exactMatch: 1.0,          // Perfect match
      strongMatch: 0.85,        // Very likely the same order
      moderateMatch: 0.70,      // Probably the same order
      weakMatch: 0.50,          // Possibly the same order
      noMatch: 0.0              // Different orders
    }

    // Date tolerance (in days)
    this.dateTolerance = 7 // Allow ±7 days
  }

  /**
   * Main matching method
   * Tries multiple strategies in priority order
   */
  async matchRefund(refundData) {
    const { order_ref_id, transaction_date, amount_deducted } = refundData

    try {
      // Strategy 1: Exact Order ID Match (Priority 1)
      if (order_ref_id) {
        const exactMatch = await this.findExactMatch(order_ref_id)
        if (exactMatch) {
          return {
            matched: true,
            orderId: exactMatch.id,
            confidence: 1.0,
            method: 'exact_order_id',
            order: exactMatch,
            reasoning: 'Perfect order ID match'
          }
        }

        // Strategy 2: Fuzzy Order ID Match (Still Priority 1, but lower confidence)
        const fuzzyMatch = await this.findFuzzyMatch(order_ref_id)
        if (fuzzyMatch && fuzzyMatch.confidence >= this.thresholds.moderateMatch) {
          return {
            matched: true,
            orderId: fuzzyMatch.order.id,
            confidence: fuzzyMatch.confidence,
            method: 'fuzzy_order_id',
            order: fuzzyMatch.order,
            reasoning: `Fuzzy match with ${(fuzzyMatch.confidence * 100).toFixed(0)}% similarity`
          }
        }
      }

      // Strategy 3: Date + Amount Match (Priority 2 - Fallback)
      if (transaction_date && amount_deducted) {
        const dateAmountMatch = await this.findDateAmountMatch(
          transaction_date,
          amount_deducted
        )

        if (dateAmountMatch) {
          return {
            matched: true,
            orderId: dateAmountMatch.order.id,
            confidence: dateAmountMatch.confidence,
            method: 'date_amount_match',
            order: dateAmountMatch.order,
            reasoning: `Matched via date (${transaction_date}) and amount (${amount_deducted})`
          }
        }
      }

      // No match found
      return {
        matched: false,
        orderId: null,
        confidence: 0,
        method: 'unmatched',
        order: null,
        reasoning: 'Could not find matching order'
      }
    } catch (error) {
      console.error('Matching error:', error)

      return {
        matched: false,
        orderId: null,
        confidence: 0,
        method: 'error',
        order: null,
        reasoning: `Matching failed: ${error.message}`
      }
    }
  }

  /**
   * Strategy 1: Find exact order ID match
   */
  async findExactMatch(orderRefId) {
    const normalized = normalizeOrderId(orderRefId)

    // Query database for exact match
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', this.userId)
      .or(`order_number.eq.${orderRefId},order_number.ilike.${orderRefId}`)
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    // Verify it's actually an exact match
    if (normalizeOrderId(data.order_number) === normalized) {
      return data
    }

    return null
  }

  /**
   * Strategy 2: Find fuzzy order ID match
   * Uses Levenshtein distance to find similar order numbers
   */
  async findFuzzyMatch(orderRefId) {
    const normalized = normalizeOrderId(orderRefId)

    // Get all orders within date range (optimize query)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', this.userId)
      .gte('order_date', this.getDateRange().start)
      .lte('order_date', this.getDateRange().end)
      .order('order_date', { ascending: false })
      .limit(1000) // Limit for performance

    if (error || !orders || orders.length === 0) {
      return null
    }

    // Calculate similarity for each order
    const matches = orders
      .map(order => ({
        order,
        confidence: stringSimilarity(orderRefId, order.order_number)
      }))
      .filter(match => match.confidence >= this.thresholds.moderateMatch)
      .sort((a, b) => b.confidence - a.confidence)

    // Return best match
    if (matches.length > 0) {
      return matches[0]
    }

    return null
  }

  /**
   * Strategy 3: Find match by date + amount
   * Fallback when order ID is not available or doesn't match
   */
  async findDateAmountMatch(transactionDate, amount) {
    // Calculate date range (±tolerance)
    const dateObj = new Date(transactionDate)
    const startDate = new Date(dateObj)
    startDate.setDate(startDate.getDate() - this.dateTolerance)
    const endDate = new Date(dateObj)
    endDate.setDate(endDate.getDate() + this.dateTolerance)

    // Query orders matching date range
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', this.userId)
      .gte('order_date', startDate.toISOString().split('T')[0])
      .lte('order_date', endDate.toISOString().split('T')[0])
      .order('order_date', { ascending: false })
      .limit(500)

    if (error || !orders || orders.length === 0) {
      return null
    }

    // Find orders with matching amount (allow ±5% variance)
    const tolerance = 0.05 // 5%
    const matches = orders
      .filter(order => {
        const diff = Math.abs(order.total - amount)
        const percentDiff = diff / amount
        return percentDiff <= tolerance
      })
      .map(order => {
        // Calculate confidence based on date proximity and amount accuracy
        const daysDiff = Math.abs(
          (new Date(order.order_date) - dateObj) / (1000 * 60 * 60 * 24)
        )
        const amountDiff = Math.abs(order.total - amount) / amount

        // Higher confidence for closer dates and more accurate amounts
        const dateScore = Math.max(0, 1 - (daysDiff / this.dateTolerance))
        const amountScore = Math.max(0, 1 - (amountDiff / tolerance))

        const confidence = (dateScore * 0.6 + amountScore * 0.4) * 0.8 // Max 0.8 for this method

        return { order, confidence }
      })
      .filter(match => match.confidence >= this.thresholds.weakMatch)
      .sort((a, b) => b.confidence - a.confidence)

    // Return best match
    if (matches.length > 0) {
      return matches[0]
    }

    return null
  }

  /**
   * Get date range for queries (optimization)
   */
  getDateRange() {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 3) // Last 3 months

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    }
  }

  /**
   * Batch matching for multiple refunds
   */
  async matchBatch(refunds, options = {}) {
    const results = []
    const logAllAttempts = options.logAllAttempts || false

    for (const refund of refunds) {
      const match = await this.matchRefund(refund)

      results.push({
        refund,
        ...match
      })

      // Log matching attempt if enabled
      if (logAllAttempts && match.orderId) {
        await this.logMatchingAttempt(refund.id, match)
      }
    }

    // Generate summary
    const summary = {
      total: results.length,
      matched: results.filter(r => r.matched).length,
      unmatched: results.filter(r => !r.matched).length,
      exactMatches: results.filter(r => r.method === 'exact_order_id').length,
      fuzzyMatches: results.filter(r => r.method === 'fuzzy_order_id').length,
      dateAmountMatches: results.filter(r => r.method === 'date_amount_match').length,
      averageConfidence: results
        .filter(r => r.matched)
        .reduce((acc, r) => acc + r.confidence, 0) / results.filter(r => r.matched).length || 0
    }

    return {
      results,
      summary
    }
  }

  /**
   * Log matching attempt for debugging
   */
  async logMatchingAttempt(refundId, matchResult) {
    try {
      await supabase
        .from('refund_matching_log')
        .insert({
          refund_id: refundId,
          attempted_order_id: matchResult.orderId,
          match_score: matchResult.confidence,
          match_algorithm: matchResult.method,
          reasoning: matchResult.reasoning,
          metadata: {
            matched: matchResult.matched,
            order_number: matchResult.order?.order_number
          }
        })
    } catch (error) {
      console.error('Failed to log matching attempt:', error)
    }
  }
}

/**
 * Factory function
 */
export function createOrderMatcher(userId, branchId = null) {
  return new FuzzyOrderMatcher(userId, branchId)
}

/**
 * Quick match function for single refund
 */
export async function quickMatch(userId, refundData) {
  const matcher = createOrderMatcher(userId)
  return await matcher.matchRefund(refundData)
}

export default FuzzyOrderMatcher
