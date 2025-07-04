import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError, ApiResponse } from './types';

export function useApiQuery<T>(
  queryKey: string[],
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiCall();
      return response.data;
    },
    ...options,
  });
}

export function useApiMutation<T, P = unknown>(
  apiCall: (params: P) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: P) => {
      const response = await apiCall(params);
      return response.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: options?.onError,
  });
}