import type { SearchResult } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  SEARCH: (query: string) => `/search?q=${query}`,
} as const;

export class SearchService {
  async search(query: string): Promise<ApiResponse<SearchResult>> {
    return httpClient.request<SearchResult>(ENDPOINTS.SEARCH(query));
  }
}

export const searchService = new SearchService();
