// src/services/chatService.js
/**
 * Chat Service
 * Unified service integrating LLM, memory, and safety systems
 */

import LLMClient from '../lib/ai/llmClient';
import ConversationMemory from '../lib/ai/conversationMemory';
import SafetyGuardrails from '../lib/ai/safetyGuardrails';
import { logger } from '../lib/logger';

class ChatService {
  constructor() {
    this.llmClient = null;
    this.memory = new ConversationMemory();
    this.safety = new SafetyGuardrails();
    this.initialized = false;
    this.systemPrompt = this.getDefaultSystemPrompt();
  }

  /**
   * Initialize the chat service
   */
  async initialize(config = {}) {
    try {
      this.llmClient = new LLMClient({
        provider: config.provider || 'openai',
        apiKey: config.apiKey,
        model: config.model
      });

      this.llmClient.validateConfig();
      this.initialized = true;

      logger.info('Chat service initialized successfully');

      return { success: true };

    } catch (error) {
      logger.error('Failed to initialize chat service:', error);
      return { success: false, error: error.message };
    }
  }

  getDefaultSystemPrompt() {
    return `You are NAVA AI, an intelligent assistant for the NAVA Restaurant Management Platform.

You help restaurant operators with:
- General knowledge questions and information
- Business insights and analytics interpretation
- Creative content generation (marketing copy, menu descriptions)
- Code snippets for automation and integrations
- Multi-language support (English, Arabic, and more)

Guidelines:
- Be professional, friendly, and helpful
- Provide accurate, well-structured responses
- Use markdown for formatting when appropriate
- If you don't know something, admit it honestly
- Keep responses concise but comprehensive
- Prioritize actionable advice

Current date: ${new Date().toLocaleDateString()}`;
  }

  /**
   * Start new conversation
   */
  async startConversation(userId, context = {}) {
    if (!this.initialized) {
      throw new Error('Chat service not initialized');
    }

    const conversationId = this.memory.createConversation(userId, context);

    logger.info(`Started conversation ${conversationId} for user ${userId}`);

    return {
      conversationId,
      welcomeMessage: this.generateWelcomeMessage(context)
    };
  }

  generateWelcomeMessage(context) {
    const greeting = context.userName
      ? `Hello ${context.userName}!`
      : 'Hello!';

    return `${greeting} I'm NAVA AI, your intelligent assistant. How can I help you today?

I can assist with:
✨ **General Knowledge** - Ask me anything
🎨 **Creative Content** - Marketing copy, descriptions
💻 **Code Snippets** - Automation and integrations
🌍 **Translation** - Multiple languages
📊 **Business Insights** - Analytics interpretation

What would you like to explore?`;
  }

  /**
   * Send message and get response (non-streaming)
   */
  async sendMessage(conversationId, userMessage) {
    try {
      if (!this.initialized) {
        throw new Error('Chat service not initialized');
      }

      // Validate input
      const inputValidation = this.safety.validateInput(userMessage);
      if (!inputValidation.isValid) {
        return {
          success: false,
          error: inputValidation.reasons.join(', '),
          isSafetyViolation: true
        };
      }

      // Add user message to memory
      this.memory.addMessage(conversationId, {
        role: 'user',
        content: userMessage
      });

      // Get conversation context
      const messages = this.memory.getMessagesForLLM(conversationId, this.systemPrompt);

      // Generate response
      const response = await this.llmClient.generateCompletion(messages);

      // Validate output
      const outputValidation = this.safety.validateOutput(response.content);
      if (!outputValidation.isSafe) {
        logger.warn('Unsafe response detected, using sanitized version');
        response.content = outputValidation.sanitizedResponse;
      }

      // Format markdown
      response.content = this.safety.formatMarkdownResponse(response.content);

      // Add assistant response to memory
      this.memory.addMessage(conversationId, {
        role: 'assistant',
        content: response.content
      });

      return {
        success: true,
        message: response.content,
        usage: response.usage,
        warnings: outputValidation.warnings
      };

    } catch (error) {
      logger.error('Error sending message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send message and get streaming response
   */
  async *sendMessageStream(conversationId, userMessage) {
    try {
      if (!this.initialized) {
        yield {
          error: 'Chat service not initialized'
        };
        return;
      }

      // Validate input
      const inputValidation = this.safety.validateInput(userMessage);
      if (!inputValidation.isValid) {
        yield {
          error: inputValidation.reasons.join(', '),
          isSafetyViolation: true
        };
        return;
      }

      // Add user message to memory
      this.memory.addMessage(conversationId, {
        role: 'user',
        content: userMessage
      });

      // Get conversation context
      const messages = this.memory.getMessagesForLLM(conversationId, this.systemPrompt);

      // Generate streaming response
      let fullResponse = '';

      for await (const chunk of this.llmClient.generateStreamingCompletion(messages)) {
        if (chunk.content) {
          fullResponse += chunk.content;

          yield {
            content: chunk.content,
            fullContent: fullResponse,
            done: false
          };
        }

        if (chunk.done) {
          // Validate complete response
          const outputValidation = this.safety.validateOutput(fullResponse);

          if (!outputValidation.isSafe) {
            logger.warn('Unsafe streaming response detected');
            fullResponse = outputValidation.sanitizedResponse;
          }

          // Format markdown
          fullResponse = this.safety.formatMarkdownResponse(fullResponse);

          // Add to memory
          this.memory.addMessage(conversationId, {
            role: 'assistant',
            content: fullResponse
          });

          yield {
            content: '',
            fullContent: fullResponse,
            done: true,
            warnings: outputValidation.warnings
          };
        }
      }

    } catch (error) {
      logger.error('Error in streaming message:', error);
      yield {
        error: error.message,
        done: true
      };
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId) {
    return this.memory.getConversation(conversationId);
  }

  /**
   * Get all conversations for user
   */
  getUserConversations(userId) {
    return this.memory.getUserConversations(userId);
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId) {
    return this.memory.clearHistory(conversationId);
  }

  /**
   * Delete conversation
   */
  deleteConversation(conversationId) {
    return this.memory.deleteConversation(conversationId);
  }

  /**
   * Update conversation context
   */
  updateContext(conversationId, contextUpdates) {
    return this.memory.updateContext(conversationId, contextUpdates);
  }

  /**
   * Get safety report for conversation
   */
  getSafetyReport(conversationId) {
    const conversation = this.memory.getConversation(conversationId);
    if (!conversation) {
      return null;
    }

    return this.safety.generateSafetyReport(conversation.messages);
  }

  /**
   * Get chat statistics
   */
  getStats() {
    return {
      memory: this.memory.getStats(),
      initialized: this.initialized,
      provider: this.llmClient?.provider || 'none',
      model: this.llmClient?.model || 'none'
    };
  }

  /**
   * Cleanup old conversations
   */
  cleanup(maxAgeHours = 24) {
    return this.memory.cleanupOldConversations(maxAgeHours);
  }
}

// Singleton instance
const chatService = new ChatService();

export default chatService;
