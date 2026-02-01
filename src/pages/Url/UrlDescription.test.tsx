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
  it("renders URL title, URL, chunk count, date, and delete button", () => {
    render(
      <UrlDescription url={mockUrl} onDelete={vi.fn()} isDeleting={false} />,
    );

    expect(screen.getByText("Example Article Title")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/article")).toBeInTheDocument();
    expect(screen.getByText(/5 chunks/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 5, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("displays singular 'chunk' when count is 1", () => {
    const urlWithOneChunk: Url = {
      ...mockUrl,
      chunkCount: 1,
    };

    render(
      <UrlDescription
        url={urlWithOneChunk}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    );
    expect(screen.getByText(/1 chunk •/)).toBeInTheDocument();
  });

  it("displays plural 'chunks' when count is greater than 1", () => {
    render(
      <UrlDescription url={mockUrl} onDelete={vi.fn()} isDeleting={false} />,
    );
    expect(screen.getByText(/5 chunks •/)).toBeInTheDocument();
  });
});
