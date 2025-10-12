import type { KindleBook, SearchResult } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

// API response interfaces with snake_case fields
interface KindleNoteApiResponse {
  id: string;
  content: string;
  created_at: string;
}

interface KindleNoteBundleApiResponse {
  book: KindleBook;
  notes: KindleNoteApiResponse[];
}

interface SearchResultApiResponse {
  q: string;
  results: KindleNoteBundleApiResponse[];
  count: number;
}

// Mapping function
const mapSearchResult = (apiResult: SearchResultApiResponse): SearchResult => ({
  q: apiResult.q,
  count: apiResult.count,
  results: apiResult.results.map((bundle) => ({
    book: bundle.book,
    notes: bundle.notes.map((note) => ({
      id: note.id,
      content: note.content,
      createdAt: note.created_at,
    })),
  })),
});

const ENDPOINTS = {
  SEARCH: (query: string) => `/search?q=${query}`,
} as const;

export class SearchService {
  async search(query: string): Promise<ApiResponse<SearchResult>> {
    const response = await httpClient.request<SearchResultApiResponse>(
      ENDPOINTS.SEARCH(query),
    );
    return {
      ...response,
      data: mapSearchResult(response.data),
    };
  }
}

export const searchService = new SearchService();
