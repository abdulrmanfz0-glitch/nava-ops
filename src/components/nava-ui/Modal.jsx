import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import theme from '../../styles/navaUITheme';

/**
 * Modal - Modal dialog with glass effects
 *
 * @param {boolean} isOpen - Open state
 * @param {function} onClose - Close handler
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {string} title - Modal title
 * @param {React.Node} footer - Footer content
 * @param {boolean} closeOnBackdrop - Close on backdrop click
 * @param {boolean} closeOnEsc - Close on ESC key
 * @param {boolean} showCloseButton - Show close button
 */
const Modal = ({
  isOpen = false,
  onClose,
  size = 'md',
  title,
  footer,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  className = '',
}) => {
  // Size configurations
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className={`
                w-full ${sizes[size]}
                rounded-2xl border shadow-2xl
                pointer-events-auto
                ${className}
              `}
              style={{
                background: theme.glass.dark.strong.background,
                backdropFilter: theme.glass.dark.strong.backdropFilter,
                borderColor: theme.colors.dark.border.default,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  {title && (
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                  {footer}
                </div>
              )}

              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
