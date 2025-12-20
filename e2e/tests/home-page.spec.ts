import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page successfully", async ({ page }) => {
    await page.goto("/");

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Kindle Notes/i);

    // Check for main navigation elements
    const randomLink = page.getByRole("link", { name: /random/i });
    await expect(randomLink).toBeVisible();

    const searchLink = page.getByRole("link", { name: /search/i });
    await expect(searchLink).toBeVisible();

    const uploadLink = page.getByRole("link", { name: /upload/i });
    await expect(uploadLink).toBeVisible();
  });

  test("should navigate to random page", async ({ page }) => {
    await page.goto("/");

    const searchLink = page.getByRole("link", { name: /random/i });
    await searchLink.click();

    // Verify navigation to search page
    await expect(page).toHaveURL(/\/random/);
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
