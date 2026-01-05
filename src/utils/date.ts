/**
 * Formats a date string into a human-readable format.
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 5, 2026")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
