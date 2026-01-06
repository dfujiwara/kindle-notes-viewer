import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { UrlChunk } from "src/models";
import { ChunkList } from "./ChunkList";

const mockChunks: UrlChunk[] = [
  {
    id: "1",
    content: "First chunk from the URL.",
    isSummary: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    content: "Second chunk with different content.",
    isSummary: true,
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    content: "Third chunk for testing purposes.",
    isSummary: false,
    createdAt: "2024-01-17T09:15:00Z",
  },
];

describe("ChunkList", () => {
  it("renders all chunks when chunks array is not empty", () => {
    render(
      <MemoryRouter>
        <ChunkList urlId="test-url-id" chunks={mockChunks} />
      </MemoryRouter>,
    );

    expect(screen.getByText("First chunk from the URL.")).toBeInTheDocument();
    expect(
      screen.getByText("Second chunk with different content."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Third chunk for testing purposes."),
    ).toBeInTheDocument();
  });

  it("displays 'No chunks found' message when chunks array is empty", () => {
    render(
      <MemoryRouter>
        <ChunkList urlId="test-url-id" chunks={[]} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("No chunks found for this URL."),
    ).toBeInTheDocument();
  });
});
