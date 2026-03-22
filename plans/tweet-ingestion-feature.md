# Tweet Ingestion Frontend - Implementation Plan

## Context

The backend has fully implemented tweet/thread ingestion (Phases 1–8 complete as of 2026-03-21). The backend exposes:
- `POST /tweets` – ingest tweet or thread by URL or ID
- `GET /tweets` – list all ingested threads
- `GET /tweets/{thread_id}` – thread with all tweets
- `GET /tweets/{thread_id}/tweets/{tweet_id}` – SSE stream for individual tweet with AI context
- `/random/v2` – now includes tweets (weighted)
- `/search` – now includes `tweet_threads` in response

This plan adds the frontend to surface tweets as a first-class content type alongside books and URLs.

---

## Phase 1: Models

**New file: `src/models/tweet.ts`**

Domain models (camelCase):
```typescript
TweetThread { id, rootTweetId, authorUsername, authorDisplayName, title, tweetCount, fetchedAt, createdAt }
Tweet { id, tweetId, authorUsername, authorDisplayName, content, mediaUrls, threadId, positionInThread, tweetedAt, createdAt }
TweetThreadBundle { thread: TweetThread, tweets: Tweet[] }
TweetDetailedContent { thread: TweetThread, tweet: Tweet, additionalContext: string, relatedTweets: Tweet[] }
```

For unified random/streaming types (add to `src/models/random.ts`):
```typescript
TweetThreadSource { id, title, type: "tweet_thread", authorUsername, authorDisplayName, rootTweetId, tweetCount, createdAt }
TweetContent { id, contentType: "tweet", content, authorUsername, positionInThread, mediaUrls, tweetedAt, createdAt }
```
Extend `Source = BookSource | UrlSource | TweetThreadSource`
Extend `Content = NoteContent | UrlChunkContent | TweetContent`

**Update `src/models/searchResult.ts`**: add `tweetThreads: TweetThreadBundle[]`

**Update `src/models/mappers.ts`**: add `mapTweetThreadSourceToThread()` and `mapTweetContentToTweet()`

**Update `src/models/index.ts`**: export all new tweet types

---

## Phase 2: Tweet Service

**New file: `src/api/tweetService.ts`**

API response interfaces (snake_case):
```typescript
TweetThreadApiResponse { id, root_tweet_id, author_username, author_display_name, title, tweet_count, fetched_at, created_at }
TweetApiResponse { id, tweet_id, author_username, author_display_name, content, media_urls, thread_id, position_in_thread, tweeted_at, created_at }
TweetThreadBundleApiResponse { thread: TweetThreadApiResponse, tweets: TweetApiResponse[] }
TweetStreamMetadataApiResponse { source: TweetThreadSourceApiResponse, content: TweetContentApiResponse, related_items: TweetContentApiResponse[] }
```

Service class:
```typescript
class TweetService {
  async getTweets(): Promise<ApiResponse<TweetThread[]>>  // GET /tweets
  async ingestTweet(tweetUrl: string): Promise<ApiResponse<TweetThreadBundle>>  // POST /tweets
  async getTweetThread(threadId: string): Promise<ApiResponse<TweetThreadBundle>>  // GET /tweets/{thread_id}
  getStreamedTweet(threadId, tweetId, handlers): EventSource  // SSE /tweets/{thread_id}/tweets/{tweet_id}
}
export const tweetService = new TweetService();
```

StreamHandlers mirrors `urlService.ts` pattern (onMetadata, onContextChunk, onComplete, onInStreamError, onError?)

**Update `src/api/index.ts`**: export `tweetService`

---

## Phase 3: Home Page — Tweets Tab

**Update `src/pages/Home/HomePage.tsx`**:
- Add `"tweets"` to `Tab` type
- Add `tweetsTabRef`, `tweetsTabId`, `tweetsPanelId` with `useId()`
- Fetch with `useApiSuspenseQuery(["tweets"], () => tweetService.getTweets())`
- Add third tab button `Tweets`
- Update `handleKeyDown` for 3-tab cycle (books → urls → tweets → books)
- Add tweets tab panel with `TweetList`

**New file: `src/pages/Home/TweetList.tsx`**:
- Props: `threads: TweetThread[], onThreadClick: (thread) => void`
- Renders `<ul>/<li>` list; each item shows title, `@authorUsername`, tweet count badge, date
- Mirrors `UrlList.tsx` pattern

---

## Phase 4: Tweet Detail Pages

**New files under `src/pages/Tweet/`:**

`TweetPage.tsx` (mirrors `UrlPage`):
- `useApiSuspenseQuery(["tweet-thread", threadId], () => tweetService.getTweetThread(threadId))`
- Renders thread header (title, author, tweet count) + list of tweets
- Each tweet navigates to `/tweets/:threadId/tweets/:tweetId`

`TweetDetailPage.tsx` (mirrors `ChunkPage`):
- No Suspense — uses custom streaming hook
- Renders tweet content + streaming AI context + related tweets

`useStreamedDetailedTweet.ts` (mirrors `useStreamedDetailedChunk.ts`):
- State machine: `loading` → `streaming` (on metadata) → `success` (on complete) | `error`
- Calls `tweetService.getStreamedTweet(threadId, tweetId, handlers)`
- Returns `{ status, data: TweetDetailedContent | null, error }`

`TweetDescription.tsx`:
- Props: `thread: TweetThread, tweet: Tweet, relatedTweets: Tweet[], additionalContext: string, onThreadClick, onRelatedTweetClick`
- Renders tweet content with author/position, AI context section, related tweets list

---

## Phase 5: Upload Page — Tweet Ingestion

**Update `src/pages/Upload/UploadPage.tsx`**:
- Add `"tweet"` to `UploadMode` type
- Add third tab button `Tweet`
- Reuse `UrlInputZone` for tweet URL input (accepts twitter.com / x.com URLs)
- Add tweet mutation:
  ```typescript
  const tweetMutation = useApiMutation(
    (url: string) => tweetService.ingestTweet(url),
    () => { toast.success("Tweet ingested!"); navigate("/"); },
    (error: ApiError) => { toast.error(`Ingestion failed: ${error.message}`); },
    ["tweets"],
  );
  ```
- Update `hasContent` and `isUploading` to cover tweet mode

---

## Phase 6: Random Page — Tweet Support

**Update `src/api/randomService.ts`**:
- Add `TweetThreadSourceApiResponse` (type: "tweet_thread") and `TweetContentApiResponse` (content_type: "tweet") interfaces
- Extend `SourceApiResponse` and `ContentApiResponse` unions
- Update `mapSource()` to handle `tweet_thread` → `TweetThreadSource`
- Update `mapContent()` to handle `tweet` → `TweetContent`

**Update `src/pages/Random/RandomPage.tsx`**:
- Add `tweet_thread` branch in the `source.type` switch
- Render `TweetDescription` with nav to `/tweets/:source.id/` and related tweets

**Update `src/models/mappers.ts`**:
- Add `mapTweetThreadSourceToThread()` and `mapTweetContentToTweet()` (mirror URL mapper pattern)

---

## Phase 7: Search — Tweet Results

**Update `src/api/searchService.ts`**:
- Add `TweetThreadBundleApiResponse` interface
- Update `SearchResultApiResponse` to include `tweet_threads: TweetThreadBundleApiResponse[]`
- Update `mapSearchResult()` to map tweet threads

**Update `src/models/searchResult.ts`**:
- Add `tweetThreads: TweetThreadBundle[]`

**Update `src/pages/Search/SearchResults.tsx`**:
- Add `TweetsSection` component (mirrors `UrlsSection`) — shows thread title, author, and tweet excerpts with links to `/tweets/:threadId/tweets/:tweetId`
- Update `SearchResultsProps` success variant to include `tweetThreads: TweetThreadBundle[]`

**Update `src/pages/Search/SearchPage.tsx`**:
- Pass `tweetThreads: result.data?.tweetThreads ?? []` to `SearchResults`

---

## Phase 8: Routes

**Update `src/App.tsx`**:
```typescript
<Route path="/tweets/:threadId" element={<Suspense fallback={<LoadingIndicator />}><TweetPage /></Suspense>} />
<Route path="/tweets/:threadId/tweets/:tweetId" element={<TweetDetailPage />} />
```

---

## Phase 9: Tests

Follow existing patterns (`vi.mock`, `renderHook`, `QueryClientProvider + MemoryRouter`):

- `src/api/tweetService.test.ts` — mock httpClient/sseClient, test mapping and service methods
- `src/pages/Home/TweetList.test.tsx` — renders list, calls onThreadClick
- `src/pages/Home/HomePage.test.tsx` — update to cover tweets tab
- `src/pages/Tweet/TweetPage.test.tsx` — mock tweetService.getTweetThread
- `src/pages/Tweet/useStreamedDetailedTweet.test.ts` — renderHook, mock SSE handlers
- `src/pages/Upload/UploadPage.test.tsx` — update to cover tweet mode
- `src/pages/Random/RandomPage.test.tsx` — update to cover tweet_thread source type
- `src/pages/Search/SearchResults.test.tsx` — update to cover TweetsSection

---

## Critical Files

**New files:**
- `src/models/tweet.ts`
- `src/api/tweetService.ts`
- `src/pages/Home/TweetList.tsx`
- `src/pages/Tweet/TweetPage.tsx`
- `src/pages/Tweet/TweetDetailPage.tsx`
- `src/pages/Tweet/TweetDescription.tsx`
- `src/pages/Tweet/useStreamedDetailedTweet.ts`

**Modified files:**
- `src/models/random.ts` — extend Source/Content unions
- `src/models/searchResult.ts` — add tweetThreads
- `src/models/mappers.ts` — add tweet mappers
- `src/models/index.ts` — export new types
- `src/api/randomService.ts` — handle tweet_thread type
- `src/api/searchService.ts` — map tweet_threads
- `src/api/index.ts` — export tweetService
- `src/pages/Home/HomePage.tsx` — add tweets tab
- `src/pages/Upload/UploadPage.tsx` — add tweet mode
- `src/pages/Random/RandomPage.tsx` — add tweet_thread branch
- `src/pages/Search/SearchResults.tsx` — add TweetsSection
- `src/pages/Search/SearchPage.tsx` — pass tweetThreads
- `src/App.tsx` — add tweet routes

**Reference implementations to mirror:**
- `src/api/urlService.ts` → `tweetService.ts`
- `src/pages/Url/UrlPage.tsx` → `TweetPage.tsx`
- `src/pages/Chunk/ChunkPage.tsx` + `useStreamedDetailedChunk.ts` → `TweetDetailPage.tsx` + `useStreamedDetailedTweet.ts`
- `src/pages/Home/UrlList.tsx` → `TweetList.tsx`
- `src/pages/Chunk/ChunkDescription.tsx` → `TweetDescription.tsx`

---

## Verification

1. `npm run check && npm run test:run` — all existing tests pass, new tests pass
2. Start dev server (`npm run dev`) with backend running
3. Upload page: add tweet tab, enter a tweet URL, confirm ingestion → toast + redirect to home
4. Home page: Tweets tab shows ingested threads with author/count
5. Tweet thread page (`/tweets/:id`): shows all tweets in thread
6. Tweet detail page (`/tweets/:id/tweets/:tweetId`): streams AI context
7. Random page (`/random`): occasionally shows a tweet with proper rendering
8. Search page: search results include a "From Tweets" section when tweets match
9. Run E2E: `npm run test:e2e`
