import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

/**
 * InfoBlock - Information/alert block with various variants
 *
 * @param {string} variant - 'info' | 'success' | 'warning' | 'error'
 * @param {string} title - Block title
 * @param {string} message - Block message
 * @param {React.Node} children - Custom content
 * @param {boolean} dismissible - Show dismiss button
 * @param {function} onDismiss - Dismiss handler
 * @param {boolean} icon - Show icon
 */
const InfoBlock = ({
  variant = 'info',
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  icon = true,
  className = '',
}) => {
  const variants = {
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20',
    },
  };

  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <motion.div
      className={`
        relative flex gap-3 p-4 rounded-xl border backdrop-blur-sm
        ${config.bg} ${config.border}
        ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      {icon && (
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-sm font-semibold ${config.text} mb-1`}>
            {title}
          </h4>
        )}

        {message && (
          <p className="text-sm text-white/70 leading-relaxed">
            {message}
          </p>
        )}

        {children && (
          <div className="text-sm text-white/70 leading-relaxed">
            {children}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <motion.button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/10 ${config.text} transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${config.border} rounded-b-xl`} />
    </motion.div>
  );
};

export default InfoBlock;
