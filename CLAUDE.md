# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Kindle Notes Frontend** application built with React 19, TypeScript, and Vite. The project is in early development stages with a modern testing setup using Vitest.

## Development Commands

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run preview      # Preview production build locally
npm run test         # Run tests in watch mode (recommended for development)
npm run test:run     # Run tests once (for CI/scripts)
npm run test:coverage # Run tests with coverage report
```

## Technology Stack

- **React 19.1.0** with TypeScript
- **Vite 6.3.5** for build tooling and dev server
- **Vitest 3.2.4** for testing (Vite-native test runner)
- **Testing Library** for component testing
- **jsdom** for DOM simulation in tests

## Architecture

### Project Structure
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component
- `src/test/setup.ts` - Test setup file (imports jest-dom matchers)
- Vite handles the build process with TypeScript compilation

### Configuration Files
- `vite.config.ts` - Vite configuration with Vitest integration
- `tsconfig.json` - Main TypeScript config (ES2020, strict mode, react-jsx)
- `tsconfig.node.json` - TypeScript config for Node.js files (like vite.config.ts)

## Testing Setup

The project uses Vitest with the following configuration:
- **Environment**: jsdom (provides DOM APIs for React component testing)
- **Global APIs**: Enabled (no need to import `describe`, `it`, `expect`)
- **Setup file**: `src/test/setup.ts` (automatically imports jest-dom matchers)

### Running Tests
- Use `npm run test` for development (watch mode with file change detection)
- Test files should be named `*.test.tsx` or `*.test.ts`
- Testing Library is configured for React component testing

## Node.js Version

The project specifies Node.js `v24.2.0` in `.nvmrc`. Use `nvm use` to switch to the correct version.

## Module System

This project uses ES modules (`"type": "module"` in package.json). All imports/exports should use ES module syntax.