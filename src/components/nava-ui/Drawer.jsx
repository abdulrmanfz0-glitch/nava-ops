import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import theme from '../../styles/navaUITheme';

/**
 * Drawer - Side drawer/panel with glass effects
 *
 * @param {boolean} isOpen - Open state
 * @param {function} onClose - Close handler
 * @param {string} position - 'left' | 'right'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {string} title - Drawer title
 * @param {React.Node} footer - Footer content
 */
const Drawer = ({
  isOpen = false,
  onClose,
  position = 'right',
  size = 'md',
  title,
  footer,
  children,
  className = '',
}) => {
  // Size configurations
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full',
  };

  // Animation variants
  const variants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  };

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

          {/* Drawer */}
          <motion.div
            className={`
              fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} bottom-0
              w-full ${sizes[size]}
              z-50 flex flex-col
              border-${position === 'left' ? 'r' : 'l'} shadow-2xl
              ${className}
            `}
            style={{
              background: theme.glass.dark.strong.background,
              backdropFilter: theme.glass.dark.strong.backdropFilter,
              borderColor: theme.colors.dark.border.default,
            }}
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={variants[position].exit}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              {title && (
                <h2 className="text-xl font-bold text-white">{title}</h2>
              )}
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                {footer}
              </div>
            )}

            {/* Glow effect */}
            <div
              className={`
                absolute ${position === 'left' ? 'right-0' : 'left-0'} inset-y-0 w-px
                bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent
                pointer-events-none
              `}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
