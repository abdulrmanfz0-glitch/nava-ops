// src/components/UI/Toast.jsx
/**
 * Toast Notification System
 * Modern, accessible toast notifications with animations
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react';
import logger from '@/lib/logger';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Types
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-500 dark:bg-green-600',
    iconColor: 'text-white'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500 dark:bg-red-600',
    iconColor: 'text-white'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-500 dark:bg-yellow-600',
    iconColor: 'text-white'
  },
  info: {
    icon: Info,
    className: 'bg-blue-500 dark:bg-blue-600',
    iconColor: 'text-white'
  }
};

// Toast Component
const Toast = ({ id, type, message, title, duration, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(id);
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      role="alert"
      className={`
        relative flex items-start gap-3 min-w-80 max-w-md p-4 rounded-lg shadow-lg
        ${config.className}
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-white mb-1">
            {title}
          </p>
        )}
        <p className="text-sm text-white/90">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-white/50 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Toast Provider
export const ToastProvider = ({ children, maxToasts = 5, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: options.type || 'info',
      message: options.message || '',
      title: options.title,
      duration: options.duration || 5000
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      // Limit number of toasts
      if (updated.length > maxToasts) {
        return updated.slice(-maxToasts);
      }
      return updated;
    });

    logger.debug('Toast notification added', { type: newToast.type, message: newToast.message });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, title) => {
    return addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message, title) => {
    return addToast({ type: 'error', message, title });
  }, [addToast]);

  const warning = useCallback((message, title) => {
    return addToast({ type: 'warning', message, title });
  }, [addToast]);

  const info = useCallback((message, title) => {
    return addToast({ type: 'info', message, title });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div
        className={`fixed z-[9999] flex flex-col gap-3 ${positionClasses[position]}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default useToast;
