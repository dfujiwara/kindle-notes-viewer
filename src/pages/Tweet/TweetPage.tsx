import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { ApiError } from "src/api";
import { tweetService, useApiMutation, useApiSuspenseQuery } from "src/api";
import {
  ClickableUrl,
  DeleteButton,
  DetailCardButton,
  DetailPageShell,
  EmptyState,
  PageHeader,
} from "src/components";
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
    <DetailPageShell>
      <PageHeader
        title={thread.title}
        subtitle={
          <ClickableUrl
            url={thread.canonicalURL}
            className="text-sm sm:text-base text-zinc-400 line-clamp-1 block hover:text-white transition-colors"
          />
        }
        meta={`@${thread.authorUsername} · ${thread.authorDisplayName} · ${thread.tweetCount} ${thread.tweetCount === 1 ? "tweet" : "tweets"} · ${formatDate(thread.createdAt)}`}
        action={
          <DeleteButton
            confirmMessage={`Delete "${thread.title}" and all its tweets?`}
            onDelete={() => deleteMutation.mutate(threadId)}
            isDeleting={deleteMutation.isPending}
            ariaLabel={`Delete tweet thread ${thread.title}`}
          />
        }
        backLink={{ to: "/", label: "Back to Home" }}
      />

      <ul className="space-y-3 list-none pt-2">
        {tweets.length === 0 && (
          <li>
            <EmptyState>No tweets found</EmptyState>
          </li>
        )}
        {tweets.map((tweet) => (
          <li key={tweet.id}>
            <DetailCardButton
              className="text-left"
              onClick={() => navigate(`/tweets/${threadId}/tweets/${tweet.id}`)}
            >
              <p className="text-zinc-400 text-xs mb-1">
                @{tweet.authorUsername} · {formatDate(tweet.tweetedAt)}
              </p>
              <p className="text-zinc-200">{tweet.content}</p>
            </DetailCardButton>
          </li>
        ))}
      </ul>
    </DetailPageShell>
  );
}
