import { act, renderHook } from "@testing-library/react";
import { randomService } from "src/api";
import type { RandomContent } from "src/models";
import { useStreamedRandomContent } from "./useStreamedRandomContent";

// Mock randomService
vi.mock("src/api", () => ({
  randomService: {
    getStreamedRandomContent: vi.fn(),
  },
}));

// Mock EventSource
class MockEventSource {
  close = vi.fn();
}

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
  additionalContext: "",
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
  additionalContext: "",
  relatedItems: [],
};

describe("useStreamedRandomContent", () => {
  let mockEventSource: MockEventSource;
  let onMetadataCallback: (content: RandomContent) => void;
  let onContextChunkCallback: (content: string) => void;
  let onCompleteCallback: () => void;
  let onInStreamErrorCallback: () => void;
  let onErrorCallback: ((error: Event) => void) | undefined;

  beforeEach(() => {
    mockEventSource = new MockEventSource();
    vi.mocked(randomService.getStreamedRandomContent).mockImplementation(
      (handlers) => {
        onMetadataCallback = handlers.onMetadata;
        onContextChunkCallback = handlers.onContextChunk;
        onCompleteCallback = handlers.onComplete;
        onInStreamErrorCallback = handlers.onInStreamError;
        onErrorCallback = handlers.onError;
        return mockEventSource as unknown as EventSource;
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start in loading state", () => {
    const { result } = renderHook(() => useStreamedRandomContent());
    expect(result.current).toEqual({ status: "loading" });
  });

  it("should transition to streaming state when metadata is received (note)", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());

    act(() => {
      onMetadataCallback(mockNoteContent);
    });

    expect(result.current).toEqual({
      status: "streaming",
      data: mockNoteContent,
    });
  });

  it("should transition to streaming state when metadata is received (chunk)", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());

    act(() => {
      onMetadataCallback(mockChunkContent);
    });

    expect(result.current).toEqual({
      status: "streaming",
      data: mockChunkContent,
    });
  });

  it("should append context chunks to additionalContext", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());

    act(() => {
      onMetadataCallback(mockNoteContent);
      onContextChunkCallback("First chunk. ");
      onContextChunkCallback("Second chunk.");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.additionalContext).toBe(
      "First chunk. Second chunk.",
    );
  });

  it("should preserve content data while appending context chunks", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());

    act(() => {
      onMetadataCallback(mockNoteContent);
      onContextChunkCallback("New context");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.source).toEqual(mockNoteContent.source);
    expect(result.current.data.content).toEqual(mockNoteContent.content);
    expect(result.current.data.relatedItems).toEqual(
      mockNoteContent.relatedItems,
    );
    expect(result.current.data.additionalContext).toBe("New context");
  });

  it("should transition to success state when streaming completes", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());

    act(() => {
      onMetadataCallback(mockNoteContent);
      onContextChunkCallback("Complete context");
      onCompleteCallback();
    });

    expect(result.current).toEqual({
      status: "success",
      data: {
        ...mockNoteContent,
        additionalContext: "Complete context",
      },
    });
  });

  it("should handle in-stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());
    act(() => {
      onInStreamErrorCallback();
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe(
      "Failed to stream random content",
    );
  });

  it("should handle stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());
    act(() => {
      onErrorCallback?.(new Event("error"));
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe(
      "Failed to stream random content",
    );
  });

  it("should close EventSource on unmount", () => {
    const { unmount } = renderHook(() => useStreamedRandomContent());
    unmount();
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it("should maintain empty additionalContext if no chunks received", async () => {
    const { result } = renderHook(() => useStreamedRandomContent());
    act(() => {
      onMetadataCallback(mockNoteContent);
      onCompleteCallback();
    });
    assert(result.current.status === "success");
    expect(result.current.data.additionalContext).toBe("");
  });
});
