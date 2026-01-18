/**
 * Playwright MCP initialization script
 *
 * This file is executed before each browser session when using Playwright MCP.
 * Use it to configure the page context, set up permissions, or inject helpers.
 *
 * To use this file with Playwright MCP, add the --init-page flag:
 * npx @playwright/mcp@latest --init-page ./e2e/init-page.ts
 */

import type { Page } from "@playwright/test";

export async function initializePage(page: Page): Promise<void> {
  // Set default viewport for consistent testing
  await page.setViewportSize({ width: 1280, height: 720 });

  // Grant necessary permissions (if needed)
  // await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  // Set geolocation (if needed)
  // await page.context().setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

  // Add custom helpers to the page (if needed)
  // await page.addInitScript(() => {
  //   window.__TEST_MODE__ = true;
  // });

  console.log(
    "Playwright MCP page initialized for:",
    page.url() || "about:blank",
  );
}
