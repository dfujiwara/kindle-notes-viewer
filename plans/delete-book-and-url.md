# Plan: Add Delete Book & Delete URL Features

## Summary
Add delete functionality for books and URLs, matching the backend `DELETE /books/{bookId}` and `DELETE /urls/{urlId}` endpoints (both return 204 No Content).

## Changes

### 1. Fix `httpClient.ts` to handle 204 No Content
The current `request()` always calls `response.json()`, which fails on empty bodies. Add a check for 204 status to return early without parsing JSON.

**File**: `src/api/httpClient.ts`

### 2. Add `deleteBook` to `booksService.ts`
Add a `deleteBook(bookId: string)` method that sends `DELETE /books/{bookId}`.

**File**: `src/api/booksService.ts`

### 3. Add `deleteUrl` to `urlService.ts`
Add a `deleteUrl(urlId: string)` method that sends `DELETE /urls/{urlId}`.

**File**: `src/api/urlService.ts`

### 4. Add delete button to `BookDescription.tsx`
- Accept `onDelete` callback prop
- Render a delete button with confirmation (`window.confirm`)
- Style: small red/danger-styled button in the description card

**File**: `src/pages/Book/BookDescription.tsx`

### 5. Wire up delete mutation in `BookPage.tsx`
- Use `useApiMutation` to call `booksService.deleteBook`
- On success: toast success, navigate to `/`, invalidate `["books"]`
- On error: toast error
- Pass `onDelete` to `BookDescription`

**File**: `src/pages/Book/BookPage.tsx`

### 6. Add delete button to `UrlDescription.tsx`
Same pattern as BookDescription — `onDelete` prop, delete button with confirmation.

**File**: `src/pages/Url/UrlDescription.tsx`

### 7. Wire up delete mutation in `UrlPage.tsx`
Same pattern as BookPage — mutation with toast + navigate to `/`, invalidate `["urls"]`.

**File**: `src/pages/Url/UrlPage.tsx`

### 8. Tests
- Unit tests for `BookPage` and `UrlPage` delete flows (mock service, verify navigation + toast)
- Unit tests for `BookDescription` and `UrlDescription` (verify confirm dialog + callback)

## Verification
1. `npm run check && npm run test:run` — lint + all tests pass
2. Manual test via Playwright MCP: navigate to a book/URL detail page, click delete, confirm, verify redirect to home
