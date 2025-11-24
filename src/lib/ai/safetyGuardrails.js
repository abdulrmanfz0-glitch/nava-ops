// src/lib/ai/safetyGuardrails.js
/**
 * Safety and Guardrail System for LLM Responses
 * Filters inappropriate content, validates responses, ensures quality
 */

import { logger } from '../logger';

export class SafetyGuardrails {
  constructor(config = {}) {
    this.strictMode = config.strictMode || false;
    this.maxLength = config.maxLength || 10000;
    this.blockedPatterns = this.initializeBlockedPatterns();
    this.warningPatterns = this.initializeWarningPatterns();
  }

  initializeBlockedPatterns() {
    return [
      // Harmful content patterns
      /hack\s+(into|the|system)/gi,
      /steal\s+(data|information|credentials)/gi,
      /bypass\s+(security|authentication)/gi,

      // Inappropriate content
      /\b(xxx|porn|adult\s+content)\b/gi,

      // Dangerous instructions
      /how\s+to\s+(build|make)\s+(bomb|weapon|explosive)/gi,

      // Sensitive data patterns
      /\b(\d{16}|\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4})\b/g, // Credit card numbers
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN-like patterns
    ];
  }

  initializeWarningPatterns() {
    return [
      // Sensitive topics that need careful handling
      /\b(password|secret|api[_\s]?key|token)\b/gi,
      /\b(medical|health|diagnosis|prescription)\b/gi,
      /\b(legal|lawsuit|attorney|court)\b/gi,
      /\b(financial|investment|stock|trading)\b/gi
    ];
  }

  /**
   * Validate input before sending to LLM
   */
  validateInput(userInput) {
    try {
      const validation = {
        isValid: true,
        isSafe: true,
        warnings: [],
        reasons: []
      };

      // Check length
      if (userInput.length > this.maxLength) {
        validation.isValid = false;
        validation.reasons.push(`Input exceeds maximum length of ${this.maxLength} characters`);
      }

      // Check for blocked patterns
      for (const pattern of this.blockedPatterns) {
        if (pattern.test(userInput)) {
          validation.isValid = false;
          validation.isSafe = false;
          validation.reasons.push('Input contains potentially harmful or inappropriate content');
          logger.warn('Blocked input detected', { pattern: pattern.toString() });
          break;
        }
      }

      // Check for warning patterns (doesn't block, just warns)
      for (const pattern of this.warningPatterns) {
        if (pattern.test(userInput)) {
          validation.warnings.push('Input contains sensitive topics - please be cautious');
          logger.info('Warning pattern detected in input', { pattern: pattern.toString() });
        }
      }

      // Check for prompt injection attempts
      if (this.detectPromptInjection(userInput)) {
        validation.isValid = false;
        validation.isSafe = false;
        validation.reasons.push('Input contains potential prompt injection attempt');
        logger.warn('Potential prompt injection detected');
      }

      return validation;

    } catch (error) {
      logger.error('Error validating input:', error);
      return {
        isValid: false,
        isSafe: true,
        warnings: [],
        reasons: ['Validation error']
      };
    }
  }

  /**
   * Validate output from LLM
   */
  validateOutput(llmResponse) {
    try {
      const validation = {
        isValid: true,
        isSafe: true,
        warnings: [],
        reasons: [],
        sanitizedResponse: llmResponse
      };

      // Check for blocked patterns in response
      for (const pattern of this.blockedPatterns) {
        if (pattern.test(llmResponse)) {
          validation.isSafe = false;
          validation.reasons.push('Response contains inappropriate content');
          validation.sanitizedResponse = this.sanitizeResponse(llmResponse);
          logger.warn('Blocked content in LLM response');
          break;
        }
      }

      // Check for potential data leakage
      if (this.detectDataLeakage(llmResponse)) {
        validation.warnings.push('Response may contain sensitive information');
        logger.warn('Potential data leakage in response');
      }

      // Validate markdown formatting
      if (!this.validateMarkdown(llmResponse)) {
        validation.warnings.push('Response may have markdown formatting issues');
      }

      // Check response length
      if (llmResponse.length > this.maxLength) {
        validation.isValid = false;
        validation.reasons.push('Response exceeds maximum length');
      }

      // Check for completeness
      if (this.isIncomplete(llmResponse)) {
        validation.warnings.push('Response may be incomplete');
      }

      return validation;

    } catch (error) {
      logger.error('Error validating output:', error);
      return {
        isValid: false,
        isSafe: true,
        warnings: [],
        reasons: ['Validation error'],
        sanitizedResponse: llmResponse
      };
    }
  }

  /**
   * Detect prompt injection attempts
   */
  detectPromptInjection(input) {
    const injectionPatterns = [
      /ignore\s+(previous|all)\s+(instructions?|prompts?)/gi,
      /forget\s+(everything|all)\s+(you|that)/gi,
      /you\s+are\s+now/gi,
      /new\s+instructions?:/gi,
      /system\s+prompt/gi,
      /\[SYSTEM\]/gi,
      /<\|im_start\|>/gi, // ChatML markers
      /<\|im_end\|>/gi
    ];

    return injectionPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect potential data leakage in response
   */
  detectDataLeakage(response) {
    const dataLeakagePatterns = [
      /api[_\s]?key:\s*[\w-]+/gi,
      /password:\s*[\w-]+/gi,
      /secret:\s*[\w-]+/gi,
      /token:\s*[\w-]+/gi,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g // Phone numbers
    ];

    return dataLeakagePatterns.some(pattern => pattern.test(response));
  }

  /**
   * Validate markdown formatting
   */
  validateMarkdown(text) {
    // Check for balanced markdown syntax
    const codeBlockCount = (text.match(/```/g) || []).length;
    const boldCount = (text.match(/\*\*/g) || []).length;
    const italicCount = (text.match(/\*/g) || []).length;

    // Code blocks should be in pairs
    if (codeBlockCount % 2 !== 0) return false;

    // Bold markers should be in pairs
    if (boldCount % 2 !== 0) return false;

    return true;
  }

  /**
   * Check if response appears incomplete
   */
  isIncomplete(response) {
    const incompleteSigns = [
      /\.\.\.$/, // Ends with ellipsis
      /\bin\s+progress\s*$/i,
      /\bto\s+be\s+continued\s*$/i,
      /\[incomplete\]/i
    ];

    // Check if ends mid-sentence
    const lastChar = response.trim().slice(-1);
    if (!'?.!'.includes(lastChar) && response.trim().length > 100) {
      return true;
    }

    return incompleteSigns.some(pattern => pattern.test(response));
  }

  /**
   * Sanitize response by removing/replacing inappropriate content
   */
  sanitizeResponse(response) {
    let sanitized = response;

    // Remove potential sensitive data
    sanitized = sanitized.replace(/\b\d{16}\b/g, '[REDACTED CARD NUMBER]');
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]');
    sanitized = sanitized.replace(/api[_\s]?key:\s*[\w-]+/gi, 'api_key: [REDACTED]');
    sanitized = sanitized.replace(/password:\s*[\w-]+/gi, 'password: [REDACTED]');

    return sanitized;
  }

  /**
   * Format response with proper markdown
   */
  formatMarkdownResponse(response) {
    let formatted = response;

    // Ensure code blocks are properly formatted
    formatted = formatted.replace(/```(\w+)?\n/g, '\n```$1\n');
    formatted = formatted.replace(/\n```\n/g, '\n```\n\n');

    // Ensure proper spacing around headers
    formatted = formatted.replace(/\n(#{1,6}\s+)/g, '\n\n$1');

    // Ensure proper list formatting
    formatted = formatted.replace(/\n(\d+\.|\*|\-)\s+/g, '\n$1 ');

    return formatted.trim();
  }

  /**
   * Generate safety report for conversation
   */
  generateSafetyReport(conversationMessages) {
    const report = {
      totalMessages: conversationMessages.length,
      flaggedInputs: 0,
      flaggedOutputs: 0,
      warnings: [],
      safetyScore: 100
    };

    conversationMessages.forEach(msg => {
      if (msg.role === 'user') {
        const validation = this.validateInput(msg.content);
        if (!validation.isSafe) {
          report.flaggedInputs++;
          report.safetyScore -= 10;
        }
        report.warnings.push(...validation.warnings);
      } else if (msg.role === 'assistant') {
        const validation = this.validateOutput(msg.content);
        if (!validation.isSafe) {
          report.flaggedOutputs++;
          report.safetyScore -= 5;
        }
        report.warnings.push(...validation.warnings);
      }
    });

    report.safetyScore = Math.max(0, report.safetyScore);
    report.safetyLevel = this.determineSafetyLevel(report.safetyScore);

    return report;
  }

  determineSafetyLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'moderate';
    return 'poor';
  }

  /**
   * Add custom blocked pattern
   */
  addBlockedPattern(pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern, 'gi');
    }
    this.blockedPatterns.push(pattern);
    logger.info('Added custom blocked pattern');
  }

  /**
   * Add custom warning pattern
   */
  addWarningPattern(pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern, 'gi');
    }
    this.warningPatterns.push(pattern);
    logger.info('Added custom warning pattern');
  }
}

export default SafetyGuardrails;
