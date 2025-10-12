import {
  type UseMutationResult,
  type UseQueryResult,
  type UseSuspenseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "./types";

export function useApiSuspenseQuery<T>(
  queryKey: string[],
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    staleTime?: number;
    gcTime?: number;
  },
): UseSuspenseQueryResult<T> {
  return useSuspenseQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiCall();
      return response.data;
    },
    ...options,
  });
}

export function useApiQuery<T>(
  queryKey: string[],
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
  },
): UseQueryResult<T, ApiError> {
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
  onSuccess: (data: T) => void,
  onError: (error: ApiError) => void,
  invalidateQueries: string[],
): UseMutationResult<T, ApiError, P> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: P) => {
      const response = await apiCall(params);
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: invalidateQueries });
    },
    onError: onError,
  });
}
