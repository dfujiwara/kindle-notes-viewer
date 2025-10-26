# CLAUDE.md``

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Kindle Notes Frontend** application built with React 19, TypeScript, and Vite. The project manages Kindle books and notes with a modern React architecture, API layer, and component-based design.

## Development Commands

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run preview      # Preview production build locally
npm run test         # Run tests in watch mode (recommended for development)
npm run test:run     # Run tests once (for CI/scripts)
npm run test:coverage # Run tests with coverage report
npm run check        # Run Biome linting and formatting checks
npm run check:fix    # Run Biome checks with auto-fix
```

## Technology Stack

- **React 19.1.0** with TypeScript
- **React Router 7.8.2** for client-side routing
- **Vite 6.3.5** for build tooling and dev server
- **Vitest 3.2.4** for testing (Vite-native test runner)
- **TanStack React Query 5.81.5** for server state management
- **Tailwind CSS 4.1.11** for styling
- **React Error Boundary 6.0.0** for error handling
- **react-hot-toast 2.6.0** for toast notifications
- **Biome 2.0.4** for linting and formatting
- **Testing Library** for component testing
- **jsdom** for DOM simulation in tests

## Architecture

### Project Structure
```
src/
├── api/          # API layer: httpClient, queries, services (books, notes, search)
├── components/   # Reusable UI components (Header, Footer, FileDropZone, FileUploadControl)
├── pages/        # Page components organized by route (Home, Book, Note, Search, Upload)
├── models/       # TypeScript interfaces (KindleBook, KindleNote, KindleNoteBundle, etc.)
└── test/         # Test setup
```

### Data Models

API returns snake_case but services transform to camelCase for TypeScript:

- **KindleBook**: `{ id, title, author }`
- **KindleNote**: `{ id, content, createdAt }`
- **KindleNoteBundle**: Book with its notes array
- **KindleDetailedNote**: Note with additionalContext and relatedNotes
- **SearchResult**: Query results with count
- **ApiResponse<T>**: Generic API response wrapper

## Code Quality & Linting

Uses **Biome** (2-space indentation, double quotes). **IMPORTANT**: After code changes, always run `npm run check` and `npm run test:run`.

## Testing

Uses **Vitest** with jsdom environment, global test APIs, and Testing Library. Test files: `*.test.tsx` or `*.test.ts`.

**IMPORTANT**: Test component logic and behavior, NOT styles or visual output. Use `npm run test` for watch mode, `npm run test:run` for CI.

## Routing

Uses **React Router v7** with BrowserRouter. Routes configured in [App.tsx](src/App.tsx):

- `/` - Book listing
- `/books/:bookId` - Notes for a book
- `/books/:bookId/notes/:noteId` - Detailed note view
- `/random` - Random note
- `/search` - Search (minimum 3 characters)
- `/upload` - File upload with drag-and-drop

Header uses `NavLink` for navigation. All routes wrapped in Suspense + Error Boundary.

## API Integration

Uses **TanStack React Query** for server state. HTTP client at [api/httpClient.ts](src/api/httpClient.ts) supports JSON and FormData. API URL from `VITE_API_URL` environment variable.

### Endpoints
- `GET /books` - List books
- `POST /books` - Upload book (FormData: `.txt` or `.html`, max 10MB)
- `GET /books/{bookId}/notes` - Book notes
- `GET /books/{bookId}/notes/{noteId}` - Detailed note
- `GET /random` - Random note
- `GET /search?q={query}` - Search (min 3 chars)

### Query Hooks
- `useApiSuspenseQuery<T>` - Used in page components for automatic loading/error states
- `useApiQuery<T>` - Used in SearchPage with `enabled` flag
- `useApiMutation<T, P>` - Used for file upload

## Architectural Decisions

### State Management
- **Server State**: TanStack React Query for API data
- **Client State**: React hooks (`useState`, `useReducer`)
- **Global State**: Minimal - prefer lifting state up or React Query

### API Layer
- **HTTP Client** ([api/httpClient.ts](src/api/httpClient.ts)): Supports JSON and FormData, handles errors, wraps responses in `ApiResponse<T>`
- **Services** ([api/](src/api/)): `booksService`, `notesService`, `searchService` - transform snake_case API to camelCase TypeScript
- **Query Hooks** ([api/queries.ts](src/api/queries.ts)): `useApiQuery`, `useApiSuspenseQuery`, `useApiMutation`

### Component Patterns
- Functional components with TypeScript interfaces
- Page-based routing: `src/pages/` organized by route (Home, Book, Note, Search, Upload)
- Composition over inheritance, single responsibility principle
- Error boundaries + Suspense for loading/error states
- Toast notifications (react-hot-toast) for user feedback

## Deployment

Multi-stage Docker build ([Dockerfile](Dockerfile)): Node.js for building, Caddy for serving.

**Key points**:
- Build argument: `VITE_API_URL` (set at build time)
- Caddy serves SPA from `/usr/share/caddy`
- Port from `$PORT` env var (default: 3000)
- Health check: `GET /health` returns "OK"
- SPA routing: `try_files {path} /index.html`
- Optimized for platforms like Railway (auto HTTPS, JSON logging)

```bash
docker build --build-arg VITE_API_URL=https://your-api.com -t kindle-notes-frontend .
docker run -p 3000:3000 -e PORT=3000 kindle-notes-frontend
```