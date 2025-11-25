/**
 * NAVA OPS - AI-Powered Refund Extraction Engine
 * Uses LLM (GPT-4o or Claude 3.5) to extract structured refund data from settlement files
 */

// System prompt (deterministic extraction)
export const REFUND_EXTRACTION_SYSTEM_PROMPT = `### SYSTEM CONFIGURATION
**Role:** Senior Financial Data Analyst & Parser for Food Delivery Platforms.
**Task:** Parse raw content from financial settlement statements (PDF/Excel exports) and extract specific negative transaction events.
**Output Format:** Strict JSON Array only.

### PROCESSING LOGIC
You will receive raw unstructured text or markdown tables from delivery apps (e.g., Jahez, HungerStation, The Chefz, ToYou).
Your goal is to isolate **Revenue Leakage** events.

**Step 1: Filter (The Needle in the Haystack)**
- IGNORE all rows representing successful deliveries, commissions, or positive payouts.
- TARGET only rows containing keywords: "Refund", "Adjustment", "Penalty", "Return", "Compensation", "Waste", "Damaged", "استرجاع", "تعديل", "غرامة", "تعويض".
- TARGET rows where the "Net Amount" is negative (e.g., -50.00).

**Step 2: Extraction Rules**
1.  **Platform Identification:** Infer the app name from the header/context (e.g., "Jahez").
2.  **Order Reference (Critical):** Extract the unique Order ID. Clean it of special chars (remove '#').
3.  **Financials:**
    - Extract \`refund_amount\` as an ABSOLUTE POSITIVE FLOAT (convert -45.50 to 45.50).
    - If multiple deductions exist for one order, aggregate them or list as separate entries.
4.  **Root Cause Analysis (The "Gold"):**
    - Extract the text describing the reason (e.g., "Spilled Item", "Missing Item").
    - **CRITICAL:** Preserve the original language (Arabic/English). DO NOT TRANSLATE.
    - If the reason is generic (e.g., "Adjustment"), look for a "Comment" or "Note" column.

### OUTPUT SCHEMA (JSON)
Return a single JSON object with a "refunds" key containing an array.

{
  "refunds": [
    {
      "order_ref_id": "String (Normalized ID)",
      "platform_source": "String",
      "transaction_date": "YYYY-MM-DD",
      "amount_deducted": Float,
      "currency": "String (default: SAR)",
      "reason_raw": "String (Original text reason)",
      "reason_category": "String (Classify into: 'quality', 'operations', 'driver', 'other')",
      "confidence_score": Float (0.0 to 1.0 based on extraction certainty)
    }
  ]
}

### EDGE CASES & CONSTRAINTS
- If the file contains no refunds, return \`{"refunds": []}\`.
- Do not hallucinate Order IDs. If ID is missing, mark as \`null\`.
- Handle mixed formats (e.g., "1,200.50" -> 1200.50).
- OUTPUT RAW JSON ONLY. No markdown fences, no conversational filler.`

/**
 * AI Extraction Engine
 * Supports multiple providers: OpenAI (GPT-4o) and Anthropic (Claude 3.5)
 */
export class AIRefundExtractor {
  constructor(config = {}) {
    this.provider = config.provider || 'openai' // 'openai' or 'anthropic'
    this.apiKey = config.apiKey
    this.model = config.model || (this.provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022')
    this.timeout = config.timeout || 60000 // 60 seconds
  }

  /**
   * Extract refunds from raw text using AI
   * @param {string} rawText - The extracted text from PDF/Excel
   * @param {string} platformHint - Optional platform name hint
   * @returns {Promise<Object>} - { success, data, metadata }
   */
  async extractRefunds(rawText, platformHint = null) {
    const startTime = Date.now()

    try {
      // Validate input
      if (!rawText || rawText.trim().length < 10) {
        throw new Error('Raw text is too short or empty')
      }

      // Build user prompt
      const userPrompt = this.buildUserPrompt(rawText, platformHint)

      // Call AI API based on provider
      let response
      if (this.provider === 'openai') {
        response = await this.callOpenAI(userPrompt)
      } else if (this.provider === 'anthropic') {
        response = await this.callAnthropic(userPrompt)
      } else {
        throw new Error(`Unsupported AI provider: ${this.provider}`)
      }

      // Parse and validate response
      const parsedData = this.parseAIResponse(response)

      const duration = Date.now() - startTime

      return {
        success: true,
        data: parsedData,
        metadata: {
          provider: this.provider,
          model: this.model,
          duration_ms: duration,
          tokens_used: response.tokensUsed || 0,
          refunds_found: parsedData.refunds.length
        }
      }
    } catch (error) {
      console.error('AI Extraction Error:', error)

      return {
        success: false,
        data: null,
        error: error.message,
        metadata: {
          provider: this.provider,
          model: this.model,
          duration_ms: Date.now() - startTime
        }
      }
    }
  }

  /**
   * Build user prompt with raw text
   */
  buildUserPrompt(rawText, platformHint) {
    let prompt = 'Parse the following settlement report and extract all refunds/adjustments:\n\n'

    if (platformHint) {
      prompt += `Platform: ${platformHint}\n\n`
    }

    prompt += '--- START OF DOCUMENT ---\n'
    prompt += rawText
    prompt += '\n--- END OF DOCUMENT ---\n\n'
    prompt += 'Extract all refunds and return as JSON according to the schema.'

    return prompt
  }

  /**
   * Call OpenAI API (GPT-4o)
   */
  async callOpenAI(userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: REFUND_EXTRACTION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for deterministic output
        response_format: { type: 'json_object' }
      }),
      signal: AbortSignal.timeout(this.timeout)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    }
  }

  /**
   * Call Anthropic API (Claude 3.5)
   */
  async callAnthropic(userPrompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.1,
        system: REFUND_EXTRACTION_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      }),
      signal: AbortSignal.timeout(this.timeout)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Anthropic API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    return {
      content: data.content[0]?.text,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0
    }
  }

  /**
   * Parse and validate AI response
   */
  parseAIResponse(response) {
    try {
      // Remove markdown code fences if present (just in case)
      let cleanContent = response.content.trim()
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')

      const parsed = JSON.parse(cleanContent)

      // Validate schema
      if (!parsed.refunds || !Array.isArray(parsed.refunds)) {
        throw new Error('Invalid response schema: missing "refunds" array')
      }

      // Validate each refund entry
      parsed.refunds = parsed.refunds.map((refund, index) => {
        // Ensure required fields
        if (!refund.order_ref_id && refund.order_ref_id !== null) {
          console.warn(`Refund #${index}: Missing order_ref_id, setting to null`)
          refund.order_ref_id = null
        }

        if (typeof refund.amount_deducted !== 'number' || refund.amount_deducted < 0) {
          throw new Error(`Refund #${index}: Invalid amount_deducted (must be positive number)`)
        }

        // Set defaults
        refund.currency = refund.currency || 'SAR'
        refund.confidence_score = refund.confidence_score || 0.8
        refund.platform_source = refund.platform_source || 'unknown'
        refund.reason_category = refund.reason_category || 'other'

        // Normalize category
        const validCategories = ['quality', 'operations', 'driver', 'customer', 'platform', 'other']
        if (!validCategories.includes(refund.reason_category)) {
          refund.reason_category = 'other'
        }

        return refund
      })

      return parsed
    } catch (error) {
      console.error('Failed to parse AI response:', response.content)
      throw new Error(`JSON Parse Error: ${error.message}`)
    }
  }

  /**
   * Batch processing for multiple files
   */
  async extractBatch(files, platformHint = null) {
    const results = []

    for (const file of files) {
      const result = await this.extractRefunds(file.rawText, platformHint)
      results.push({
        fileId: file.id,
        fileName: file.name,
        ...result
      })
    }

    return results
  }
}

/**
 * Factory function to create extractor with environment variables
 */
export function createRefundExtractor(provider = 'openai') {
  const config = {
    provider,
    apiKey: provider === 'openai'
      ? import.meta.env.VITE_OPENAI_API_KEY
      : import.meta.env.VITE_ANTHROPIC_API_KEY,
    timeout: 90000 // 90 seconds for large files
  }

  if (!config.apiKey) {
    throw new Error(`Missing API key for provider: ${provider}. Set VITE_${provider.toUpperCase()}_API_KEY in .env`)
  }

  return new AIRefundExtractor(config)
}

/**
 * Helper: Test extraction with sample data
 */
export async function testExtraction(sampleText) {
  console.log('🧪 Testing AI Extraction...')

  const extractor = createRefundExtractor('openai')
  const result = await extractor.extractRefunds(sampleText, 'jahez')

  console.log('✅ Extraction Result:', result)

  return result
}

export default AIRefundExtractor
