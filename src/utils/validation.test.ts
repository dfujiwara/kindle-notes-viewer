import { describe, expect, it } from "vitest";
import { validateUrl } from "./validation";

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
