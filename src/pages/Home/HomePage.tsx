import { useEffect, useId } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  booksService,
  tweetService,
  urlService,
  useApiSuspenseQuery,
} from "src/api";
import { TabBar } from "src/components";
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

  useEffect(() => {
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
  };

  const tabs = [
    {
      id: "books" as const,
      label: "Books",
      buttonId: booksTabId,
      panelId: booksPanelId,
    },
    {
      id: "urls" as const,
      label: "URLs",
      buttonId: urlsTabId,
      panelId: urlsPanelId,
    },
    {
      id: "tweets" as const,
      label: "Tweets",
      buttonId: tweetsTabId,
      panelId: tweetsPanelId,
    },
  ];

  return (
    <div className="space-y-6">
      <TabBar tabs={tabs} activeTab={activeTab} onChange={updateTab} />

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
