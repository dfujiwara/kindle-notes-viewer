import { useId, useRef, useState } from "react";
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
  const booksTabRef = useRef<HTMLButtonElement>(null);
  const urlsTabRef = useRef<HTMLButtonElement>(null);

  const booksResult = useApiSuspenseQuery(["books"], () =>
    booksService.getBooks(),
  );
  const urlsResult = useApiSuspenseQuery(["urls"], () => urlService.getUrls());

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const newTab: Tab = activeTab === "books" ? "urls" : "books";
      setActiveTab(newTab);
      // Move focus to the newly activated tab
      if (newTab === "books") {
        booksTabRef.current?.focus();
      } else {
        urlsTabRef.current?.focus();
      }
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
          onClick={() => setActiveTab("books")}
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
          onClick={() => setActiveTab("urls")}
          onKeyDown={handleKeyDown}
          className={getTabClassName(activeTab === "urls")}
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
