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
httpClient → urlsService (transform data) → query hooks → components
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

**Location**: `src/api/urlsService.ts` (new file - rename current urlService)

The current `urlService.ts` will be renamed to `urlsService.ts` for consistency with `booksService.ts` and `notesService.ts`.

```typescript
// API response interfaces (snake_case from backend)
interface UrlApiResponse {
  id: string;
  url: string;
  title: string;
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
  STREAM_RANDOM: "/urls/random",                    // SSE: Stream random chunk (optional)
} as const;
```

**Methods**:
```typescript
class UrlsService {
  async getUrls(): Promise<ApiResponse<Url[]>>
  async uploadUrl(url: string): Promise<ApiResponse<{ success: boolean }>>  // existing
  async getChunksFromUrl(urlId: string): Promise<ApiResponse<UrlChunkBundle>>
  getStreamedChunk(urlId: string, chunkId: string, handlers: StreamHandlers): EventSource
  getStreamedRandomChunk(handlers: StreamHandlers): EventSource  // optional
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

**Export**: Update `src/api/index.ts` to export `urlsService`

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
│ Uploaded: Jan 5, 2026           │
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

#### 3.4 RandomChunkPage (optional)
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
    const eventSource = urlsService.getStreamedChunk(urlId, chunkId, {
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

1. **Service tests** (`urlsService.test.ts`):
   - Mock httpClient requests
   - Test data transformation (snake_case → camelCase)
   - Test SSE stream handler setup

2. **Component tests**:
   - Mock urlsService methods
   - Test rendering with data
   - Test user interactions (clicks, navigation)
   - Test loading/error states

3. **Integration tests** (E2E with Playwright):
   - Upload URL flow
   - Browse URLs → View chunks → View chunk detail
   - Random chunk navigation
   - Search for chunk content

### 9. Error Handling

Follow existing patterns:
- `ApiError` for all API errors
- Error boundaries at route level
- Toast notifications for user-facing errors
- Retry buttons in error states

### 10. Migration & Backward Compatibility

**No breaking changes needed** - this is additive functionality.

**Deployment considerations**:
- Frontend can deploy before backend if new endpoints return 404 (graceful degradation)
- Add feature flag if gradual rollout needed

## Implementation Phases

### Phase 1: Core Data & API Layer
- [ ] Create URL data models (`src/models/url.ts`)
- [ ] Rename `urlService.ts` to `urlsService.ts`
- [ ] Implement `UrlsService` with all methods (list, chunks, streaming)
- [ ] Add unit tests for service layer
- [ ] Update `src/api/index.ts` and `src/models/index.ts` exports

### Phase 2: URL Listing & Detail
- [ ] Create `UrlList` and `UrlItem` components
- [ ] Update `HomePage` to show URLs alongside books (tabs/toggle)
- [ ] Create `UrlPage` with `ChunkList` and `ChunkItem`
- [ ] Add routes for `/urls/:urlId`
- [ ] Update `UploadPage` to navigate to URLs page after upload
- [ ] Write component tests

### Phase 3: Chunk Detail & Streaming
- [ ] Create `ChunkPage` with SSE streaming
- [ ] Implement `useStreamedDetailedChunk` hook
- [ ] Create `ChunkDescription` component
- [ ] Add route for `/urls/:urlId/chunks/:chunkId`
- [ ] Test streaming functionality
- [ ] Write component and integration tests

### Phase 4: Search & Navigation
- [ ] Update search models to include chunk results
- [ ] Update `SearchPage` to display and link to chunks
- [ ] Add random chunk page (`/urls/random`)
- [ ] Update navigation/header with URL links
- [ ] Write E2E tests for full flow

### Phase 5: Polish & Documentation
- [ ] Error handling and loading states
- [ ] Accessibility review (ARIA labels, keyboard navigation)
- [ ] Update CLAUDE.md with URL patterns
- [ ] Update README with URL feature description
- [ ] Final E2E test coverage

## Open Questions & Assumptions

1. **Backend API contract**: Assumes backend will provide endpoints matching the specification above. May need coordination with backend team.

2. **Chunking strategy**: How does the backend chunk URLs? By paragraph, token count, semantic meaning? This affects how we display chunks.

3. **URL deduplication**: Should uploading the same URL twice create a new entry or update existing? Affects upload flow and user messaging.

4. **Chunk ordering**: Are chunks ordered by position in the original document? Should we show chunk numbers/positions?

5. **URL metadata**: What additional metadata should we display? (domain, upload date, word count, number of chunks?)

6. **Random chunk scope**: Should "random chunk" pull from all URLs or just user's uploads (if auth added later)?

7. **Search ranking**: Should chunk results be mixed with note results or separated in search?

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
