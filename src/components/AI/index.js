/**
 * AI Components Index
 * Exports all AI-related components for easy importing
 */

export { default as AIChatSidebar } from './AIChatSidebar';
export { default as AIFloatingButton } from './AIFloatingButton';

// Re-export context and hooks for convenience
export { AIChatProvider, useAIChat, MESSAGE_TYPES } from '@/contexts/AIChatContext';
