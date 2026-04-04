import { logger } from "src/utils/logger";
import type { Url, UrlChunkBundle, UrlDetailedChunk } from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type { ApiResponse } from "./types";
import type {
  UrlApiResponse,
  UrlChunkBundleApiResponse,
  UrlStreamMetadataApiResponse,
} from "./urlApiTypes";
import { mapStreamMetadata, mapUrl, mapUrlChunkBundle } from "./urlApiTypes";

const ENDPOINTS = {
  LIST: "/urls",
  UPLOAD: "/urls",
  DELETE: (urlId: string) => `/urls/${urlId}`,
  CHUNKS: (urlId: string) => `/urls/${urlId}`,
  STREAM_CHUNK: (urlId: string, chunkId: string) =>
    `/urls/${urlId}/chunks/${chunkId}`,
  STREAM_RANDOM: "/urls/random",
} as const;

type ChunkStreamEvents = {
  metadata: UrlStreamMetadataApiResponse;
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
    const data = response.data.urls.map(mapUrl);
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
   * Delete a URL and all its chunks
   */
  async deleteUrl(urlId: string): Promise<ApiResponse<null>> {
    return httpClient.request<null>(ENDPOINTS.DELETE(urlId), {
      method: "DELETE",
      headers: {},
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
      data: mapUrlChunkBundle(response.data),
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
          const mappedData = mapStreamMetadata(data);
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
          const mappedData = mapStreamMetadata(data);
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
