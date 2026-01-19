import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "./httpClient";
import { searchService } from "./searchService";

// Mock httpClient
vi.mock("./httpClient", () => ({
  httpClient: {
    request: vi.fn(),
  },
}));

describe("SearchService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("search", () => {
    it("should fetch and transform search results with both books and URLs", async () => {
      const mockApiResponse = {
        data: {
          query: "test query",
          books: [
            {
              book: {
                id: "book-1",
                title: "Test Book",
                author: "Test Author",
              },
              notes: [
                {
                  id: "note-1",
                  content: "Note content",
                  created_at: "2026-01-05T00:00:00Z",
                },
              ],
            },
          ],
          urls: [
            {
              url: {
                id: "url-1",
                url: "https://example.com",
                title: "Example Site",
                chunk_count: 3,
                created_at: "2026-01-04T00:00:00Z",
              },
              chunks: [
                {
                  id: "chunk-1",
                  content: "Chunk content",
                  is_summary: false,
                  created_at: "2026-01-04T00:00:00Z",
                },
              ],
            },
          ],
          count: 2,
        },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await searchService.search("test query");

      expect(httpClient.request).toHaveBeenCalledWith("/search?q=test query");
      expect(result.data).toEqual({
        q: "test query",
        books: [
          {
            book: {
              id: "book-1",
              title: "Test Book",
              author: "Test Author",
            },
            notes: [
              {
                id: "note-1",
                content: "Note content",
                createdAt: "2026-01-05T00:00:00Z",
              },
            ],
          },
        ],
        urls: [
          {
            url: {
              id: "url-1",
              url: "https://example.com",
              title: "Example Site",
              chunkCount: 3,
              createdAt: "2026-01-04T00:00:00Z",
            },
            chunks: [
              {
                id: "chunk-1",
                content: "Chunk content",
                isSummary: false,
                createdAt: "2026-01-04T00:00:00Z",
              },
            ],
          },
        ],
        count: 2,
      });
    });

    it("should transform isSummary field correctly for URL chunks", async () => {
      const mockApiResponse = {
        data: {
          query: "summary test",
          books: [],
          urls: [
            {
              url: {
                id: "url-1",
                url: "https://example.com",
                title: "Example Site",
                chunk_count: 2,
                created_at: "2026-01-04T00:00:00Z",
              },
              chunks: [
                {
                  id: "chunk-1",
                  content: "Summary chunk",
                  is_summary: true,
                  created_at: "2026-01-04T00:00:00Z",
                },
                {
                  id: "chunk-2",
                  content: "Regular chunk",
                  is_summary: false,
                  created_at: "2026-01-04T00:00:00Z",
                },
              ],
            },
          ],
          count: 2,
        },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await searchService.search("summary test");

      expect(result.data.urls[0].chunks[0].isSummary).toBe(true);
      expect(result.data.urls[0].chunks[1].isSummary).toBe(false);
    });

    it("should handle empty books and URLs arrays", async () => {
      const mockApiResponse = {
        data: {
          query: "no results",
          books: [],
          urls: [],
          count: 0,
        },
        status: 200,
      };

      vi.mocked(httpClient.request).mockResolvedValue(mockApiResponse);

      const result = await searchService.search("no results");

      expect(result.data).toEqual({
        q: "no results",
        books: [],
        urls: [],
        count: 0,
      });
    });
  });
});
