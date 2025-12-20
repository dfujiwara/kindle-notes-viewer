import type { Page } from "@playwright/test";

/**
 * Helper to navigate to the home page
 */
export async function navigateToHome(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

/**
 * Helper to upload a Kindle notes file
 */
export async function uploadKindleFile(page: Page, filePath: string) {
  await navigateToHome(page);

  // Navigate to upload page
  const uploadLink = page.getByRole("link", { name: /upload/i });
  await uploadLink.click();

  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  // Wait for upload to complete
  await page.waitForURL(/.*\/books\/\d+/, { timeout: 10000 });
}

/**
 * Helper to wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
) {
  return await page.waitForResponse(
    (response) =>
      (typeof urlPattern === "string"
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) && response.status() === 200,
  );
}
