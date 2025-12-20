import path from "node:path";
import { expect, test } from "@playwright/test";

test.describe("Upload Flow", () => {
  test("should upload a Kindle notes file and display the book", async ({
    page,
  }) => {
    // Navigate to upload page
    await page.goto("/upload");

    // Verify we're on the upload page
    await expect(page.getByText(/upload kindle notes/i)).toBeVisible();

    // Prepare the file path
    const filePath = path.join(
      process.cwd(),
      "e2e/fixtures/sample-kindle-notes.txt",
    );

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete and redirect to book page
    // This will work once the backend is connected
    await page.waitForURL(/\/books\/\d+/, { timeout: 10000 });

    // Verify we're on the book details page
    await expect(page.getByText(/The Great Gatsby/i)).toBeVisible();

    // Verify notes are displayed
    await expect(
      page.getByText(/In my younger and more vulnerable years/i),
    ).toBeVisible();
  });

  test("should show upload page with file drop zone", async ({ page }) => {
    await page.goto("/upload");

    // Check for file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Check for upload instructions
    await expect(page.getByText(/Drag and drop your file here/i)).toBeVisible();
  });

  test("should navigate back to home after upload", async ({ page }) => {
    await page.goto("/upload");

    // Click home link in navigation
    const homeLink = page.getByRole("link", { name: /Kindle Notes/i });
    await homeLink.click();

    // Verify we're back on home page
    await expect(page).toHaveURL("/");
  });
});
