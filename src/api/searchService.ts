import type { KindleBook } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  SEARCH: (query: string) => `/search?q=${query}`,
} as const;

export class SearchService {
  async search(query: string): Promise<ApiResponse<KindleBook>> {
    return httpClient.request<KindleBook>(ENDPOINTS.SEARCH(query));
  }
}

export const searchService = new SearchService();
