import { describe, expect, it } from "vitest";
import { validateTweetUrl, validateUrl } from "./validation";

describe("validateUrl", () => {
  it("returns false for empty/whitespace strings", () => {
    expect(validateUrl("")).toBe(false);
    expect(validateUrl("   ")).toBe(false);
  });

  it("returns true for http/https URLs", () => {
    expect(validateUrl("http://example.com")).toBe(true);
    expect(validateUrl("https://example.com")).toBe(true);
  });

  it("returns false for non-http(s) protocols", () => {
    expect(validateUrl("ftp://example.com")).toBe(false);
  });

  it("returns false for invalid URL format", () => {
    expect(validateUrl("not-a-url")).toBe(false);
  });
});

describe("validateTweetUrl", () => {
  it("returns true for twitter.com and x.com URLs", () => {
    expect(validateTweetUrl("https://twitter.com/user/status/123")).toBe(true);
    expect(validateTweetUrl("https://x.com/user/status/123")).toBe(true);
  });

  it("returns false for non-tweet domains", () => {
    expect(validateTweetUrl("https://example.com")).toBe(false);
  });

  it("returns false for empty/invalid URLs", () => {
    expect(validateTweetUrl("")).toBe(false);
    expect(validateTweetUrl("not-a-url")).toBe(false);
  });
});
