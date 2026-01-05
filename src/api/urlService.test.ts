import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Url, UrlChunkBundle, UrlDetailedChunk } from "../models/url";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import { urlService } from "./urlService";

// Mock httpClient
vi.mock("./httpClient", () => ({
  httpClient: {
    request: vi.fn(),
  },
}));

// Mock sseClient
vi.mock("./sseClient", () => ({
  sseClient: {
    createEventSourceWithHandlers: vi.fn(),
  },
}));

// Mock logger
vi.mock("src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("UrlService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUrls", () => {
    it("should fetch and transform URLs from snake_case to camelCase", async () => {
      const mockApiResponse = {
        data: {
          urls: [
            {
              id: "1",
              url: "https://example.com",
              title: "Example Site",
              chunk_count: 5,
              created_at: "2026-01-05T00:00:00Z",
            },
            {
              id: "2",
              url: "https://test.com",
              title: "Test Site",
              chunk_count: 3,
              created_at: "2026-01-04T00:00:00Z",
            },
          ],
        },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await urlService.getUrls();

      expect(httpClient.request).toHaveBeenCalledWith("/urls");
      expect(result.data).toEqual([
        {
          id: "1",
          url: "https://example.com",
          title: "Example Site",
          chunkCount: 5,
          createdAt: "2026-01-05T00:00:00Z",
        },
        {
          id: "2",
          url: "https://test.com",
          title: "Test Site",
          chunkCount: 3,
          createdAt: "2026-01-04T00:00:00Z",
        },
      ] as Url[]);
    });

    it("should handle empty urls array", async () => {
      const mockApiResponse = {
        data: { urls: [] },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await urlService.getUrls();

      expect(result.data).toEqual([]);
    });

    it("should handle missing urls field", async () => {
      const mockApiResponse = {
        data: {},
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await urlService.getUrls();

      expect(result.data).toEqual([]);
    });
  });

  describe("uploadUrl", () => {
    it("should upload a URL with POST request", async () => {
      const mockApiResponse = {
        data: { success: true },
        status: 201,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await urlService.uploadUrl("https://example.com");

      expect(httpClient.request).toHaveBeenCalledWith("/urls", {
        method: "POST",
        headers: {},
        body: { url: "https://example.com" },
      });
      expect(result.data).toEqual({ success: true });
    });
  });

  describe("getChunksFromUrl", () => {
    it("should fetch and transform chunks from snake_case to camelCase", async () => {
      const mockApiResponse = {
        data: {
          url: {
            id: "url-1",
            url: "https://example.com",
            title: "Example Site",
            chunk_count: 2,
            created_at: "2026-01-05T00:00:00Z",
          },
          chunks: [
            {
              id: "chunk-1",
              content: "First chunk content",
              is_summary: false,
              created_at: "2026-01-05T00:00:00Z",
            },
            {
              id: "chunk-2",
              content: "Second chunk content",
              is_summary: false,
              created_at: "2026-01-05T00:00:00Z",
            },
          ],
        },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await urlService.getChunksFromUrl("url-1");

      expect(httpClient.request).toHaveBeenCalledWith("/urls/url-1");
      expect(result.data).toEqual({
        url: {
          id: "url-1",
          url: "https://example.com",
          title: "Example Site",
          chunkCount: 2,
          createdAt: "2026-01-05T00:00:00Z",
        },
        chunks: [
          {
            id: "chunk-1",
            content: "First chunk content",
            isSummary: false,
            createdAt: "2026-01-05T00:00:00Z",
          },
          {
            id: "chunk-2",
            content: "Second chunk content",
            isSummary: false,
            createdAt: "2026-01-05T00:00:00Z",
          },
        ],
      } as UrlChunkBundle);
    });
  });

  describe("getStreamedChunk", () => {
    it("should create event source with correct handlers", () => {
      const mockEventSource = {} as EventSource;
      vi.mocked(sseClient.createEventSourceWithHandlers).mockReturnValue(
        mockEventSource,
      );

      const handlers = {
        onMetadata: vi.fn(),
        onContextChunk: vi.fn(),
        onComplete: vi.fn(),
        onInStreamError: vi.fn(),
      };

      const result = urlService.getStreamedChunk("url-1", "chunk-1", handlers);

      expect(sseClient.createEventSourceWithHandlers).toHaveBeenCalledWith(
        "/urls/url-1/chunks/chunk-1",
        expect.objectContaining({
          metadata: expect.any(Function),
          context_chunk: expect.any(Function),
          context_complete: expect.any(Function),
          error: expect.any(Function),
        }),
        undefined,
      );
      expect(result).toBe(mockEventSource);
    });

    it("should transform metadata correctly in handler", () => {
      const mockEventSource = {
        close: vi.fn(),
      } as unknown as EventSource;

      let metadataHandler: (data: unknown, es: EventSource) => void = () => {};

      vi.mocked(sseClient.createEventSourceWithHandlers).mockImplementation(
        (_url, handlers) => {
          metadataHandler = handlers.metadata as typeof metadataHandler;
          return mockEventSource;
        },
      );

      const handlers = {
        onMetadata: vi.fn(),
        onContextChunk: vi.fn(),
        onComplete: vi.fn(),
        onInStreamError: vi.fn(),
      };

      urlService.getStreamedChunk("url-1", "chunk-1", handlers);

      // Simulate metadata event
      const mockMetadata = {
        url: {
          id: "url-1",
          url: "https://example.com",
          title: "Example Site",
          chunk_count: 3,
          created_at: "2026-01-05T00:00:00Z",
        },
        chunk: {
          id: "chunk-1",
          content: "Chunk content",
          is_summary: false,
          created_at: "2026-01-05T00:00:00Z",
        },
        related_chunks: [
          {
            id: "chunk-2",
            content: "Related content",
            is_summary: false,
            created_at: "2026-01-05T00:00:00Z",
          },
        ],
      };

      metadataHandler(mockMetadata, mockEventSource);

      expect(handlers.onMetadata).toHaveBeenCalledWith({
        url: {
          id: "url-1",
          url: "https://example.com",
          title: "Example Site",
          chunkCount: 3,
          createdAt: "2026-01-05T00:00:00Z",
        },
        chunk: {
          id: "chunk-1",
          content: "Chunk content",
          isSummary: false,
          createdAt: "2026-01-05T00:00:00Z",
        },
        additionalContext: "",
        relatedChunks: [
          {
            id: "chunk-2",
            content: "Related content",
            isSummary: false,
            createdAt: "2026-01-05T00:00:00Z",
          },
        ],
      } as UrlDetailedChunk);
    });
  });

  describe("getStreamedRandomChunk", () => {
    it("should create event source for random chunk endpoint", () => {
      const mockEventSource = {} as EventSource;
      vi.mocked(sseClient.createEventSourceWithHandlers).mockReturnValue(
        mockEventSource,
      );

      const handlers = {
        onMetadata: vi.fn(),
        onContextChunk: vi.fn(),
        onComplete: vi.fn(),
        onInStreamError: vi.fn(),
      };

      const result = urlService.getStreamedRandomChunk(handlers);

      expect(sseClient.createEventSourceWithHandlers).toHaveBeenCalledWith(
        "/urls/random",
        expect.objectContaining({
          metadata: expect.any(Function),
          context_chunk: expect.any(Function),
          context_complete: expect.any(Function),
          error: expect.any(Function),
        }),
        undefined,
      );
      expect(result).toBe(mockEventSource);
    });
  });
});
