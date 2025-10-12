import { useNavigate } from "react-router";
import { booksService, useApiSuspenseQuery } from "src/api";
import type { KindleBook } from "src/models";
import { BookList } from "./BookList";

export function HomePage() {
  const navigate = useNavigate();
  const result = useApiSuspenseQuery(["books"], () => booksService.getBooks());
  return (
    <BookList
      books={result.data}
      onBookClick={(book: KindleBook) => navigate(`/books/${book.id}`)}
    />
  );
}
