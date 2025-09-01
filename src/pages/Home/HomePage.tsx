import { useNavigate } from "react-router";
import { booksService, useApiQuery } from "src/api";
import type { KindleBook } from "src/models";
import { BookList } from "./BookList";

export function HomePage() {
  const navigate = useNavigate();
  const result = useApiQuery(["books"], () => booksService.getBooks());
  return (
    <BookList
      books={result.data}
      onBookClick={(book: KindleBook) => navigate(`/books/${book.id}`)}
    />
  );
}
