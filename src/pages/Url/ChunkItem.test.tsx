import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { UrlChunk } from "src/models";
import { ChunkItem } from "./ChunkItem";

const mockChunk: UrlChunk = {
  id: "1",
  content: "This is a sample chunk from the URL.",
  isSummary: false,
  createdAt: "2024-01-15T10:30:00Z",
};

describe("ChunkItem", () => {
  it("renders chunk content", () => {
    render(<ChunkItem chunk={mockChunk} onClick={() => {}} />);

    expect(
      screen.getByText("This is a sample chunk from the URL."),
    ).toBeInTheDocument();
  });

  it("shows summary badge when chunk is a summary", () => {
    const summaryChunk: UrlChunk = {
      ...mockChunk,
      isSummary: true,
    };

    render(<ChunkItem chunk={summaryChunk} onClick={() => {}} />);

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(
      screen.getByText("This is a sample chunk from the URL."),
    ).toBeInTheDocument();
  });

  it("does not show summary badge when chunk is not a summary", () => {
    render(<ChunkItem chunk={mockChunk} onClick={() => {}} />);

    expect(screen.queryByText("Summary")).not.toBeInTheDocument();
  });

  it("calls onClick when chunk is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ChunkItem chunk={mockChunk} onClick={handleClick} />);

    const chunkButton = screen.getByRole("button");
    await user.click(chunkButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
