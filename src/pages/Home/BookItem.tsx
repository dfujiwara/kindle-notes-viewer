import type { KindleBook } from "src/models";

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
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6 hover:bg-zinc-750 transition-colors cursor-pointer text-left w-full active:bg-zinc-700"
      onClick={handleClick}
    >
      <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-2">
        {book.title}
      </h3>
      <p className="text-zinc-400 text-sm line-clamp-1">by {book.author}</p>
    </button>
  );
}
