/**
 * NAVA OPS - Settlement File Parser
 * Converts PDF/Excel files to structured text for AI processing
 * Handles: PDF, Excel (.xlsx, .xls), CSV
 */

import * as XLSX from 'xlsx'

/**
 * Settlement File Parser Class
 * Extracts text from various file formats
 */
export class SettlementFileParser {
  constructor() {
    this.supportedFormats = ['pdf', 'xlsx', 'xls', 'csv']
  }

  /**
   * Main parsing method - routes to appropriate parser
   * @param {File} file - The uploaded file object
   * @returns {Promise<Object>} - { success, rawText, metadata }
   */
  async parseFile(file) {
    try {
      // Validate file
      this.validateFile(file)

      const fileType = this.getFileType(file)
      const startTime = Date.now()

      let rawText = ''

      // Route to appropriate parser
      switch (fileType) {
        case 'pdf':
          rawText = await this.parsePDF(file)
          break
        case 'xlsx':
        case 'xls':
          rawText = await this.parseExcel(file)
          break
        case 'csv':
          rawText = await this.parseCSV(file)
          break
        default:
          throw new Error(`Unsupported file type: ${fileType}`)
      }

      // Clean and normalize text
      rawText = this.cleanText(rawText)

      const duration = Date.now() - startTime

      return {
        success: true,
        rawText,
        metadata: {
          fileName: file.name,
          fileType,
          fileSize: file.size,
          parseDuration: duration,
          textLength: rawText.length,
          linesCount: rawText.split('\n').length
        }
      }
    } catch (error) {
      console.error('File parsing error:', error)

      return {
        success: false,
        rawText: null,
        error: error.message,
        metadata: {
          fileName: file.name,
          fileSize: file.size
        }
      }
    }
  }

  /**
   * Validate file before processing
   */
  validateFile(file) {
    // Check if file exists
    if (!file) {
      throw new Error('No file provided')
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size: 10MB`)
    }

    // Check file type
    const fileType = this.getFileType(file)
    if (!this.supportedFormats.includes(fileType)) {
      throw new Error(`Unsupported file format: ${fileType}. Supported: ${this.supportedFormats.join(', ')}`)
    }
  }

  /**
   * Get file type from file name
   */
  getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase()
    return extension
  }

  /**
   * Parse PDF file
   * Note: Browser-based PDF parsing using pdf.js would require additional library
   * For server-side, use pdf-parse or similar
   */
  async parsePDF(file) {
    // For client-side, we'll use a different approach
    // In production, this should be done server-side with pdf-parse
    console.warn('PDF parsing in browser has limitations. Consider server-side processing.')

    // Convert to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // For now, we'll use a placeholder that extracts what we can
    // In production, use: import('pdfjs-dist') or server-side pdf-parse
    try {
      // Try to extract text using basic methods
      const uint8Array = new Uint8Array(arrayBuffer)
      const text = new TextDecoder('utf-8').decode(uint8Array)

      // This is a very basic extraction - may not work for complex PDFs
      // Filter out binary garbage
      const cleaned = text
        .replace(/[^\x20-\x7E\u0600-\u06FF\n\r\t]/g, ' ') // Keep printable ASCII + Arabic
        .replace(/\s+/g, ' ')
        .trim()

      if (cleaned.length < 100) {
        throw new Error('PDF text extraction failed - file may be image-based or protected')
      }

      return cleaned
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}. Consider uploading as Excel/CSV instead.`)
    }
  }

  /**
   * Parse Excel file (.xlsx, .xls)
   * Uses SheetJS (xlsx library)
   */
  async parseExcel(file) {
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Parse with SheetJS
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      // Get first sheet
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Convert to CSV format (preserves structure)
      const csv = XLSX.utils.sheet_to_csv(worksheet, {
        FS: ',',
        RS: '\n',
        blankrows: false
      })

      // Also get as JSON for better structure
      const json = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      })

      // Convert to markdown table format (better for AI parsing)
      const markdown = this.convertToMarkdownTable(json)

      // Return markdown format (more structured for AI)
      return markdown || csv
    } catch (error) {
      throw new Error(`Excel parsing failed: ${error.message}`)
    }
  }

  /**
   * Parse CSV file
   */
  async parseCSV(file) {
    try {
      const text = await file.text()

      // Parse CSV manually (simple parsing)
      const lines = text.split('\n').filter(line => line.trim())

      // Convert to markdown table for better AI parsing
      const rows = lines.map(line => {
        // Handle quoted fields
        const fields = this.parseCSVLine(line)
        return fields
      })

      return this.convertToMarkdownTable(rows)
    } catch (error) {
      throw new Error(`CSV parsing failed: ${error.message}`)
    }
  }

  /**
   * Parse CSV line handling quotes
   */
  parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  /**
   * Convert array of arrays to markdown table
   * This format is easier for AI to parse
   */
  convertToMarkdownTable(rows) {
    if (!rows || rows.length === 0) {
      return ''
    }

    // Get headers (first row)
    const headers = rows[0]

    // Build markdown table
    let markdown = '| ' + headers.join(' | ') + ' |\n'
    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n'

    // Add data rows (skip first row which is headers)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      markdown += '| ' + row.join(' | ') + ' |\n'
    }

    return markdown
  }

  /**
   * Clean and normalize extracted text
   */
  cleanText(text) {
    return text
      // Normalize whitespace
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      // Remove excessive blank lines
      .replace(/\n{3,}/g, '\n\n')
      // Trim each line
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .trim()
  }

  /**
   * Generate file hash for idempotency check
   * Uses SHA-256
   */
  async generateFileHash(file) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      return hashHex
    } catch (error) {
      console.error('Hash generation failed:', error)
      // Fallback to simple hash
      return this.simpleHash(file.name + file.size + file.lastModified)
    }
  }

  /**
   * Simple fallback hash
   */
  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Detect platform from file content
   * Looks for keywords in the file
   */
  detectPlatform(rawText) {
    const platforms = {
      'jahez': ['jahez', 'جاهز'],
      'hungerstation': ['hungerstation', 'هنقرستيشن'],
      'toyo': ['toyo', 'توصيل', 'toyou'],
      'chefz': ['chefz', 'ذا شيفز', 'the chefz'],
      'mrsool': ['mrsool', 'مرسول'],
      'careem': ['careem', 'كريم']
    }

    const textLower = rawText.toLowerCase()

    for (const [platform, keywords] of Object.entries(platforms)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return platform
      }
    }

    return 'unknown'
  }

  /**
   * Validate parsed content has refund-related data
   */
  validateRefundContent(rawText) {
    const refundKeywords = [
      'refund', 'adjustment', 'penalty', 'return', 'compensation',
      'استرجاع', 'تعديل', 'غرامة', 'تعويض', 'خصم'
    ]

    const textLower = rawText.toLowerCase()
    const hasRefundKeywords = refundKeywords.some(keyword =>
      textLower.includes(keyword.toLowerCase())
    )

    return {
      hasRefundData: hasRefundKeywords,
      confidence: hasRefundKeywords ? 0.8 : 0.2
    }
  }
}

/**
 * Factory function
 */
export function createFileParser() {
  return new SettlementFileParser()
}

/**
 * Convenience function: Parse and analyze file
 */
export async function parseAndAnalyze(file) {
  const parser = createFileParser()

  // Parse file
  const parseResult = await parser.parseFile(file)

  if (!parseResult.success) {
    return parseResult
  }

  // Generate hash
  const fileHash = await parser.generateFileHash(file)

  // Detect platform
  const platform = parser.detectPlatform(parseResult.rawText)

  // Validate content
  const validation = parser.validateRefundContent(parseResult.rawText)

  return {
    ...parseResult,
    fileHash,
    detectedPlatform: platform,
    validation
  }
}

export default SettlementFileParser
