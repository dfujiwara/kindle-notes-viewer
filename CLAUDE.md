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
npm run check             # Biome lint/format check
npm run check:fix         # Auto-fix
```

**After code changes, run:** `npm run check && npm run test:run && npm run build`

## Architecture

### API Layer
**Flow**: httpClient → services (transform data) → query hooks → components

- Backend returns **snake_case**, services transform to **camelCase**
- API response interfaces: `*ApiResponse` (e.g., `KindleNoteApiResponse`)
- Domain models: `Kindle*` (e.g., `KindleNote`) — detailed variants: `KindleDetailedNote`, `KindleDetailedChunk`
- All services are class-based with singleton exports: `export const booksService = new BooksService()`
- Services in `src/api/*Service.ts`, import from `src/api`

**Query Hooks**:
- `useApiSuspenseQuery<T>` - Pages (auto loading/error)
- `useApiQuery<T>` - SearchPage (with `enabled` option)
- `useApiMutation<T, P>` - File upload

**Error Handling**: Custom `ApiError` class (message + status code), `ErrorFallback` with retry, mutations accept `onError` callback

### SSE Streaming
**Client**: `src/api/sseClient.ts` - Generic EventSource wrapper with type-safe handlers

**Pattern**: loading → streaming → success | error. Auto-closes on completion/error. See `src/pages/*/useStreamed*.ts` for examples.

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8000`)
- `E2E_API_URL` - API URL for E2E tests (overrides default in `playwright.config.ts`)

## Testing

- **Unit/integration**: See existing `*.test.tsx` files for wrapper and mock patterns
- **E2E**: Playwright — see [e2e/README.md](e2e/README.md)
- **Browser automation**: Playwright MCP Server — see [MCP_SETUP.md](MCP_SETUP.md)
- Test behavior and logic, NOT styles or implementation details

## Debug SSE Streaming

1. Check event names match backend in sseClient handlers
2. Verify JSON parsing in `createEventSourceWithHandlers`
3. Check Network tab for EventSource connection
4. Verify handler callbacks fire in correct order
5. Ensure cleanup closes EventSource on unmount
