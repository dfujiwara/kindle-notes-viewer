import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UrlDetailedChunk } from "src/models";
import { ChunkDescription } from "./ChunkDescription";

const mockDetailedChunk: UrlDetailedChunk = {
  url: {
    id: "url-1",
    url: "https://example.com/article",
    title: "Sample Article",
    chunkCount: 5,
    createdAt: "2026-01-05T00:00:00Z",
  },
  chunk: {
    id: "chunk-1",
    content: "This is the main chunk content that provides valuable insights.",
    isSummary: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  additionalContext:
    "This chunk discusses important concepts related to the topic.",
  relatedChunks: [
    {
      id: "related-1",
      content: "First related chunk content",
      isSummary: false,
      createdAt: "2024-01-14T09:15:00Z",
    },
    {
      id: "related-2",
      content: "Second related chunk content",
      isSummary: true,
      createdAt: "2024-01-16T14:20:00Z",
    },
  ],
};

const mockDetailedChunkWithoutRelated: UrlDetailedChunk = {
  url: {
    id: "url-2",
    url: "https://example.com/another-article",
    title: "Another Article",
    chunkCount: 3,
    createdAt: "2026-01-06T00:00:00Z",
  },
  chunk: {
    id: "chunk-2",
    content: "A chunk without related chunks.",
    isSummary: true,
    createdAt: "2024-01-17T11:45:00Z",
  },
  additionalContext: "Some additional context for this chunk.",
  relatedChunks: [],
};

describe("ChunkDescription", () => {
  const mockOnUrlClick = vi.fn();
  const mockOnRelatedChunkClick = vi.fn();

  beforeEach(() => {
    mockOnUrlClick.mockClear();
    mockOnRelatedChunkClick.mockClear();
  });

  describe("with related chunks", () => {
    beforeEach(() => {
      render(
        <ChunkDescription
          url={mockDetailedChunk.url}
          chunk={mockDetailedChunk.chunk}
          additionalContext={mockDetailedChunk.additionalContext}
          relatedChunks={mockDetailedChunk.relatedChunks}
          onUrlClick={mockOnUrlClick}
          onRelatedChunkClick={mockOnRelatedChunkClick}
        />,
      );
    });

    it("renders URL title and URL", () => {
      expect(screen.getByText("Sample Article")).toBeInTheDocument();
      expect(
        screen.getByText("https://example.com/article"),
      ).toBeInTheDocument();
    });

    it("renders main chunk content", () => {
      expect(
        screen.getByText(
          "This is the main chunk content that provides valuable insights.",
        ),
      ).toBeInTheDocument();
    });

    it("renders additional context section", () => {
      expect(screen.getByText("Additional Context")).toBeInTheDocument();
      expect(
        screen.getByText(
          "This chunk discusses important concepts related to the topic.",
        ),
      ).toBeInTheDocument();
    });

    it("renders related chunks section with chunks", () => {
      expect(screen.getByText("Related Chunks")).toBeInTheDocument();
      expect(
        screen.getByText("First related chunk content"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Second related chunk content"),
      ).toBeInTheDocument();
    });

    it("calls onRelatedChunkClick when related chunk is clicked", async () => {
      const user = userEvent.setup();

      const firstRelatedChunk = screen.getByText("First related chunk content");
      await user.click(firstRelatedChunk);

      expect(mockOnRelatedChunkClick).toHaveBeenCalledTimes(1);
      expect(mockOnRelatedChunkClick).toHaveBeenCalledWith("related-1");
    });

    it("shows summary badge on related chunks that are summaries", () => {
      // Should have 1 summary badge (only for related-2, not for the main chunk or related-1)
      const summaryBadges = screen.getAllByText("Summary");
      expect(summaryBadges).toHaveLength(1);
    });

    it("calls onUrlClick when URL section is clicked", async () => {
      const user = userEvent.setup();

      const urlTitle = screen.getByText("Sample Article");
      await user.click(urlTitle);

      expect(mockOnUrlClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("without related chunks", () => {
    beforeEach(() => {
      render(
        <ChunkDescription
          url={mockDetailedChunkWithoutRelated.url}
          chunk={mockDetailedChunkWithoutRelated.chunk}
          additionalContext={mockDetailedChunkWithoutRelated.additionalContext}
          relatedChunks={mockDetailedChunkWithoutRelated.relatedChunks}
          onUrlClick={mockOnUrlClick}
          onRelatedChunkClick={mockOnRelatedChunkClick}
        />,
      );
    });

    it("displays 'No related chunks found' when no related chunks exist", () => {
      expect(screen.getByText("No related chunks found")).toBeInTheDocument();
    });

    it("shows summary badge when chunk is a summary", () => {
      expect(screen.getByText("Summary")).toBeInTheDocument();
    });
  });
});
