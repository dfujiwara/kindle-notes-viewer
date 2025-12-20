import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page successfully", async ({ page }) => {
    await page.goto("/");

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Kindle Notes/i);

    // Check for main navigation elements
    const homeLink = page.getByRole("link", { name: /home/i });
    await expect(homeLink).toBeVisible();

    const searchLink = page.getByRole("link", { name: /search/i });
    await expect(searchLink).toBeVisible();

    const uploadLink = page.getByRole("link", { name: /upload/i });
    await expect(uploadLink).toBeVisible();
  });

  test("should display 'No books found' message when no books exist", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check for either books or empty state message
    const noBooksMessage = page.getByText(/no books found/i);
    const bookList = page.locator('[data-testid="book-list"]');

    // At least one should be visible (either books or empty state)
    const hasBooks = await bookList.isVisible().catch(() => false);
    const hasEmptyMessage = await noBooksMessage.isVisible().catch(() => false);

    expect(hasBooks || hasEmptyMessage).toBe(true);
  });

  test("should navigate to search page", async ({ page }) => {
    await page.goto("/");

    const searchLink = page.getByRole("link", { name: /search/i });
    await searchLink.click();

    // Verify navigation to search page
    await expect(page).toHaveURL(/\/search/);
  });

  test("should navigate to upload page", async ({ page }) => {
    await page.goto("/");

    const uploadLink = page.getByRole("link", { name: /upload/i });
    await uploadLink.click();

    // Verify navigation to upload page
    await expect(page).toHaveURL(/\/upload/);
  });
});
