import { useId } from "react";
import { NavLink } from "react-router";
import { ClickableUrl } from "src/components";
import type { KindleNoteBundle, UrlChunkBundle } from "src/models";
import { formatDate } from "src/utils/date";

export type SearchResultsProps =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; errorMessage: string }
  | { status: "success"; books: KindleNoteBundle[]; urls: UrlChunkBundle[] };

function BooksSection({ books }: { books: KindleNoteBundle[] }) {
  const headingId = useId();

  if (books.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-zinc-400 mb-4">
        From Books
      </h2>
      <ul className="space-y-6 list-none">
        {books.map((bundle) => (
          <li key={bundle.book.id}>
            <article className="space-y-3">
              <header className="border-b border-zinc-700 pb-2">
                <h3 className="text-xl font-semibold text-white">
                  {bundle.book.title}
                </h3>
                <p className="text-sm text-zinc-400">{bundle.book.author}</p>
              </header>
              <ul className="space-y-2 pl-4 list-none">
                {bundle.notes.map((note) => (
                  <li key={note.id}>
                    <NavLink
                      to={`/books/${bundle.book.id}/notes/${note.id}`}
                      className="block p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                      <p className="text-zinc-200">{note.content}</p>
                      <p className="text-xs text-zinc-500 mt-2">
                        {formatDate(note.createdAt)}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UrlsSection({ urls }: { urls: UrlChunkBundle[] }) {
  const headingId = useId();

  if (urls.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-zinc-400 mb-4">
        From URLs
      </h2>
      <ul className="space-y-6 list-none">
        {urls.map((bundle) => (
          <li key={bundle.url.id}>
            <article className="space-y-3">
              <header className="border-b border-zinc-700 pb-2">
                <h3 className="text-xl font-semibold text-white">
                  {bundle.url.title}
                </h3>
                <ClickableUrl
                  url={bundle.url.url}
                  className="text-sm text-zinc-400 truncate block"
                />
              </header>
              <ul className="space-y-2 pl-4 list-none">
                {bundle.chunks.map((chunk) => (
                  <li key={chunk.id}>
                    <NavLink
                      to={`/urls/${bundle.url.id}/chunks/${chunk.id}`}
                      className="block p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                      {chunk.isSummary && (
                        <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
                          Summary
                        </span>
                      )}
                      <p className="text-zinc-200">{chunk.content}</p>
                      <p className="text-xs text-zinc-500 mt-2">
                        {formatDate(chunk.createdAt)}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SearchResults(props: SearchResultsProps) {
  if (props.status === "idle") {
    return (
      <div className="text-center text-zinc-400 py-12">
        Enter a search query and press Enter to find notes
      </div>
    );
  }

  if (props.status === "error") {
    return (
      <div className="text-center text-red-400 py-12">
        Error: {props.errorMessage}
      </div>
    );
  }

  if (props.status === "loading") {
    return <div className="text-center text-zinc-400 py-12">Searching...</div>;
  }

  // props.status === "success"
  const hasBooks = props.books.length > 0;
  const hasUrls = props.urls.length > 0;

  if (!hasBooks && !hasUrls) {
    return (
      <div className="text-center text-zinc-400 py-12">No results found</div>
    );
  }

  return (
    <div className="space-y-8">
      <BooksSection books={props.books} />
      <UrlsSection urls={props.urls} />
    </div>
  );
}
