import { useParams } from "react-router";
import { notesService, useApiSuspenseQuery } from "src/api";
import { BookDescription } from "./BookDescription";
import { NoteList } from "./NoteList";

export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  if (bookId === undefined) {
    throw new Error("Book ID is not defined in the URL");
  }
  const result = useApiSuspenseQuery(["notes", bookId], () =>
    notesService.getNotesFromBook(bookId),
  );
  return (
    <div>
      <BookDescription book={result.data.book} />
      <NoteList bookId={bookId} notes={result.data.notes} />
    </div>
  );
}
