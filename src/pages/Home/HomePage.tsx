import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { booksService, urlService, useApiSuspenseQuery } from "src/api";
import type { KindleBook, Url } from "src/models";
import { BookList } from "./BookList";
import { UrlList } from "./UrlList";

type Tab = "books" | "urls";

export function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const booksTabId = useId();
  const urlsTabId = useId();
  const booksPanelId = useId();
  const urlsPanelId = useId();

  const booksResult = useApiSuspenseQuery(["books"], () =>
    booksService.getBooks(),
  );
  const urlsResult = useApiSuspenseQuery(["urls"], () => urlService.getUrls());

  const handleKeyDown = (e: React.KeyboardEvent, tab: Tab) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tab === "books" ? "urls" : "books");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div role="tablist" className="flex border-b border-zinc-700">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "books"}
          aria-controls={booksPanelId}
          id={booksTabId}
          tabIndex={activeTab === "books" ? 0 : -1}
          onClick={() => setActiveTab("books")}
          onKeyDown={(e) => handleKeyDown(e, "books")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "books"
              ? "text-white border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Books
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "urls"}
          aria-controls={urlsPanelId}
          id={urlsTabId}
          tabIndex={activeTab === "urls" ? 0 : -1}
          onClick={() => setActiveTab("urls")}
          onKeyDown={(e) => handleKeyDown(e, "urls")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "urls"
              ? "text-white border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          URLs
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "books" && (
        <section role="tabpanel" id={booksPanelId} aria-labelledby={booksTabId}>
          <BookList
            books={booksResult.data}
            onBookClick={(book: KindleBook) => navigate(`/books/${book.id}`)}
          />
        </section>
      )}

      {activeTab === "urls" && (
        <section role="tabpanel" id={urlsPanelId} aria-labelledby={urlsTabId}>
          <UrlList
            urls={urlsResult.data}
            onUrlClick={(url: Url) => navigate(`/urls/${url.id}`)}
          />
        </section>
      )}
    </div>
  );
}
