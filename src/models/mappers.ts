import type { KindleBook } from "./book";
import type { KindleNote } from "./note";
import type {
  BookSource,
  Content,
  NoteContent,
  TweetContent,
  TweetThreadSource,
  UrlChunkContent,
  UrlSource,
} from "./random";
import type { Tweet, TweetThread } from "./tweet";
import type { Url, UrlChunk } from "./url";

// Book/Note mappers

/**
 * Maps a BookSource (from RandomContent) to a KindleBook domain model
 */
export const mapBookSourceToKindleBook = (source: BookSource): KindleBook => ({
  id: source.id,
  title: source.title,
  author: source.author,
});

/**
 * Maps a NoteContent (from RandomContent) to a KindleNote domain model
 */
export const mapNoteContentToKindleNote = (
  content: NoteContent,
): KindleNote => ({
  id: content.id,
  content: content.content,
  createdAt: content.createdAt,
});

/**
 * Filters and maps Content[] to KindleNote[], extracting only note items
 */
export const mapRelatedItemsToNotes = (relatedItems: Content[]): KindleNote[] =>
  relatedItems
    .filter((item): item is NoteContent => item.contentType === "note")
    .map(mapNoteContentToKindleNote);

// URL/Chunk mappers

/**
 * Maps a UrlSource (from RandomContent) to a Url domain model
 */
export const mapUrlSourceToUrl = (source: UrlSource): Url => ({
  id: source.id,
  url: source.url,
  title: source.title,
  chunkCount: 0, // Not provided by the API
  createdAt: source.createdAt,
});

/**
 * Maps a UrlChunkContent (from RandomContent) to a UrlChunk domain model
 */
export const mapUrlChunkContentToUrlChunk = (
  content: UrlChunkContent,
): UrlChunk => ({
  id: content.id,
  content: content.content,
  isSummary: content.isSummary,
  createdAt: content.createdAt,
});

/**
 * Filters and maps Content[] to UrlChunk[], extracting only url_chunk items
 */
export const mapRelatedItemsToUrlChunks = (
  relatedItems: Content[],
): UrlChunk[] =>
  relatedItems
    .filter((item): item is UrlChunkContent => item.contentType === "url_chunk")
    .map(mapUrlChunkContentToUrlChunk);

// Tweet mappers

/**
 * Maps a TweetThreadSource (from RandomContent) to a TweetThread domain model
 */
export const mapTweetThreadSourceToThread = (
  source: TweetThreadSource,
): TweetThread => ({
  id: source.id,
  rootTweetId: source.rootTweetId,
  authorUsername: source.authorUsername,
  authorDisplayName: source.authorDisplayName,
  title: source.title,
  tweetCount: source.tweetCount,
  // The random API does not provide fetched_at separately; use createdAt for both
  fetchedAt: source.createdAt,
  createdAt: source.createdAt,
});

/**
 * Maps a TweetContent (from RandomContent) to a Tweet domain model
 */
export const mapTweetContentToTweet = (content: TweetContent): Tweet => ({
  id: content.id,
  tweetId: content.id,
  authorUsername: content.authorUsername,
  // The random API does not include author_display_name on tweet content; fall back to username
  authorDisplayName: content.authorUsername,
  content: content.content,
  mediaUrls: content.mediaUrls,
  positionInThread: content.positionInThread,
  tweetedAt: content.tweetedAt,
  createdAt: content.createdAt,
});

/**
 * Filters and maps Content[] to Tweet[], extracting only tweet items
 */
export const mapRelatedItemsToTweets = (relatedItems: Content[]): Tweet[] =>
  relatedItems
    .filter((item): item is TweetContent => item.contentType === "tweet")
    .map((item) => mapTweetContentToTweet(item));
