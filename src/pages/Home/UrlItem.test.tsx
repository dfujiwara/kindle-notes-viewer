import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { Url } from "src/models";
import { describe, expect, it, vi } from "vitest";
import { UrlItem } from "./UrlItem";

const mockUrl: Url = {
  id: "1",
  url: "https://example.com/article",
  title: "Example Article Title",
  chunkCount: 15,
  createdAt: "2026-01-05T00:00:00Z",
};

describe("UrlItem", () => {
  it("renders URL title, URL, chunk count, and date", () => {
    render(<UrlItem url={mockUrl} onClick={() => {}} />);

    expect(screen.getByText("Example Article Title")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/article")).toBeInTheDocument();
    expect(screen.getByText(/15 chunks/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 5, 2026/)).toBeInTheDocument();
  });

  it("displays singular 'chunk' when count is 1", () => {
    const urlWithOneChunk: Url = {
      ...mockUrl,
      chunkCount: 1,
    };

    render(<UrlItem url={urlWithOneChunk} onClick={() => {}} />);
    expect(screen.getByText(/1 chunk •/)).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<UrlItem url={mockUrl} onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockUrl);
  });
});
