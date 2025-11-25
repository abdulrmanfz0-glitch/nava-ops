/**
 * NAVA OPS - Refund Processing Service (Orchestrator)
 * Coordinates the entire refund ingestion pipeline:
 * 1. File Upload & Validation
 * 2. Idempotency Check (hash-based)
 * 3. File Parsing (PDF/Excel → Text)
 * 4. AI Extraction (Text → Structured JSON)
 * 5. Fuzzy Matching (Match to Orders)
 * 6. Database Insertion
 */

import { supabase } from './supabase.js'
import { createFileParser, parseAndAnalyze } from './settlementFileParser.js'
import { createRefundExtractor } from './aiRefundExtractor.js'
import { createOrderMatcher } from './fuzzyOrderMatcher.js'

/**
 * Refund Processing Service
 */
export class RefundProcessingService {
  constructor(userId, options = {}) {
    this.userId = userId
    this.branchId = options.branchId || null
    this.aiProvider = options.aiProvider || 'openai'
    this.skipMatching = options.skipMatching || false

    // Initialize sub-services
    this.fileParser = createFileParser()
    this.aiExtractor = null // Initialized on demand
    this.orderMatcher = createOrderMatcher(userId, this.branchId)
  }

  /**
   * Main processing method
   * Handles entire pipeline from file to database
   */
  async processSettlementFile(file, metadata = {}) {
    const startTime = Date.now()

    try {
      console.log('🚀 Starting settlement file processing...')

      // Step 1: Parse and analyze file
      console.log('📄 Step 1/6: Parsing file...')
      const parseResult = await parseAndAnalyze(file)

      if (!parseResult.success) {
        throw new Error(`File parsing failed: ${parseResult.error}`)
      }

      const { rawText, fileHash, detectedPlatform, validation } = parseResult

      // Step 2: Check for duplicate (idempotency)
      console.log('🔍 Step 2/6: Checking for duplicates...')
      const isDuplicate = await this.checkDuplicate(fileHash)

      if (isDuplicate) {
        return {
          success: false,
          status: 'duplicate',
          message: 'This file has already been processed',
          existingFileId: isDuplicate.id,
          data: null
        }
      }

      // Step 3: Create settlement file record
      console.log('💾 Step 3/6: Creating settlement file record...')
      const settlementFile = await this.createSettlementFileRecord({
        file,
        fileHash,
        detectedPlatform: metadata.platform || detectedPlatform,
        reportDate: metadata.reportDate,
        rawText
      })

      // Step 4: Extract refunds using AI
      console.log('🤖 Step 4/6: Extracting refunds with AI...')
      const extractionStartTime = Date.now()

      // Initialize AI extractor on demand (requires API key)
      if (!this.aiExtractor) {
        this.aiExtractor = createRefundExtractor(this.aiProvider)
      }

      const extractionResult = await this.aiExtractor.extractRefunds(
        rawText,
        detectedPlatform
      )

      if (!extractionResult.success) {
        await this.updateSettlementFileStatus(settlementFile.id, 'failed', {
          error_message: `AI extraction failed: ${extractionResult.error}`
        })

        throw new Error(`AI extraction failed: ${extractionResult.error}`)
      }

      const extractedRefunds = extractionResult.data.refunds
      const extractionDuration = Date.now() - extractionStartTime

      console.log(`✅ Extracted ${extractedRefunds.length} refunds in ${extractionDuration}ms`)

      // Update settlement file with extraction metadata
      await this.updateSettlementFileMetadata(settlementFile.id, {
        extraction_started_at: new Date(extractionStartTime).toISOString(),
        extraction_completed_at: new Date().toISOString(),
        extraction_duration_ms: extractionDuration,
        ai_model_used: extractionResult.metadata.model,
        ai_tokens_used: extractionResult.metadata.tokens_used,
        total_refunds_found: extractedRefunds.length
      })

      // Step 5: Match refunds to orders (if not skipped)
      console.log('🎯 Step 5/6: Matching refunds to orders...')
      let matchingResults = null

      if (!this.skipMatching && extractedRefunds.length > 0) {
        matchingResults = await this.orderMatcher.matchBatch(extractedRefunds, {
          logAllAttempts: true
        })

        console.log(`✅ Matched ${matchingResults.summary.matched}/${matchingResults.summary.total} refunds`)
      }

      // Step 6: Insert refunds into database
      console.log('💾 Step 6/6: Saving refunds to database...')
      const insertedRefunds = await this.insertRefunds(
        extractedRefunds,
        settlementFile.id,
        matchingResults
      )

      // Update settlement file status
      await this.updateSettlementFileStatus(settlementFile.id, 'completed', {
        matched_orders_count: matchingResults?.summary.matched || 0,
        unmatched_refunds_count: matchingResults?.summary.unmatched || 0
      })

      const totalDuration = Date.now() - startTime

      console.log(`✨ Processing completed in ${totalDuration}ms`)

      return {
        success: true,
        status: 'completed',
        message: `Successfully processed ${extractedRefunds.length} refunds`,
        data: {
          settlementFileId: settlementFile.id,
          refundsExtracted: extractedRefunds.length,
          refundsInserted: insertedRefunds.length,
          matchingSummary: matchingResults?.summary,
          processing: {
            totalDuration,
            extractionDuration,
            aiTokensUsed: extractionResult.metadata.tokens_used
          }
        }
      }
    } catch (error) {
      console.error('❌ Processing failed:', error)

      return {
        success: false,
        status: 'error',
        message: error.message,
        data: null
      }
    }
  }

  /**
   * Check if file has already been processed (idempotency)
   */
  async checkDuplicate(fileHash) {
    const { data, error } = await supabase
      .from('settlement_files')
      .select('id, file_name, created_at, upload_status')
      .eq('user_id', this.userId)
      .eq('file_hash', fileHash)
      .single()

    if (error || !data) {
      return null
    }

    return data
  }

  /**
   * Create settlement file record in database
   */
  async createSettlementFileRecord(fileData) {
    const { file, fileHash, detectedPlatform, reportDate, rawText } = fileData

    const record = {
      user_id: this.userId,
      branch_id: this.branchId,
      file_name: file.name,
      file_type: this.fileParser.getFileType(file),
      file_size_bytes: file.size,
      file_hash: fileHash,
      platform_source: detectedPlatform,
      platform_report_date: reportDate || null,
      upload_status: 'processing',
      raw_text: rawText // Store for re-processing if needed
    }

    const { data, error } = await supabase
      .from('settlement_files')
      .insert(record)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create settlement file record: ${error.message}`)
    }

    return data
  }

  /**
   * Update settlement file metadata
   */
  async updateSettlementFileMetadata(fileId, metadata) {
    const { error } = await supabase
      .from('settlement_files')
      .update(metadata)
      .eq('id', fileId)

    if (error) {
      console.error('Failed to update settlement file metadata:', error)
    }
  }

  /**
   * Update settlement file status
   */
  async updateSettlementFileStatus(fileId, status, additionalData = {}) {
    const { error } = await supabase
      .from('settlement_files')
      .update({
        upload_status: status,
        ...additionalData,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId)

    if (error) {
      console.error('Failed to update settlement file status:', error)
    }
  }

  /**
   * Insert refunds into database
   */
  async insertRefunds(extractedRefunds, settlementFileId, matchingResults = null) {
    if (!extractedRefunds || extractedRefunds.length === 0) {
      return []
    }

    // Build refund records
    const refundRecords = extractedRefunds.map((refund, index) => {
      // Get matching result if available
      const matchResult = matchingResults?.results[index]

      return {
        user_id: this.userId,
        branch_id: this.branchId,
        settlement_file_id: settlementFileId,

        // Matching data
        matched_order_id: matchResult?.orderId || null,
        order_ref_id: refund.order_ref_id,
        match_confidence: matchResult?.confidence || 0,
        match_method: matchResult?.method || 'unmatched',

        // Platform and transaction details
        platform_source: refund.platform_source,
        transaction_date: refund.transaction_date,
        transaction_time: refund.transaction_time || null,

        // Financial
        amount_deducted: refund.amount_deducted,
        currency: refund.currency || 'SAR',

        // Categorization
        reason_raw: refund.reason_raw,
        reason_category: refund.reason_category || 'other',

        // AI confidence
        ai_confidence_score: refund.confidence_score || 0.8,

        // Status
        status: 'pending', // Default to pending for user review

        // Metadata
        metadata: {
          ai_extracted: true,
          extraction_index: index,
          matching_reasoning: matchResult?.reasoning
        }
      }
    })

    // Batch insert
    const { data, error } = await supabase
      .from('refunds_adjustments')
      .insert(refundRecords)
      .select()

    if (error) {
      console.error('Failed to insert refunds:', error)
      throw new Error(`Database insertion failed: ${error.message}`)
    }

    return data
  }

  /**
   * Get processing status
   */
  async getProcessingStatus(settlementFileId) {
    const { data, error } = await supabase
      .from('settlement_files')
      .select(`
        *,
        refunds:refunds_adjustments(count)
      `)
      .eq('id', settlementFileId)
      .single()

    if (error) {
      throw new Error(`Failed to get processing status: ${error.message}`)
    }

    return data
  }

  /**
   * Reprocess a failed settlement file
   */
  async reprocessSettlementFile(settlementFileId) {
    // Get original file data
    const { data: settlementFile, error } = await supabase
      .from('settlement_files')
      .select('*')
      .eq('id', settlementFileId)
      .eq('user_id', this.userId)
      .single()

    if (error || !settlementFile) {
      throw new Error('Settlement file not found')
    }

    // Check if already processed
    if (settlementFile.upload_status === 'completed') {
      throw new Error('File already processed successfully')
    }

    // Re-extract from raw_text
    if (!settlementFile.raw_text) {
      throw new Error('Raw text not available for reprocessing')
    }

    // Update status to processing
    await this.updateSettlementFileStatus(settlementFileId, 'processing')

    // Re-run extraction and matching
    // (Implementation similar to processSettlementFile but skips parsing)

    console.log(`♻️ Reprocessing settlement file ${settlementFileId}...`)

    // TODO: Implement full reprocessing logic

    return {
      success: true,
      message: 'Reprocessing started'
    }
  }
}

/**
 * Factory function
 */
export function createRefundProcessor(userId, options = {}) {
  return new RefundProcessingService(userId, options)
}

/**
 * Quick process function
 */
export async function processFile(userId, file, metadata = {}) {
  const processor = createRefundProcessor(userId, metadata)
  return await processor.processSettlementFile(file, metadata)
}

export default RefundProcessingService
