// src/hooks/useApi.js
/**
 * Enhanced API Hook with Request Cancellation, Caching, and Error Handling
 * Provides a robust data fetching solution for the application
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import logger from '@/lib/logger';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useApi = (
  fetchFunction,
  dependencies = [],
  options = {}
) => {
  const {
    immediate = true,
    cacheKey = null,
    cacheDuration = CACHE_DURATION,
    onSuccess = null,
    onError = null,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  // Check cache
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    // Clear expired cache
    cache.delete(cacheKey);
    return null;
  }, [cacheKey, cacheDuration]);

  // Set cache
  const setCachedData = useCallback((data) => {
    if (cacheKey) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
  }, [cacheKey]);

  // Execute fetch with cancellation support
  const executeFetch = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return cachedData;
      }

      // Execute fetch
      const result = await fetchFunction(signal);

      // Check if request was aborted
      if (signal?.aborted) return;

      setData(result);
      setCachedData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      retryCountRef.current = 0; // Reset retry count on success
      return result;

    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError' || signal?.aborted) {
        logger.debug('Request aborted');
        return;
      }

      logger.error('API request failed', {
        error: err.message,
        retryAttempt: retryCountRef.current
      });

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;

        setTimeout(() => {
          executeFetch(signal);
        }, retryDelay * retryCountRef.current); // Exponential backoff

        return;
      }

      setError(err);

      if (onError) {
        onError(err);
      }

    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [fetchFunction, getCachedData, setCachedData, onSuccess, onError, retryCount, retryDelay]);

  // Main fetch function
  const fetch = useCallback(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    return executeFetch(abortControllerRef.current.signal);
  }, [executeFetch]);

  // Refresh data (bypass cache)
  const refresh = useCallback(() => {
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    return fetch();
  }, [fetch, cacheKey]);

  // Mutate data optimistically
  const mutate = useCallback((newData) => {
    setData(newData);
    setCachedData(newData);
  }, [setCachedData]);

  // Auto-fetch on mount or dependency change
  useEffect(() => {
    if (immediate) {
      fetch();
    }

    // Cleanup: abort on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    fetch,
    refresh,
    mutate
  };
};

// Hook for mutations (POST, PUT, DELETE)
export const useMutation = (mutationFunction, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    optimistic = false
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (variables, optimisticData = null) => {
    try {
      setLoading(true);
      setError(null);

      // Optimistic update
      if (optimistic && optimisticData) {
        setData(optimisticData);
      }

      const result = await mutationFunction(variables);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;

    } catch (err) {
      logger.error('Mutation failed', { error: err.message });
      setError(err);

      // Revert optimistic update
      if (optimistic && optimisticData) {
        setData(null);
      }

      if (onError) {
        onError(err);
      }

      throw err;

    } finally {
      setLoading(false);
    }
  }, [mutationFunction, onSuccess, onError, optimistic]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    loading,
    error,
    reset
  };
};

// Hook for infinite loading/pagination
export const useInfiniteApi = (fetchFunction, options = {}) => {
  const {
    pageSize = 20,
    cacheKey = null
  } = options;

  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageRef = useRef(0);
  const abortControllerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await fetchFunction({
        page: pageRef.current,
        pageSize,
        signal: abortControllerRef.current.signal
      });

      if (abortControllerRef.current.signal.aborted) return;

      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      pageRef.current++;

    } catch (err) {
      if (err.name !== 'AbortError') {
        logger.error('Infinite load failed', { error: err.message });
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setHasMore(true);
    pageRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

// Clear all cache
export const clearCache = () => {
  cache.clear();
};

// Clear specific cache entry
export const clearCacheKey = (key) => {
  cache.delete(key);
};

export default useApi;
