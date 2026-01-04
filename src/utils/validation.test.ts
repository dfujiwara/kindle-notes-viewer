import { describe, expect, it } from "vitest";
import { validateUrl } from "./validation";

describe("validateUrl", () => {
  it("returns false for empty string", () => {
    expect(validateUrl("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(validateUrl("   ")).toBe(false);
  });

  it("returns true for valid http URL", () => {
    expect(validateUrl("http://example.com")).toBe(true);
  });

  it("returns true for valid https URL", () => {
    expect(validateUrl("https://example.com")).toBe(true);
  });

  it("returns true for http URL with path", () => {
    expect(validateUrl("http://example.com/path/to/page")).toBe(true);
  });

  it("returns true for https URL with query params", () => {
    expect(validateUrl("https://example.com?param=value")).toBe(true);
  });

  it("returns true for https URL with port", () => {
    expect(validateUrl("https://example.com:8080")).toBe(true);
  });

  it("returns false for invalid URL format", () => {
    expect(validateUrl("not-a-url")).toBe(false);
  });

  it("returns false for ftp protocol", () => {
    expect(validateUrl("ftp://example.com")).toBe(false);
  });

  it("returns false for file protocol", () => {
    expect(validateUrl("file:///path/to/file")).toBe(false);
  });

  it("returns false for javascript protocol", () => {
    expect(validateUrl("javascript:alert(1)")).toBe(false);
  });

  it("returns false for data URI", () => {
    expect(validateUrl("data:text/html,<h1>test</h1>")).toBe(false);
  });

  it("returns false for URL without protocol", () => {
    expect(validateUrl("example.com")).toBe(false);
  });
});
