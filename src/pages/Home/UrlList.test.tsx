import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { Url } from "src/models";
import { describe, expect, it, vi } from "vitest";
import { UrlList } from "./UrlList";

const mockUrls: Url[] = [
  {
    id: "1",
    url: "https://example.com/article",
    title: "Example Article",
    chunkCount: 15,
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "2",
    url: "https://test.com/post",
    title: "Test Blog Post",
    chunkCount: 8,
    createdAt: "2026-01-04T00:00:00Z",
  },
];

describe("UrlList", () => {
  it("renders all URLs when urls array is not empty", () => {
    const mockOnUrlClick = vi.fn();
    render(<UrlList urls={mockUrls} onUrlClick={mockOnUrlClick} />);

    expect(screen.getByText("Example Article")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/article")).toBeInTheDocument();
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(screen.getByText("https://test.com/post")).toBeInTheDocument();
  });

  it("displays 'No URLs Found' message when urls array is empty", () => {
    const mockOnUrlClick = vi.fn();
    render(<UrlList urls={[]} onUrlClick={mockOnUrlClick} />);

    expect(screen.getByText("No URLs Found")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onUrlClick when a URL is clicked", async () => {
    const user = userEvent.setup();
    const mockOnUrlClick = vi.fn();
    render(<UrlList urls={mockUrls} onUrlClick={mockOnUrlClick} />);

    const firstUrlButton = screen.getByRole("button", {
      name: /Example Article/i,
    });
    await user.click(firstUrlButton);

    expect(mockOnUrlClick).toHaveBeenCalledTimes(1);
    expect(mockOnUrlClick).toHaveBeenCalledWith(mockUrls[0]);
  });
});
