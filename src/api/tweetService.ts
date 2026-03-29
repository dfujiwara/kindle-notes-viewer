import { logger } from "src/utils/logger";
import type {
  Tweet,
  TweetDetailedContent,
  TweetThread,
  TweetThreadBundle,
} from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type { ApiResponse } from "./types";

// API response interfaces with snake_case fields
interface TweetThreadApiResponse {
  id: string;
  root_tweet_id: string;
  author_username: string;
  author_display_name: string;
  title: string;
  tweet_count: number;
  fetched_at: string;
  created_at: string;
}

interface TweetApiResponse {
  id: string;
  tweet_id: string;
  author_username: string;
  author_display_name: string;
  content: string;
  media_urls: string[];
  thread_id: string;
  position_in_thread: number;
  tweeted_at: string;
  created_at: string;
}

interface TweetThreadBundleApiResponse {
  thread: TweetThreadApiResponse;
  tweets: TweetApiResponse[];
}

interface TweetThreadSourceApiResponse {
  id: string;
  title: string;
  type: "tweet_thread";
  author_username: string;
  author_display_name: string;
  root_tweet_id: string;
  tweet_count: number;
  fetched_at: string;
  created_at: string;
}

interface TweetContentApiResponse {
  id: string;
  content_type: "tweet";
  content: string;
  author_username: string;
  author_display_name: string;
  position_in_thread: number;
  media_urls: string[];
  tweeted_at: string;
  created_at: string;
}

interface TweetStreamMetadataApiResponse {
  source: TweetThreadSourceApiResponse;
  content: TweetContentApiResponse;
  related_items: TweetContentApiResponse[];
}

// Mapping functions
const mapTweetThread = (api: TweetThreadApiResponse): TweetThread => ({
  id: api.id,
  rootTweetId: api.root_tweet_id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  title: api.title,
  tweetCount: api.tweet_count,
  fetchedAt: api.fetched_at,
  createdAt: api.created_at,
});

const mapTweet = (api: TweetApiResponse): Tweet => ({
  id: api.id,
  tweetId: api.tweet_id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  content: api.content,
  mediaUrls: api.media_urls,
  threadId: api.thread_id,
  positionInThread: api.position_in_thread,
  tweetedAt: api.tweeted_at,
  createdAt: api.created_at,
});

const mapTweetThreadBundle = (
  api: TweetThreadBundleApiResponse,
): TweetThreadBundle => ({
  thread: mapTweetThread(api.thread),
  tweets: api.tweets.map(mapTweet),
});

const mapTweetContentApi = (api: TweetContentApiResponse): Tweet => ({
  id: api.id,
  tweetId: api.id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  content: api.content,
  mediaUrls: api.media_urls,
  threadId: "",
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
    fetchedAt: api.source.fetched_at,
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
