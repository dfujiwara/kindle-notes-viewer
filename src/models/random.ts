// Random content models - discriminated unions for combined book/url and note/url_chunk types

export interface BookSource {
  id: string;
  title: string;
  type: "book";
  author: string;
  createdAt: string;
}

export interface UrlSource {
  id: string;
  title: string;
  type: "url";
  url: string;
  createdAt: string;
}

export interface TweetThreadSource {
  id: string;
  title: string;
  type: "tweet_thread";
  authorUsername: string;
  authorDisplayName: string;
  rootTweetId: string;
  tweetCount: number;
  createdAt: string;
}

export type Source = BookSource | UrlSource | TweetThreadSource;

export interface NoteContent {
  id: string;
  contentType: "note";
  content: string;
  createdAt: string;
}

export interface UrlChunkContent {
  id: string;
  contentType: "url_chunk";
  content: string;
  isSummary: boolean;
  chunkOrder: number;
  createdAt: string;
}

export interface TweetContent {
  id: string;
  contentType: "tweet";
  content: string;
  authorUsername: string;
  positionInThread: number;
  mediaUrls: string[];
  tweetedAt: string;
  createdAt: string;
}

export type Content = NoteContent | UrlChunkContent | TweetContent;

export interface RandomContent {
  source: Source;
  content: Content;
  additionalContext: string;
  relatedItems: Content[];
}
