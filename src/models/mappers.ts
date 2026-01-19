import type { KindleBook } from "./book";
import type { KindleNote } from "./note";
import type {
  BookSource,
  Content,
  NoteContent,
  UrlChunkContent,
  UrlSource,
} from "./random";
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
