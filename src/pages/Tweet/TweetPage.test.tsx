import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { tweetService } from "src/api";
import type { TweetThreadBundle } from "src/models";
import { TweetPage } from "./TweetPage";

vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    tweetService: {
      getTweetThread: vi.fn(),
    },
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ threadId: "thread-1" }),
    useNavigate: () => mockNavigate,
  };
});

const mockBundle: TweetThreadBundle = {
  thread: {
    id: "thread-1",
    rootTweetId: "tweet-1",
    authorUsername: "user1",
    authorDisplayName: "User One",
    title: "Test Thread Title",
    tweetCount: 2,
    fetchedAt: "2026-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  },
  tweets: [
    {
      id: "tweet-1",
      tweetId: "ext-1",
      authorUsername: "user1",
      authorDisplayName: "User One",
      content: "First tweet content",
      mediaUrls: [],

      positionInThread: 0,
      tweetedAt: "2026-01-01T00:00:00Z",
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "tweet-2",
      tweetId: "ext-2",
      authorUsername: "user1",
      authorDisplayName: "User One",
      content: "Second tweet content",
      mediaUrls: [],

      positionInThread: 1,
      tweetedAt: "2026-01-01T00:00:00Z",
      createdAt: "2026-01-01T00:00:00Z",
    },
  ],
};

function renderTweetPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <TweetPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("TweetPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tweetService.getTweetThread).mockResolvedValue({
      data: mockBundle,
      status: 200,
    });
  });

  it("renders thread title and author info", async () => {
    renderTweetPage();

    await waitFor(() => {
      expect(screen.getByText("Test Thread Title")).toBeInTheDocument();
      expect(screen.getByText(/User One/)).toBeInTheDocument();
      expect(screen.getByText(/2 tweets/)).toBeInTheDocument();
    });
  });

  it("renders all tweets in the thread", async () => {
    renderTweetPage();

    await waitFor(() => {
      expect(screen.getByText("First tweet content")).toBeInTheDocument();
      expect(screen.getByText("Second tweet content")).toBeInTheDocument();
    });
  });

  it("navigates to tweet detail on tweet click", async () => {
    const user = userEvent.setup();
    renderTweetPage();

    await waitFor(() => {
      expect(screen.getByText("First tweet content")).toBeInTheDocument();
    });
    await user.click(screen.getByText("First tweet content"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/tweets/thread-1/tweets/tweet-1",
      );
    });
  });

  it("shows empty state when thread has no tweets", async () => {
    vi.mocked(tweetService.getTweetThread).mockResolvedValue({
      data: { ...mockBundle, tweets: [] },
      status: 200,
    });

    renderTweetPage();

    await waitFor(() => {
      expect(screen.getByText("No tweets found")).toBeInTheDocument();
    });
  });
});
