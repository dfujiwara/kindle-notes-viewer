# End-to-End Tests

This directory contains end-to-end tests for the Kindle Notes Viewer application using Playwright.

## Structure

```
e2e/
├── tests/          # E2E test files
├── fixtures/       # Test data (sample Kindle notes files)
├── helpers/        # Reusable test utilities
└── README.md       # This file
```

## Running Tests

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- upload-flow.spec.ts

# Debug mode
npm run test:e2e -- --debug
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  // ... test steps
  await expect(page.getByText('Expected text')).toBeVisible();
});
```

### Using Test Helpers

```typescript
import { uploadKindleFile, waitForApiResponse } from '../helpers/test-helpers';

test('upload flow', async ({ page }) => {
  await uploadKindleFile(page, './e2e/fixtures/sample-kindle-notes.txt');
  // ... continue test
});
```

## Backend Setup

These tests require a running backend server. By default, tests expect:
- Backend API at: `http://localhost:8000`
- Frontend dev server at: `http://localhost:5173`

### Option 1: Use Existing Backend

Make sure your backend is running on port 8000:
```bash
cd ../kindle-notes-backend
npm run start
```

### Option 2: Custom Backend URL

Set the `E2E_API_URL` environment variable:
```bash
E2E_API_URL=http://localhost:8001 npm run test:e2e
```

### Option 3: Docker Backend (Recommended for CI)

```bash
# Start backend in Docker
docker-compose -f docker-compose.e2e.yml up -d

# Run tests
npm run test:e2e

# Cleanup
docker-compose -f docker-compose.e2e.yml down -v
```

## Test Database

For reliable E2E tests, use a separate test database:

1. Create a test database
2. Point your backend to it during E2E tests
3. Reset the database between test runs

Example backend test script:
```json
{
  "scripts": {
    "test:e2e": "DATABASE_URL=postgresql://localhost/kindle_test npm start"
  }
}
```

## CI/CD

Tests are configured to run in CI with:
- Automatic retries (2 retries on failure)
- Serial execution (to avoid database conflicts)
- HTML reporter output

## Debugging

### View Test Report

```bash
npx playwright show-report
```

### View Trace

When a test fails, a trace is automatically recorded:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshot on Failure

Screenshots are automatically captured on test failure in `test-results/`.

## Best Practices

1. **Use data-testid for stable selectors**
   ```tsx
   <button data-testid="upload-button">Upload</button>
   ```

2. **Wait for network idle when needed**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use fixtures for test data**
   - Keep sample files in `e2e/fixtures/`
   - Commit fixtures to version control

4. **Test real user flows**
   - Don't test implementation details
   - Focus on critical user journeys

5. **Keep tests independent**
   - Each test should work in isolation
   - Don't rely on order of execution
