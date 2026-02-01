# Plan: Add Delete Book & Delete URL Features

**Status**: Completed

## Summary
Add delete functionality for books and URLs, matching the backend `DELETE /books/{bookId}` and `DELETE /urls/{urlId}` endpoints (both return 204 No Content).

## Changes

### 1. Fix `httpClient.ts` to handle 204 No Content
The current `request()` always calls `response.json()`, which fails on empty bodies. Added a check for 204 status to return early without parsing JSON.

**File**: `src/api/httpClient.ts`

### 2. Add `deleteBook` to `booksService.ts`
Added `deleteBook(bookId: string)` method that sends `DELETE /books/{bookId}`.

**File**: `src/api/booksService.ts`

### 3. Add `deleteUrl` to `urlService.ts`
Added `deleteUrl(urlId: string)` method that sends `DELETE /urls/{urlId}`.

**File**: `src/api/urlService.ts`

### 4. Add delete button to `BookDescription.tsx`
- Added `onDelete` and `isDeleting` optional props
- Renders a delete button with `window.confirm` confirmation dialog
- Styled as a red/danger button in the description card header

**File**: `src/pages/Book/BookDescription.tsx`

### 5. Wire up delete mutation in `BookPage.tsx`
- Uses `useApiMutation` to call `booksService.deleteBook`
- On success: toast success, navigate to `/`, invalidate `["books"]`
- On error: toast error
- Passes `onDelete` and `isDeleting` to `BookDescription`

**File**: `src/pages/Book/BookPage.tsx`

### 6. Add delete button to `UrlDescription.tsx`
Same pattern as BookDescription — `onDelete`/`isDeleting` props, delete button with confirmation.

**File**: `src/pages/Url/UrlDescription.tsx`

### 7. Wire up delete mutation in `UrlPage.tsx`
Same pattern as BookPage — mutation with toast + navigate to `/`, invalidate `["urls"]`.

**File**: `src/pages/Url/UrlPage.tsx`

### 8. Tests
- `src/pages/Book/BookDescription.test.tsx` — 6 tests (render, delete button visibility, confirm/cancel, deleting state)
- `src/pages/Url/UrlDescription.test.tsx` — 5 new tests added (delete button visibility, confirm/cancel, deleting state)

## Verification
- `npm run check` — passes (no lint/format issues)
- `npm run test:run` — 186 tests pass across 28 test files
