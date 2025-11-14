// src/utils/formatters.js - Utility Functions for Business Intelligence Dashboard

/**
 * Format currency amounts in Saudi Riyal (SAR)
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'SAR')
 * @param {number} minimumFractionDigits - Minimum decimal places (default: 0)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SAR', minimumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits
  }).format(amount || 0);
};

/**
 * Format large numbers with commas
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return (number || 0).toLocaleString('en-US');
};

/**
 * Format numbers to compact notation (K, M, B)
 * @param {number} number - The number to format
 * @returns {string} Compact number string
 */
export const formatCompactNumber = (number) => {
  if (!number) return '0';

  const absNum = Math.abs(number);

  if (absNum >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  }
  if (absNum >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (absNum >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }

  return number.toString();
};

/**
 * Format percentage values
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return (value || 0).toFixed(decimals) + '%';
};

/**
 * Format date to readable string
 * @param {Date|string} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time to readable string
 * @param {Date|string} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  return new Date(date).toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format date and time to readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return `${formatDate(date, { month: 'short', day: 'numeric' })} • ${formatTime(date)}`;
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - The old value
 * @param {number} newValue - The new value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Format change with sign
 * @param {number} change - The change value
 * @param {boolean} includePercent - Include % sign (default: true)
 * @returns {string} Formatted change string with sign
 */
export const formatChange = (change, includePercent = true) => {
  const sign = change > 0 ? '+' : '';
  const suffix = includePercent ? '%' : '';
  return `${sign}${change.toFixed(1)}${suffix}`;
};

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get color class based on value (positive/negative)
 * @param {number} value - The value to check
 * @returns {string} Tailwind color class
 */
export const getColorClass = (value) => {
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-slate-600 dark:text-slate-400';
};

/**
 * Get background color class based on value
 * @param {number} value - The value to check
 * @returns {string} Tailwind background color class
 */
export const getBgColorClass = (value) => {
  if (value > 0) return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (value < 0) return 'bg-red-100 dark:bg-red-900/30';
  return 'bg-slate-100 dark:bg-slate-700';
};

/**
 * Calculate average from array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Sleep utility for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generate random ID
 * @param {number} length - Length of ID (default: 8)
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  calculatePercentageChange,
  formatChange,
  truncateText,
  getColorClass,
  getBgColorClass,
  calculateAverage,
  getInitials,
  sleep,
  clamp,
  generateId,
  deepClone,
  debounce,
  throttle
};
