import type { KindleBook } from "./book";
import type { KindleNote } from "./note";
import type { BookSource, Content, NoteContent } from "./random";

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
