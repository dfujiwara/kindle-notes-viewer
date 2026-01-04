import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UrlInputZone } from "./UrlInputZone";

describe("UrlInputZone", () => {
  it("renders input field with placeholder", () => {
    const mockOnUrlChange = vi.fn();
    render(<UrlInputZone url="" onUrlChange={mockOnUrlChange} error={null} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    expect(input).toBeInTheDocument();
  });

  it("calls onUrlChange when user types", async () => {
    const user = userEvent.setup();
    const mockOnUrlChange = vi.fn();
    render(<UrlInputZone url="" onUrlChange={mockOnUrlChange} error={null} />);

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    await user.type(input, "https://example.com");

    expect(mockOnUrlChange).toHaveBeenCalled();
  });

  it("shows validation error when error prop is provided", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone
        url="invalid-url"
        onUrlChange={mockOnUrlChange}
        error="Invalid URL format"
      />,
    );

    expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
  });

  it("displays entered URL when valid http URL is entered", async () => {
    const user = userEvent.setup();
    const mockOnUrlChange = vi.fn();
    const { rerender } = render(
      <UrlInputZone url="" onUrlChange={mockOnUrlChange} error={null} />,
    );

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    await user.type(input, "http://example.com");

    // Rerender with the URL to simulate state update
    rerender(
      <UrlInputZone
        url="http://example.com"
        onUrlChange={mockOnUrlChange}
        error={null}
      />,
    );

    // Should show the URL in display view
    expect(screen.getByText(/http:\/\/example\.com/)).toBeInTheDocument();
  });

  it("displays entered URL when valid https URL is entered", async () => {
    const user = userEvent.setup();
    const mockOnUrlChange = vi.fn();
    const { rerender } = render(
      <UrlInputZone url="" onUrlChange={mockOnUrlChange} error={null} />,
    );

    const input = screen.getByPlaceholderText(
      "Enter URL to extract and upload",
    );
    await user.type(input, "https://example.com");

    // Rerender with the URL to simulate state update
    rerender(
      <UrlInputZone
        url="https://example.com"
        onUrlChange={mockOnUrlChange}
        error={null}
      />,
    );

    // Should show the URL in display view
    expect(screen.getByText(/https:\/\/example\.com/)).toBeInTheDocument();
  });

  it("does not display URL view for invalid URLs", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone
        url="not-a-url"
        onUrlChange={mockOnUrlChange}
        error={null}
      />,
    );

    // Should still show input field, not display view
    expect(
      screen.getByPlaceholderText("Enter URL to extract and upload"),
    ).toBeInTheDocument();
  });

  it("does not display URL view for non-http(s) protocols", () => {
    const mockOnUrlChange = vi.fn();
    render(
      <UrlInputZone
        url="ftp://example.com"
        onUrlChange={mockOnUrlChange}
        error={null}
      />,
    );

    // Should still show input field, not display view
    expect(
      screen.getByPlaceholderText("Enter URL to extract and upload"),
    ).toBeInTheDocument();
  });

  it("truncates long URLs in display view", () => {
    const mockOnUrlChange = vi.fn();
    const longUrl =
      "https://example.com/very/long/path/that/should/be/truncated/for/display";
    render(
      <UrlInputZone url={longUrl} onUrlChange={mockOnUrlChange} error={null} />,
    );

    // Should show truncated URL (first 57 chars + ...)
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });
});
