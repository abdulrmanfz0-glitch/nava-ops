// src/hooks/useKeyboardShortcuts.js
/**
 * Keyboard Shortcuts Hook
 * Enterprise-grade keyboard navigation system
 */

import { useEffect, useCallback, useRef } from 'react';
import logger from '@/lib/logger';

// Modifier keys mapping
const MODIFIERS = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  alt: 'altKey',
  meta: 'metaKey'
};

// Parse shortcut string (e.g., "ctrl+shift+s")
const parseShortcut = (shortcut) => {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);

  return {
    key,
    modifiers: modifiers.reduce((acc, mod) => {
      if (MODIFIERS[mod]) {
        acc[MODIFIERS[mod]] = true;
      }
      return acc;
    }, {})
  };
};

// Check if event matches shortcut
const matchesShortcut = (event, parsedShortcut) => {
  // Check if main key matches
  if (event.key.toLowerCase() !== parsedShortcut.key.toLowerCase()) {
    return false;
  }

  // Check all modifiers
  for (const [modifier, required] of Object.entries(parsedShortcut.modifiers)) {
    if (event[modifier] !== required) {
      return false;
    }
  }

  // Ensure no extra modifiers are pressed
  const expectedModifiers = new Set(Object.keys(parsedShortcut.modifiers));
  const actualModifiers = Object.keys(MODIFIERS)
    .map(key => MODIFIERS[key])
    .filter(mod => event[mod]);

  return actualModifiers.every(mod => expectedModifiers.has(mod));
};

// Global shortcuts registry
const globalShortcuts = new Map();

/**
 * Register a keyboard shortcut
 * @param {string} shortcut - Shortcut string (e.g., "ctrl+s", "shift+?")
 * @param {function} callback - Callback function
 * @param {object} options - Configuration options
 */
export const useKeyboardShortcut = (shortcut, callback, options = {}) => {
  const {
    enabled = true,
    preventDefault = true,
    description = '',
    category = 'General',
    global = false
  } = options;

  const callbackRef = useRef(callback);
  const parsedShortcutRef = useRef(null);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Parse shortcut
  useEffect(() => {
    if (shortcut) {
      parsedShortcutRef.current = parseShortcut(shortcut);
    }
  }, [shortcut]);

  const handleKeyDown = useCallback((event) => {
    if (!enabled || !parsedShortcutRef.current) return;

    // Skip if user is typing in an input
    const target = event.target;
    if (
      !global &&
      (target.tagName === 'INPUT' ||
       target.tagName === 'TEXTAREA' ||
       target.isContentEditable)
    ) {
      return;
    }

    if (matchesShortcut(event, parsedShortcutRef.current)) {
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      logger.debug('Keyboard shortcut triggered', { shortcut });
      callbackRef.current(event);
    }
  }, [enabled, preventDefault, global, shortcut]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    // Register in global shortcuts (for help menu)
    if (description) {
      globalShortcuts.set(shortcut, {
        shortcut,
        description,
        category
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      globalShortcuts.delete(shortcut);
    };
  }, [enabled, handleKeyDown, shortcut, description, category]);
};

/**
 * Register multiple keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts, options = {}) => {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handlers = [];

    for (const [shortcut, config] of Object.entries(shortcuts)) {
      const parsedShortcut = parseShortcut(shortcut);
      const { callback, preventDefault = true, description, category } = config;

      const handleKeyDown = (event) => {
        // Skip if user is typing in an input
        const target = event.target;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }

        if (matchesShortcut(event, parsedShortcut)) {
          if (preventDefault) {
            event.preventDefault();
            event.stopPropagation();
          }

          logger.debug('Keyboard shortcut triggered', { shortcut });
          callback(event);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      handlers.push({ shortcut, handler: handleKeyDown });

      // Register in global shortcuts
      if (description) {
        globalShortcuts.set(shortcut, {
          shortcut,
          description,
          category: category || 'General'
        });
      }
    }

    return () => {
      handlers.forEach(({ shortcut, handler }) => {
        document.removeEventListener('keydown', handler);
        globalShortcuts.delete(shortcut);
      });
    };
  }, [shortcuts, enabled]);
};

/**
 * Get all registered shortcuts (for help menu)
 */
export const getAllShortcuts = () => {
  const categorized = {};

  globalShortcuts.forEach(({ shortcut, description, category }) => {
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push({ shortcut, description });
  });

  return categorized;
};

/**
 * Hook for handling sequence shortcuts (e.g., "g then h" for GitHub-style navigation)
 */
export const useSequenceShortcut = (sequence, callback, options = {}) => {
  const { enabled = true, timeout = 1000 } = options;
  const sequenceRef = useRef([]);
  const timeoutRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Skip if user is typing in an input
    const target = event.target;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Add key to sequence
    sequenceRef.current.push(event.key.toLowerCase());

    // Check if sequence matches
    const currentSequence = sequenceRef.current.join(' ');
    if (currentSequence === sequence.toLowerCase()) {
      event.preventDefault();
      callback(event);
      sequenceRef.current = [];
      return;
    }

    // Set timeout to reset sequence
    timeoutRef.current = setTimeout(() => {
      sequenceRef.current = [];
    }, timeout);

  }, [enabled, sequence, callback, timeout]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleKeyDown]);
};

/**
 * Common shortcuts preset
 */
export const COMMON_SHORTCUTS = {
  // Navigation
  'ctrl+h': { description: 'Go to home/dashboard', category: 'Navigation' },
  'ctrl+b': { description: 'Toggle sidebar', category: 'Navigation' },
  'ctrl+k': { description: 'Open command palette', category: 'Navigation' },
  '/': { description: 'Focus search', category: 'Navigation' },
  'esc': { description: 'Close modal/dialog', category: 'Navigation' },

  // Actions
  'ctrl+s': { description: 'Save', category: 'Actions' },
  'ctrl+z': { description: 'Undo', category: 'Actions' },
  'ctrl+y': { description: 'Redo', category: 'Actions' },
  'ctrl+n': { description: 'New item', category: 'Actions' },
  'ctrl+e': { description: 'Edit', category: 'Actions' },
  'delete': { description: 'Delete selected', category: 'Actions' },

  // View
  'ctrl+=': { description: 'Zoom in', category: 'View' },
  'ctrl+-': { description: 'Zoom out', category: 'View' },
  'ctrl+0': { description: 'Reset zoom', category: 'View' },
  'f11': { description: 'Toggle fullscreen', category: 'View' },

  // Selection
  'ctrl+a': { description: 'Select all', category: 'Selection' },
  'shift+click': { description: 'Select range', category: 'Selection' },
  'ctrl+click': { description: 'Toggle selection', category: 'Selection' },

  // Help
  'shift+?': { description: 'Show keyboard shortcuts', category: 'Help' },
  'f1': { description: 'Open help', category: 'Help' }
};

/**
 * Format shortcut for display
 */
export const formatShortcut = (shortcut) => {
  const parts = shortcut.split('+').map(part => {
    const formatted = part.trim();
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  // Use symbols for common modifiers
  return parts
    .map(part => {
      switch (part.toLowerCase()) {
        case 'ctrl':
          return '⌃';
        case 'shift':
          return '⇧';
        case 'alt':
          return '⌥';
        case 'meta':
          return '⌘';
        default:
          return part;
      }
    })
    .join('');
};

export default useKeyboardShortcut;
