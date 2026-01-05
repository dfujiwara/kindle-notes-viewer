// URL represents the source document (analogous to KindleBook)
export interface Url {
  id: string;
  url: string; // The original URL
  title: string; // Extracted page title
  chunkCount: number; // Number of chunks extracted
  createdAt: string; // When it was uploaded
}

// URL Chunk represents extracted content (analogous to KindleNote)
export interface UrlChunk {
  id: string;
  content: string; // The chunk text
  createdAt: string;
}

// Bundle of URL with its chunks (analogous to KindleNoteBundle)
export interface UrlChunkBundle {
  url: Url;
  chunks: UrlChunk[];
}

// Detailed chunk with context (analogous to KindleDetailedNote)
export interface UrlDetailedChunk {
  url: Url;
  chunk: UrlChunk;
  additionalContext: string;
  relatedChunks: UrlChunk[];
}
