import { useNavigate } from "react-router";
import { booksService, urlService, useApiSuspenseQuery } from "src/api";
import type { KindleBook, Url } from "src/models";
import { BookList } from "./BookList";
import { UrlList } from "./UrlList";

export function HomePage() {
  const navigate = useNavigate();
  const booksResult = useApiSuspenseQuery(["books"], () =>
    booksService.getBooks(),
  );
  const urlsResult = useApiSuspenseQuery(["urls"], () => urlService.getUrls());

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Books</h2>
        <BookList
          books={booksResult.data}
          onBookClick={(book: KindleBook) => navigate(`/books/${book.id}`)}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">URLs</h2>
        <UrlList
          urls={urlsResult.data}
          onUrlClick={(url: Url) => navigate(`/urls/${url.id}`)}
        />
      </section>
    </div>
  );
}
