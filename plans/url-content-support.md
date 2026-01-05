# URL Content Support Implementation Plan

## Overview

This plan outlines the implementation of URL content support in the Kindle Notes Viewer application. URLs will be treated analogously to books, and URL chunks will be treated analogously to notes. This will allow users to upload URLs, view chunked content extracted from those URLs, and interact with that content using the same patterns established for Kindle books and notes.

## Current State (url_upload branch)

The `url_upload` branch already implements:
- URL upload functionality via `UrlService.uploadUrl()`
- `UrlInputZone` component for URL input with validation
- Mode toggle in `UploadPage` to switch between file and URL upload
- URL validation utility in `src/utils/validation.ts`

**Gap**: The uploaded URLs have no viewing/browsing interface. Users can upload URLs but cannot see them or their extracted chunks.

## Architecture Overview

Following the established pattern:

```
URLs (analogous to Books)
  └── URL Chunks (analogous to Notes)
```

**Data Flow**:
```
httpClient → urlService (transform data) → query hooks → components
Backend: snake_case → Frontend: camelCase
```

## Implementation Plan

### 1. Data Models

**Location**: `src/models/url.ts` (new file)

```typescript
// URL represents the source document (like KindleBook)
export interface Url {
  id: string;
  url: string;          // The original URL
  title: string;        // Extracted page title
  chunkCount: number;   // Number of chunks extracted
  createdAt: string;    // When it was uploaded
}

// URL Chunk represents extracted content (like KindleNote)
export interface UrlChunk {
  id: string;
  content: string;      // The chunk text
  createdAt: string;
}

// Bundle of URL with its chunks (like KindleNoteBundle)
export interface UrlChunkBundle {
  url: Url;
  chunks: UrlChunk[];
}

// Detailed chunk with context (like KindleDetailedNote)
export interface UrlDetailedChunk {
  url: Url;
  chunk: UrlChunk;
  additionalContext: string;
  relatedChunks: UrlChunk[];
}
```

**Export**: Update `src/models/index.ts` to export URL types

### 2. API Service Layer

**Location**: `src/api/urlService.ts` (existing file - will be updated)

The current `urlService.ts` will be updated with new methods for listing URLs and fetching chunks.

```typescript
// API response interfaces (snake_case from backend)
interface UrlApiResponse {
  id: string;
  url: string;
  title: string;
  chunk_count: number;
  created_at: string;
}

interface UrlChunkApiResponse {
  id: string;
  content: string;
  created_at: string;
}

interface UrlChunkBundleApiResponse {
  url: UrlApiResponse;
  chunks: UrlChunkApiResponse[];
}

interface UrlInitialChunkApiResponse {
  url: UrlApiResponse;
  chunk: UrlChunkApiResponse;
  related_chunks: UrlChunkApiResponse[];
}

// Mapping functions
const mapUrl = (apiUrl: UrlApiResponse): Url => ({ ... });
const mapChunk = (apiChunk: UrlChunkApiResponse): UrlChunk => ({ ... });
const mapChunkBundle = (apiBundle: UrlChunkBundleApiResponse): UrlChunkBundle => ({ ... });
const mapInitialDetailedChunk = (apiChunk: UrlInitialChunkApiResponse): UrlDetailedChunk => ({ ... });
```

**Endpoints**:
```typescript
const ENDPOINTS = {
  LIST: "/urls",                                    // GET: List all URLs
  UPLOAD: "/urls",                                  // POST: Upload URL (existing)
  CHUNKS: (urlId: string) => `/urls/${urlId}/chunks`,   // GET: Get chunks for URL
  STREAM_CHUNK: (urlId: string, chunkId: string) =>
    `/urls/${urlId}/chunks/${chunkId}`,             // SSE: Stream chunk with context
  STREAM_RANDOM: "/urls/random",                    // SSE: Stream random chunk
} as const;
```

**Methods**:
```typescript
class UrlService {
  async getUrls(): Promise<ApiResponse<Url[]>>
  async uploadUrl(url: string): Promise<ApiResponse<{ success: boolean }>>  // existing
  async getChunksFromUrl(urlId: string): Promise<ApiResponse<UrlChunkBundle>>
  getStreamedChunk(urlId: string, chunkId: string, handlers: StreamHandlers): EventSource
  getStreamedRandomChunk(handlers: StreamHandlers): EventSource
}
```

**SSE Stream Events** (similar to notes):
```typescript
type ChunkStreamEvents = {
  metadata: UrlInitialChunkApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};
```

**Export**: Update `src/api/index.ts` to export `urlService`

### 3. Pages

#### 3.1 Update HomePage
**Location**: `src/pages/Home/HomePage.tsx`

**Changes**:
- Add tabs/toggle to switch between "Books" and "URLs" view
- Fetch and display both books and URLs
- Create `UrlList` component (mirror of `BookList`)
- Create `UrlItem` component (mirror of `BookItem`)

**Components to create**:
- `src/pages/Home/UrlList.tsx` - Displays list of URLs
- `src/pages/Home/UrlList.test.tsx`
- `src/pages/Home/UrlItem.tsx` - Individual URL card
- `src/pages/Home/UrlItem.test.tsx`

**URL Item Display**:
```
┌─────────────────────────────────┐
│ Page Title                       │
│ https://example.com/article      │
│ 15 chunks • Jan 5, 2026         │
└─────────────────────────────────┘
```

#### 3.2 UrlPage (new)
**Location**: `src/pages/Url/UrlPage.tsx` (new directory)

**Purpose**: Display a specific URL's metadata and all its chunks (mirror of `BookPage`)

**Route**: `/urls/:urlId`

**Components to create**:
- `src/pages/Url/UrlPage.tsx` - Main page component
- `src/pages/Url/UrlDescription.tsx` - Display URL metadata
- `src/pages/Url/ChunkList.tsx` - List all chunks from the URL
- `src/pages/Url/ChunkItem.tsx` - Individual chunk preview
- Tests for all components

**ChunkList Display** (similar to NoteList):
```
┌─────────────────────────────────────────┐
│ Chunk 1                                  │
│ This is the first chunk of content...   │
│ Jan 5, 2026                             │
├─────────────────────────────────────────┤
│ Chunk 2                                  │
│ This is the second chunk...             │
│ Jan 5, 2026                             │
└─────────────────────────────────────────┘
```

#### 3.3 ChunkPage (new)
**Location**: `src/pages/Chunk/ChunkPage.tsx` (new directory)

**Purpose**: Display a specific chunk with AI-generated context and related chunks (mirror of `NotePage`)

**Route**: `/urls/:urlId/chunks/:chunkId`

**Components to create**:
- `src/pages/Chunk/ChunkPage.tsx` - Main page with SSE streaming
- `src/pages/Chunk/ChunkDescription.tsx` - Display chunk with context
- Tests for components

**Features**:
- Use `useStreamedDetailedChunk()` hook (new)
- Display streaming states (loading → streaming → success | error)
- Show chunk content, AI context, and related chunks
- Link to original URL and other chunks

#### 3.4 RandomChunkPage
**Location**: `src/pages/Chunk/RandomChunkPage.tsx`

**Purpose**: Display a random URL chunk (mirror of `RandomNotePage`)

**Route**: `/urls/random`

**Implementation**: Similar to `RandomNotePage` but for URL chunks

### 4. Query Hooks

**Location**: Create hooks in components that need them (following existing pattern)

```typescript
// In UrlPage.tsx or a shared hooks file
const useStreamedDetailedChunk = (urlId: string, chunkId: string) => {
  const [state, setState] = useState<StreamState>({
    status: 'loading',
    data: null,
    error: null,
  });

  useEffect(() => {
    const eventSource = urlService.getStreamedChunk(urlId, chunkId, {
      onMetadata: (chunk) => { ... },
      onContextChunk: (content) => { ... },
      onComplete: () => { ... },
      onInStreamError: () => { ... },
      onError: (error) => { ... },
    });

    return () => eventSource.close();
  }, [urlId, chunkId]);

  return state;
};
```

### 5. Routing

**Location**: `src/App.tsx`

**New Routes**:
```typescript
<Route
  path="/urls/:urlId"
  element={
    <Suspense fallback={<LoadingIndicator />}>
      <UrlPage />
    </Suspense>
  }
/>
<Route
  path="/urls/:urlId/chunks/:chunkId"
  element={
    <Suspense fallback={<LoadingIndicator />}>
      <ChunkPage />
    </Suspense>
  }
/>
<Route
  path="/urls/random"
  element={<RandomChunkPage />}
/>
```

**Update exports**: `src/pages/index.ts`

### 6. Navigation Updates

**Location**: `src/components/Header.tsx` (if exists) or navigation component

**Changes**:
- Add link to URLs section (if home page doesn't have tabs)
- Add "Random URL Chunk" option to match "Random Note"

### 7. Search Integration

**Location**: `src/api/searchService.ts` and `src/pages/Search/SearchPage.tsx`

**Backend assumption**: Search API should return both note results and chunk results

**Changes**:
```typescript
// Update SearchResult model
interface SearchResult {
  type: 'note' | 'chunk';  // Add type discriminator
  // ... existing fields
  // For chunks:
  urlId?: string;
  chunkId?: string;
}
```

**Display**: Update `SearchResults` component to handle both types and link appropriately

### 8. Testing Strategy

For each new component/service:

1. **Service tests** (`urlService.test.ts`):
   - Mock httpClient requests
   - Test data transformation (snake_case → camelCase)
   - Test SSE stream handler setup

2. **Component tests**:
   - Mock urlService methods
   - Test rendering with data
   - Test user interactions (clicks, navigation)
   - Test loading/error states

3. **Integration tests** (E2E with Playwright):
   - Upload URL flow
   - Browse URLs → View chunks → View chunk detail
   - Random chunk navigation
   - Search for chunk content

### 9. Error Handling

**Strategy**: Show specific error messages when backend provides them, with user-friendly fallbacks.

**URL Upload Error Messages**:
- "Invalid URL format. Please enter a valid URL starting with http:// or https://"
- "Unable to reach URL. Please check the URL and try again."
- "Failed to extract content from this page. The site may require authentication or block automated access."
- "This content type is not supported. Please try a different URL."
- "Request timeout. The page took too long to load."
- Generic fallback: "Failed to process URL. Please try again or contact support."

**Implementation Approach**:
1. **Client-side validation**: Validate URL format before upload (basic regex check)
2. **Backend errors**: Display `error.message` from API response when specific
3. **Fallback**: Show generic helpful message if backend doesn't provide details
4. **UI**: Display errors as toast notifications (following existing file upload pattern)

**General Error Handling** (follows existing patterns):
- `ApiError` for all API errors
- Error boundaries at route level
- Toast notifications for user-facing errors
- Retry buttons in error states

### 10. Migration & Backward Compatibility

**No breaking changes needed** - this is additive functionality.

**Deployment considerations**:
- Frontend can deploy before backend if new endpoints return 404 (graceful degradation)
- Add feature flag if gradual rollout needed

## Implementation Phases (Step-by-Step)

**Approach**: Implement incrementally, testing at each step before moving forward.

### Step 1: API Layer Foundation ✅
**Purpose**: Set up all data models, services, and query hooks

- [x] Create URL data models in `src/models/url.ts`
  - `Url`, `UrlChunk`, `UrlChunkBundle`, `UrlDetailedChunk`
- [x] Update existing `urlService.ts` with new methods
  - `getUrls()`, `getChunksFromUrl()`, `getStreamedChunk()`, `getStreamedRandomChunk()`
  - Add API response interfaces and mapping functions
  - Added `isSummary` field to `UrlChunk` for distinguishing summary chunks
  - Simplified CHUNKS endpoint to `/urls/:id` (from `/urls/:id/chunks`)
- [x] Create query hooks for URL data fetching
  - Using existing generic hooks (useApiSuspenseQuery, useApiQuery)
- [x] Add unit tests for service layer
  - 6 comprehensive tests covering all service methods
  - Tests verify snake_case → camelCase transformation
  - SSE streaming handler tests included
- [x] Update `src/api/index.ts` and `src/models/index.ts` exports
- [x] Run checks: `npm run check && npm run test:run`
  - All 94 tests passing
  - No lint/format issues

### Step 2: URL List Page ✅
**Purpose**: Allow users to view all uploaded URLs

- [x] Create `UrlList` component in `src/pages/Home/`
  - Display grid of URL cards
  - Use query hook to fetch URLs
  - Responsive grid layout: 1→2→3 columns (mobile→tablet→desktop)
  - Empty state handling with centered message
- [x] Create `UrlItem` component
  - Display: title, URL, chunk count, upload date
  - Link to URL detail page via onClick callback
  - Card styling following BookItem pattern
  - Singular/plural chunk count handling
- [x] Write component tests for UrlList and UrlItem
  - UrlList: 5 tests (render, empty state, click, count, single item)
  - UrlItem: 4 tests (render, singular chunk, click, optional callback)
- [x] Temporarily add to HomePage for testing (before tabs)
  - HomePage now shows both "Books" and "URLs" sections
  - Each section has heading and list component
  - Both sections use useApiSuspenseQuery for data fetching
- [x] Run checks: `npm run check && npm run test:run`
  - All 103 tests passing
  - No lint/format issues

### Step 3: URL Detail Page with Streaming
**Purpose**: Display URL chunks with SSE streaming for detailed view

- [ ] Create `UrlPage` component in `src/pages/Url/`
  - Display URL metadata (UrlDescription component)
  - List all chunks (ChunkList component)
- [ ] Create `ChunkPage` component in `src/pages/Chunk/`
  - Implement `useStreamedDetailedChunk` hook
  - Display streaming states (loading → streaming → success | error)
  - Show chunk content, AI context, related chunks
- [ ] Add routes in `App.tsx`:
  - `/urls/:urlId`
  - `/urls/:urlId/chunks/:chunkId`
- [ ] Write component tests
- [ ] Test SSE streaming functionality manually
- [ ] Run checks: `npm run check && npm run test:run`

### Step 4: Home Page Tabs
**Purpose**: Organize Books and URLs into separate tabbed views

- [ ] Add tab navigation to `HomePage`
  - Tab 1: "Books" (existing BookList)
  - Tab 2: "URLs" (new UrlList)
- [ ] Implement tab state management
- [ ] Ensure proper keyboard navigation and accessibility
- [ ] Write tests for tab switching behavior
- [ ] Run checks: `npm run check && npm run test:run`

### Step 5: Random Chunk Feature
**Purpose**: Allow users to discover random URL chunks

- [ ] Create `RandomChunkPage` component in `src/pages/Chunk/`
  - Mirror `RandomNotePage` pattern
  - Use `getStreamedRandomChunk()` service method
- [ ] Add route: `/urls/random`
- [ ] Add navigation link (Header or similar)
- [ ] Write component tests
- [ ] Run checks: `npm run check && npm run test:run`

### Step 6: Search Integration
**Purpose**: Include URL chunks in search results

- [ ] Update search types to include chunk results
  - Add `type: 'note' | 'chunk'` discriminator
  - Add chunk-specific fields (`urlId`, `chunkId`)
- [ ] Update `SearchPage` to display both notes and chunks
  - Render different components based on type
  - Link to chunk detail pages
- [ ] Update searchService mapping functions
- [ ] Write tests for mixed search results
- [ ] Run checks: `npm run check && npm run test:run`

### Step 7: Polish & Final Testing
**Purpose**: Ensure production readiness

- [ ] Review all error handling and loading states
- [ ] Accessibility audit (ARIA labels, keyboard navigation, focus management)
- [ ] Update CLAUDE.md with URL patterns and architecture
- [ ] Manual testing of full user flows:
  - Upload URL → View in list → View chunks → View chunk detail
  - Random chunk navigation
  - Search for chunk content
- [ ] Final checks: `npm run check && npm run test:run`
- [ ] Commit and push to feature branch

## Implementation Decisions

### Resolved Questions

1. **Backend API Status**: ✅ All backend endpoints exist, including SSE endpoints. Event structure matches the existing notes pattern (`metadata`, `context_chunk`, `context_complete`, `error`).

2. **URL Deduplication**: ✅ Handled by the backend `/urls` POST endpoint automatically.

3. **Chunk Display**:
   - ✅ Chunks are ordered by position in the original document
   - ✅ No chunk numbers needed initially (can add later if requested)
   - ✅ URL cards display: title, URL, chunk count, upload date

4. **Home Page Navigation**: ✅ Implement tabs to switch between "Books" and "URLs" views.

5. **Search Integration**: ✅ Backend API response will include both notes and chunks in a single response. Frontend will display both result types together.

6. **Random Chunk Feature**: ✅ Must-have feature (not optional).

7. **Service Naming**: ✅ Keep as `urlService.ts` (not `urlsService.ts`).

8. **Testing Strategy**: ✅ Focus on unit/component tests initially. E2E Playwright tests will be addressed later.

### Phase 1 Implementation Notes (Completed 2026-01-05)

**Data Model Refinements**:
- Added `isSummary: boolean` field to `UrlChunk` to distinguish summary chunks from content chunks
- This allows future UI enhancements (e.g., highlighting summaries, filtering)

**API Endpoint Simplification**:
- Simplified CHUNKS endpoint from `/urls/:urlId/chunks` to `/urls/:urlId`
- More RESTful and cleaner API design

**Testing Improvements**:
- Moved logger mock to global test setup (`src/test/setup.ts`)
- All future test files automatically benefit from logger mocking
- Removed redundant/unnecessary test cases (empty array handling, missing fields)
- Final test suite: 6 focused tests covering all service methods and edge cases

**Code Quality**:
- All snake_case → camelCase transformations properly tested
- SSE streaming handlers tested for both specific chunk and random chunk endpoints
- No defensive null handling needed (backend contract guarantees field presence)

### Phase 2 Implementation Notes (Completed 2026-01-05)

**Component Architecture**:
- Followed existing BookList/BookItem pattern exactly for consistency
- UrlItem and UrlList mirror their book counterparts in structure and styling
- All components use semantic HTML (`<button>` instead of `<div>` for clickable items)

**UI/UX Design**:
- Responsive grid layout with Tailwind classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Card styling matches BookItem: `bg-zinc-800 border border-zinc-700 rounded-lg`
- URL display includes: title (line-clamp-2), URL (line-clamp-1), chunk count with singular/plural, formatted date
- Empty state shows centered "No URLs Found" message matching books pattern

**HomePage Integration**:
- Temporarily displays both "Books" and "URLs" sections vertically
- Each section has a heading and uses `useApiSuspenseQuery` for data fetching
- Navigation handled at page level via onClick callbacks (not in list components)
- Will be replaced with tabbed interface in Step 4

**Testing Coverage**:
- 9 new tests added (4 for UrlItem, 5 for UrlList)
- All tests follow existing patterns (mocking, userEvent, assertions)
- Updated App.test.tsx to mock urlService.getUrls() to prevent failures
- Total project tests: 103 (all passing)

**Files Created**:
- `src/pages/Home/UrlList.tsx` (16 lines)
- `src/pages/Home/UrlList.test.tsx` (48 lines)
- `src/pages/Home/UrlItem.tsx` (33 lines)
- `src/pages/Home/UrlItem.test.tsx` (42 lines)

**Files Modified**:
- `src/pages/Home/HomePage.tsx` - Added URLs section with urlService query
- `src/App.test.tsx` - Added urlService mock

### Open Questions

None remaining - all decisions made.

## Success Criteria

- [ ] Users can view all uploaded URLs on the home page
- [ ] Users can click a URL to see all its chunks
- [ ] Users can click a chunk to see it with AI-generated context
- [ ] SSE streaming works for chunk context (smooth loading experience)
- [ ] Search includes URL chunks in results
- [ ] Random chunk feature works
- [ ] All tests pass (unit, component, E2E)
- [ ] No regression in existing book/note functionality
- [ ] Performance is acceptable (page loads < 1s, streaming feels instant)
- [ ] Code follows established patterns (service layer, camelCase, error handling)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API not ready | High - blocks all development | Create mock endpoints for local dev, coordinate early with backend |
| SSE streaming differs from notes | Medium - need rework | Review backend SSE implementation before starting Phase 3 |
| Search integration complex | Medium - delayed search feature | Implement search last (Phase 4), can launch without it |
| Performance issues with many URLs/chunks | Low - user experience | Implement pagination if needed, lazy loading for large lists |
| Inconsistent naming (URL vs urls) | Low - code clarity | Establish convention early: "URL" for display, "urls" for routes/APIs |

## Future Enhancements (Out of Scope)

- URL categorization/tagging
- Bulk URL upload (paste multiple URLs)
- URL refresh/re-scrape functionality
- Export URL chunks to various formats
- URL collection sharing
- Browser extension for one-click URL upload
- PDF/document URL support (not just web pages)
