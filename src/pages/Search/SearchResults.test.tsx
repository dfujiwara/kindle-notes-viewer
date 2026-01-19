import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { KindleNoteBundle, UrlChunkBundle } from "src/models";
import { formatDate } from "src/utils/date";
import { SearchResults } from "./SearchResults";

const mockNoteBundles: KindleNoteBundle[] = [
  {
    book: {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    },
    notes: [
      {
        id: "note-1",
        content: "In my younger and more vulnerable years",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "note-2",
        content: "So we beat on, boats against the current",
        createdAt: "2024-01-16T14:20:00Z",
      },
    ],
  },
  {
    book: {
      id: "2",
      title: "1984",
      author: "George Orwell",
    },
    notes: [
      {
        id: "note-3",
        content: "War is peace. Freedom is slavery. Ignorance is strength.",
        createdAt: "2024-01-20T09:15:00Z",
      },
    ],
  },
];

const mockUrlBundles: UrlChunkBundle[] = [
  {
    url: {
      id: "url-1",
      url: "https://example.com/article/long-article-title-here",
      title: "Example Article",
      chunkCount: 2,
      createdAt: "2024-01-18T12:00:00Z",
    },
    chunks: [
      {
        id: "chunk-1",
        content: "This is a summary of the article",
        isSummary: true,
        createdAt: "2024-01-18T12:00:00Z",
      },
      {
        id: "chunk-2",
        content: "This is a regular chunk of content",
        isSummary: false,
        createdAt: "2024-01-18T12:01:00Z",
      },
    ],
  },
];

describe("SearchResults", () => {
  it("displays initial message when status is idle", () => {
    render(
      <MemoryRouter>
        <SearchResults status="idle" />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Enter a search query and press Enter to find notes"),
    ).toBeInTheDocument();
  });

  it("displays error message when status is error", () => {
    render(
      <MemoryRouter>
        <SearchResults status="error" errorMessage="Network error occurred" />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Error: Network error occurred"),
    ).toBeInTheDocument();
  });

  it("displays loading state when status is loading", () => {
    render(
      <MemoryRouter>
        <SearchResults status="loading" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("displays no results message when status is success with empty books and urls", () => {
    render(
      <MemoryRouter>
        <SearchResults status="success" books={[]} urls={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  describe("books-only results", () => {
    it("renders all note bundles with book titles and authors", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={mockNoteBundles} urls={[]} />
        </MemoryRouter>,
      );

      expect(screen.getByText("From Books")).toBeInTheDocument();
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
      expect(screen.getByText("1984")).toBeInTheDocument();
      expect(screen.getByText("George Orwell")).toBeInTheDocument();
    });

    it("renders all notes within each bundle", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={mockNoteBundles} urls={[]} />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("In my younger and more vulnerable years"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("So we beat on, boats against the current"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "War is peace. Freedom is slavery. Ignorance is strength.",
        ),
      ).toBeInTheDocument();
    });

    it("formats and displays note creation dates", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={mockNoteBundles} urls={[]} />
        </MemoryRouter>,
      );

      const expectedDate = formatDate("2024-01-15T10:30:00Z");
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it("renders notes as clickable links with correct URLs", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={mockNoteBundles} urls={[]} />
        </MemoryRouter>,
      );

      const firstNoteLink = screen.getByRole("link", {
        name: /In my younger and more vulnerable years/i,
      });
      expect(firstNoteLink).toHaveAttribute("href", "/books/1/notes/note-1");

      const secondNoteLink = screen.getByRole("link", {
        name: /So we beat on, boats against the current/i,
      });
      expect(secondNoteLink).toHaveAttribute("href", "/books/1/notes/note-2");

      const thirdNoteLink = screen.getByRole("link", {
        name: /War is peace/i,
      });
      expect(thirdNoteLink).toHaveAttribute("href", "/books/2/notes/note-3");
    });

    it("does not show From URLs section when urls is empty", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={mockNoteBundles} urls={[]} />
        </MemoryRouter>,
      );

      expect(screen.queryByText("From URLs")).not.toBeInTheDocument();
    });
  });

  describe("urls-only results", () => {
    it("renders URL bundles with titles", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={[]} urls={mockUrlBundles} />
        </MemoryRouter>,
      );

      expect(screen.getByText("From URLs")).toBeInTheDocument();
      expect(screen.getByText("Example Article")).toBeInTheDocument();
    });

    it("displays URL as subtitle", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={[]} urls={mockUrlBundles} />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("https://example.com/article/long-article-title-here"),
      ).toBeInTheDocument();
    });

    it("renders chunks as clickable links with correct paths", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={[]} urls={mockUrlBundles} />
        </MemoryRouter>,
      );

      const summaryLink = screen.getByRole("link", {
        name: /This is a summary of the article/i,
      });
      expect(summaryLink).toHaveAttribute("href", "/urls/url-1/chunks/chunk-1");

      const regularLink = screen.getByRole("link", {
        name: /This is a regular chunk of content/i,
      });
      expect(regularLink).toHaveAttribute("href", "/urls/url-1/chunks/chunk-2");
    });

    it("displays Summary badge for summary chunks", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={[]} urls={mockUrlBundles} />
        </MemoryRouter>,
      );

      expect(screen.getByText("Summary")).toBeInTheDocument();
    });

    it("does not show From Books section when books is empty", () => {
      render(
        <MemoryRouter>
          <SearchResults status="success" books={[]} urls={mockUrlBundles} />
        </MemoryRouter>,
      );

      expect(screen.queryByText("From Books")).not.toBeInTheDocument();
    });
  });

  describe("mixed results (both books and urls)", () => {
    it("renders both sections", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={mockUrlBundles}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("From Books")).toBeInTheDocument();
      expect(screen.getByText("From URLs")).toBeInTheDocument();
    });

    it("renders content from both books and URLs", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={mockUrlBundles}
          />
        </MemoryRouter>,
      );

      // Books content
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(
        screen.getByText("In my younger and more vulnerable years"),
      ).toBeInTheDocument();

      // URLs content
      expect(screen.getByText("Example Article")).toBeInTheDocument();
      expect(
        screen.getByText("This is a summary of the article"),
      ).toBeInTheDocument();
    });
  });
});
