import { act, renderHook } from "@testing-library/react";
import { urlService } from "src/api";
import type { UrlDetailedChunk } from "src/models";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { useStreamedDetailedChunk } from "./useStreamedDetailedChunk";

// Mock urlService
vi.mock("src/api", () => ({
  urlService: {
    getStreamedRandomChunk: vi.fn(),
  },
}));

// Mock EventSource
class MockEventSource {
  close = vi.fn();
}

describe("useStreamedDetailedChunk", () => {
  let mockEventSource: MockEventSource;
  let onMetadataCallback: (chunk: UrlDetailedChunk) => void;
  let onContextChunkCallback: (content: string) => void;
  let onCompleteCallback: () => void;
  let onInStreamErrorCallback: () => void;
  let onErrorCallback: ((error: Event) => void) | undefined;

  const mockChunk: UrlDetailedChunk = {
    url: {
      id: "url-1",
      url: "https://example.com/article",
      title: "Test Article",
      chunkCount: 5,
      createdAt: "2026-01-05T00:00:00Z",
    },
    chunk: {
      id: "chunk-1",
      content: "Test chunk content",
      isSummary: false,
      createdAt: "2024-01-01T00:00:00Z",
    },
    additionalContext: "",
    relatedChunks: [
      {
        id: "chunk-2",
        content: "Related chunk",
        isSummary: true,
        createdAt: "2024-01-02T00:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    mockEventSource = new MockEventSource();
    vi.mocked(urlService.getStreamedRandomChunk).mockImplementation(
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
    const { result } = renderHook(() => useStreamedDetailedChunk());
    expect(result.current).toEqual({ status: "loading" });
  });

  it("should transition to streaming state when metadata is received", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());

    act(() => {
      onMetadataCallback(mockChunk);
    });

    expect(result.current).toEqual({
      status: "streaming",
      data: mockChunk,
    });
  });

  it("should append context chunks to additionalContext", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());

    act(() => {
      onMetadataCallback(mockChunk);
      onContextChunkCallback("First chunk. ");
      onContextChunkCallback("Second chunk.");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.additionalContext).toBe(
      "First chunk. Second chunk.",
    );
  });

  it("should preserve chunk data while appending context chunks", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());

    act(() => {
      onMetadataCallback(mockChunk);
      onContextChunkCallback("New context");
    });

    assert(result.current.status === "streaming");
    expect(result.current.data.url).toEqual(mockChunk.url);
    expect(result.current.data.chunk).toEqual(mockChunk.chunk);
    expect(result.current.data.relatedChunks).toEqual(mockChunk.relatedChunks);
    expect(result.current.data.additionalContext).toBe("New context");
  });

  it("should transition to success state when streaming completes", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());

    act(() => {
      onMetadataCallback(mockChunk);
      onContextChunkCallback("Complete context");
      onCompleteCallback();
    });

    expect(result.current).toEqual({
      status: "success",
      data: {
        ...mockChunk,
        additionalContext: "Complete context",
      },
    });
  });

  it("should handle in-stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());
    act(() => {
      onInStreamErrorCallback();
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream chunk");
  });

  it("should handle stream error and transition to error state", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());
    act(() => {
      onErrorCallback?.(new Event("error"));
    });
    assert(result.current.status === "error");
    expect(result.current.error.message).toBe("Failed to stream chunk");
  });

  it("should close EventSource on unmount", () => {
    const { unmount } = renderHook(() => useStreamedDetailedChunk());
    unmount();
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it("should maintain empty additionalContext if no chunks received", async () => {
    const { result } = renderHook(() => useStreamedDetailedChunk());
    act(() => {
      onMetadataCallback(mockChunk);
      onCompleteCallback();
    });
    assert(result.current.status === "success");
    expect(result.current.data.additionalContext).toBe("");
  });
});
