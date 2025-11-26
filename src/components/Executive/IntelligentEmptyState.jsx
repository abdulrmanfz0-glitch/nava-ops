import React from 'react';
import { motion } from 'framer-motion';
import {
  FileX,
  Search,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Plus,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Database
} from 'lucide-react';
import { useBrandTheme } from '../../contexts/BrandThemeContext';
import { executiveTypography } from '../../styles/executiveDesignSystem';
import { entranceAnimations, interactiveAnimations } from '../../utils/executiveAnimations';

/**
 * Intelligent Empty State
 * Context-aware empty states with helpful actions
 *
 * Props:
 * - type: 'no-data' | 'no-results' | 'no-access' | 'error' | 'custom'
 * - context: 'revenue' | 'orders' | 'customers' | 'menu' | 'analytics' | 'custom'
 * - title: Custom title (optional)
 * - description: Custom description (optional)
 * - icon: Custom Lucide icon component (optional)
 * - actions: Array of action objects { label, onClick, primary }
 * - suggestions: Array of suggestion strings
 * - className: Additional CSS classes
 */
const IntelligentEmptyState = ({
  type = 'no-data',
  context = 'custom',
  title,
  description,
  icon: CustomIcon,
  actions = [],
  suggestions = [],
  className = ''
}) => {
  const { currentTheme } = useBrandTheme();

  // Get contextual icon
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;

    if (type === 'no-results') return Search;
    if (type === 'no-access') return HelpCircle;
    if (type === 'error') return FileX;

    // Context-based icons for no-data
    switch (context) {
      case 'revenue':
      case 'financial':
        return DollarSign;
      case 'orders':
        return Package;
      case 'customers':
        return Users;
      case 'menu':
        return Package;
      case 'analytics':
        return BarChart3;
      default:
        return Database;
    }
  };

  // Get contextual content
  const getContent = () => {
    // Custom content takes priority
    if (title && description) {
      return { title, description };
    }

    // Type-based defaults
    if (type === 'no-results') {
      return {
        title: 'No Results Found',
        description: 'Try adjusting your search or filter criteria to find what you\'re looking for.'
      };
    }

    if (type === 'no-access') {
      return {
        title: 'Access Restricted',
        description: 'You don\'t have permission to view this content. Contact your administrator if you need access.'
      };
    }

    if (type === 'error') {
      return {
        title: 'Something Went Wrong',
        description: 'We encountered an error loading this data. Please try again or contact support if the problem persists.'
      };
    }

    // Context-based defaults for no-data
    const contextDefaults = {
      revenue: {
        title: 'No Revenue Data Yet',
        description: 'Start tracking your sales to see revenue analytics and insights here. Connect your POS or add your first order to get started.'
      },
      orders: {
        title: 'No Orders Yet',
        description: 'Your order history will appear here. Start processing orders to see analytics and trends.'
      },
      customers: {
        title: 'No Customer Data',
        description: 'Customer profiles and analytics will appear once you start serving customers. Import existing data or wait for new orders.'
      },
      menu: {
        title: 'No Menu Items',
        description: 'Build your menu by adding items, categories, and pricing. Your menu is the foundation of your restaurant operations.'
      },
      analytics: {
        title: 'Not Enough Data',
        description: 'Analytics and insights will become available once we have sufficient data to analyze. Keep operating and check back soon.'
      },
      custom: {
        title: title || 'No Data Available',
        description: description || 'There\'s no data to display at the moment. Try refreshing or check back later.'
      }
    };

    return contextDefaults[context] || contextDefaults.custom;
  };

  // Get contextual suggestions
  const getSuggestions = () => {
    if (suggestions.length > 0) return suggestions;

    if (type === 'no-results') {
      return [
        'Try using different keywords',
        'Remove some filters',
        'Check your spelling',
        'Use broader search terms'
      ];
    }

    const contextSuggestions = {
      revenue: [
        'Connect your POS system',
        'Manually add transactions',
        'Import historical data',
        'Set up payment integrations'
      ],
      orders: [
        'Start taking orders',
        'Enable online ordering',
        'Import past orders',
        'Connect delivery platforms'
      ],
      customers: [
        'Import customer list',
        'Enable customer tracking',
        'Set up loyalty program',
        'Start collecting customer data'
      ],
      menu: [
        'Add your first menu item',
        'Import menu from spreadsheet',
        'Copy from template',
        'Sync with POS system'
      ],
      analytics: [
        'Wait for more data to accumulate',
        'Import historical data',
        'Adjust date range',
        'Check data connections'
      ]
    };

    return contextSuggestions[context] || [];
  };

  // Get contextual actions
  const getActions = () => {
    if (actions.length > 0) return actions;

    if (type === 'error') {
      return [
        { label: 'Try Again', onClick: () => window.location.reload(), primary: true },
        { label: 'Contact Support', onClick: () => {}, primary: false }
      ];
    }

    if (type === 'no-access') {
      return [
        { label: 'Request Access', onClick: () => {}, primary: true },
        { label: 'Learn More', onClick: () => {}, primary: false }
      ];
    }

    const contextActions = {
      revenue: [
        { label: 'Connect POS', onClick: () => {}, primary: true },
        { label: 'Add Transaction', onClick: () => {}, primary: false }
      ],
      orders: [
        { label: 'Create Order', onClick: () => {}, primary: true },
        { label: 'Import Orders', onClick: () => {}, primary: false }
      ],
      customers: [
        { label: 'Add Customer', onClick: () => {}, primary: true },
        { label: 'Import Customers', onClick: () => {}, primary: false }
      ],
      menu: [
        { label: 'Add Menu Item', onClick: () => {}, primary: true },
        { label: 'Import Menu', onClick: () => {}, primary: false }
      ]
    };

    return contextActions[context] || [];
  };

  const Icon = getIcon();
  const content = getContent();
  const displaySuggestions = getSuggestions();
  const displayActions = getActions();

  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      {...entranceAnimations.slideUp}
    >
      {/* Icon */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
      >
        <div
          className="p-6 rounded-full"
          style={{
            backgroundColor: currentTheme.colors.primary + '15',
            color: currentTheme.colors.primary
          }}
        >
          <Icon size={48} strokeWidth={1.5} />
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: currentTheme.colors.primary }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      {/* Title */}
      <h3
        className="font-bold text-gray-900 dark:text-white mb-3"
        style={{
          fontSize: executiveTypography.heading.h2.fontSize,
          fontWeight: executiveTypography.heading.h2.fontWeight,
          lineHeight: executiveTypography.heading.h2.lineHeight
        }}
      >
        {content.title}
      </h3>

      {/* Description */}
      <p
        className="text-gray-600 dark:text-gray-400 max-w-md mb-8"
        style={{
          fontSize: executiveTypography.body.large.fontSize,
          lineHeight: executiveTypography.body.large.lineHeight
        }}
      >
        {content.description}
      </p>

      {/* Suggestions */}
      {displaySuggestions.length > 0 && (
        <motion.div
          className="mb-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 max-w-md w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles size={16} className="text-gray-600 dark:text-gray-400" />
            <p
              className="text-gray-700 dark:text-gray-300 font-medium"
              style={{ fontSize: executiveTypography.label.large.fontSize }}
            >
              Suggestions
            </p>
          </div>
          <ul className="space-y-2 text-left">
            {displaySuggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-2 text-gray-600 dark:text-gray-400"
                style={{ fontSize: executiveTypography.body.small.fontSize }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <span className="text-gray-400 dark:text-gray-600 mt-0.5">•</span>
                <span>{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Actions */}
      {displayActions.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {displayActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                action.primary
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
              style={
                action.primary
                  ? {
                      backgroundColor: currentTheme.colors.primary,
                      color: '#FFFFFF'
                    }
                  : {}
              }
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {action.primary && <Plus size={18} />}
              <span>{action.label}</span>
              {!action.primary && <ArrowRight size={18} />}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default IntelligentEmptyState;
