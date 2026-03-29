import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Tweet, TweetThread } from "src/models";
import { TweetDescription } from "./TweetDescription";

const mockThread: TweetThread = {
  id: "thread-1",
  rootTweetId: "tweet-1",
  authorUsername: "user1",
  authorDisplayName: "User One",
  title: "Test Thread Title",
  tweetCount: 3,
  fetchedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

const mockTweet: Tweet = {
  id: "tweet-1",
  tweetId: "ext-1",
  authorUsername: "user1",
  authorDisplayName: "User One",
  content: "This is the main tweet content.",
  mediaUrls: [],
  threadId: "thread-1",
  positionInThread: 0,
  tweetedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

const mockRelatedTweets: Tweet[] = [
  {
    id: "tweet-2",
    tweetId: "ext-2",
    authorUsername: "user1",
    authorDisplayName: "User One",
    content: "First related tweet",
    mediaUrls: [],
    threadId: "thread-1",
    positionInThread: 1,
    tweetedAt: "2026-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tweet-3",
    tweetId: "ext-3",
    authorUsername: "user1",
    authorDisplayName: "User One",
    content: "Second related tweet",
    mediaUrls: [],
    threadId: "thread-1",
    positionInThread: 2,
    tweetedAt: "2026-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

describe("TweetDescription", () => {
  const mockOnThreadClick = vi.fn();
  const mockOnRelatedTweetClick = vi.fn();

  beforeEach(() => {
    mockOnThreadClick.mockClear();
    mockOnRelatedTweetClick.mockClear();
  });

  describe("with related tweets", () => {
    beforeEach(() => {
      render(
        <TweetDescription
          thread={mockThread}
          tweet={mockTweet}
          relatedTweets={mockRelatedTweets}
          additionalContext="Some additional context here."
          onThreadClick={mockOnThreadClick}
          onRelatedTweetClick={mockOnRelatedTweetClick}
        />,
      );
    });

    it("renders thread title", () => {
      expect(screen.getByText("Test Thread Title")).toBeInTheDocument();
    });

    it("renders thread author and tweet count", () => {
      expect(screen.getByText(/3 tweets/)).toBeInTheDocument();
    });

    it("renders main tweet content", () => {
      expect(
        screen.getByText("This is the main tweet content."),
      ).toBeInTheDocument();
    });

    it("renders tweet position in thread", () => {
      expect(screen.getByText(/tweet 1/)).toBeInTheDocument();
    });

    it("renders additional context section", () => {
      expect(screen.getByText("Additional Context")).toBeInTheDocument();
      expect(
        screen.getByText("Some additional context here."),
      ).toBeInTheDocument();
    });

    it("renders related tweets", () => {
      expect(screen.getByText("Related Tweets")).toBeInTheDocument();
      expect(screen.getByText("First related tweet")).toBeInTheDocument();
      expect(screen.getByText("Second related tweet")).toBeInTheDocument();
    });

    it("calls onThreadClick when thread button is clicked", async () => {
      const user = userEvent.setup();
      await user.click(screen.getByText("Test Thread Title"));
      expect(mockOnThreadClick).toHaveBeenCalledTimes(1);
    });

    it("calls onRelatedTweetClick with correct id when related tweet is clicked", async () => {
      const user = userEvent.setup();
      await user.click(screen.getByText("First related tweet"));
      expect(mockOnRelatedTweetClick).toHaveBeenCalledWith("tweet-2");
    });
  });

  describe("without related tweets", () => {
    beforeEach(() => {
      render(
        <TweetDescription
          thread={mockThread}
          tweet={mockTweet}
          relatedTweets={[]}
          additionalContext=""
          onThreadClick={mockOnThreadClick}
          onRelatedTweetClick={mockOnRelatedTweetClick}
        />,
      );
    });

    it("shows empty state when no related tweets", () => {
      expect(screen.getByText("No related tweets found")).toBeInTheDocument();
    });

    it("hides Additional Context section when additionalContext is empty", () => {
      expect(screen.queryByText("Additional Context")).not.toBeInTheDocument();
    });
  });

  describe("with media", () => {
    it("renders media images", () => {
      render(
        <TweetDescription
          thread={mockThread}
          tweet={{ ...mockTweet, mediaUrls: ["https://example.com/img.jpg"] }}
          relatedTweets={[]}
          additionalContext=""
          onThreadClick={mockOnThreadClick}
          onRelatedTweetClick={mockOnRelatedTweetClick}
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/img.jpg");
    });

    it("renders no images when mediaUrls is empty", () => {
      render(
        <TweetDescription
          thread={mockThread}
          tweet={mockTweet}
          relatedTweets={[]}
          additionalContext=""
          onThreadClick={mockOnThreadClick}
          onRelatedTweetClick={mockOnRelatedTweetClick}
        />,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });
});
