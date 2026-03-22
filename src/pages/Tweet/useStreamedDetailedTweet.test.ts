import { act, renderHook } from "@testing-library/react";
import { tweetService } from "src/api";
import type { TweetDetailedContent } from "src/models";
import { useStreamedDetailedTweet } from "./useStreamedDetailedTweet";

vi.mock("src/api", () => ({
  tweetService: {
    getStreamedTweet: vi.fn(),
  },
}));

class MockEventSource {
  close = vi.fn();
}

describe("useStreamedDetailedTweet", () => {
  let mockEventSource: MockEventSource;
  let onMetadataCallback: (data: TweetDetailedContent) => void;
  let onContextChunkCallback: (content: string) => void;
  let onCompleteCallback: () => void;
  let onInStreamErrorCallback: () => void;
  let onErrorCallback: ((error: Event) => void) | undefined;

  const mockThread = {
    id: "thread-1",
    rootTweetId: "tweet-1",
    authorUsername: "user1",
    authorDisplayName: "User One",
    title: "Test Thread",
    tweetCount: 3,
    fetchedAt: "2026-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  };

  const mockTweet = {
    id: "tweet-1",
    tweetId: "ext-1",
    authorUsername: "user1",
    authorDisplayName: "User One",
    content: "Test tweet content",
    mediaUrls: [],
    threadId: "thread-1",
    positionInThread: 0,
    tweetedAt: "2026-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  };

  const mockData: TweetDetailedContent = {
    thread: mockThread,
    tweet: mockTweet,
    additionalContext: "",
    relatedTweets: [
      {
        id: "tweet-2",
        tweetId: "ext-2",
        authorUsername: "user1",
        authorDisplayName: "User One",
        content: "Related tweet",
        mediaUrls: [],
        threadId: "thread-1",
        positionInThread: 1,
        tweetedAt: "2026-01-01T00:00:00Z",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    mockEventSource = new MockEventSource();
    vi.mocked(tweetService.getStreamedTweet).mockImplementation(
      (_threadId, _tweetId, handlers) => {
        onMetadataCallback = handlers.onMetadata;
        onContextChunkCallback = handlers.onContextChunk;
        onCompleteCallback = handlers.onComplete;
        onInStreamErrorCallback = handlers.onInStreamError;
        onErrorCallback = handlers.onError;
        return mockEventSource as unknown as EventSource;
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start in loading state", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );
    expect(result.current).toEqual({ status: "loading" });
  });

  it("should reset to loading state when params change", () => {
    const { result, rerender } = renderHook(
      ({ threadId, tweetId }) => useStreamedDetailedTweet(threadId, tweetId),
      { initialProps: { threadId: "thread-1", tweetId: "tweet-1" } },
    );

    act(() => {
      onMetadataCallback(mockData);
      onCompleteCallback();
    });
    expect(result.current.status).toBe("success");

    rerender({ threadId: "thread-1", tweetId: "tweet-2" });
    expect(result.current).toEqual({ status: "loading" });
  });

  it("should transition to streaming state when metadata is received", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onMetadataCallback(mockData);
    });

    expect(result.current).toEqual({ status: "streaming", data: mockData });
  });

  it("should append context chunks to additionalContext", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onMetadataCallback(mockData);
      onContextChunkCallback("First. ");
      onContextChunkCallback("Second.");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.additionalContext).toBe("First. Second.");
  });

  it("should preserve tweet and thread data while appending chunks", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onMetadataCallback(mockData);
      onContextChunkCallback("New context");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.thread).toEqual(mockData.thread);
    expect(result.current.data.tweet).toEqual(mockData.tweet);
    expect(result.current.data.relatedTweets).toEqual(mockData.relatedTweets);
  });

  it("should transition to success state when streaming completes", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onMetadataCallback(mockData);
      onContextChunkCallback("Complete context");
      onCompleteCallback();
    });

    expect(result.current).toEqual({
      status: "success",
      data: { ...mockData, additionalContext: "Complete context" },
    });
  });

  it("should maintain empty additionalContext if no chunks received", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onMetadataCallback(mockData);
      onCompleteCallback();
    });

    assert(result.current.status === "success");
    expect(result.current.data.additionalContext).toBe("");
  });

  it("should transition to error state on in-stream error", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onInStreamErrorCallback();
    });

    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream tweet");
  });

  it("should transition to error state on stream error event", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onErrorCallback?.(new Event("error"));
    });

    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream tweet");
  });

  it("should transition to error if onContextChunk fires in non-streaming state", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onContextChunkCallback("unexpected chunk");
    });

    assert(result.current.status === "error");
    expect(result.current.error.message).toMatch(/loading/);
  });

  it("should transition to error if onComplete fires in non-streaming state", () => {
    const { result } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    act(() => {
      onCompleteCallback();
    });

    assert(result.current.status === "error");
    expect(result.current.error.message).toMatch(/loading/);
  });

  it("should close EventSource on unmount", () => {
    const { unmount } = renderHook(() =>
      useStreamedDetailedTweet("thread-1", "tweet-1"),
    );

    unmount();

    expect(mockEventSource.close).toHaveBeenCalled();
  });
});
