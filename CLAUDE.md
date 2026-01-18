# CLAUDE.md

Guidance for Claude Code when working with this **Kindle Notes Frontend** (React 19 + TypeScript + Vite).

## Commands

```bash
npm run dev               # Dev server
npm run build             # Production build
npm run test              # Tests (watch mode)
npm run test:run          # Tests (CI)
npm run test:coverage     # Tests with coverage
npm run test:e2e          # E2E tests (Playwright)
npm run test:e2e:ui       # E2E tests with Playwright UI
npm run test:e2e:headed   # E2E tests in headed mode (visible browser)
npm run test:e2e:report   # View E2E test HTML report
npm run check             # Biome lint/format check
npm run check:fix         # Auto-fix
```

**After code changes, run:** `npm run check && npm run test:run`

## Architecture

### API Layer Pattern
**Flow**: httpClient → services (transform data) → query hooks → components

**Data Transformation**:
- Backend returns **snake_case**, services transform to **camelCase**
- API response interfaces: `*ApiResponse` (e.g., `KindleNoteApiResponse`)
- Domain models: `Kindle*` (e.g., `KindleNote`)
- Mapping functions in each service handle transformation

**Service Pattern**:
```typescript
class BooksService {
  async getBooks(): Promise<KindleBook[]> { ... }
}
export const booksService = new BooksService();
```
All services: class-based with static instance exports

### SSE Streaming (Real-time Note Context)
**Client**: `src/api/sseClient.ts` - Generic EventSource wrapper with type-safe handlers

**Pattern**:
```typescript
createEventSourceWithHandlers<TEvents>({
  url,
  handlers: {
    eventName: (data: EventType) => { ... },
    error: (error: Error) => { ... }
  }
});
```

**Usage**: Streaming hooks in pages (`useStreamedDetailedNote`, `useStreamedDetailedChunk`, `useStreamedRandomContent`)
- Streaming states: loading → streaming → success | error
- Auto-closes connection on completion/error

**All Streaming Hooks Follow Same Pattern**:
```typescript
type StreamState =
  | { status: "loading" }
  | { status: "streaming"; data: T }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

**Event Handlers**:
- `onMetadata` - Receives initial data, sets status to "streaming"
- `onContextChunk` - Receives streamed content chunks, appends to data
- `onComplete` - Marks streaming complete, sets status to "success"
- `onError` / `onInStreamError` - Error handling

## E2E Testing

**Framework**: Playwright (`@playwright/test`)

**Configuration**:
- Config: `playwright.config.ts`
- Tests: `e2e/tests/*.spec.ts`
- Helpers: `e2e/helpers/test-helpers.ts`
- Base URL: `http://localhost:5173`
- API URL (E2E): Set via `E2E_API_URL` env var (defaults to `http://localhost:8000`)

**Test Execution**:
- Dev server starts automatically before tests
- Tests run in Chromium by default
- Screenshots captured on failure
- Retries: 2 on CI, 0 locally

**Writing E2E Tests**:
```typescript
import { test, expect } from "@playwright/test";

test("test name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading")).toContainText("Expected");
});
```

**Best Practices**:
- Use Playwright's auto-waiting (no manual waits needed)
- Prefer user-facing selectors (getByRole, getByLabel, getByText)
- Test user workflows, not implementation details

## MCP Server Integration

**Playwright MCP Server** (`.mcp.json`):
- Enables browser automation via Claude Code
- Command: `npx -y @playwright/mcp@latest`
- Config: `e2e/playwright-mcp.config.json`
- Use for manual UI testing and debugging with Claude

**Configuration**:
- Browser: Chromium (non-headless by default for visibility)
- Viewport: 1280x720
- Base URL: `http://localhost:5173`
- Capabilities: Screenshots, downloads (no videos)
- Allowed hosts: localhost, 127.0.0.1

## Routes

All routes defined in `src/App.tsx` with Suspense + Error Boundary:

- `/` - Home (book list + URL list)
- `/books/:bookId` - Book detail with notes list
- `/books/:bookId/notes/:noteId` - Single note with streaming context
- `/urls/:urlId` - URL detail with chunks list
- `/urls/:urlId/chunks/:chunkId` - Single chunk with streaming context
- `/random` - Random note or chunk with streaming context
- `/search` - Search across books and URLs
- `/upload` - Upload Kindle notes file

## API

**Base URL**: `VITE_API_URL` env var

**Query Hooks**:
- `useApiSuspenseQuery<T>` - Pages (auto loading/error)
- `useApiQuery<T>` - SearchPage (with `enabled` option)
- `useApiMutation<T, P>` - File upload

**Services**:
- All services in `src/api/*Service.ts` (import from `src/api`)
- `booksService` - Book upload, retrieval
- `notesService` - Note details (SSE streaming)
- `urlService` - URL management and chunk retrieval
- `randomService` - Random content (SSE streaming)
- `searchService` - Search across books and URLs
- Services encapsulate API calls and data transformation

**Error Handling**:
- Custom `ApiError` class (message + status code)
- `ErrorFallback` component with retry button
- Mutations accept `onError` callback

## Environment Variables

**Required**:
- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8000`)

**E2E Testing**:
- `E2E_API_URL` - API URL for E2E tests (overrides default in `playwright.config.ts`)

## TypeScript

**Naming Conventions**:
- Props: Interface suffix `Props` (e.g., `FileDropZoneProps`)
- Domain models: `KindleBook`, `KindleNote`, `KindleUrl`, `KindleChunk`, `RandomContent`, `SearchResult`
- Detailed models: `KindleDetailedNote`, `KindleDetailedChunk` (with streaming context)
- API responses: `*ApiResponse` (snake_case fields, e.g., `KindleNoteApiResponse`)
- Generics: `useApiQuery<T>`, `useApiMutation<T, P>`

## Testing

**Test Wrapper Pattern**:
```typescript
<QueryClientProvider client={queryClient}>
  <MemoryRouter initialEntries={["/"]}>
    {children}
  </MemoryRouter>
</QueryClientProvider>
```

**Mocking Patterns**:
```typescript
// Services
vi.mock("src/api/booksService");
vi.mocked(booksService.getBooks).mockResolvedValue([...]);

// Partial module mocks
vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return { ...actual, booksService: { uploadBook: vi.fn() } };
});

// Hooks
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});
```

**Testing Hooks**: Use `renderHook()` with QueryClientProvider wrapper

**Focus**: Test behavior and logic, NOT styles or implementation details

## UI & Styling

**CSS Framework**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- Utility-first approach
- Dark theme by default (zinc-900, zinc-800 backgrounds)
- Mobile-first responsive design

**Components**:
- Custom components in `src/components/` built with Tailwind (no component library)
- Toast notifications: `react-hot-toast` (positioned bottom-right)
- Markdown rendering: `react-markdown` for note/chunk content display

## Patterns

**State Management**:
- Server state: React Query
- Local state: React hooks (useState, useEffect)
- No Redux/Context

**Error Handling**:
- `ApiError` class for all API errors
- Error boundaries at app level
- Toast notifications for user-facing errors
- Form validation in components (FileDropZone, SearchPage)

**Accessibility**:
- Semantic HTML (header, main, nav)
- `role` and `aria-label` on interactive elements
- Alt text on icons

## Quick Reference

### Add New API Endpoint
1. Create service method in `src/api/*Service.ts`
2. Define `*ApiResponse` interface + mapping function
3. Export from `src/api/index.ts`
4. Use `useApiSuspenseQuery<T>` or `useApiQuery<T>` in components

### Add New Page
1. Create component in `src/pages/[Feature]/`
2. Wrap content with Suspense + LoadingIndicator
3. Add route in App.tsx
4. Export from `src/pages/index.ts`

### Write Tests
1. Create `.test.tsx` in same directory as component
2. Use TestWrapper with QueryClientProvider + MemoryRouter
3. Mock services with `vi.mock()` + `vi.mocked()`
4. Test user behavior with `userEvent` and `screen` queries

### Add SSE Streaming Hook
1. Create hook in `src/pages/[Feature]/useStreamed*.ts`
2. Define `StreamState` union type (loading | streaming | success | error)
3. Implement handlers object:
   - `onMetadata` - Receives initial data, sets status to "streaming"
   - `onContextChunk` - Receives chunks, appends to data.additionalContext
   - `onComplete` - Sets status to "success"
   - `onError` / `onInStreamError` - Error handling
4. Call service method with handlers, return EventSource
5. Clean up EventSource in useEffect cleanup function
6. Return state object

### Debug SSE Streaming
1. Check event names match backend in sseClient handlers
2. Verify JSON parsing in createEventSourceWithHandlers
3. Check Network tab in DevTools for EventSource connection
4. Verify handler callbacks fire in correct order
5. Ensure cleanup function closes EventSource on unmount
