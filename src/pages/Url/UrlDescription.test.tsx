import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("calls onDelete when confirm is accepted", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <UrlDescription url={mockUrl} onDelete={onDelete} isDeleting={false} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("does not call onDelete when confirm is cancelled", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <UrlDescription url={mockUrl} onDelete={onDelete} isDeleting={false} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("shows 'Deleting...' when isDeleting is true", () => {
    render(
      <UrlDescription url={mockUrl} onDelete={vi.fn()} isDeleting={true} />,
    );
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});
