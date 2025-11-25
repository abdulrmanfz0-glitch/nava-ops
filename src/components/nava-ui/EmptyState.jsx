import React from 'react';
import { motion } from 'framer-motion';
import NeoButton from './NeoButton';

/**
 * EmptyState - Modern empty state placeholder
 *
 * @param {React.Component} icon - Icon component
 * @param {string} title - Main title
 * @param {string} description - Description text
 * @param {string} actionLabel - Action button label
 * @param {function} onAction - Action button handler
 * @param {string} variant - 'default' | 'minimal'
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className = '',
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          className="mb-6 p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Icon className="w-16 h-16 text-white/30" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        className="text-2xl font-bold text-white mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className="text-white/60 max-w-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}

      {/* Action button */}
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NeoButton
            variant="primary"
            size="lg"
            onClick={onAction}
          >
            {actionLabel}
          </NeoButton>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
