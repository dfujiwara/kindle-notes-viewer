import type {
  Tweet,
  TweetDetailedContent,
  TweetThread,
  TweetThreadBundle,
} from "../models";
import type {
  TweetApiResponse,
  TweetContentApiResponse,
  TweetStreamMetadataApiResponse,
  TweetThreadApiResponse,
  TweetThreadBundleApiResponse,
  TweetThreadSourceApiResponse,
} from "./tweetApiTypes";

const mapTweetThreadFromApi = (
  api: TweetThreadApiResponse | TweetThreadSourceApiResponse,
): TweetThread => ({
  id: api.id,
  rootTweetId: api.root_tweet_id,
  authorUsername: api.author_username,
  authorDisplayName: api.author_display_name,
  title: api.title,
  tweetCount: api.tweet_count,
  fetchedAt: api.fetched_at ?? "",
  createdAt: api.created_at,
});

export const mapTweetThread = (api: TweetThreadApiResponse): TweetThread =>
  mapTweetThreadFromApi(api);

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

export const mapTweetContentApi = (api: TweetContentApiResponse): Tweet => ({
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

export const mapTweetStreamMetadata = (
  api: TweetStreamMetadataApiResponse,
): TweetDetailedContent => ({
  thread: mapTweetThreadFromApi(api.source),
  tweet: mapTweetContentApi(api.content),
  additionalContext: "",
  relatedTweets: api.related_items.map(mapTweetContentApi),
});
