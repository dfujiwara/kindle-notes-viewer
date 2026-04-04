import type { SearchResult } from "../models";
import { httpClient } from "./httpClient";
import type { KindleNoteBundleApiResponse } from "./kindleApiTypes";
import { mapNoteBundle } from "./kindleApiTypes";
import type { TweetThreadBundleApiResponse } from "./tweetApiTypes";
import { mapTweetThreadBundle } from "./tweetApiTypes";
import type { ApiResponse } from "./types";
import type { UrlChunkBundleApiResponse } from "./urlApiTypes";
import { mapUrlChunkBundle } from "./urlApiTypes";

interface SearchResultApiResponse {
  query: string;
  books: KindleNoteBundleApiResponse[];
  urls: UrlChunkBundleApiResponse[];
  tweet_threads: TweetThreadBundleApiResponse[];
  count: number;
}

const mapSearchResult = (apiResult: SearchResultApiResponse): SearchResult => ({
  q: apiResult.query,
  count: apiResult.count,
  books: apiResult.books.map(mapNoteBundle),
  urls: apiResult.urls.map(mapUrlChunkBundle),
  tweetThreads: apiResult.tweet_threads.map(mapTweetThreadBundle),
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
