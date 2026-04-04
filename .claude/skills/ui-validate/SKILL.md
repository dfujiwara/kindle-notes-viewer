---
name: ui-validate
description: Validates UI features using Playwright browser automation
args:
  feature:
    description: Feature to validate (navigation, home, search, upload, tweets, random, all)
    required: false
    default: all
---

# UI Validation Skill

Validates UI features of the Kindle Notes Viewer application using Playwright browser automation.

## Usage

```
/ui-validate [feature]
```

**Available features:**
- `navigation` - Validates header navigation links work correctly
- `home` - Validates home page tabs (Books, URLs, Tweets) load and display content
- `search` - Validates search page finds results across books, URLs, and tweets
- `upload` - Validates all three upload modes (File, URL, Tweet)
- `tweets` - Validates tweet thread page and tweet detail page
- `random` - Validates random page loads content (note, chunk, or tweet)
- `all` - Runs all validations (default if no feature specified)

## Example

```
/ui-validate navigation
/ui-validate tweets
/ui-validate all
```

---

## Instructions for Claude

When this skill is invoked, perform UI validation using Playwright MCP server tools.

### Prerequisites Check

1. Check if dev server is running on port 5173:
   ```bash
   curl -s http://localhost:5173 > /dev/null && echo "Server running" || echo "Server not running"
   ```

2. If not running, inform user to start it:
   ```bash
   npm run dev
   ```

### Validation Flow

Use these Playwright MCP tools in sequence:

#### 1. Navigate to Application
```typescript
mcp__playwright__browser_navigate({ url: "http://localhost:5173" })
```

#### 2. Capture Page State
```typescript
mcp__playwright__browser_snapshot({})
```

This gives you the accessibility tree showing all interactive elements.

#### 3. Validate Based on Feature

**For `navigation` validation:**
- Verify header contains links: "Search", "Random", "Upload"
- Click "Search" link → verify URL changes to /search
- Click "Random" link → verify URL changes to /random
- Click "Upload" link → verify URL changes to /upload
- Click "Kindle Notes" title → verify returns to /

**For `home` validation:**
- Navigate to /
- Take snapshot
- Verify three tabs exist: "Books", "URLs", "Tweets"
- Verify "Books" tab is active by default
- Verify book list or "No books" message appears in Books tab
- Click "URLs" tab → verify URL list or "No URLs" message appears
- Click "Tweets" tab → verify tweet thread list or "No tweets" message appears
- Verify keyboard navigation works (Arrow Left/Right keys switch tabs)
- Verify navigation links are present in header

**For `search` validation:**
- Navigate to /search
- Take snapshot
- Verify search input textbox exists with placeholder "Search..."
- Type a short query (< 3 chars) → verify validation message appears (requires 3+ chars)
- Type a valid query (3+ chars) → wait for results
- Verify results are organized into sections: Books, URLs, Tweets
- Verify each result section shows matching items or is absent if no results
- Verify clicking a result navigates to the correct detail page

**For `upload` validation:**
- Navigate to /upload
- Take snapshot
- Verify three mode buttons exist: "File Upload", "URL Upload", "Tweet"
- **File mode** (default): Verify file drop zone is visible; verify accepts .txt/.html
- Click "URL Upload" → verify URL input field appears; verify file drop zone is gone
- Click "Tweet" → verify URL input field appears with tweet URL placeholder
- Verify Upload and Clear buttons are present in all modes
- Verify switching modes clears previous input state

**For `tweets` validation:**
- Navigate to / → click Tweets tab → click a tweet thread (if any exist)
- If no tweets exist, skip thread/detail checks and note it
- On TweetPage: verify thread title, author handle (@username), tweet count, and tweet list are visible
- Click a tweet in the list → verify navigation to /tweets/:threadId/tweets/:tweetId
- On TweetDetailPage: verify tweet content is visible, verify related tweets section exists
- Verify streaming content loads (loading indicator → content appears)
- Verify back/breadcrumb navigation link to parent thread

**For `random` validation:**
- Navigate to /random
- Take snapshot
- Verify page loads some content (note, URL chunk, or tweet)
- Verify content is one of the three types based on what is shown
- Verify streaming content finishes loading
- Verify navigation link back to the source item exists
- Reload page and verify different (or same) random content loads without error

**For `all` validation:**
- Run all of the above validations in sequence
- Report aggregate results

### Available Playwright MCP Tools

The following tools are available from the Playwright MCP server:

#### Navigation
- `mcp__playwright__browser_navigate({ url })` - Navigate to a URL
- `mcp__playwright__browser_navigate_back()` - Go back to previous page
- `mcp__playwright__browser_tabs({ action, index? })` - List, create, close, or select tabs
  - Actions: `"list"`, `"new"`, `"close"`, `"select"`

#### Page Inspection
- `mcp__playwright__browser_snapshot({ filename? })` - Capture accessibility tree (best for understanding page structure)
- `mcp__playwright__browser_take_screenshot({ filename?, fullPage?, type?, element?, ref? })` - Take PNG/JPEG screenshot
- `mcp__playwright__browser_console_messages({ level? })` - Get console messages (error, warning, info, debug)
- `mcp__playwright__browser_network_requests({ includeStatic? })` - Get network requests since page load

#### Interactions
- `mcp__playwright__browser_click({ element, ref, button?, doubleClick?, modifiers? })` - Click element
- `mcp__playwright__browser_type({ element, ref, text, slowly?, submit? })` - Type text into element
- `mcp__playwright__browser_hover({ element, ref })` - Hover over element
- `mcp__playwright__browser_drag({ startElement, startRef, endElement, endRef })` - Drag and drop
- `mcp__playwright__browser_press_key({ key })` - Press keyboard key (e.g., "Enter", "Tab", "ArrowDown")

#### Forms
- `mcp__playwright__browser_fill_form({ fields })` - Fill multiple form fields at once
  - Field types: textbox, checkbox, radio, combobox, slider
- `mcp__playwright__browser_select_option({ element, ref, values })` - Select dropdown option(s)
- `mcp__playwright__browser_file_upload({ paths? })` - Upload file(s) or cancel file chooser

#### Dialogs & Waits
- `mcp__playwright__browser_handle_dialog({ accept, promptText? })` - Handle alert/confirm/prompt dialogs
- `mcp__playwright__browser_wait_for({ text?, textGone?, time? })` - Wait for text to appear/disappear or time to pass

#### Advanced
- `mcp__playwright__browser_evaluate({ function, element?, ref? })` - Execute JavaScript on page or element
- `mcp__playwright__browser_run_code({ code })` - Run Playwright code snippet with page context
- `mcp__playwright__browser_resize({ width, height })` - Resize browser window
- `mcp__playwright__browser_close()` - Close the browser
- `mcp__playwright__browser_install()` - Install browser (if not installed)

#### Important Usage Notes

**Working with Elements:**
- Always take a `browser_snapshot` before interacting with elements
- Use the `ref` values from snapshots when clicking/typing (e.g., `ref: "xyz123"`)
- The `element` parameter is a human-readable description (e.g., `element: "Search button"`)

**Common Patterns:**
```typescript
// 1. Navigate and inspect
mcp__playwright__browser_navigate({ url: "http://localhost:5173" })
mcp__playwright__browser_snapshot({})

// 2. Click an element (using ref from snapshot)
mcp__playwright__browser_click({
  element: "Tweets tab",
  ref: "abc123"
})

// 3. Type into input
mcp__playwright__browser_type({
  element: "Search input",
  ref: "def456",
  text: "test query"
})

// 4. Wait and verify
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_snapshot({})
```

**Best Practices:**
- Wait 1-2 seconds after navigation for content to load
- Check console for errors after each page load
- Use snapshots to understand page structure before interactions
- Take screenshots on failures for debugging
- If a list is empty (no books/URLs/tweets), note it but don't fail — validate what you can

### Reporting Results

Provide clear, formatted output:

```
🧪 UI Validation Results
========================

✓ Navigation: All header links working correctly
✓ Home Page: Books/URLs/Tweets tabs all render; keyboard nav works
✓ Search Page: Input validation works; results show Books, URLs, Tweets sections
✓ Upload Page: All three modes (File, URL, Tweet) switch correctly
✓ Tweets Page: Thread metadata and tweet list render; detail page streams content
✓ Random Page: Loads random content without errors

Results: 6/6 passed
```

### Error Handling

If validations fail:
1. Take a screenshot for debugging
2. Check browser console for errors
3. Verify the dev server is running correctly
4. Check if API backend is accessible
5. Provide specific error messages to help debug

### Pro Tips

- Start with a fresh browser state each validation
- Use snapshots liberally to understand page structure
- Don't just check if elements exist - verify they work (click tabs, type in inputs)
- Keep validations fast (< 60 seconds total for `all`)
- If data-dependent pages (tweets, books) are empty, note it and move on
- Focus on critical user paths, not edge cases
