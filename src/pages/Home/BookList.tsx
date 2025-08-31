import type { KindleBook } from "src/models";
import { BookItem } from "./BookItem";

interface BookListProps {
  books: KindleBook[];
  onBookClick: (book: KindleBook) => void;
}

export function BookList({ books, onBookClick }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg">No Books Found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  );
}
