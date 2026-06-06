import { useEffect, useId, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  booksService,
  tweetService,
  urlService,
  useApiSuspenseQuery,
} from "src/api";
import { BookList } from "./BookList";
import { TweetList } from "./TweetList";
import { UrlList } from "./UrlList";

type Tab = "books" | "urls" | "tweets";

function isTab(value: string | null): value is Tab {
  return value === "books" || value === "urls" || value === "tweets";
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: Tab = isTab(tabParam) ? tabParam : "books";
  const booksTabId = useId();
  const urlsTabId = useId();
  const tweetsTabId = useId();
  const booksPanelId = useId();
  const urlsPanelId = useId();
  const tweetsPanelId = useId();
  const booksTabRef = useRef<HTMLButtonElement>(null);
  const urlsTabRef = useRef<HTMLButtonElement>(null);
  const tweetsTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Only normalize invalid tab values; omit the param entirely when no tab is set.
    if (tabParam !== null && !isTab(tabParam)) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("tab", "books");
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, tabParam]);

  const booksResult = useApiSuspenseQuery(["books"], () =>
    booksService.getBooks(),
  );
  const urlsResult = useApiSuspenseQuery(["urls"], () => urlService.getUrls());
  const tweetsResult = useApiSuspenseQuery(["tweets"], () =>
    tweetService.getTweets(),
  );

  const updateTab = (tab: Tab) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", tab);
    setSearchParams(nextSearchParams);

    if (tab === "books") {
      booksTabRef.current?.focus();
    } else if (tab === "urls") {
      urlsTabRef.current?.focus();
    } else {
      tweetsTabRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const tabs: Tab[] = ["books", "urls", "tweets"];
      const currentIndex = tabs.indexOf(activeTab);
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const newTab =
        tabs[(currentIndex + direction + tabs.length) % tabs.length];
      updateTab(newTab);
    }
  };

  const getTabClassName = (isActive: boolean) => {
    const baseClasses =
      "px-6 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900";
    const activeClasses =
      "text-white bg-blue-600/20 border border-blue-500 hover:border-blue-400";
    const inactiveClasses =
      "text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div role="tablist" className="flex gap-4 mb-6">
        <button
          ref={booksTabRef}
          type="button"
          role="tab"
          aria-selected={activeTab === "books"}
          aria-controls={booksPanelId}
          id={booksTabId}
          tabIndex={activeTab === "books" ? 0 : -1}
          onClick={() => updateTab("books")}
          onKeyDown={handleKeyDown}
          className={getTabClassName(activeTab === "books")}
        >
          Books
        </button>
        <button
          ref={urlsTabRef}
          type="button"
          role="tab"
          aria-selected={activeTab === "urls"}
          aria-controls={urlsPanelId}
          id={urlsTabId}
          tabIndex={activeTab === "urls" ? 0 : -1}
          onClick={() => updateTab("urls")}
          onKeyDown={handleKeyDown}
          className={getTabClassName(activeTab === "urls")}
        >
          URLs
        </button>
        <button
          ref={tweetsTabRef}
          type="button"
          role="tab"
          aria-selected={activeTab === "tweets"}
          aria-controls={tweetsPanelId}
          id={tweetsTabId}
          tabIndex={activeTab === "tweets" ? 0 : -1}
          onClick={() => updateTab("tweets")}
          onKeyDown={handleKeyDown}
          className={getTabClassName(activeTab === "tweets")}
        >
          Tweets
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "books" && (
        <section role="tabpanel" id={booksPanelId} aria-labelledby={booksTabId}>
          <BookList
            books={booksResult.data}
            onBookClick={(book) => navigate(`/books/${book.id}`)}
          />
        </section>
      )}

      {activeTab === "urls" && (
        <section role="tabpanel" id={urlsPanelId} aria-labelledby={urlsTabId}>
          <UrlList
            urls={urlsResult.data}
            onUrlClick={(url) => navigate(`/urls/${url.id}`)}
          />
        </section>
      )}

      {activeTab === "tweets" && (
        <section
          role="tabpanel"
          id={tweetsPanelId}
          aria-labelledby={tweetsTabId}
        >
          <TweetList
            threads={tweetsResult.data}
            onThreadClick={(thread) => navigate(`/tweets/${thread.id}`)}
          />
        </section>
      )}
    </div>
  );
}
