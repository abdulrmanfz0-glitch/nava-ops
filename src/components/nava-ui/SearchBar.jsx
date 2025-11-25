import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';

/**
 * SearchBar 2.0 - Modern search input with keyboard shortcuts
 *
 * @param {string} placeholder - Input placeholder
 * @param {string} value - Controlled value
 * @param {function} onChange - Change handler
 * @param {function} onSearch - Search submit handler
 * @param {boolean} showShortcut - Show Cmd+K hint
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} autoFocus - Auto focus on mount
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  showShortcut = false,
  size = 'md',
  autoFocus = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    if (!showShortcut) return;

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcut]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(e);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.({ target: { value: '' } });
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(localValue);
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-14 px-5 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          relative flex items-center
          bg-white/5 backdrop-blur-xl
          border rounded-xl
          ${isFocused
            ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,196,255,0.3)]'
            : 'border-white/10 shadow-lg'
          }
          transition-all duration-300
        `}
      >
        {/* Search icon */}
        <div className={`absolute left-4 ${iconSizes[size]} text-white/40`}>
          <Search className="w-full h-full" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full ${sizeStyles[size]}
            bg-transparent
            text-white placeholder:text-white/40
            outline-none
            ${showShortcut ? 'pr-24' : 'pr-12'}
            pl-11
          `}
        />

        {/* Clear button */}
        <AnimatePresence>
          {localValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute right-12 p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X className={iconSizes[size]} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard shortcut hint */}
        {showShortcut && !isFocused && !localValue && (
          <motion.div
            className="absolute right-4 flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Command className="w-3 h-3 text-white/40" />
            <span className="text-xs text-white/40 font-medium">K</span>
          </motion.div>
        )}
      </div>

      {/* Focus glow effect */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-teal-500/20 -z-10 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.form>
  );
};

export default SearchBar;
