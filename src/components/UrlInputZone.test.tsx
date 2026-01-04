import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UrlInputZone } from "./UrlInputZone";

describe("UrlInputZone", () => {
  it("renders input field with placeholder", () => {
    const mockOnUrlChange = vi.fn();
    render(<UrlInputZone url="" onUrlChange={mockOnUrlChange} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toBeInTheDocument();
  });

  it("calls onUrlChange when user types", async () => {
    const user = userEvent.setup();
    const mockOnUrlChange = vi.fn();
    render(<UrlInputZone url="" onUrlChange={mockOnUrlChange} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    await user.type(input, "https://example.com");

    expect(mockOnUrlChange).toHaveBeenCalled();
  });

  it("shows green border when valid http URL is entered", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone url="http://example.com" onUrlChange={mockOnUrlChange} />,
    );

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toHaveValue("http://example.com");
    expect(input).toHaveClass("border-green-500");
  });

  it("shows green border when valid https URL is entered", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone url="https://example.com" onUrlChange={mockOnUrlChange} />,
    );

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toHaveValue("https://example.com");
    expect(input).toHaveClass("border-green-500");
  });

  it("shows gray border for invalid URLs", () => {
    const mockOnUrlChange = vi.fn();
    render(<UrlInputZone url="not-a-url" onUrlChange={mockOnUrlChange} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toHaveClass("border-gray-300");
  });

  it("shows gray border for non-http(s) protocols", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone url="ftp://example.com" onUrlChange={mockOnUrlChange} />,
    );

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toHaveClass("border-gray-300");
  });

  it("allows editing long URLs without truncation", () => {
    const mockOnUrlChange = vi.fn();
    const longUrl =
      "https://example.com/very/long/path/that/should/not/be/truncated";
    render(<UrlInputZone url={longUrl} onUrlChange={mockOnUrlChange} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toHaveValue(longUrl);
  });
});
