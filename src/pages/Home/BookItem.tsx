import type { KindleBook } from "src/models";
import { getCardButtonClassName } from "src/utils/styles";

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
      className={getCardButtonClassName()}
      onClick={handleClick}
    >
      <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-2">
        {book.title}
      </h3>
      <p className="text-zinc-400 text-sm line-clamp-1">by {book.author}</p>
    </button>
  );
}
