import { useId } from "react";
import Markdown from "react-markdown";
import type { Tweet, TweetThread } from "src/models";
import { formatDate } from "src/utils/date";

interface TweetDescriptionProps {
  thread: TweetThread;
  tweet: Tweet;
  relatedTweets: Tweet[];
  additionalContext: string;
  onThreadClick: () => void;
  onRelatedTweetClick: (tweetId: string) => void;
}

export function TweetDescription({
  thread,
  tweet,
  relatedTweets,
  additionalContext,
  onThreadClick,
  onRelatedTweetClick,
}: TweetDescriptionProps) {
  const additionalContextId = useId();
  const relatedTweetsId = useId();

  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
      <div className="mb-3 md:mb-4">
        <button
          type="button"
          className="block hover:bg-zinc-700 rounded p-2 -m-2 transition-colors w-full text-left cursor-pointer"
          onClick={onThreadClick}
        >
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
            {thread.title}
          </h2>
          <p className="text-zinc-500 text-xs">
            @{thread.authorUsername} • {thread.tweetCount}{" "}
            {thread.tweetCount === 1 ? "tweet" : "tweets"} •{" "}
            {formatDate(thread.createdAt)}
          </p>
        </button>
      </div>

      <div className="mb-3 md:mb-4">
        <p className="text-zinc-400 text-xs mb-1">
          @{tweet.authorUsername} · tweet {tweet.positionInThread + 1} ·{" "}
          {formatDate(tweet.tweetedAt)}
        </p>
        <div className="text-base md:text-lg text-zinc-300">
          {tweet.content}
        </div>
        {tweet.mediaUrls.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2 list-none">
            {tweet.mediaUrls.map((url) => (
              <li key={url}>
                <img
                  src={url}
                  alt="Tweet media"
                  className="max-h-48 rounded border border-zinc-600"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {additionalContext && (
        <section className="mb-3 md:mb-4" aria-labelledby={additionalContextId}>
          <h3
            id={additionalContextId}
            className="text-base md:text-lg font-semibold text-white mb-2"
          >
            Additional Context
          </h3>
          <div className="text-zinc-300 text-sm md:text-base [&_p]:mb-3 md:[&_p]:mb-4">
            <Markdown>{additionalContext}</Markdown>
          </div>
        </section>
      )}

      <section className="mb-3 md:mb-4" aria-labelledby={relatedTweetsId}>
        <h3
          id={relatedTweetsId}
          className="text-base md:text-lg font-semibold text-white mb-2"
        >
          Related Tweets
        </h3>
        <ul className="space-y-2 list-none">
          {relatedTweets.length > 0 ? (
            relatedTweets.map((relatedTweet) => (
              <li key={relatedTweet.id}>
                <button
                  type="button"
                  className="bg-zinc-700 rounded p-2 md:p-3 border border-zinc-600 cursor-pointer hover:border-zinc-500 transition-colors w-full text-left"
                  onClick={() => onRelatedTweetClick(relatedTweet.id)}
                >
                  <p className="text-zinc-400 text-xs mb-1">
                    @{relatedTweet.authorUsername}
                  </p>
                  <p className="text-zinc-300 text-sm">
                    {relatedTweet.content}
                  </p>
                </button>
              </li>
            ))
          ) : (
            <li>
              <p className="text-zinc-500 text-sm italic">
                No related tweets found
              </p>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}
