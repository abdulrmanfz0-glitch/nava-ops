// src/lib/ai/conversationMemory.js
/**
 * Conversation Memory System
 * Manages short-term and long-term conversation context
 */

import { logger } from '../logger';

export class ConversationMemory {
  constructor(options = {}) {
    this.maxMessages = options.maxMessages || 20; // Keep last 20 messages
    this.maxTokens = options.maxTokens || 4000; // Approximate token limit
    this.conversations = new Map(); // conversationId -> messages[]
    this.metadata = new Map(); // conversationId -> metadata
  }

  /**
   * Create new conversation
   */
  createConversation(userId, initialContext = {}) {
    const conversationId = this.generateConversationId();

    this.conversations.set(conversationId, []);
    this.metadata.set(conversationId, {
      id: conversationId,
      userId,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      messageCount: 0,
      context: initialContext
    });

    logger.debug(`Created conversation ${conversationId} for user ${userId}`);

    return conversationId;
  }

  /**
   * Add message to conversation
   */
  addMessage(conversationId, message) {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const messages = this.conversations.get(conversationId);
    const metadata = this.metadata.get(conversationId);

    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toISOString(),
      id: this.generateMessageId()
    };

    messages.push(messageWithTimestamp);
    metadata.messageCount++;
    metadata.lastActivityAt = new Date().toISOString();

    // Trim if exceeds max messages
    if (messages.length > this.maxMessages) {
      const removed = messages.splice(0, messages.length - this.maxMessages);
      logger.debug(`Trimmed ${removed.length} old messages from conversation ${conversationId}`);
    }

    return messageWithTimestamp;
  }

  /**
   * Get conversation history
   */
  getConversation(conversationId, options = {}) {
    if (!this.conversations.has(conversationId)) {
      return null;
    }

    const messages = this.conversations.get(conversationId);
    const metadata = this.metadata.get(conversationId);

    let filteredMessages = [...messages];

    // Apply filters
    if (options.lastN) {
      filteredMessages = filteredMessages.slice(-options.lastN);
    }

    if (options.role) {
      filteredMessages = filteredMessages.filter(m => m.role === options.role);
    }

    return {
      ...metadata,
      messages: filteredMessages
    };
  }

  /**
   * Get messages formatted for LLM
   */
  getMessagesForLLM(conversationId, systemPrompt = null) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return [];
    }

    const messages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Add conversation context if available
    if (conversation.context && Object.keys(conversation.context).length > 0) {
      const contextStr = this.formatContext(conversation.context);
      messages.push({
        role: 'system',
        content: `Context: ${contextStr}`
      });
    }

    // Add conversation messages
    conversation.messages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    return this.trimToTokenLimit(messages);
  }

  /**
   * Format context object as string
   */
  formatContext(context) {
    const parts = [];

    if (context.userName) parts.push(`User: ${context.userName}`);
    if (context.userRole) parts.push(`Role: ${context.userRole}`);
    if (context.platform) parts.push(`Platform: ${context.platform}`);
    if (context.location) parts.push(`Location: ${context.location}`);

    // Add any custom context
    Object.entries(context).forEach(([key, value]) => {
      if (!['userName', 'userRole', 'platform', 'location'].includes(key)) {
        parts.push(`${key}: ${value}`);
      }
    });

    return parts.join(', ');
  }

  /**
   * Trim messages to fit token limit
   */
  trimToTokenLimit(messages) {
    const estimatedTokens = this.estimateTotalTokens(messages);

    if (estimatedTokens <= this.maxTokens) {
      return messages;
    }

    // Keep system messages, trim conversation messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    // Remove oldest conversation messages until under limit
    while (this.estimateTotalTokens([...systemMessages, ...conversationMessages]) > this.maxTokens) {
      if (conversationMessages.length <= 2) break; // Keep at least last 2 messages

      conversationMessages.shift();
    }

    return [...systemMessages, ...conversationMessages];
  }

  /**
   * Estimate token count for messages
   */
  estimateTotalTokens(messages) {
    return messages.reduce((total, msg) => {
      return total + this.estimateTokens(msg.content);
    }, 0);
  }

  estimateTokens(text) {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Update conversation context
   */
  updateContext(conversationId, contextUpdates) {
    if (!this.metadata.has(conversationId)) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const metadata = this.metadata.get(conversationId);
    metadata.context = {
      ...metadata.context,
      ...contextUpdates
    };

    return metadata.context;
  }

  /**
   * Clear conversation history (but keep metadata)
   */
  clearHistory(conversationId) {
    if (!this.conversations.has(conversationId)) {
      return false;
    }

    this.conversations.set(conversationId, []);

    const metadata = this.metadata.get(conversationId);
    metadata.messageCount = 0;
    metadata.lastActivityAt = new Date().toISOString();

    logger.info(`Cleared conversation history for ${conversationId}`);

    return true;
  }

  /**
   * Delete conversation entirely
   */
  deleteConversation(conversationId) {
    const deleted = this.conversations.delete(conversationId);
    this.metadata.delete(conversationId);

    if (deleted) {
      logger.info(`Deleted conversation ${conversationId}`);
    }

    return deleted;
  }

  /**
   * Get all conversations for a user
   */
  getUserConversations(userId) {
    const userConversations = [];

    this.metadata.forEach((metadata, conversationId) => {
      if (metadata.userId === userId) {
        userConversations.push({
          ...metadata,
          messages: this.conversations.get(conversationId)
        });
      }
    });

    // Sort by last activity (most recent first)
    return userConversations.sort((a, b) =>
      new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
    );
  }

  /**
   * Get conversation summary
   */
  getConversationSummary(conversationId) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return null;
    }

    const userMessages = conversation.messages.filter(m => m.role === 'user');
    const assistantMessages = conversation.messages.filter(m => m.role === 'assistant');

    return {
      id: conversationId,
      userId: conversation.userId,
      totalMessages: conversation.messageCount,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      createdAt: conversation.createdAt,
      lastActivityAt: conversation.lastActivityAt,
      duration: this.calculateDuration(conversation.createdAt, conversation.lastActivityAt),
      firstMessage: conversation.messages[0]?.content.substring(0, 100) || '',
      lastMessage: conversation.messages[conversation.messages.length - 1]?.content.substring(0, 100) || ''
    };
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  }

  /**
   * Clean up old conversations
   */
  cleanupOldConversations(maxAgeHours = 24) {
    const now = new Date();
    let cleanedCount = 0;

    this.metadata.forEach((metadata, conversationId) => {
      const lastActivity = new Date(metadata.lastActivityAt);
      const ageHours = (now - lastActivity) / (1000 * 60 * 60);

      if (ageHours > maxAgeHours) {
        this.deleteConversation(conversationId);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} old conversations`);
    }

    return cleanedCount;
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      totalConversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values())
        .reduce((sum, messages) => sum + messages.length, 0),
      avgMessagesPerConversation: this.conversations.size > 0
        ? Array.from(this.conversations.values())
          .reduce((sum, messages) => sum + messages.length, 0) / this.conversations.size
        : 0,
      oldestConversation: this.getOldestConversationDate(),
      newestConversation: this.getNewestConversationDate()
    };
  }

  getOldestConversationDate() {
    let oldest = null;
    this.metadata.forEach(metadata => {
      if (!oldest || new Date(metadata.createdAt) < new Date(oldest)) {
        oldest = metadata.createdAt;
      }
    });
    return oldest;
  }

  getNewestConversationDate() {
    let newest = null;
    this.metadata.forEach(metadata => {
      if (!newest || new Date(metadata.createdAt) > new Date(newest)) {
        newest = metadata.createdAt;
      }
    });
    return newest;
  }

  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export default ConversationMemory;
