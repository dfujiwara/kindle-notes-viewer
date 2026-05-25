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

export interface TweetStreamMetadataApiResponse {
  source: TweetThreadSourceApiResponse;
  content: TweetContentApiResponse;
  related_items: TweetContentApiResponse[];
}
