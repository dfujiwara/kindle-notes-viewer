import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  TweetDetailedContent,
  TweetThread,
  TweetThreadBundle,
} from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import { tweetService } from "./tweetService";

vi.mock("./httpClient", () => ({
  httpClient: {
    request: vi.fn(),
  },
}));

vi.mock("./sseClient", () => ({
  sseClient: {
    createEventSourceWithHandlers: vi.fn(),
  },
}));

// Shared API response fixtures
const mockThreadApi = {
  id: "thread-1",
  root_tweet_id: "tweet-123",
  author_username: "user1",
  author_display_name: "User One",
  title: "My Thread",
  tweet_count: 2,
  fetched_at: "2026-01-05T00:00:00Z",
  created_at: "2026-01-05T00:00:00Z",
};

const mockTweetApi1 = {
  id: "t-1",
  tweet_id: "ext-1",
  author_username: "user1",
  author_display_name: "User One",
  content: "First tweet",
  media_urls: [],
  thread_id: "thread-1",
  position_in_thread: 0,
  tweeted_at: "2026-01-04T00:00:00Z",
  created_at: "2026-01-05T00:00:00Z",
};

const mockTweetApi2 = {
  id: "t-2",
  tweet_id: "ext-2",
  author_username: "user1",
  author_display_name: "User One",
  content: "Second tweet",
  media_urls: ["https://example.com/img.jpg"],
  thread_id: "thread-1",
  position_in_thread: 1,
  tweeted_at: "2026-01-04T01:00:00Z",
  created_at: "2026-01-05T00:00:00Z",
};

// Expected camelCase domain models corresponding to the fixtures above
const expectedThread: TweetThread = {
  id: "thread-1",
  rootTweetId: "tweet-123",
  authorUsername: "user1",
  authorDisplayName: "User One",
  title: "My Thread",
  tweetCount: 2,
  fetchedAt: "2026-01-05T00:00:00Z",
  createdAt: "2026-01-05T00:00:00Z",
};

const expectedTweet1 = {
  id: "t-1",
  tweetId: "ext-1",
  authorUsername: "user1",
  authorDisplayName: "User One",
  content: "First tweet",
  mediaUrls: [],

  positionInThread: 0,
  tweetedAt: "2026-01-04T00:00:00Z",
  createdAt: "2026-01-05T00:00:00Z",
};

const expectedTweet2 = {
  id: "t-2",
  tweetId: "ext-2",
  authorUsername: "user1",
  authorDisplayName: "User One",
  content: "Second tweet",
  mediaUrls: ["https://example.com/img.jpg"],

  positionInThread: 1,
  tweetedAt: "2026-01-04T01:00:00Z",
  createdAt: "2026-01-05T00:00:00Z",
};

/**
 * Sets up sseClient mock to capture a specific SSE handler by name.
 * Returns the mockEventSource and a getter to retrieve the captured handler
 * after getStreamedTweet is called.
 */
function captureSseHandler(handlerName: string) {
  const mockEventSource = { close: vi.fn() } as unknown as EventSource;
  let captured: ((data: unknown, es: EventSource) => void) | undefined;

  vi.mocked(sseClient.createEventSourceWithHandlers).mockImplementation(
    (_url, handlers) => {
      captured = handlers[handlerName as keyof typeof handlers] as
        | ((data: unknown, es: EventSource) => void)
        | undefined;
      return mockEventSource;
    },
  );

  return {
    mockEventSource,
    getHandler: () => {
      if (!captured) throw new Error(`Handler "${handlerName}" not captured`);
      return captured;
    },
  };
}

function makeHandlers() {
  return {
    onMetadata: vi.fn(),
    onContextChunk: vi.fn(),
    onComplete: vi.fn(),
    onInStreamError: vi.fn(),
  };
}

describe("TweetService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTweets", () => {
    it("transforms multiple threads from snake_case to camelCase", async () => {
      const mockThread2Api = {
        ...mockThreadApi,
        id: "thread-2",
        title: "Another Thread",
      };

      vi.mocked(httpClient.request).mockResolvedValue({
        data: { threads: [mockThreadApi, mockThread2Api] },
        status: 200,
      });

      const result = await tweetService.getTweets();

      expect(httpClient.request).toHaveBeenCalledWith("/tweets");
      expect(result.data).toEqual([
        expectedThread,
        { ...expectedThread, id: "thread-2", title: "Another Thread" },
      ]);
    });
  });

  describe("ingestTweet", () => {
    it("POSTs the tweet URL and returns the transformed thread bundle", async () => {
      vi.mocked(httpClient.request).mockResolvedValue({
        data: { thread: mockThreadApi, tweets: [mockTweetApi1, mockTweetApi2] },
        status: 201,
      });

      const result = await tweetService.ingestTweet(
        "https://twitter.com/user1/status/ext-1",
      );

      expect(httpClient.request).toHaveBeenCalledWith("/tweets", {
        method: "POST",
        headers: {},
        body: { tweet_input: "https://twitter.com/user1/status/ext-1" },
      });
      expect(result.data).toEqual({
        thread: expectedThread,
        tweets: [expectedTweet1, expectedTweet2],
      } as TweetThreadBundle);
    });
  });

  describe("getTweetThread", () => {
    it("fetches and transforms a full thread bundle from snake_case to camelCase", async () => {
      vi.mocked(httpClient.request).mockResolvedValue({
        data: { thread: mockThreadApi, tweets: [mockTweetApi1, mockTweetApi2] },
        status: 200,
      });

      const result = await tweetService.getTweetThread("thread-1");

      expect(httpClient.request).toHaveBeenCalledWith("/tweets/thread-1");
      expect(result.data).toEqual({
        thread: expectedThread,
        tweets: [expectedTweet1, expectedTweet2],
      } as TweetThreadBundle);
    });
  });

  describe("getStreamedTweet", () => {
    it("creates an EventSource for the correct endpoint with all required handlers", () => {
      const mockEventSource = {} as EventSource;
      vi.mocked(sseClient.createEventSourceWithHandlers).mockReturnValue(
        mockEventSource,
      );

      const result = tweetService.getStreamedTweet(
        "thread-1",
        "t-1",
        makeHandlers(),
      );

      expect(sseClient.createEventSourceWithHandlers).toHaveBeenCalledWith(
        "/tweets/thread-1/tweets/t-1",
        expect.objectContaining({
          metadata: expect.any(Function),
          context_chunk: expect.any(Function),
          context_complete: expect.any(Function),
          error: expect.any(Function),
        }),
        undefined,
      );
      expect(result).toBe(mockEventSource);
    });

    it("passes onError callback through to createEventSourceWithHandlers", () => {
      vi.mocked(sseClient.createEventSourceWithHandlers).mockReturnValue(
        {} as EventSource,
      );
      const onError = vi.fn();

      tweetService.getStreamedTweet("thread-1", "t-1", {
        ...makeHandlers(),
        onError,
      });

      expect(sseClient.createEventSourceWithHandlers).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        onError,
      );
    });

    it("transforms the metadata event into camelCase TweetDetailedContent", () => {
      const { mockEventSource, getHandler } = captureSseHandler("metadata");
      const handlers = makeHandlers();
      tweetService.getStreamedTweet("thread-1", "t-1", handlers);

      getHandler()(
        {
          source: {
            id: "thread-1",
            title: "My Thread",
            type: "tweet_thread",
            author_username: "user1",
            author_display_name: "User One",
            root_tweet_id: "tweet-123",
            tweet_count: 2,
            fetched_at: "2026-01-05T00:00:00Z",
            created_at: "2026-01-05T00:00:00Z",
          },
          content: {
            id: "t-1",
            content_type: "tweet",
            content: "First tweet",
            author_username: "user1",
            author_display_name: "User One",
            position_in_thread: 0,
            media_urls: [],
            tweeted_at: "2026-01-04T00:00:00Z",
            created_at: "2026-01-05T00:00:00Z",
          },
          related_items: [
            {
              id: "t-2",
              content_type: "tweet",
              content: "Second tweet",
              author_username: "user1",
              author_display_name: "User One",
              position_in_thread: 1,
              media_urls: ["https://example.com/img.jpg"],
              tweeted_at: "2026-01-04T01:00:00Z",
              created_at: "2026-01-05T00:00:00Z",
            },
          ],
        },
        mockEventSource,
      );

      expect(handlers.onMetadata).toHaveBeenCalledWith({
        thread: expectedThread,
        tweet: {
          id: "t-1",
          tweetId: "t-1",
          authorUsername: "user1",
          authorDisplayName: "User One",
          content: "First tweet",
          mediaUrls: [],
          positionInThread: 0,
          tweetedAt: "2026-01-04T00:00:00Z",
          createdAt: "2026-01-05T00:00:00Z",
        },
        additionalContext: "",
        relatedTweets: [
          {
            id: "t-2",
            tweetId: "t-2",
            authorUsername: "user1",
            authorDisplayName: "User One",
            content: "Second tweet",
            mediaUrls: ["https://example.com/img.jpg"],
            positionInThread: 1,
            tweetedAt: "2026-01-04T01:00:00Z",
            createdAt: "2026-01-05T00:00:00Z",
          },
        ],
      } as TweetDetailedContent);
    });

    it("calls onContextChunk with the chunk content string", () => {
      const { mockEventSource, getHandler } =
        captureSseHandler("context_chunk");
      const handlers = makeHandlers();
      tweetService.getStreamedTweet("thread-1", "t-1", handlers);

      getHandler()({ content: "some context" }, mockEventSource);

      expect(handlers.onContextChunk).toHaveBeenCalledWith("some context");
    });

    it("calls onComplete and closes the EventSource on context_complete", () => {
      const { mockEventSource, getHandler } =
        captureSseHandler("context_complete");
      const handlers = makeHandlers();
      tweetService.getStreamedTweet("thread-1", "t-1", handlers);

      getHandler()({}, mockEventSource);

      expect(handlers.onComplete).toHaveBeenCalled();
      expect(mockEventSource.close).toHaveBeenCalled();
    });

    it("calls onInStreamError and closes the EventSource on in-stream error", () => {
      const { mockEventSource, getHandler } = captureSseHandler("error");
      const handlers = makeHandlers();
      tweetService.getStreamedTweet("thread-1", "t-1", handlers);

      getHandler()({ detail: "something went wrong" }, mockEventSource);

      expect(handlers.onInStreamError).toHaveBeenCalled();
      expect(mockEventSource.close).toHaveBeenCalled();
    });
  });
});
