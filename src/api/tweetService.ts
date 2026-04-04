import { logger } from "src/utils/logger";
import type {
  Tweet,
  TweetDetailedContent,
  TweetThread,
  TweetThreadBundle,
} from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type {
  TweetContentApiResponse,
  TweetThreadApiResponse,
  TweetThreadBundleApiResponse,
  TweetThreadSourceApiResponse,
} from "./tweetApiTypes";
import { mapTweetThread, mapTweetThreadBundle } from "./tweetApiTypes";
import type { ApiResponse } from "./types";

interface TweetStreamMetadataApiResponse {
  source: TweetThreadSourceApiResponse;
  content: TweetContentApiResponse;
  related_items: TweetContentApiResponse[];
}

const mapTweetContentApi = (api: TweetContentApiResponse): Tweet => ({
  id: api.id,
  tweetId: api.id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name ?? api.author_username,
  content: api.content,
  mediaUrls: api.media_urls,
  positionInThread: api.position_in_thread,
  tweetedAt: api.tweeted_at,
  createdAt: api.created_at,
});

const mapStreamMetadata = (
  api: TweetStreamMetadataApiResponse,
): TweetDetailedContent => ({
  thread: {
    id: api.source.id,
    rootTweetId: api.source.root_tweet_id,
    authorUsername: api.source.author_username,
    authorDisplayName: api.source.author_display_name,
    title: api.source.title,
    tweetCount: api.source.tweet_count,
    fetchedAt: api.source.fetched_at ?? "",
    createdAt: api.source.created_at,
  },
  tweet: mapTweetContentApi(api.content),
  additionalContext: "",
  relatedTweets: api.related_items.map(mapTweetContentApi),
});

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

  getStreamedTweet(
    threadId: string,
    tweetId: string,
    handlers: TweetStreamHandlers,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<TweetStreamEvents>(
      ENDPOINTS.STREAM_TWEET(threadId, tweetId),
      {
        metadata: (data, _es) => {
          handlers.onMetadata(mapStreamMetadata(data));
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
