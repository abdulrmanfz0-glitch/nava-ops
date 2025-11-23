// src/components/UI/ConfirmDialog.jsx
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

/**
 * ConfirmDialog Component
 *
 * A professional confirmation dialog with:
 * - Modal overlay with backdrop blur
 * - Confirm/Cancel buttons
 * - Custom message and title
 * - Callback support (onConfirm, onCancel)
 * - Danger mode (red for destructive actions)
 * - Keyboard support (Enter=confirm, Esc=cancel)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls dialog visibility
 * @param {function} props.onClose - Callback when dialog is closed
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Optional callback when user cancels (defaults to onClose)
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/description
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.variant - Dialog variant: 'danger', 'warning', 'info', 'success' (default: 'info')
 * @param {boolean} props.loading - Shows loading state on confirm button
 * @param {React.ReactNode} props.children - Optional custom content
 */
const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info', // 'danger', 'warning', 'info', 'success'
  loading = false,
  children
}) => {
  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && !loading) {
        handleConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading]);

  const handleConfirm = () => {
    if (!loading && onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      if (onCancel) {
        onCancel();
      } else {
        onClose();
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleCancel();
    }
  };

  // Variant configurations
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      title: 'text-red-800 dark:text-red-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      title: 'text-yellow-800 dark:text-yellow-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      title: 'text-blue-800 dark:text-blue-200'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      confirmBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      title: 'text-green-800 dark:text-green-200'
    }
  };

  const config = variantConfig[variant] || variantConfig.info;
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleCancel}
          disabled={loading}
          className="absolute top-4 left-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center pt-6">
          <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <IconComponent className={config.iconColor} size={32} />
          </div>
        </div>

        {/* Title */}
        <div className="px-6 pt-4">
          <h3
            id="confirm-dialog-title"
            className={`text-xl font-semibold text-center ${config.title}`}
          >
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="px-6 pt-3 pb-6">
          <p
            id="confirm-dialog-description"
            className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
          >
            {message}
          </p>

          {/* Custom content */}
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 rtl:flex-row-reverse">
          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`
              flex-1 px-4 py-2.5 rounded-xl font-medium text-white
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${config.confirmBg}
              ${loading ? 'cursor-wait' : ''}
            `}
            autoFocus
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            disabled={loading}
            className="
              flex-1 px-4 py-2.5 rounded-xl font-medium
              bg-gray-100 hover:bg-gray-200 text-gray-700
              dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for using ConfirmDialog programmatically
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  });

  const confirm = React.useCallback((options) => {
    return new Promise((resolve, reject) => {
      setDialogState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to proceed with this action?',
        variant: options.variant || 'info',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          setDialogState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setDialogState((prev) => ({ ...prev, isOpen: false }));
          reject(false);
        }
      });
    });
  }, []);

  const DialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
      {...dialogState}
    />
  );

  return { confirm, Dialog: DialogComponent };
};

export default ConfirmDialog;
