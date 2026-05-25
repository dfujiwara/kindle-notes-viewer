import { logger } from "src/utils/logger";
import type {
  TweetDetailedContent,
  TweetThread,
  TweetThreadBundle,
} from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type {
  TweetStreamMetadataApiResponse,
  TweetThreadApiResponse,
  TweetThreadBundleApiResponse,
} from "./tweetApiTypes";
import {
  mapTweetStreamMetadata,
  mapTweetThread,
  mapTweetThreadBundle,
} from "./tweetMappers";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: "/tweets",
  INGEST: "/tweets",
  THREAD: (threadId: string) => `/tweets/${threadId}`,
  STREAM_TWEET: (threadId: string, tweetId: string) =>
    `/tweets/${threadId}/tweets/${tweetId}`,
} as const;

type TweetStreamEvents = {
  metadata: TweetStreamMetadataApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};

export type TweetStreamHandlers = {
  onMetadata: (data: TweetDetailedContent) => void;
  onContextChunk: (content: string) => void;
  onComplete: () => void;
  onInStreamError: () => void;
  onError?: (error: Event) => void;
};

export class TweetService {
  async getTweets(): Promise<ApiResponse<TweetThread[]>> {
    const response = await httpClient.request<{
      threads: TweetThreadApiResponse[];
    }>(ENDPOINTS.LIST);
    const data = response.data.threads.map(mapTweetThread);
    return { ...response, data };
  }

  async ingestTweet(tweetUrl: string): Promise<ApiResponse<TweetThreadBundle>> {
    const response = await httpClient.request<TweetThreadBundleApiResponse>(
      ENDPOINTS.INGEST,
      {
        method: "POST",
        headers: {},
        body: { tweet_input: tweetUrl },
      },
    );
    return { ...response, data: mapTweetThreadBundle(response.data) };
  }

  async getTweetThread(
    threadId: string,
  ): Promise<ApiResponse<TweetThreadBundle>> {
    const response = await httpClient.request<TweetThreadBundleApiResponse>(
      ENDPOINTS.THREAD(threadId),
    );
    return { ...response, data: mapTweetThreadBundle(response.data) };
  }

  async deleteTweetThread(threadId: string): Promise<ApiResponse<null>> {
    return httpClient.request<null>(ENDPOINTS.THREAD(threadId), {
      method: "DELETE",
      headers: {},
    });
  }

  getStreamedTweet(
    threadId: string,
    tweetId: string,
    handlers: TweetStreamHandlers,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<TweetStreamEvents>(
      ENDPOINTS.STREAM_TWEET(threadId, tweetId),
      {
        metadata: (data, _es) => {
          handlers.onMetadata(mapTweetStreamMetadata(data));
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

export const tweetService = new TweetService();
