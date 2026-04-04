import { describe, expect, it } from "vitest";
import {
  mapRelatedItemsToTweets,
  mapTweetContentToTweet,
  mapTweetThreadSourceToThread,
} from "./mappers";
import type { TweetContent, TweetThreadSource } from "./random";

const mockTweetThreadSource: TweetThreadSource = {
  id: "thread-1",
  title: "Test Thread",
  type: "tweet_thread",
  authorUsername: "testuser",
  authorDisplayName: "Test User",
  rootTweetId: "tweet-root",
  tweetCount: 3,
  createdAt: "2026-01-01T00:00:00Z",
};

const mockTweetContent: TweetContent = {
  id: "tweet-1",
  contentType: "tweet",
  content: "Hello world",
  authorUsername: "testuser",
  positionInThread: 2,
  mediaUrls: ["https://example.com/img.jpg"],
  tweetedAt: "2026-01-01T12:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("mapTweetThreadSourceToThread", () => {
  it("maps all fields correctly", () => {
    const result = mapTweetThreadSourceToThread(mockTweetThreadSource);

    expect(result).toEqual({
      id: "thread-1",
      rootTweetId: "tweet-root",
      authorUsername: "testuser",
      authorDisplayName: "Test User",
      title: "Test Thread",
      tweetCount: 3,
      fetchedAt: "2026-01-01T00:00:00Z",
      createdAt: "2026-01-01T00:00:00Z",
    });
  });

  it("uses createdAt for both fetchedAt and createdAt", () => {
    const result = mapTweetThreadSourceToThread(mockTweetThreadSource);
    expect(result.fetchedAt).toBe(result.createdAt);
  });
});

describe("mapTweetContentToTweet", () => {
  it("maps all fields correctly", () => {
    const result = mapTweetContentToTweet(mockTweetContent);

    expect(result).toEqual({
      id: "tweet-1",
      tweetId: "tweet-1",
      authorUsername: "testuser",
      // authorDisplayName falls back to username — API does not provide it on tweet content
      authorDisplayName: "testuser",
      content: "Hello world",
      mediaUrls: ["https://example.com/img.jpg"],
      positionInThread: 2,
      tweetedAt: "2026-01-01T12:00:00Z",
      createdAt: "2026-01-01T00:00:00Z",
    });
  });

  it("uses id for both id and tweetId", () => {
    const result = mapTweetContentToTweet(mockTweetContent);
    expect(result.id).toBe(result.tweetId);
  });

  it("maps empty mediaUrls", () => {
    const result = mapTweetContentToTweet({
      ...mockTweetContent,
      mediaUrls: [],
    });
    expect(result.mediaUrls).toEqual([]);
  });
});

describe("mapRelatedItemsToTweets", () => {
  it("filters out non-tweet items and maps tweet items", () => {
    const relatedItems = [
      mockTweetContent,
      {
        id: "note-1",
        contentType: "note" as const,
        content: "A note",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "tweet-2",
        contentType: "tweet" as const,
        content: "Second tweet",
        authorUsername: "user2",
        positionInThread: 1,
        mediaUrls: [],
        tweetedAt: "2026-01-02T00:00:00Z",
        createdAt: "2026-01-02T00:00:00Z",
      },
    ];

    const result = mapRelatedItemsToTweets(relatedItems);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("tweet-1");
    expect(result[1].id).toBe("tweet-2");
  });

  it("returns empty array when no tweet items", () => {
    const relatedItems = [
      {
        id: "note-1",
        contentType: "note" as const,
        content: "A note",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    expect(mapRelatedItemsToTweets(relatedItems)).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(mapRelatedItemsToTweets([])).toEqual([]);
  });
});
