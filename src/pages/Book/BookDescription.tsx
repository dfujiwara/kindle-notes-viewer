import { DeleteButton, PageHeader } from "src/components";
import type { KindleBook } from "src/models";

interface BookDescriptionProps {
  book: KindleBook;
  onDelete: () => void;
  isDeleting: boolean;
}

export function BookDescription({
  book,
  onDelete,
  isDeleting,
}: BookDescriptionProps) {
  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <PageHeader
        title={book.title}
        subtitle={
          <p className="text-base sm:text-lg text-zinc-300">by {book.author}</p>
        }
        action={
          <DeleteButton
            confirmMessage={`Delete "${book.title}" and all its notes?`}
            onDelete={onDelete}
            isDeleting={isDeleting}
            ariaLabel={`Delete book ${book.title}`}
          />
        }
      />
    </article>
  );
}
