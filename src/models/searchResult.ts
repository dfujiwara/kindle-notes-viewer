import type { KindleNoteBundle } from "./note";
import type { UrlChunkBundle } from "./url";

export interface SearchResult {
  q: string;
  books: KindleNoteBundle[];
  urls: UrlChunkBundle[];
  count: number;
}
