# Tweet Ingestion Frontend - Implementation Plan

> **Status: COMPLETE** (as of 2026-04-04) — All phases implemented and tests passing.

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

## Phase 1: Models ✅

**`src/models/tweet.ts`** — complete

Domain models (camelCase):
```typescript
TweetThread { id, rootTweetId, authorUsername, authorDisplayName, title, tweetCount, fetchedAt, createdAt }
Tweet { id, tweetId, authorUsername, authorDisplayName, content, mediaUrls, threadId, positionInThread, tweetedAt, createdAt }
TweetThreadBundle { thread: TweetThread, tweets: Tweet[] }
TweetDetailedContent { thread: TweetThread, tweet: Tweet, additionalContext: string, relatedTweets: Tweet[] }
```

**`src/models/random.ts`** — extended with:
```typescript
TweetThreadSource { id, title, type: "tweet_thread", authorUsername, authorDisplayName, rootTweetId, tweetCount, createdAt }
TweetContent { id, contentType: "tweet", content, authorUsername, positionInThread, mediaUrls, tweetedAt, createdAt }
```
`Source` and `Content` unions extended.

**`src/models/searchResult.ts`** — `tweetThreads: TweetThreadBundle[]` added

**`src/models/mappers.ts`** — `mapTweetThreadSourceToThread()`, `mapTweetContentToTweet()`, `mapRelatedItemsToTweets()` added

**`src/models/index.ts`** — all new tweet types exported

---

## Phase 2: Tweet Service ✅

**`src/api/tweetService.ts`** and **`src/api/tweetApiTypes.ts`** — complete

API response interfaces (`TweetThreadApiResponse`, `TweetApiResponse`, `TweetThreadBundleApiResponse`, etc.) live in `tweetApiTypes.ts`. Mapper functions (`mapTweetThread`, `mapTweet`, `mapTweetThreadBundle`) also there.

Service:
```typescript
class TweetService {
  async getTweets(): Promise<ApiResponse<TweetThread[]>>
  async ingestTweet(tweetUrl: string): Promise<ApiResponse<TweetThreadBundle>>
  async getTweetThread(threadId: string): Promise<ApiResponse<TweetThreadBundle>>
  getStreamedTweet(threadId, tweetId, handlers): EventSource
}
export const tweetService = new TweetService();
```

**`src/api/index.ts`** — exports `tweetService`

---

## Phase 3: Home Page — Tweets Tab ✅

**`src/pages/Home/HomePage.tsx`** — `"tweets"` tab added, keyboard nav updated (3-tab cycle)

**`src/pages/Home/TweetList.tsx`** — grid of tweet threads showing title, `@authorUsername`, tweet count, date

---

## Phase 4: Tweet Detail Pages ✅

**`src/pages/Tweet/TweetPage.tsx`** — thread header + tweet list, navigates to detail page

**`src/pages/Tweet/TweetDetailPage.tsx`** — streaming AI context via `useStreamedDetailedTweet`

**`src/pages/Tweet/useStreamedDetailedTweet.ts`** — state machine: `loading` → `streaming` → `success` | `error`

**`src/pages/Tweet/TweetDescription.tsx`** — tweet content, author/position, AI context (markdown), related tweets

---

## Phase 5: Upload Page — Tweet Ingestion ✅

**`src/pages/Upload/UploadPage.tsx`** — `"tweet"` mode added with URL validation (`validateTweetUrl`) and mutation via `tweetService.ingestTweet(url)`

---

## Phase 6: Random Page — Tweet Support ✅

**`src/api/randomApiTypes.ts`** — `TweetThreadSourceApiResponse` and `TweetContentApiResponse` added; `mapSource()` and `mapContent()` handle `tweet_thread` / `tweet`

**`src/pages/Random/RandomPage.tsx`** — `tweet_thread` branch renders `TweetDescription`

---

## Phase 7: Search — Tweet Results ✅

**`src/api/searchService.ts`** — maps `tweet_threads` from API

**`src/pages/Search/SearchResults.tsx`** — `TweetsSection` component added

**`src/pages/Search/SearchPage.tsx`** — passes `tweetThreads` to `SearchResults`

---

## Phase 8: Routes ✅

**`src/App.tsx`**:
```typescript
<Route path="/tweets/:threadId" element={<Suspense fallback={<LoadingIndicator />}><TweetPage /></Suspense>} />
<Route path="/tweets/:threadId/tweets/:tweetId" element={<TweetDetailPage />} />
```

---

## Phase 9: Tests ✅

All test files present and covering tweet functionality:
- `src/api/tweetService.test.ts`
- `src/pages/Home/TweetList.test.tsx`
- `src/pages/Home/HomePage.test.tsx`
- `src/pages/Tweet/TweetPage.test.tsx`
- `src/pages/Tweet/TweetDescription.test.tsx`
- `src/pages/Tweet/useStreamedDetailedTweet.test.ts`
- `src/pages/Upload/UploadPage.test.tsx`
- `src/pages/Random/RandomPage.test.tsx`
- `src/pages/Search/SearchResults.test.tsx`

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
