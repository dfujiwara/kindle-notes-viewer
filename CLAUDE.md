# CLAUDE.md

Guidance for Claude Code when working with this **Kindle Notes Frontend** (React 19 + TypeScript + Vite).

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run test         # Tests (watch mode)
npm run test:run     # Tests (CI)
npm run check        # Biome lint/format check
npm run check:fix    # Auto-fix
```

**After code changes, run:** `npm run check && npm run test:run`

## Architecture

**API Convention**: Backend returns snake_case, services transform to camelCase

**API Layer**: httpClient → services (transform data) → query hooks

## Routes

- `/` - Book listing
- `/books/:bookId` - Book notes
- `/books/:bookId/notes/:noteId` - Detailed note
- `/random` - Random note
- `/search` - Search (min 3 chars)
- `/upload` - File upload (drag-and-drop)

All routes: Suspense + Error Boundary

## API

**Base URL**: `VITE_API_URL` env var

**Query Hooks**:
- `useApiSuspenseQuery<T>` - Pages (auto loading/error)
- `useApiQuery<T>` - SearchPage (with `enabled`)
- `useApiMutation<T, P>` - File upload

## Patterns

**Code Style**: Biome (2-space indentation, double quotes)
**State**: React Query for server state, React hooks for client state
**API Layer**: httpClient → services (transform data) → query hooks
**Components**: Functional, TypeScript, composition, single responsibility
**Testing**: Test logic/behavior, NOT styles. Use `*.test.tsx`/`*.test.ts`
