import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { TweetThread } from "src/models";
import { describe, expect, it, vi } from "vitest";
import { TweetList } from "./TweetList";

const mockThreads: TweetThread[] = [
  {
    id: "thread-1",
    rootTweetId: "tweet-1",
    authorUsername: "user1",
    authorDisplayName: "User One",
    title: "Thoughts on TypeScript",
    tweetCount: 5,
    fetchedAt: "2026-01-05T00:00:00Z",
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "thread-2",
    rootTweetId: "tweet-2",
    authorUsername: "user2",
    authorDisplayName: "User Two",
    title: "A thread about React",
    tweetCount: 1,
    fetchedAt: "2026-01-04T00:00:00Z",
    createdAt: "2026-01-04T00:00:00Z",
  },
];

describe("TweetList", () => {
  it("renders all threads when threads array is not empty", () => {
    const mockOnThreadClick = vi.fn();
    render(
      <TweetList threads={mockThreads} onThreadClick={mockOnThreadClick} />,
    );

    expect(screen.getByText("Thoughts on TypeScript")).toBeInTheDocument();
    expect(screen.getByText("@user1")).toBeInTheDocument();
    expect(screen.getByText("A thread about React")).toBeInTheDocument();
    expect(screen.getByText("@user2")).toBeInTheDocument();
  });

  it("displays 'No Tweets Found' message when threads array is empty", () => {
    const mockOnThreadClick = vi.fn();
    render(<TweetList threads={[]} onThreadClick={mockOnThreadClick} />);

    expect(screen.getByText("No Tweets Found")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses plural 'tweets' for tweetCount > 1", () => {
    const mockOnThreadClick = vi.fn();
    render(
      <TweetList
        threads={[mockThreads[0]]}
        onThreadClick={mockOnThreadClick}
      />,
    );

    expect(screen.getByText(/5 tweets/)).toBeInTheDocument();
  });

  it("uses singular 'tweet' for tweetCount === 1", () => {
    const mockOnThreadClick = vi.fn();
    render(
      <TweetList
        threads={[mockThreads[1]]}
        onThreadClick={mockOnThreadClick}
      />,
    );

    expect(screen.getByText(/1 tweet[^s]/)).toBeInTheDocument();
  });

  it("calls onThreadClick when a thread is clicked", async () => {
    const user = userEvent.setup();
    const mockOnThreadClick = vi.fn();
    render(
      <TweetList threads={mockThreads} onThreadClick={mockOnThreadClick} />,
    );

    const firstThreadButton = screen.getByRole("button", {
      name: /Thoughts on TypeScript/i,
    });
    await user.click(firstThreadButton);

    expect(mockOnThreadClick).toHaveBeenCalledTimes(1);
    expect(mockOnThreadClick).toHaveBeenCalledWith(mockThreads[0]);
  });
});
