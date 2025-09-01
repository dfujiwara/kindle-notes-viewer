import { useParams } from "react-router";
import { notesService, useApiQuery } from "src/api";
import { BookDescription } from "./BookDescription";
import { NotesList } from "./NotesList";

export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  if (bookId === undefined) {
    throw new Error("Book ID is not defined in the URL");
  }
  const result = useApiQuery(["notes", bookId], () =>
    notesService.getNotesFromBook(bookId),
  );
  return (
    <div>
      <BookDescription book={result.data.book} />
      <NotesList notes={result.data.notes} />
    </div>
  );
}
