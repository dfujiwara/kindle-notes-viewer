# Playwright MCP Server Setup

This project includes a Playwright MCP (Model Context Protocol) server configuration for AI-assisted browser automation.

## What is Playwright MCP?

The Playwright MCP server enables AI assistants like Claude to programmatically control a web browser through the Model Context Protocol. Unlike screenshot-based browser automation (Computer Use), MCP uses direct DOM manipulation and Playwright's API for fast, precise browser control.

### Key Benefits

- **Fast**: Direct API calls, no screenshot analysis (100ms vs 2-5s per action)
- **Precise**: Uses CSS selectors instead of pixel coordinates
- **Integrated**: Works seamlessly with your existing Playwright setup
- **Headless capable**: Can run without a visible browser window
- **Developer-friendly**: Interacts with the accessibility tree and DOM

## Quick Start

### Prerequisites

- Node.js 18 or newer
- Claude Code CLI (`npm install -g @anthropic/claude-code`)

### Automatic Setup

The MCP server is pre-configured in `.mcp.json` and will be automatically available when you use Claude Code in this directory.

Start Claude Code:
```bash
claude
```

Verify MCP is loaded:
```
/mcp
```

You should see "playwright" listed as an available MCP server.

### Manual Setup (if needed)

If the automatic setup doesn't work, you can manually add the MCP server:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

This will add the Playwright MCP server to your user-level configuration.

## Usage

Once configured, you can interact with your app using natural language:

### Example Commands

**Navigation & Screenshots**
```
"Open http://localhost:5173 in the browser"
"Take a screenshot of the current page"
"Navigate to the upload page"
```

**Interaction**
```
"Click the upload button"
"Fill in the search box with 'machine learning'"
"Submit the form"
```

**Debugging**
```
"Find all buttons on the page"
"Check if there are any console errors"
"Inspect the DOM structure of the header"
"Click the note card and verify it navigates to the detail page"
```

**Testing**
```
"Test the file upload flow with the sample file in e2e/fixtures/"
"Verify that search results appear after submitting the form"
"Check if the navigation menu is responsive on mobile"
```

## Configuration

### Project Configuration (`.mcp.json`)

The default configuration is minimal:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "description": "Playwright browser automation for testing and debugging"
    }
  }
}
```

### Advanced Configuration

For advanced use cases, you can use the optional configuration files:

#### `e2e/playwright-mcp.config.json`

Customize browser behavior, timeouts, and network settings:

```json
{
  "browser": {
    "type": "chromium",
    "headless": false
  },
  "context": {
    "viewport": { "width": 1280, "height": 720 },
    "baseURL": "http://localhost:5173"
  },
  "timeouts": {
    "action": 5000,
    "navigation": 30000
  }
}
```

To use this config, update `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--config",
        "./e2e/playwright-mcp.config.json"
      ]
    }
  }
}
```

#### `e2e/init-page.ts`

Run custom initialization code before each browser session:

```typescript
export async function initializePage(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  // Grant permissions, set geolocation, inject scripts, etc.
}
```

To use the init script, update `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--init-page",
        "./e2e/init-page.ts"
      ]
    }
  }
}
```

### Available Configuration Options

Add these as additional arguments in `.mcp.json`:

| Flag | Description | Example |
|------|-------------|---------|
| `--browser` | Browser type | `--browser firefox` |
| `--headless` | Run without visible window | `--headless` |
| `--isolated` | No persistent profile | `--isolated` |
| `--viewport-size` | Browser dimensions | `--viewport-size 1920x1080` |
| `--device` | Emulate device | `--device "iPhone 13"` |
| `--timeout-action` | Action timeout (ms) | `--timeout-action 10000` |

## Comparison with Computer Use

| Feature | Computer Use | Playwright MCP |
|---------|--------------|----------------|
| **Mechanism** | Screenshot + vision | DOM + accessibility tree |
| **Speed** | 2-5s per action | <100ms per action |
| **Precision** | Pixel coordinates | CSS selectors |
| **Reliability** | Can fail on visual changes | Stable DOM-based |
| **Use Case** | General browsing | Development/testing |
| **Environment** | Requires display | Can run headless |

## Comparison with Traditional E2E Tests

| Feature | Traditional Tests | MCP Server |
|---------|------------------|------------|
| **Control** | Test scripts | Natural language |
| **Execution** | Automated (CI/CD) | Interactive |
| **Speed** | Fast (parallel) | Moderate (sequential) |
| **Flexibility** | Fixed scenarios | Ad-hoc exploration |
| **Use Case** | Regression testing | Debugging & development |

**Recommendation**: Use both! MCP for development and debugging, traditional tests for CI/CD.

## Troubleshooting

### MCP server not showing up

1. Verify `.mcp.json` exists in the project root
2. Restart Claude Code
3. Run `/mcp` to check loaded servers
4. Try manual installation: `claude mcp add playwright npx @playwright/mcp@latest`

### Browser not opening

1. Check if the dev server is running (`npm run dev`)
2. Verify the URL is correct (default: `http://localhost:5173`)
3. Try headed mode: add `--headless false` to args

### Permission errors

1. Ensure Node.js 18+ is installed
2. Clear npx cache: `npx clear-npx-cache`
3. Install Playwright browsers: `npx playwright install chromium`

### Connection refused

1. Start the backend server (`http://localhost:8000`)
2. Start the frontend dev server (`npm run dev`)
3. Verify both are running before using MCP

## Resources

- [Official Playwright MCP Repository](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Playwright Documentation](https://playwright.dev/)
- [E2E Test Documentation](./e2e/README.md)

## Contributing

When adding new MCP configurations:

1. Document changes in this file
2. Update `.mcp.json` if changing default behavior
3. Add examples to `e2e/README.md` if relevant
4. Test the configuration before committing

## License

Same as the main project.
