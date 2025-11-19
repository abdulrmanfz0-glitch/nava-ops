// src/hooks/useApi.js
/**
 * Enterprise-grade API hook with automatic request cancellation,
 * error handling, retries, and caching
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import logger from '../lib/logger';
import { useNotification } from '../contexts/NotificationContext';

export function useApi(apiFunction, options = {}) {
  const {
    immediate = false,
    onSuccess,
    onError,
    showErrorNotification = true,
    showSuccessNotification = false,
    retries = 0,
    retryDelay = 1000,
    dependencies = [],
    cache = false,
    cacheKey = null,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const { addNotification } = useNotification?.() || {};

  const execute = useCallback(
    async (...args) => {
      // Check cache first
      if (cache && cacheKey) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTTL) {
          logger.debug('Using cached data', { cacheKey });
          setData(cached.data);
          return cached.data;
        }
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      let attempt = 0;
      let lastError = null;

      while (attempt <= retries) {
        try {
          logger.debug('API request attempt', { attempt: attempt + 1, function: apiFunction.name });

          const result = await apiFunction(...args, { signal });

          setData(result);
          setError(null);

          // Cache the result
          if (cache && cacheKey) {
            cacheRef.current.set(cacheKey, {
              data: result,
              timestamp: Date.now(),
            });
          }

          if (onSuccess) onSuccess(result);

          if (showSuccessNotification && addNotification) {
            addNotification({
              type: 'success',
              title: 'Success',
              message: 'Operation completed successfully',
            });
          }

          logger.debug('API request successful', { function: apiFunction.name });
          return result;
        } catch (err) {
          // Don't retry if request was aborted
          if (err.name === 'AbortError') {
            logger.debug('Request aborted', { function: apiFunction.name });
            throw err;
          }

          lastError = err;
          attempt++;

          if (attempt <= retries) {
            logger.warn('API request failed, retrying', {
              attempt,
              retries,
              error: err.message,
            });
            await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
          }
        } finally {
          setLoading(false);
        }
      }

      // All retries failed
      const errorMessage = lastError?.message || 'An error occurred';
      setError(errorMessage);

      if (onError) onError(lastError);

      if (showErrorNotification && addNotification) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: errorMessage,
        });
      }

      logger.error('API request failed after retries', {
        function: apiFunction.name,
        error: errorMessage,
        attempts: attempt,
      });

      throw lastError;
    },
    [
      apiFunction,
      retries,
      retryDelay,
      onSuccess,
      onError,
      showErrorNotification,
      showSuccessNotification,
      cache,
      cacheKey,
      cacheTTL,
      addNotification,
      ...dependencies,
    ]
  );

  // Auto-execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (cache && cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
  }, [cache, cacheKey]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearCache,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
  };
}

export default useApi;
