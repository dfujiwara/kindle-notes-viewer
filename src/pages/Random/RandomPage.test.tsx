import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import type { RandomContent } from "src/models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RandomPage } from "./RandomPage";

// Mock the hook
const mockUseStreamedRandomContent = vi.fn();

vi.mock("./useStreamedRandomContent", () => ({
  useStreamedRandomContent: () => mockUseStreamedRandomContent(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNoteContent: RandomContent = {
  source: {
    id: "book-1",
    title: "Test Book",
    type: "book",
    author: "Test Author",
    createdAt: "2024-01-01T00:00:00Z",
  },
  content: {
    id: "note-1",
    contentType: "note",
    content: "Test note content",
    createdAt: "2024-01-01T00:00:00Z",
  },
  additionalContext: "Additional context for note",
  relatedItems: [
    {
      id: "related-note-1",
      contentType: "note",
      content: "Related note content",
      createdAt: "2024-01-02T00:00:00Z",
    },
  ],
};

const mockChunkContent: RandomContent = {
  source: {
    id: "url-1",
    title: "Test Article",
    type: "url",
    url: "https://example.com/article",
    createdAt: "2026-01-05T00:00:00Z",
  },
  content: {
    id: "chunk-1",
    contentType: "url_chunk",
    content: "Test chunk content",
    isSummary: false,
    chunkOrder: 0,
    createdAt: "2024-01-01T00:00:00Z",
  },
  additionalContext: "Additional context for chunk",
  relatedItems: [
    {
      id: "related-chunk-1",
      contentType: "url_chunk",
      content: "Related chunk content",
      isSummary: true,
      chunkOrder: 1,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ],
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("RandomPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStreamedRandomContent.mockReturnValue({ status: "loading" });
  });

  describe("loading state", () => {
    it("renders loading indicator when loading", () => {
      mockUseStreamedRandomContent.mockReturnValue({ status: "loading" });

      renderWithRouter(<RandomPage />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("when showing note content", () => {
    it("renders NoteDescription on success", () => {
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockNoteContent,
      });

      renderWithRouter(<RandomPage />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("by Test Author")).toBeInTheDocument();
      expect(screen.getByText("Test note content")).toBeInTheDocument();
    });

    it("renders NoteDescription during streaming", () => {
      mockUseStreamedRandomContent.mockReturnValue({
        status: "streaming",
        data: mockNoteContent,
      });

      renderWithRouter(<RandomPage />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("Test note content")).toBeInTheDocument();
    });

    it("navigates to book page when book is clicked", async () => {
      const user = userEvent.setup();
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockNoteContent,
      });

      renderWithRouter(<RandomPage />);

      const bookButton = screen.getByRole("button", { name: /Test Book/i });
      await user.click(bookButton);

      expect(mockNavigate).toHaveBeenCalledWith("/books/book-1/");
    });

    it("navigates to related note when clicked", async () => {
      const user = userEvent.setup();
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockNoteContent,
      });

      renderWithRouter(<RandomPage />);

      const relatedNoteButton = screen.getByText("Related note content");
      await user.click(relatedNoteButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/books/book-1/notes/related-note-1",
      );
    });
  });

  describe("when showing chunk content", () => {
    it("renders ChunkDescription on success", () => {
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockChunkContent,
      });

      renderWithRouter(<RandomPage />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(
        screen.getByText("https://example.com/article"),
      ).toBeInTheDocument();
      expect(screen.getByText("Test chunk content")).toBeInTheDocument();
    });

    it("renders ChunkDescription during streaming", () => {
      mockUseStreamedRandomContent.mockReturnValue({
        status: "streaming",
        data: mockChunkContent,
      });

      renderWithRouter(<RandomPage />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("Test chunk content")).toBeInTheDocument();
    });

    it("navigates to URL page when URL is clicked", async () => {
      const user = userEvent.setup();
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockChunkContent,
      });

      renderWithRouter(<RandomPage />);

      const urlButton = screen.getByRole("button", { name: /Test Article/i });
      await user.click(urlButton);

      expect(mockNavigate).toHaveBeenCalledWith("/urls/url-1/");
    });

    it("navigates to related chunk when clicked", async () => {
      const user = userEvent.setup();
      mockUseStreamedRandomContent.mockReturnValue({
        status: "success",
        data: mockChunkContent,
      });

      renderWithRouter(<RandomPage />);

      const relatedChunkButton = screen.getByText("Related chunk content");
      await user.click(relatedChunkButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/urls/url-1/chunks/related-chunk-1",
      );
    });
  });

  describe("error handling", () => {
    it("throws error on error state", () => {
      const testError = new Error("Random content streaming failed");
      mockUseStreamedRandomContent.mockReturnValue({
        status: "error",
        error: testError,
      });

      expect(() => renderWithRouter(<RandomPage />)).toThrow(
        "Random content streaming failed",
      );
    });
  });
});
