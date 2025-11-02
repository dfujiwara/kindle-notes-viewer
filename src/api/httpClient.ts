import type { ApiRequestConfig, ApiResponse } from "./types";
import { ApiError } from "./types";

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    config: ApiRequestConfig = { headers: {}, method: "GET" },
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = config.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...config.headers,
    };

    const requestConfig: RequestInit = {
      method: config.method,
      headers,
    };

    if (config.body && config.method !== "GET") {
      requestConfig.body = isFormData
        ? config.body
        : JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestConfig);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError("An api error", response.status);
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }

      // Otherwise, wrap it as an ApiError with status 0 (network/other error)
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
      );
    }
  }
}

export const httpClient = new HttpClient(import.meta.env.VITE_API_URL);
