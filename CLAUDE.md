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
- **Vite 6.3.5** for build tooling and dev server
- **Vitest 3.2.4** for testing (Vite-native test runner)
- **TanStack React Query 5.81.5** for server state management
- **Tailwind CSS 4.1.11** for styling
- **React Error Boundary 6.0.0** for error handling
- **Biome 2.0.4** for linting and formatting
- **Testing Library** for component testing
- **jsdom** for DOM simulation in tests

## Architecture

### Project Structure
```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Main application component with error boundary
├── App.css                  # Application styles
├── ErrorFallback.tsx        # Error boundary fallback component
├── LoadingIndicator.tsx     # Loading state component
├── api/                     # API layer
│   ├── index.ts            # API exports
│   ├── types.ts            # API type definitions
│   ├── httpClient.ts       # HTTP client configuration
│   ├── queries.ts          # React Query configurations
│   ├── booksService.ts     # Books API service
│   ├── notesService.ts     # Notes API service
│   └── searchService.ts    # Search API service
├── components/             # Reusable UI components
│   ├── Header.tsx          # Application header
│   ├── Footer.tsx          # Application footer
│   ├── BookList.tsx        # Book listing component
│   └── BookItem.tsx        # Individual book component
├── models/                 # Data models and types
│   ├── index.ts            # Model exports
│   ├── book.ts             # KindleBook interface
│   └── note.ts             # KindleNote interface
└── test/
    └── setup.ts            # Test setup file (imports jest-dom matchers)
```

### Data Models
- **KindleBook**: `{ id, title, author }`
- **KindleNote**: `{ id, title, author, content, location, createdAt, updatedAt }`
- **ApiResponse<T>**: Generic API response wrapper
- **ApiError**: Error response structure

### Configuration Files
- `vite.config.ts` - Vite configuration with React and Tailwind plugins, Vitest integration
- `tsconfig.json` - Main TypeScript config (ES2020, strict mode, react-jsx)
- `tsconfig.node.json` - TypeScript config for Node.js files (like vite.config.ts)
- `biome.json` - Biome configuration for linting and formatting

## Code Quality & Linting

The project uses **Biome** for linting and formatting:
- **Formatting**: 2-space indentation, double quotes
- **Linting**: Recommended rules enabled
- **Git integration**: VCS-aware with ignore file support
- **Auto-organize imports**: Enabled
- Run `npm run check` to validate code quality
- Run `npm run check:fix` to auto-fix issues

**IMPORTANT**: After making any code changes, always run `npm run check` and `npm run test:run` to ensure code quality and formatting standards are met.

## Testing Setup

The project uses Vitest with the following configuration:
- **Environment**: jsdom (provides DOM APIs for React component testing)
- **Global APIs**: Enabled (no need to import `describe`, `it`, `expect`)
- **Setup file**: `src/test/setup.ts` (automatically imports jest-dom matchers)

### Running Tests
- Use `npm run test` for development (watch mode with file change detection)
- Test files should be named `*.test.tsx` or `*.test.ts`
- Testing Library is configured for React component testing

## Styling

The project uses **Tailwind CSS v4** with Vite integration:
- Utility-first CSS framework
- Configured via `@tailwindcss/vite` plugin
- Styles in `src/index.css` and `src/App.css`

## Error Handling

- **React Error Boundary**: Wraps the main application
- **ErrorFallback component**: Provides user-friendly error display
- **LoadingIndicator component**: Handles loading states

## API Integration

- **TanStack React Query**: For server state management
- **Centralized HTTP client**: Located in `src/api/httpClient.ts`
- **Service layer**: Separate services for books, notes, and search
- **Environment variables**: API URL configured via `VITE_API_URL`

## Architectural Decisions

### State Management Strategy
- **Server State**: TanStack React Query for API data caching, synchronization, and mutations
- **Client State**: React hooks (`useState`, `useReducer`) for local component state
- **Global State**: Minimal - prefer lifting state up or React Query for shared data

### API Layer Architecture
- **HTTP Client**: Custom `HttpClient` class with standardized error handling and response wrapping
- **Service Layer**: Domain-specific services (`booksService`, `notesService`, `searchService`) for API calls
- **Query Abstractions**: Custom hooks (`useApiQuery`, `useApiMutation`) that wrap React Query with consistent error handling
- **Type Safety**: Strongly typed API responses with `ApiResponse<T>` wrapper and `ApiError` interface

### Component Architecture
- **Functional Components**: All components use React function syntax with hooks
- **Composition over Inheritance**: Components accept props and compose smaller components
- **Single Responsibility**: Each component has one clear purpose (e.g., `BookItem`, `BookList`)
- **Props Interface**: All component props are explicitly typed with TypeScript interfaces

### Error Handling Strategy
- **React Error Boundary**: Top-level error boundary with `ErrorFallback` component
- **Suspense Integration**: Use `useSuspenseQuery` with Suspense boundary for loading states
- **API Error Handling**: Centralized error handling in HTTP client with typed `ApiError`
- **Graceful Degradation**: Components handle empty states (e.g., "No Books Found")

### Performance Considerations
- **Suspense + React Query**: Automatic loading states and error boundaries
- **Component Memoization**: Use when needed for expensive renders (not premature optimization)
- **Bundle Optimization**: Vite handles code splitting and tree shaking automatically

## Module System

This project uses ES modules (`"type": "module"` in package.json). All imports/exports should use ES module syntax.