import { useNavigate, useParams } from "react-router";
import { LoadingIndicator } from "src/components";
import { TweetDescription } from "./TweetDescription";
import { useStreamedDetailedTweet } from "./useStreamedDetailedTweet";

export function TweetDetailPage() {
  const navigate = useNavigate();
  const { threadId, tweetId } = useParams<{
    threadId: string;
    tweetId: string;
  }>();
  if (threadId === undefined || tweetId === undefined) {
    throw new Error("Thread ID or Tweet ID is not defined in the URL");
  }

  const state = useStreamedDetailedTweet(threadId, tweetId);

  switch (state.status) {
    case "loading":
      return <LoadingIndicator />;
    case "error":
      throw state.error;
    case "streaming":
    case "success": {
      const { thread, tweet, additionalContext, relatedTweets } = state.data;

      return (
        <TweetDescription
          thread={thread}
          tweet={tweet}
          relatedTweets={relatedTweets}
          additionalContext={additionalContext}
          onThreadClick={() => navigate(`/tweets/${thread.id}/`)}
          onRelatedTweetClick={(relatedTweetId) =>
            navigate(`/tweets/${thread.id}/tweets/${relatedTweetId}`)
          }
        />
      );
    }
  }
}
