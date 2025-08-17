import type { KindleBook } from "../models/book";

interface BookItemProps {
  book: KindleBook;
  onClick?: (book: KindleBook) => void;
}

export function BookItem({ book, onClick }: BookItemProps) {
  const handleClick = () => {
    onClick?.(book);
  };

  return (
    <button
      type="button"
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:bg-zinc-750 transition-colors cursor-pointer text-left w-full"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{book.title}</h3>
      <p className="text-zinc-400 text-sm">by {book.author}</p>
    </button>
  );
}
