import { render, screen } from "@testing-library/react";
import type { Url } from "src/models";
import { UrlDescription } from "./UrlDescription";

const mockUrl: Url = {
  id: "1",
  url: "https://example.com/article",
  title: "Example Article Title",
  chunkCount: 5,
  createdAt: "2026-01-05T12:00:00Z",
};

describe("UrlDescription", () => {
  it("renders URL title, URL, chunk count, and date", () => {
    render(<UrlDescription url={mockUrl} />);

    expect(screen.getByText("Example Article Title")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/article")).toBeInTheDocument();
    expect(screen.getByText(/5 chunks/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 5, 2026/)).toBeInTheDocument();
  });

  it("displays singular 'chunk' when count is 1", () => {
    const urlWithOneChunk: Url = {
      ...mockUrl,
      chunkCount: 1,
    };

    render(<UrlDescription url={urlWithOneChunk} />);
    expect(screen.getByText(/1 chunk •/)).toBeInTheDocument();
  });

  it("displays plural 'chunks' when count is greater than 1", () => {
    render(<UrlDescription url={mockUrl} />);
    expect(screen.getByText(/5 chunks •/)).toBeInTheDocument();
  });
});
