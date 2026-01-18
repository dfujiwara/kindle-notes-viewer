import type {
  KindleBook,
  KindleNoteBundle,
  SearchResult,
  Url,
  UrlChunk,
  UrlChunkBundle,
} from "../models";
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

interface UrlApiResponse {
  id: string;
  url: string;
  title: string;
  chunk_count: number;
  created_at: string;
}

interface UrlChunkApiResponse {
  id: string;
  content: string;
  is_summary: boolean;
  created_at: string;
}

interface UrlChunkBundleApiResponse {
  url: UrlApiResponse;
  chunks: UrlChunkApiResponse[];
}

interface SearchResultApiResponse {
  query: string;
  books: KindleNoteBundleApiResponse[];
  urls: UrlChunkBundleApiResponse[];
  count: number;
}

// Mapping functions
const mapNoteBundle = (
  bundle: KindleNoteBundleApiResponse,
): KindleNoteBundle => ({
  book: bundle.book,
  notes: bundle.notes.map((note) => ({
    id: note.id,
    content: note.content,
    createdAt: note.created_at,
  })),
});

const mapUrl = (apiUrl: UrlApiResponse): Url => ({
  id: apiUrl.id,
  url: apiUrl.url,
  title: apiUrl.title,
  chunkCount: apiUrl.chunk_count,
  createdAt: apiUrl.created_at,
});

const mapUrlChunk = (apiChunk: UrlChunkApiResponse): UrlChunk => ({
  id: apiChunk.id,
  content: apiChunk.content,
  isSummary: apiChunk.is_summary,
  createdAt: apiChunk.created_at,
});

const mapUrlChunkBundle = (
  bundle: UrlChunkBundleApiResponse,
): UrlChunkBundle => ({
  url: mapUrl(bundle.url),
  chunks: bundle.chunks.map(mapUrlChunk),
});

const mapSearchResult = (apiResult: SearchResultApiResponse): SearchResult => {
  const books = apiResult.books.map(mapNoteBundle);
  return {
    q: apiResult.query,
    count: apiResult.count,
    books,
    urls: apiResult.urls.map(mapUrlChunkBundle),
    // @deprecated - backwards compatibility, remove in phase6-ui
    results: books,
  };
};

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
