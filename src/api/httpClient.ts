import type { ApiError, ApiRequestConfig, ApiResponse } from "./types";

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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    const requestConfig: RequestInit = {
      method: config.method,
      headers,
    };

    if (config.body && config.method !== "GET") {
      requestConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestConfig);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: "An api error",
          status: response.status,
        };
        throw error;
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof Error && "status" in error) {
        throw error;
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
      throw apiError;
    }
  }
}

export const httpClient = new HttpClient(import.meta.env.VITE_API_URL);
