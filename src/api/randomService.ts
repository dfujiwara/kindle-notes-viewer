import type { Content, RandomContent, Source } from "src/models";
import { logger } from "src/utils/logger";
import { sseClient } from "./sseClient";

// API response interfaces with snake_case fields (matching backend /random/v2)

interface BookSourceApiResponse {
  id: number;
  title: string;
  type: "book";
  author: string;
  created_at: string;
}

interface UrlSourceApiResponse {
  id: number;
  title: string;
  type: "url";
  url: string;
  created_at: string;
}

type SourceApiResponse = BookSourceApiResponse | UrlSourceApiResponse;

interface NoteContentApiResponse {
  id: number;
  content_type: "note";
  content: string;
  created_at: string;
}

interface UrlChunkContentApiResponse {
  id: number;
  content_type: "url_chunk";
  content: string;
  is_summary: boolean;
  chunk_order: number;
  created_at: string;
}

type ContentApiResponse = NoteContentApiResponse | UrlChunkContentApiResponse;

interface RandomContentApiResponse {
  source: SourceApiResponse;
  content: ContentApiResponse;
  related_items: ContentApiResponse[];
}

// Mapping functions
const mapSource = (apiSource: SourceApiResponse): Source => {
  if (apiSource.type === "book") {
    return {
      id: String(apiSource.id),
      title: apiSource.title,
      type: "book",
      author: apiSource.author,
      createdAt: apiSource.created_at,
    };
  }
  return {
    id: String(apiSource.id),
    title: apiSource.title,
    type: "url",
    url: apiSource.url,
    createdAt: apiSource.created_at,
  };
};

const mapContent = (apiContent: ContentApiResponse): Content => {
  if (apiContent.content_type === "note") {
    return {
      id: String(apiContent.id),
      contentType: "note",
      content: apiContent.content,
      createdAt: apiContent.created_at,
    };
  }
  return {
    id: String(apiContent.id),
    contentType: "url_chunk",
    content: apiContent.content,
    isSummary: apiContent.is_summary,
    chunkOrder: apiContent.chunk_order,
    createdAt: apiContent.created_at,
  };
};

const mapRandomContent = (
  apiResponse: RandomContentApiResponse,
): RandomContent => ({
  source: mapSource(apiResponse.source),
  content: mapContent(apiResponse.content),
  additionalContext: "",
  relatedItems: apiResponse.related_items.map(mapContent),
});

const ENDPOINTS = {
  STREAM_RANDOM_V2: "/random/v2",
} as const;

type RandomStreamEvents = {
  metadata: RandomContentApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};

export type RandomStreamHandlers = {
  onMetadata: (content: RandomContent) => void;
  onContextChunk: (content: string) => void;
  onComplete: () => void;
  onInStreamError: () => void;
  onError?: (error: Event) => void;
};

export class RandomService {
  /**
   * Creates a streaming connection for random content (note or URL chunk)
   * Uses the /random/v2 endpoint which returns weighted random content
   * @param handlers - Object containing all stream event handlers
   * @returns EventSource instance (caller must close it)
   */
  getStreamedRandomContent(handlers: RandomStreamHandlers): EventSource {
    return sseClient.createEventSourceWithHandlers<RandomStreamEvents>(
      ENDPOINTS.STREAM_RANDOM_V2,
      {
        metadata: (data, _es) => {
          const mappedData = mapRandomContent(data);
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

export const randomService = new RandomService();
