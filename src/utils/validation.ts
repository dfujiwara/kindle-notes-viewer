// Validate URL - only allow http/https protocols
export function validateUrl(urlString: string): boolean {
  if (!urlString.trim()) {
    return false;
  }

  try {
    const parsed = new URL(urlString);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
