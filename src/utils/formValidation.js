// src/utils/formValidation.js
/**
 * Comprehensive Form Validation Library
 * Enterprise-grade validation rules and error handling
 */

import logger from '@/lib/logger';

// Validation Rules
export const validationRules = {
  // Required field
  required: (value, message = 'This field is required') => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }
    return null;
  },

  // Email validation
  email: (value, message = 'Invalid email address') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  // Phone validation (international format)
  phone: (value, message = 'Invalid phone number') => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(value) ? null : message;
  },

  // Saudi phone number
  saudiPhone: (value, message = 'Invalid Saudi phone number') => {
    if (!value) return null;
    const saudiPhoneRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
    return saudiPhoneRegex.test(value) ? null : message;
  },

  // Minimum length
  minLength: (min) => (value, message) => {
    if (!value) return null;
    return value.length >= min ? null : message || `Minimum length is ${min} characters`;
  },

  // Maximum length
  maxLength: (max) => (value, message) => {
    if (!value) return null;
    return value.length <= max ? null : message || `Maximum length is ${max} characters`;
  },

  // Exact length
  exactLength: (length) => (value, message) => {
    if (!value) return null;
    return value.length === length ? null : message || `Must be exactly ${length} characters`;
  },

  // Minimum value
  min: (min) => (value, message) => {
    if (value === null || value === undefined || value === '') return null;
    const numValue = Number(value);
    return numValue >= min ? null : message || `Minimum value is ${min}`;
  },

  // Maximum value
  max: (max) => (value, message) => {
    if (value === null || value === undefined || value === '') return null;
    const numValue = Number(value);
    return numValue <= max ? null : message || `Maximum value is ${max}`;
  },

  // Number validation
  number: (value, message = 'Must be a valid number') => {
    if (!value) return null;
    return !isNaN(value) && !isNaN(parseFloat(value)) ? null : message;
  },

  // Integer validation
  integer: (value, message = 'Must be a whole number') => {
    if (!value) return null;
    return Number.isInteger(Number(value)) ? null : message;
  },

  // Positive number
  positive: (value, message = 'Must be a positive number') => {
    if (!value) return null;
    return Number(value) > 0 ? null : message;
  },

  // URL validation
  url: (value, message = 'Invalid URL') => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  // Pattern matching
  pattern: (regex, message = 'Invalid format') => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  // Password strength
  password: (value, message) => {
    if (!value) return null;

    const errors = [];

    if (value.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('one number');
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      errors.push('one special character');
    }

    if (errors.length > 0) {
      return message || `Password must contain ${errors.join(', ')}`;
    }

    return null;
  },

  // Match another field (e.g., confirm password)
  match: (fieldName, fieldValue, message) => (value) => {
    if (!value) return null;
    return value === fieldValue ? null : message || `Must match ${fieldName}`;
  },

  // Date validation
  date: (value, message = 'Invalid date') => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : message;
  },

  // Future date
  futureDate: (value, message = 'Date must be in the future') => {
    if (!value) return null;
    const date = new Date(value);
    return date > new Date() ? null : message;
  },

  // Past date
  pastDate: (value, message = 'Date must be in the past') => {
    if (!value) return null;
    const date = new Date(value);
    return date < new Date() ? null : message;
  },

  // Custom validation
  custom: (validatorFn, message = 'Validation failed') => (value) => {
    try {
      return validatorFn(value) ? null : message;
    } catch (error) {
      logger.error('Custom validation error', { error: error.message });
      return message;
    }
  },

  // Array min length
  arrayMinLength: (min) => (value, message) => {
    if (!value) return null;
    return Array.isArray(value) && value.length >= min
      ? null
      : message || `Select at least ${min} items`;
  },

  // Array max length
  arrayMaxLength: (max) => (value, message) => {
    if (!value) return null;
    return Array.isArray(value) && value.length <= max
      ? null
      : message || `Select at most ${max} items`;
  },

  // File type validation
  fileType: (allowedTypes) => (file, message) => {
    if (!file) return null;
    const fileType = file.type || '';
    const isAllowed = allowedTypes.some(type =>
      fileType.startsWith(type) || fileType.endsWith(type)
    );
    return isAllowed ? null : message || `Allowed types: ${allowedTypes.join(', ')}`;
  },

  // File size validation (in bytes)
  fileSize: (maxSize) => (file, message) => {
    if (!file) return null;
    return file.size <= maxSize
      ? null
      : message || `File size must be less than ${(maxSize / 1024 / 1024).toFixed(2)}MB`;
  },

  // Saudi ID (Iqama) validation
  saudiId: (value, message = 'Invalid Saudi ID') => {
    if (!value) return null;
    const idRegex = /^[12][0-9]{9}$/;
    return idRegex.test(value) ? null : message;
  },

  // VAT number validation (Saudi)
  vatNumber: (value, message = 'Invalid VAT number') => {
    if (!value) return null;
    const vatRegex = /^3[0-9]{14}$/;
    return vatRegex.test(value) ? null : message;
  },

  // Credit card validation (Luhn algorithm)
  creditCard: (value, message = 'Invalid credit card number') => {
    if (!value) return null;

    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) {
      return message;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 ? null : message;
  }
};

// Validate a single field
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const error = typeof rule === 'function' ? rule(value) : rule;
    if (error) {
      return error;
    }
  }
  return null;
};

// Validate entire form
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let hasErrors = false;

  Object.keys(validationSchema).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const fieldRules = validationSchema[fieldName];

    const error = validateField(fieldValue, fieldRules);

    if (error) {
      errors[fieldName] = error;
      hasErrors = true;
    }
  });

  return {
    errors,
    isValid: !hasErrors
  };
};

// Real-time field validation hook-compatible function
export const createFieldValidator = (rules = []) => {
  return (value) => validateField(value, rules);
};

// Sanitize input
export const sanitizeInput = (value, options = {}) => {
  if (typeof value !== 'string') return value;

  let sanitized = value;

  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  if (options.lowercase) {
    sanitized = sanitized.toLowerCase();
  }

  if (options.uppercase) {
    sanitized = sanitized.toUpperCase();
  }

  if (options.removeSpaces) {
    sanitized = sanitized.replace(/\s+/g, '');
  }

  if (options.alphanumericOnly) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
  }

  if (options.numbersOnly) {
    sanitized = sanitized.replace(/[^0-9]/g, '');
  }

  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
};

// Format validation error messages for display
export const formatValidationErrors = (errors) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return Object.entries(errors).map(([field, message]) => ({
    field,
    message
  }));
};

// Common validation schemas
export const commonSchemas = {
  login: {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required]
  },

  registration: {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.password],
    confirmPassword: [validationRules.required],
    fullName: [validationRules.required, validationRules.minLength(2)]
  },

  profile: {
    fullName: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.saudiPhone]
  },

  branch: {
    name: [validationRules.required, validationRules.minLength(2)],
    code: [validationRules.required],
    city: [validationRules.required],
    phone: [validationRules.saudiPhone]
  }
};

export default {
  validationRules,
  validateField,
  validateForm,
  createFieldValidator,
  sanitizeInput,
  formatValidationErrors,
  commonSchemas
};
