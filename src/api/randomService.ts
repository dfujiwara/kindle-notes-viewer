import type { RandomContent } from "src/models";
import { logger } from "src/utils/logger";
import type { RandomContentApiResponse } from "./randomApiTypes";
import { mapRandomContent } from "./randomApiTypes";
import { sseClient } from "./sseClient";

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
