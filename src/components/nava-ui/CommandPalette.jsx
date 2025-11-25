import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Command } from 'lucide-react';
import theme from '../../styles/navaUITheme';

/**
 * CommandPalette - Cmd+K style command palette
 *
 * @param {boolean} isOpen - Open state
 * @param {function} onClose - Close handler
 * @param {array} commands - Command list [{ id, label, description, icon, action, keywords }]
 * @param {string} placeholder - Search placeholder
 */
const CommandPalette = ({
  isOpen = false,
  onClose,
  commands = [],
  placeholder = 'Type a command or search...',
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  });

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action?.();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background: theme.glass.dark.strong.background,
                backdropFilter: theme.glass.dark.strong.backdropFilter,
                borderColor: theme.colors.dark.border.strong,
              }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-lg"
                />
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-xs text-white/40 font-medium">ESC</span>
                </div>
              </div>

              {/* Commands list */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {filteredCommands.length > 0 ? (
                  <div className="py-2">
                    {filteredCommands.map((cmd, index) => {
                      const Icon = cmd.icon;
                      const isSelected = index === selectedIndex;

                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action?.();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3
                            transition-colors
                            ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/70 hover:bg-white/5'}
                          `}
                          whileHover={{ x: 4 }}
                        >
                          {/* Icon */}
                          {Icon && (
                            <div className={`
                              p-2 rounded-lg
                              ${isSelected ? 'bg-cyan-500/20' : 'bg-white/5'}
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                          )}

                          {/* Label and description */}
                          <div className="flex-1 text-left">
                            <div className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div className="text-xs text-white/50 mt-0.5">
                                {cmd.description}
                              </div>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-white/50">
                    No commands found
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5 text-xs text-white/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">ESC</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
