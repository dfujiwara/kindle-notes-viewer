import { act, renderHook } from "@testing-library/react";
import { notesService } from "src/api";
import type { KindleDetailedNote } from "src/models";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { useStreamedDetailedNote } from "./useStreamedDetailedNote";

// Mock notesService
vi.mock("src/api", () => ({
  notesService: {
    getStreamedRandomNote: vi.fn(),
  },
}));

// Mock EventSource
class MockEventSource {
  close = vi.fn();
}

describe("useStreamedDetailedNote", () => {
  let mockEventSource: MockEventSource;
  let onMetadataCallback: (note: KindleDetailedNote) => void;
  let onContextChunkCallback: (content: string) => void;
  let onCompleteCallback: () => void;
  let onInStreamErrorCallback: () => void;
  let onErrorCallback: ((error: Event) => void) | undefined;

  const mockNote: KindleDetailedNote = {
    book: {
      id: "book-1",
      title: "Test Book",
      author: "Test Author",
    },
    note: {
      id: "note-1",
      content: "Test note content",
      createdAt: "2024-01-01T00:00:00Z",
    },
    additionalContext: "",
    relatedNotes: [
      {
        id: "note-2",
        content: "Related note",
        createdAt: "2024-01-02T00:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    mockEventSource = new MockEventSource();
    vi.mocked(notesService.getStreamedRandomNote).mockImplementation(
      (onMetadata, onContextChunk, onComplete, onInStreamError, onError) => {
        onMetadataCallback = onMetadata;
        onContextChunkCallback = onContextChunk;
        onCompleteCallback = onComplete;
        onInStreamErrorCallback = onInStreamError;
        onErrorCallback = onError;
        return mockEventSource as unknown as EventSource;
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start in loading state", () => {
    const { result } = renderHook(() => useStreamedDetailedNote());
    expect(result.current).toEqual({ status: "loading" });
  });

  it("should transition to streaming state when metadata is received", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());

    act(() => {
      onMetadataCallback(mockNote);
    });

    expect(result.current).toEqual({
      status: "streaming",
      note: mockNote,
    });
  });

  it("should append context chunks to additionalContext", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());

    act(() => {
      onMetadataCallback(mockNote);
      onContextChunkCallback("First chunk. ");
      onContextChunkCallback("Second chunk.");
    });

    assert(result.current.status === "streaming");
    expect(result.current.note.additionalContext).toBe(
      "First chunk. Second chunk.",
    );
  });

  it("should preserve note data while appending context chunks", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());

    act(() => {
      onMetadataCallback(mockNote);
      onContextChunkCallback("New context");
    });

    assert(result.current.status === "streaming");
    expect(result.current.note.book).toEqual(mockNote.book);
    expect(result.current.note.note).toEqual(mockNote.note);
    expect(result.current.note.relatedNotes).toEqual(mockNote.relatedNotes);
    expect(result.current.note.additionalContext).toBe("New context");
  });

  it("should transition to success state when streaming completes", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());

    act(() => {
      onMetadataCallback(mockNote);
      onContextChunkCallback("Complete context");
      onCompleteCallback();
    });

    expect(result.current).toEqual({
      status: "success",
      note: {
        ...mockNote,
        additionalContext: "Complete context",
      },
    });
  });

  it("should handle in-stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());
    act(() => {
      onInStreamErrorCallback();
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream note");
  });

  it("should handle stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());
    act(() => {
      onErrorCallback?.(new Event("error"));
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream note");
  });

  it("should close EventSource on unmount", () => {
    const { unmount } = renderHook(() => useStreamedDetailedNote());
    unmount();
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it("should handle full streaming lifecycle", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());

    // Initial state
    expect(result.current.status).toBe("loading");

    act(() => {
      onMetadataCallback(mockNote);
    });
    expect(result.current.status).toBe("streaming");

    act(() => {
      onContextChunkCallback("This is ");
      onContextChunkCallback("a complete ");
      onContextChunkCallback("context.");
    });

    assert(result.current.status === "streaming");
    expect(result.current.note.additionalContext).toBe(
      "This is a complete context.",
    );

    act(() => {
      onCompleteCallback();
    });
    expect(result.current.status).toBe("success");
    expect(result.current.note.additionalContext).toBe(
      "This is a complete context.",
    );
  });

  it("should maintain empty additionalContext if no chunks received", async () => {
    const { result } = renderHook(() => useStreamedDetailedNote());
    act(() => {
      onMetadataCallback(mockNote);
      onCompleteCallback();
    });
    assert(result.current.status === "success");
    expect(result.current.note.additionalContext).toBe("");
  });
});
