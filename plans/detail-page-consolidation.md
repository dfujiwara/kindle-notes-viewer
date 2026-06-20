# Plan: Consolidate Detail Pages

## Status
Draft

## Goal
Unify the Book, URL, Tweet, Note, and Chunk detail pages behind a shared layout and shared UI primitives so the app feels more consistent and is easier to extend.

## What should be shared
- Page container and spacing
- Header/title/meta/action layout
- Back navigation / breadcrumb pattern
- Empty states
- Related-items sections
- Context/markdown sections
- Clickable item/card styling

## Current pages in scope
- `src/pages/Book/BookPage.tsx`
- `src/pages/Url/UrlPage.tsx`
- `src/pages/Tweet/TweetPage.tsx`
- `src/pages/Tweet/TweetDetailPage.tsx`
- `src/pages/Note/NotePage.tsx`
- `src/pages/Chunk/ChunkPage.tsx`
- `src/pages/Random/RandomPage.tsx` (uses detail content variants)

## Proposed refactor roadmap

### Phase 1: Introduce a shared detail shell
Create a reusable wrapper that standardizes page spacing and top-level layout.

**New component**
- `src/components/DetailPageShell.tsx`

**Responsibilities**
- Wrap content in `PageContainer`
- Provide optional back link / breadcrumb row
- Reserve a consistent area for the page header
- Keep the main content stack spacing consistent

### Phase 2: Standardize the header block
Extend or wrap `PageHeader` so all detail pages use the same structure.

**Possible API**
- `title`
- `subtitle`
- `meta`
- `action`
- `backLink`

**Goal**
- Book/URL/Tweet pages should all show the same title/meta/action alignment
- Detail pages should optionally show a “Back” affordance

### Phase 3: Extract shared content sections
Create reusable section primitives for repeated patterns.

**New components**
- `src/components/DetailSection.tsx`
- `src/components/RelatedItemsSection.tsx`
- `src/components/EmptyState.tsx`
- `src/components/MarkdownSection.tsx`

**Use cases**
- Additional context blocks
- Related notes/chunks/tweets lists
- “No items found” states

### Phase 4: Normalize clickable item cards
Unify the interactive cards used by notes, chunks, tweets, and related items.

**New component ideas**
- `src/components/DetailCardButton.tsx`
- `src/components/DetailListItem.tsx`

**Benefits**
- Consistent hover, border, padding, focus, and typography
- Easier to tune mobile/touch behavior once

### Phase 5: Apply the shell to each detail page
Refactor each page one at a time to use the shared primitives.

**Recommended order**
1. `BookPage` / `UrlPage`
2. `TweetPage`
3. `NoteDescription` / `ChunkDescription` / `TweetDescription`
4. `RandomPage`

### Phase 6: Polish navigation consistency
Add a consistent back pattern.

**Examples**
- Book detail: “Back to Home” or “Back to Books”
- Note/Chunk detail: back to parent book/url
- Tweet detail: back to thread

### Phase 7: Cleanup and copy consistency
Standardize wording and capitalization.

**Examples**
- `No books found` vs `No Books Found`
- `Additional context` section labels
- Loading/empty-state messages

## Suggested implementation sequence
1. Create shared shell + section components
2. Convert `BookPage` and `UrlPage`
3. Convert `TweetPage`
4. Convert `NoteDescription` and `ChunkDescription`
5. Convert `TweetDescription`
6. Update `RandomPage` to reuse the same patterns
7. Add/adjust tests for shared layout behavior

## Risks
- Over-abstracting too early
- Making the shared API too rigid for page-specific actions
- Breaking page-specific spacing or mobile layout

## Verification
- `npm run check`
- `npm run test:run`
- `npm run build`
- Spot-check all detail routes in the browser

## Success criteria
- Detail pages share a visibly consistent layout
- Shared UI primitives reduce duplication
- New detail types can be added with minimal custom markup
