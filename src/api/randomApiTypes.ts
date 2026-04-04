import type { Content, RandomContent, Source } from "src/models";
import type {
  TweetContentApiResponse,
  TweetThreadSourceApiResponse,
} from "./tweetApiTypes";
import type {
  UrlChunkContentApiResponse,
  UrlSourceApiResponse,
} from "./urlApiTypes";

// API response interfaces with snake_case fields (matching backend /random/v2)

interface BookSourceApiResponse {
  id: number;
  title: string;
  type: "book";
  author: string;
  created_at: string;
}

type SourceApiResponse =
  | BookSourceApiResponse
  | UrlSourceApiResponse
  | TweetThreadSourceApiResponse;

interface NoteContentApiResponse {
  id: number;
  content_type: "note";
  content: string;
  created_at: string;
}

type ContentApiResponse =
  | NoteContentApiResponse
  | UrlChunkContentApiResponse
  | TweetContentApiResponse;

export interface RandomContentApiResponse {
  source: SourceApiResponse;
  content: ContentApiResponse;
  related_items: ContentApiResponse[];
}

const mapSource = (apiSource: SourceApiResponse): Source => {
  if (apiSource.type === "book") {
    return {
      id: String(apiSource.id),
      title: apiSource.title,
      type: "book",
      author: apiSource.author,
      createdAt: apiSource.created_at,
    };
  }
  if (apiSource.type === "tweet_thread") {
    return {
      id: apiSource.id,
      title: apiSource.title,
      type: "tweet_thread",
      authorUsername: apiSource.author_username,
      authorDisplayName: apiSource.author_display_name,
      rootTweetId: apiSource.root_tweet_id,
      tweetCount: apiSource.tweet_count,
      createdAt: apiSource.created_at,
    };
  }
  return {
    id: String(apiSource.id),
    title: apiSource.title,
    type: "url",
    url: apiSource.url,
    createdAt: apiSource.created_at,
  };
};

const mapContent = (apiContent: ContentApiResponse): Content => {
  if (apiContent.content_type === "note") {
    return {
      id: String(apiContent.id),
      contentType: "note",
      content: apiContent.content,
      createdAt: apiContent.created_at,
    };
  }
  if (apiContent.content_type === "tweet") {
    return {
      id: String(apiContent.id),
      contentType: "tweet",
      content: apiContent.content,
      authorUsername: apiContent.author_username,
      positionInThread: apiContent.position_in_thread,
      mediaUrls: apiContent.media_urls,
      tweetedAt: apiContent.tweeted_at,
      createdAt: apiContent.created_at,
    };
  }
  return {
    id: String(apiContent.id),
    contentType: "url_chunk",
    content: apiContent.content,
    isSummary: apiContent.is_summary,
    chunkOrder: apiContent.chunk_order,
    createdAt: apiContent.created_at,
  };
};

export const mapRandomContent = (
  apiResponse: RandomContentApiResponse,
): RandomContent => ({
  source: mapSource(apiResponse.source),
  content: mapContent(apiResponse.content),
  additionalContext: "",
  relatedItems: apiResponse.related_items.map(mapContent),
});
