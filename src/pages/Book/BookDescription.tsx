import type { KindleBook } from "src/models";

interface BookDescriptionProps {
  book: KindleBook;
}

export function BookDescription({ book }: BookDescriptionProps) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
      <p className="text-lg text-zinc-300 mb-4">by {book.author}</p>
    </div>
  );
}
