import type {
  Url,
  UrlChunk,
  UrlChunkBundle,
  UrlDetailedChunk,
} from "../models";

export interface UrlApiResponse {
  id: string;
  url: string;
  title: string;
  chunk_count: number;
  created_at: string;
}

export interface UrlChunkApiResponse {
  id: string;
  content: string;
  is_summary: boolean;
  created_at: string;
}

export interface UrlChunkBundleApiResponse {
  url: UrlApiResponse;
  chunks: UrlChunkApiResponse[];
}

// Streaming metadata API response interfaces
export interface UrlSourceApiResponse {
  id: number;
  title: string;
  type: "url";
  url: string;
  created_at: string;
}

export interface UrlChunkContentApiResponse {
  id: number;
  content_type: "url_chunk";
  content: string;
  is_summary: boolean;
  chunk_order: number;
  created_at: string;
}

export interface UrlStreamMetadataApiResponse {
  source: UrlSourceApiResponse;
  content: UrlChunkContentApiResponse;
  related_items: UrlChunkContentApiResponse[];
}

export const mapUrl = (apiUrl: UrlApiResponse): Url => ({
  id: apiUrl.id,
  url: apiUrl.url,
  title: apiUrl.title,
  chunkCount: apiUrl.chunk_count,
  createdAt: apiUrl.created_at,
});

export const mapUrlChunk = (apiChunk: UrlChunkApiResponse): UrlChunk => ({
  id: apiChunk.id,
  content: apiChunk.content,
  isSummary: apiChunk.is_summary,
  createdAt: apiChunk.created_at,
});

export const mapUrlChunkBundle = (
  bundle: UrlChunkBundleApiResponse,
): UrlChunkBundle => ({
  url: mapUrl(bundle.url),
  chunks: bundle.chunks.map(mapUrlChunk),
});

export const mapUrlSource = (apiSource: UrlSourceApiResponse): Url => ({
  id: String(apiSource.id),
  url: apiSource.url,
  title: apiSource.title,
  chunkCount: 0, // Not provided by streaming API
  createdAt: apiSource.created_at,
});

export const mapUrlChunkContent = (
  apiContent: UrlChunkContentApiResponse,
): UrlChunk => ({
  id: String(apiContent.id),
  content: apiContent.content,
  isSummary: apiContent.is_summary,
  createdAt: apiContent.created_at,
});

export const mapStreamMetadata = (
  apiResponse: UrlStreamMetadataApiResponse,
): UrlDetailedChunk => ({
  url: mapUrlSource(apiResponse.source),
  chunk: mapUrlChunkContent(apiResponse.content),
  additionalContext: "",
  relatedChunks: apiResponse.related_items.map(mapUrlChunkContent),
});
