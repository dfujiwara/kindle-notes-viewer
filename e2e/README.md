# End-to-End Tests

E2E tests for the Kindle Notes Viewer application using Playwright.

## Quick Start

```bash
# First time setup
npx playwright install chromium

# Run tests
npm run test:e2e
npm run test:e2e:ui  # Interactive mode
```

## Backend Setup

**Required:** These tests need a running backend server at `http://localhost:8000`.

Make sure your backend is running before executing E2E tests.

## Structure

```
e2e/
├── tests/          # Test files
├── fixtures/       # Sample Kindle notes files
└── helpers/        # Reusable test utilities
```
