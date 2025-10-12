import type { KindleNoteBundle } from "./note";

export interface SearchResult {
  q: string;
  results: KindleNoteBundle[];
  count: number;
}
