import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  UPLOAD: "/urls",
} as const;

export class UrlService {
  async uploadUrl(url: string): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.request<{ success: boolean }>(ENDPOINTS.UPLOAD, {
      method: "POST",
      headers: {},
      body: { url },
    });
  }
}

export const urlService = new UrlService();
