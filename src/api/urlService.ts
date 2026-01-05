import { logger } from "src/utils/logger";
import type {
  Url,
  UrlChunk,
  UrlChunkBundle,
  UrlDetailedChunk,
} from "../models/url";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type { ApiResponse } from "./types";

// API response interfaces with snake_case fields
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
  created_at: string;
}

interface UrlChunkBundleApiResponse {
  url: UrlApiResponse;
  chunks: UrlChunkApiResponse[];
}

interface UrlInitialChunkApiResponse {
  url: UrlApiResponse;
  chunk: UrlChunkApiResponse;
  related_chunks: UrlChunkApiResponse[];
}

// Mapping functions
const mapUrl = (apiUrl: UrlApiResponse): Url => ({
  id: apiUrl.id,
  url: apiUrl.url,
  title: apiUrl.title,
  chunkCount: apiUrl.chunk_count,
  createdAt: apiUrl.created_at,
});

const mapChunk = (apiChunk: UrlChunkApiResponse): UrlChunk => ({
  id: apiChunk.id,
  content: apiChunk.content,
  createdAt: apiChunk.created_at,
});

const mapChunkBundle = (
  apiBundle: UrlChunkBundleApiResponse,
): UrlChunkBundle => ({
  url: mapUrl(apiBundle.url),
  chunks: apiBundle.chunks.map(mapChunk),
});

const mapInitialDetailedChunk = (
  apiChunk: UrlInitialChunkApiResponse,
): UrlDetailedChunk => ({
  url: mapUrl(apiChunk.url),
  chunk: mapChunk(apiChunk.chunk),
  additionalContext: "",
  relatedChunks: apiChunk.related_chunks.map(mapChunk),
});

const ENDPOINTS = {
  LIST: "/urls",
  UPLOAD: "/urls",
  CHUNKS: (urlId: string) => `/urls/${urlId}/chunks`,
  STREAM_CHUNK: (urlId: string, chunkId: string) =>
    `/urls/${urlId}/chunks/${chunkId}`,
  STREAM_RANDOM: "/urls/random",
} as const;

type ChunkStreamEvents = {
  metadata: UrlInitialChunkApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};

export type StreamHandlers = {
  onMetadata: (chunk: UrlDetailedChunk) => void;
  onContextChunk: (content: string) => void;
  onComplete: () => void;
  onInStreamError: () => void;
  onError?: (error: Event) => void;
};

export class UrlService {
  /**
   * Get all uploaded URLs
   */
  async getUrls(): Promise<ApiResponse<Url[]>> {
    const response = await httpClient.request<{ urls: UrlApiResponse[] }>(
      ENDPOINTS.LIST,
    );
    const data = response.data.urls?.map(mapUrl) || [];
    return { ...response, data };
  }

  /**
   * Upload a new URL
   */
  async uploadUrl(url: string): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.request<{ success: boolean }>(ENDPOINTS.UPLOAD, {
      method: "POST",
      headers: {},
      body: { url },
    });
  }

  /**
   * Get all chunks from a specific URL
   */
  async getChunksFromUrl(urlId: string): Promise<ApiResponse<UrlChunkBundle>> {
    const response = await httpClient.request<UrlChunkBundleApiResponse>(
      ENDPOINTS.CHUNKS(urlId),
    );
    return {
      ...response,
      data: mapChunkBundle(response.data),
    };
  }

  /**
   * Creates a streaming connection for a specific chunk
   * @param urlId - The URL ID
   * @param chunkId - The chunk ID
   * @param handlers - Object containing all stream event handlers
   * @returns EventSource instance (caller must close it)
   */
  getStreamedChunk(
    urlId: string,
    chunkId: string,
    handlers: StreamHandlers,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<ChunkStreamEvents>(
      ENDPOINTS.STREAM_CHUNK(urlId, chunkId),
      {
        metadata: (data, _es) => {
          const mappedData = mapInitialDetailedChunk(data);
          handlers.onMetadata(mappedData);
        },
        context_chunk: (data, _es) => {
          handlers.onContextChunk(data.content);
        },
        context_complete: (_data, es) => {
          handlers.onComplete();
          es.close();
        },
        error: (data, es) => {
          logger.error(data.detail);
          handlers.onInStreamError();
          es.close();
        },
      },
      handlers.onError,
    );
  }

  /**
   * Creates a streaming connection for random chunks
   * @param handlers - Object containing all stream event handlers
   * @returns EventSource instance (caller must close it)
   */
  getStreamedRandomChunk(handlers: StreamHandlers): EventSource {
    return sseClient.createEventSourceWithHandlers<ChunkStreamEvents>(
      ENDPOINTS.STREAM_RANDOM,
      {
        metadata: (data, _es) => {
          const mappedData = mapInitialDetailedChunk(data);
          handlers.onMetadata(mappedData);
        },
        context_chunk: (data, _es) => {
          handlers.onContextChunk(data.content);
        },
        context_complete: (_data, es) => {
          handlers.onComplete();
          es.close();
        },
        error: (data, es) => {
          logger.error(data.detail);
          handlers.onInStreamError();
          es.close();
        },
      },
      handlers.onError,
    );
  }
}

export const urlService = new UrlService();
