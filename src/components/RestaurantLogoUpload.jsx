// NAVA OPS - Restaurant Logo Upload Component
// Drag-and-drop image upload with preview, auto-resize, and localStorage persistence

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { logger } from '../lib/logger';

/**
 * RestaurantLogoUpload Component
 *
 * Features:
 * - Drag-and-drop interface
 * - Image preview
 * - Auto-resize to 200x200px (maintains aspect ratio)
 * - Base64 encoding with JPEG compression (0.8 quality)
 * - localStorage persistence
 * - Error handling and validation
 *
 * @param {Object} props
 * @param {string} props.restaurantId - Restaurant ID for storage key
 * @param {Function} props.onUpload - Callback when upload completes
 * @param {string} props.currentLogo - Current logo URL/base64
 * @param {string} props.className - Additional CSS classes
 */
export default function RestaurantLogoUpload({
  restaurantId,
  onUpload,
  currentLogo = null,
  className = ''
}) {
  const [logo, setLogo] = useState(currentLogo);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Process and resize image
   */
  const processImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        reject(new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          try {
            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set maximum dimensions
            const maxWidth = 200;
            const maxHeight = 200;

            let { width, height } = img;

            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64 with JPEG compression
            const resizedImage = canvas.toDataURL('image/jpeg', 0.8);

            logger.info('Image processed successfully', {
              originalSize: file.size,
              dimensions: `${width}x${height}`
            });

            resolve(resizedImage);
          } catch (err) {
            logger.error('Image processing failed', err);
            reject(new Error('Failed to process image'));
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    setError(null);
    setSuccess(false);
    setIsProcessing(true);

    try {
      const processedImage = await processImage(file);

      // Save to state
      setLogo(processedImage);

      // Save to localStorage
      if (restaurantId) {
        const storageKey = `restaurant_logo_${restaurantId}`;
        localStorage.setItem(storageKey, processedImage);
        logger.info('Logo saved to localStorage', { restaurantId });
      }

      // Callback to parent
      if (onUpload) {
        onUpload(processedImage);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      logger.error('Upload failed', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [processImage, restaurantId, onUpload]);

  /**
   * Handle file input change
   */
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Handle remove logo
   */
  const handleRemove = () => {
    setLogo(null);
    setError(null);
    setSuccess(false);

    if (restaurantId) {
      const storageKey = `restaurant_logo_${restaurantId}`;
      localStorage.removeItem(storageKey);
    }

    if (onUpload) {
      onUpload(null);
    }
  };

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={!logo && !isProcessing ? handleClick : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group
          border-2 border-dashed rounded-xl
          transition-all duration-300 ease-out
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
          ${!logo && !isProcessing ? 'cursor-pointer' : ''}
          ${isProcessing ? 'opacity-60 cursor-wait' : ''}
        `}
      >
        {/* Logo Preview */}
        {logo && !isProcessing && (
          <div className="relative p-6">
            <div className="flex flex-col items-center gap-4">
              {/* Image */}
              <div className="relative">
                <img
                  src={logo}
                  alt="Restaurant Logo"
                  className="w-32 h-32 object-contain rounded-lg shadow-md"
                />

                {/* Success Badge */}
                {success && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Logo uploaded successfully
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  200x200px • JPEG format
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClick}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Change Logo
                </button>
                <button
                  onClick={handleRemove}
                  className="btn-outline text-sm py-2 px-4 text-error-600 hover:text-error-700 hover:border-error-300"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Prompt */}
        {!logo && !isProcessing && (
          <div className="p-8 text-center">
            <div className="mb-4">
              {isDragging ? (
                <Upload className="w-12 h-12 text-primary-500 mx-auto animate-bounce" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto group-hover:text-primary-500 transition-colors" />
              )}
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {isDragging ? 'Drop your logo here' : 'Upload Restaurant Logo'}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop or click to browse
            </p>

            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <p>Supported formats: JPEG, PNG, GIF, WebP</p>
              <p>Max file size: 5MB</p>
              <p>Recommended: Square image, 200x200px or larger</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Processing image...
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-error-800 dark:text-error-200">
              Upload Failed
            </p>
            <p className="text-sm text-error-700 dark:text-error-300 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg animate-slide-down">
          <Check className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
          <p className="text-sm font-medium text-success-800 dark:text-success-200">
            Logo uploaded and saved successfully!
          </p>
        </div>
      )}

      {/* RTL Support */}
      <style jsx>{`
        [dir="rtl"] .flex {
          direction: rtl;
        }
      `}</style>
    </div>
  );
}
