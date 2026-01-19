import type { KindleNoteBundle } from "./note";
import type { UrlChunkBundle } from "./url";

export interface SearchResult {
  q: string;
  books: KindleNoteBundle[];
  urls: UrlChunkBundle[];
  count: number;
  /** @deprecated Use `books` instead. Will be removed in phase6-ui. */
  results: KindleNoteBundle[];
}
