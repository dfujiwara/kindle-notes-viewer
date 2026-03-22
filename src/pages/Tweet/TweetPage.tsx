import { useNavigate, useParams } from "react-router";
import { tweetService, useApiSuspenseQuery } from "src/api";
import { formatDate } from "src/utils/date";

export function TweetPage() {
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  if (threadId === undefined) {
    throw new Error("Thread ID is not defined in the URL");
  }

  const result = useApiSuspenseQuery(["tweet-thread", threadId], () =>
    tweetService.getTweetThread(threadId),
  );

  const { thread, tweets } = result.data;

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          {thread.title}
        </h1>
        <p className="text-zinc-400 text-sm">
          @{thread.authorUsername} · {thread.authorDisplayName} ·{" "}
          {thread.tweetCount} {thread.tweetCount === 1 ? "tweet" : "tweets"} ·{" "}
          {formatDate(thread.createdAt)}
        </p>
      </div>

      <ul className="space-y-3 list-none">
        {tweets.length === 0 && (
          <li>
            <p className="text-zinc-500 text-sm italic">No tweets found</p>
          </li>
        )}
        {tweets.map((tweet) => (
          <li key={tweet.id}>
            <button
              type="button"
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer text-left w-full"
              onClick={() => navigate(`/tweets/${threadId}/tweets/${tweet.id}`)}
            >
              <p className="text-zinc-400 text-xs mb-1">
                @{tweet.authorUsername} · {formatDate(tweet.tweetedAt)}
              </p>
              <p className="text-zinc-200">{tweet.content}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
