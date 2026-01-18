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
├── tests/                      # Test files
├── fixtures/                   # Sample Kindle notes files
├── helpers/                    # Reusable test utilities
├── playwright-mcp.config.json  # MCP server configuration
└── init-page.ts                # MCP page initialization script
```

## Playwright MCP Server

This directory includes configuration files for the Playwright MCP server (`playwright-mcp.config.json` and `init-page.ts`).

For full documentation on Playwright MCP setup, configuration, and usage, see **[MCP_SETUP.md](../MCP_SETUP.md)**.
