import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type {
  KindleNoteBundle,
  TweetThreadBundle,
  UrlChunkBundle,
} from "src/models";
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

const mockTweetThreadBundles: TweetThreadBundle[] = [
  {
    thread: {
      id: "thread-1",
      rootTweetId: "tweet-root-1",
      authorUsername: "testuser",
      authorDisplayName: "Test User",
      title: "Interesting Thread About TypeScript",
      tweetCount: 2,
      fetchedAt: "2024-01-20T10:00:00Z",
      createdAt: "2024-01-20T10:00:00Z",
    },
    tweets: [
      {
        id: "tweet-1",
        tweetId: "tw-1",
        authorUsername: "testuser",
        authorDisplayName: "Test User",
        content: "TypeScript generics are powerful tools",
        mediaUrls: [],

        positionInThread: 0,
        tweetedAt: "2024-01-20T09:00:00Z",
        createdAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "tweet-2",
        tweetId: "tw-2",
        authorUsername: "testuser",
        authorDisplayName: "Test User",
        content: "Here is an example with conditional types",
        mediaUrls: [],

        positionInThread: 1,
        tweetedAt: "2024-01-20T09:01:00Z",
        createdAt: "2024-01-20T10:00:00Z",
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
        <SearchResults
          status="success"
          books={[]}
          urls={[]}
          tweetThreads={[]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  describe("books-only results", () => {
    it("renders all note bundles with book titles and authors", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={[]}
            tweetThreads={[]}
          />
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
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={[]}
            tweetThreads={[]}
          />
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
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={[]}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      const expectedDate = formatDate("2024-01-15T10:30:00Z");
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it("renders notes as clickable links with correct URLs", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={[]}
            tweetThreads={[]}
          />
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
          <SearchResults
            status="success"
            books={mockNoteBundles}
            urls={[]}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      expect(screen.queryByText("From URLs")).not.toBeInTheDocument();
    });
  });

  describe("urls-only results", () => {
    it("renders URL bundles with titles", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={mockUrlBundles}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("From URLs")).toBeInTheDocument();
      expect(screen.getByText("Example Article")).toBeInTheDocument();
    });

    it("displays URL as subtitle", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={mockUrlBundles}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("https://example.com/article/long-article-title-here"),
      ).toBeInTheDocument();
    });

    it("renders chunks as clickable links with correct paths", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={mockUrlBundles}
            tweetThreads={[]}
          />
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
          <SearchResults
            status="success"
            books={[]}
            urls={mockUrlBundles}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("Summary")).toBeInTheDocument();
    });

    it("does not show From Books section when books is empty", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={mockUrlBundles}
            tweetThreads={[]}
          />
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
            tweetThreads={[]}
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
            tweetThreads={[]}
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

  describe("tweet threads results", () => {
    it("does not show From Tweets section when tweetThreads is empty", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={[]}
          />
        </MemoryRouter>,
      );

      expect(screen.queryByText("From Tweets")).not.toBeInTheDocument();
    });

    it("renders tweet thread section heading", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={mockTweetThreadBundles}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("From Tweets")).toBeInTheDocument();
    });

    it("renders thread title as a link to the thread page", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={mockTweetThreadBundles}
          />
        </MemoryRouter>,
      );

      const titleLink = screen.getByRole("link", {
        name: "Interesting Thread About TypeScript",
      });
      expect(titleLink).toBeInTheDocument();
      expect(titleLink.getAttribute("href")).toBe("/tweets/thread-1");
    });

    it("renders thread author username", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={mockTweetThreadBundles}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("@testuser")).toBeInTheDocument();
    });

    it("renders tweets as clickable links with correct paths", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={mockTweetThreadBundles}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("TypeScript generics are powerful tools"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Here is an example with conditional types"),
      ).toBeInTheDocument();

      const links = screen.getAllByRole("link");
      const tweetLinks = links.filter((l) =>
        l.getAttribute("href")?.startsWith("/tweets/thread-1/tweets/"),
      );
      expect(tweetLinks).toHaveLength(2);
      expect(tweetLinks[0].getAttribute("href")).toBe(
        "/tweets/thread-1/tweets/tweet-1",
      );
      expect(tweetLinks[1].getAttribute("href")).toBe(
        "/tweets/thread-1/tweets/tweet-2",
      );
    });

    it("displays tweet dates", () => {
      render(
        <MemoryRouter>
          <SearchResults
            status="success"
            books={[]}
            urls={[]}
            tweetThreads={mockTweetThreadBundles}
          />
        </MemoryRouter>,
      );

      const dateCells = screen.getAllByText(formatDate("2024-01-20T09:00:00Z"));
      expect(dateCells.length).toBeGreaterThan(0);
    });
  });
});
