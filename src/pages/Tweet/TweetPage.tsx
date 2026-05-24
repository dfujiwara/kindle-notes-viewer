import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { ApiError } from "src/api";
import { tweetService, useApiMutation, useApiSuspenseQuery } from "src/api";
import { DeleteButton } from "src/components";
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

  const deleteMutation = useApiMutation(
    (threadId: string) => tweetService.deleteTweetThread(threadId),
    () => {
      toast.success("Tweet thread deleted successfully");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Failed to delete tweet thread: ${error.message}`);
    },
    ["tweets"],
  );

  const { thread, tweets } = result.data;

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {thread.title}
          </h1>
          <p className="text-zinc-400 text-sm">
            @{thread.authorUsername} · {thread.authorDisplayName} ·{" "}
            {thread.tweetCount} {thread.tweetCount === 1 ? "tweet" : "tweets"} ·{" "}
            {formatDate(thread.createdAt)}
          </p>
        </div>
        <DeleteButton
          confirmMessage={`Delete "${thread.title}" and all its tweets?`}
          onDelete={() => deleteMutation.mutate(threadId)}
          isDeleting={deleteMutation.isPending}
          ariaLabel={`Delete tweet thread ${thread.title}`}
        />
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
