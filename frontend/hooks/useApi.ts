'use client';

import { useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      endpoint: string,
      options?: RequestInit & { timeout?: number },
      callbacks?: UseApiOptions
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<T>(endpoint, options);
        setData(result);
        callbacks?.onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError(0, 'Unknown error');
        setError(apiError);
        callbacks?.onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset };
}
