import type { Tweet, TweetThread, TweetThreadBundle } from "../models";

export interface TweetThreadSourceApiResponse {
  id: string;
  title: string;
  type: "tweet_thread";
  author_username: string;
  author_display_name: string;
  root_tweet_id: string;
  tweet_count: number;
  fetched_at?: string;
  created_at: string;
}

export interface TweetThreadApiResponse {
  id: string;
  root_tweet_id: string;
  author_username: string;
  author_display_name: string;
  title: string;
  tweet_count: number;
  fetched_at: string;
  created_at: string;
}

export interface TweetApiResponse {
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

export interface TweetContentApiResponse {
  id: string;
  content_type: "tweet";
  content: string;
  author_username: string;
  author_display_name?: string;
  position_in_thread: number;
  media_urls: string[];
  tweeted_at: string;
  created_at: string;
}

export interface TweetThreadBundleApiResponse {
  thread: TweetThreadApiResponse;
  tweets: TweetApiResponse[];
}

export const mapTweetThread = (api: TweetThreadApiResponse): TweetThread => ({
  id: api.id,
  rootTweetId: api.root_tweet_id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  title: api.title,
  tweetCount: api.tweet_count,
  fetchedAt: api.fetched_at,
  createdAt: api.created_at,
});

export const mapTweet = (api: TweetApiResponse): Tweet => ({
  id: api.id,
  tweetId: api.tweet_id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  content: api.content,
  mediaUrls: api.media_urls,
  positionInThread: api.position_in_thread,
  tweetedAt: api.tweeted_at,
  createdAt: api.created_at,
});

export const mapTweetThreadBundle = (
  api: TweetThreadBundleApiResponse,
): TweetThreadBundle => ({
  thread: mapTweetThread(api.thread),
  tweets: api.tweets.map(mapTweet),
});
