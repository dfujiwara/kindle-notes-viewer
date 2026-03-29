import type { TweetThread } from "src/models";
import { formatDate } from "src/utils/date";
import { getCardButtonClassName } from "src/utils/styles";

interface TweetListProps {
  threads: TweetThread[];
  onThreadClick: (thread: TweetThread) => void;
}

export function TweetList({ threads, onThreadClick }: TweetListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg">No Tweets Found</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 list-none">
      {threads.map((thread) => (
        <li key={thread.id}>
          <button
            type="button"
            className={getCardButtonClassName()}
            onClick={() => onThreadClick(thread)}
          >
            <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-2">
              {thread.title}
            </h3>
            <p className="text-zinc-400 text-sm mb-2">
              @{thread.authorUsername}
            </p>
            <p className="text-zinc-500 text-xs">
              {thread.tweetCount} {thread.tweetCount === 1 ? "tweet" : "tweets"}{" "}
              • {formatDate(thread.createdAt)}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
