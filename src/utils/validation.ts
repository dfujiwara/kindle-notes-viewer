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

// Validate tweet URL - must be a valid twitter.com or x.com URL
export function validateTweetUrl(urlString: string): boolean {
  if (!validateUrl(urlString)) {
    return false;
  }

  try {
    const parsed = new URL(urlString);
    return ["twitter.com", "x.com"].includes(parsed.hostname);
  } catch {
    return false;
  }
}
