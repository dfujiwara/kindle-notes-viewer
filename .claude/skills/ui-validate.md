# UI Validation Skill

Validates UI features of the Kindle Notes Viewer application using Playwright browser automation.

## Usage

```
/ui-validate [feature]
```

**Available features:**
- `navigation` - Validates header navigation links work correctly
- `search` - Validates search page UI and functionality
- `upload` - Validates upload page UI elements
- `home` - Validates home page loads and displays content
- `all` - Runs all validations (default if no feature specified)

## Example

```
/ui-validate navigation
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

**For `search` validation:**
- Navigate to /search
- Take snapshot
- Verify search input textbox exists
- Verify "Search Notes" or submit button exists
- Optionally: type test query and verify results load

**For `upload` validation:**
- Navigate to /upload
- Take snapshot
- Verify file upload area or drag-drop zone exists
- Verify upload instructions are visible

**For `home` validation:**
- Navigate to /
- Take snapshot
- Verify page title contains "Kindle Notes"
- Verify either book list or "No books" message appears
- Verify navigation links are present

**For `all` validation:**
- Run all of the above validations in sequence
- Report aggregate results

### Using Playwright MCP Tools

**Key tools available:**

- `browser_navigate({ url })` - Navigate to URL
- `browser_snapshot({})` - Get accessibility tree of page
- `browser_click({ element, ref })` - Click element (get ref from snapshot)
- `browser_type({ element, ref, text })` - Type into input
- `browser_wait_for({ time })` - Wait N seconds
- `browser_take_screenshot({ filename })` - Screenshot (for debugging)
- `browser_console_messages({})` - Get console errors

**Important:**
- Always take a snapshot before trying to click elements
- Use the `ref` values from snapshots when clicking
- Wait 1-2 seconds after navigation for content to load
- Check console for errors after each page load

### Reporting Results

Provide clear, formatted output:

```
🧪 UI Validation Results
========================

✓ Navigation: All links working correctly
✓ Search Page: Input and button present
✓ Upload Page: File drop zone visible
✗ Home Page: Failed to load book list (API error)

Results: 3/4 passed

⚠️  Issues Found:
- Home page: API returned 500 error
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
- Don't just check if elements exist - verify they work
- Keep validations fast (< 30 seconds total)
- Focus on critical user paths, not edge cases
