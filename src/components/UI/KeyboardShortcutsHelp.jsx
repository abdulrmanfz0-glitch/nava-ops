// src/components/UI/KeyboardShortcutsHelp.jsx
/**
 * Keyboard Shortcuts Help Modal
 * Displays all available keyboard shortcuts
 */

import React, { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { getAllShortcuts, formatShortcut, useKeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const [shortcuts, setShortcuts] = useState({});

  // Load shortcuts when modal opens
  useEffect(() => {
    if (isOpen) {
      setShortcuts(getAllShortcuts());
    }
  }, [isOpen]);

  // Close on Escape key
  useKeyboardShortcut('esc', onClose, {
    enabled: isOpen,
    description: 'Close shortcuts help'
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Keyboard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Master NAVA OPS with these shortcuts
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 custom-scrollbar">
            {Object.keys(shortcuts).length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Keyboard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No keyboard shortcuts registered yet</p>
                <p className="text-sm mt-2">Shortcuts will appear here as you navigate the app</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(shortcuts).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    {/* Category Header */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="h-px flex-1 bg-gradient-to-r from-primary-500 to-transparent"></span>
                      <span>{category}</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-primary-500 to-transparent"></span>
                    </h3>

                    {/* Shortcuts List */}
                    <div className="space-y-2">
                      {items.map(({ shortcut, description }) => (
                        <div
                          key={shortcut}
                          className="flex items-center justify-between p-3 rounded-lg
                                   bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900
                                   transition-colors duration-200"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {description}
                          </span>

                          <kbd className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold
                                       text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800
                                       border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                            {formatShortcut(shortcut)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              Press <kbd className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd> to close this dialog
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook to easily add the shortcuts help modal
export const useKeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcut('shift+?', () => setIsOpen(true), {
    description: 'Show keyboard shortcuts help',
    category: 'Help',
    global: true
  });

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
};

export default KeyboardShortcutsHelp;
