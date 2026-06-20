import {
  ClickableUrl,
  DetailCardButton,
  MarkdownSection,
  RelatedItemsSection,
} from "src/components";
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
  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6">
      <div className="mb-3 md:mb-4">
        <DetailCardButton
          className="mb-3 md:mb-4 text-left"
          padding="p-2"
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
        </DetailCardButton>
        <ClickableUrl
          url={thread.canonicalURL}
          className="text-sm text-zinc-400 line-clamp-1 mt-2 block"
        />
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
        <MarkdownSection
          title="Additional Context"
          content={additionalContext}
        />
      )}

      <RelatedItemsSection
        title="Related Tweets"
        items={relatedTweets}
        emptyMessage="No related tweets found"
        getKey={(relatedTweet) => relatedTweet.id}
        renderItem={(relatedTweet) => (
          <DetailCardButton
            className="text-left"
            padding="p-2 md:p-3"
            onClick={() => onRelatedTweetClick(relatedTweet.id)}
          >
            <p className="text-zinc-400 text-xs mb-1">
              @{relatedTweet.authorUsername}
            </p>
            <p className="text-zinc-300 text-sm">{relatedTweet.content}</p>
          </DetailCardButton>
        )}
      />
    </article>
  );
}
