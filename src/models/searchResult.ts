import type { KindleNoteBundle } from "./note";
import type { TweetThreadBundle } from "./tweet";
import type { UrlChunkBundle } from "./url";

export interface SearchResult {
  q: string;
  books: KindleNoteBundle[];
  urls: UrlChunkBundle[];
  tweetThreads: TweetThreadBundle[];
  count: number;
}
