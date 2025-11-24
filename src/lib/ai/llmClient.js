// src/lib/ai/llmClient.js
/**
 * Universal LLM Client
 * Supports multiple LLM providers with streaming, retries, and error handling
 * Providers: OpenAI, Anthropic Claude, Azure OpenAI
 */

import { logger } from '../logger';

export class LLMClient {
  constructor(config = {}) {
    this.provider = config.provider || 'openai'; // 'openai', 'anthropic', 'azure'
    this.apiKey = config.apiKey || process.env.VITE_OPENAI_API_KEY;
    this.model = config.model || this.getDefaultModel();
    this.baseURL = config.baseURL || this.getDefaultBaseURL();
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;
  }

  getDefaultModel() {
    const models = {
      openai: 'gpt-4-turbo-preview',
      anthropic: 'claude-3-sonnet-20240229',
      azure: 'gpt-4'
    };
    return models[this.provider] || 'gpt-4-turbo-preview';
  }

  getDefaultBaseURL() {
    const urls = {
      openai: 'https://api.openai.com/v1',
      anthropic: 'https://api.anthropic.com/v1',
      azure: process.env.VITE_AZURE_OPENAI_ENDPOINT
    };
    return urls[this.provider];
  }

  /**
   * Generate completion (non-streaming)
   */
  async generateCompletion(messages, options = {}) {
    try {
      logger.debug('Generating LLM completion', { provider: this.provider, model: this.model });

      const requestPayload = this.buildRequestPayload(messages, options, false);
      const response = await this.makeRequest(requestPayload);

      return {
        content: this.extractContent(response),
        usage: response.usage,
        model: this.model,
        provider: this.provider
      };

    } catch (error) {
      logger.error('Error generating completion:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generate streaming completion
   */
  async *generateStreamingCompletion(messages, options = {}) {
    try {
      logger.debug('Generating streaming LLM completion', { provider: this.provider });

      const requestPayload = this.buildRequestPayload(messages, options, true);
      const response = await this.makeStreamingRequest(requestPayload);

      for await (const chunk of this.processStream(response)) {
        yield chunk;
      }

    } catch (error) {
      logger.error('Error in streaming completion:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Build request payload based on provider
   */
  buildRequestPayload(messages, options, streaming) {
    const basePayload = {
      model: this.model,
      messages: this.formatMessages(messages),
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: streaming
    };

    // Provider-specific adjustments
    if (this.provider === 'anthropic') {
      return {
        ...basePayload,
        max_tokens: options.maxTokens || 4096,
        system: options.systemPrompt || null
      };
    }

    if (this.provider === 'openai') {
      return {
        ...basePayload,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      };
    }

    return basePayload;
  }

  /**
   * Format messages for the provider
   */
  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Make HTTP request to LLM API
   */
  async makeRequest(payload) {
    const endpoint = this.getEndpoint();
    const headers = this.getHeaders();

    let lastError;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${response.status} - ${error.message || response.statusText}`);
        }

        return await response.json();

      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.warn(`Request failed, retrying in ${delay}ms...`, { attempt: attempt + 1 });
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Make streaming HTTP request
   */
  async makeStreamingRequest(payload) {
    const endpoint = this.getEndpoint();
    const headers = this.getHeaders();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${error.message || response.statusText}`);
    }

    return response.body;
  }

  /**
   * Process streaming response
   */
  async *processStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = this.extractStreamContent(parsed);
              if (content) {
                yield {
                  content,
                  done: false
                };
              }
            } catch (error) {
              logger.warn('Error parsing stream chunk:', error);
            }
          }
        }
      }

      yield { content: '', done: true };

    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Get API endpoint
   */
  getEndpoint() {
    const endpoints = {
      openai: `${this.baseURL}/chat/completions`,
      anthropic: `${this.baseURL}/messages`,
      azure: `${this.baseURL}/openai/deployments/${this.model}/chat/completions?api-version=2024-02-15-preview`
    };
    return endpoints[this.provider] || endpoints.openai;
  }

  /**
   * Get request headers
   */
  getHeaders() {
    const commonHeaders = {
      'Content-Type': 'application/json'
    };

    if (this.provider === 'anthropic') {
      return {
        ...commonHeaders,
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      };
    }

    if (this.provider === 'azure') {
      return {
        ...commonHeaders,
        'api-key': this.apiKey
      };
    }

    // OpenAI and default
    return {
      ...commonHeaders,
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Extract content from response
   */
  extractContent(response) {
    if (this.provider === 'anthropic') {
      return response.content[0]?.text || '';
    }

    // OpenAI format
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Extract content from stream chunk
   */
  extractStreamContent(chunk) {
    if (this.provider === 'anthropic') {
      if (chunk.type === 'content_block_delta') {
        return chunk.delta?.text || '';
      }
      return null;
    }

    // OpenAI format
    return chunk.choices[0]?.delta?.content || null;
  }

  /**
   * Handle and format errors
   */
  handleError(error) {
    if (error.message?.includes('timeout')) {
      return new Error('Request timeout - please try again');
    }

    if (error.message?.includes('401') || error.message?.includes('403')) {
      return new Error('API authentication failed - check your API key');
    }

    if (error.message?.includes('429')) {
      return new Error('Rate limit exceeded - please wait and try again');
    }

    if (error.message?.includes('500') || error.message?.includes('502') || error.message?.includes('503')) {
      return new Error('API service unavailable - please try again later');
    }

    return error;
  }

  /**
   * Calculate token count (approximate)
   */
  estimateTokens(text) {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    if (!this.apiKey) {
      throw new Error(`API key not configured for provider: ${this.provider}`);
    }

    if (!this.baseURL && this.provider === 'azure') {
      throw new Error('Azure OpenAI endpoint not configured');
    }

    return true;
  }
}

export default LLMClient;
