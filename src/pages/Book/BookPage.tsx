import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { ApiError } from "src/api";
import {
  booksService,
  notesService,
  useApiMutation,
  useApiSuspenseQuery,
} from "src/api";
import { DetailPageShell } from "src/components";
import { BookDescription } from "./BookDescription";
import { NoteList } from "./NoteList";

export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  if (bookId === undefined) {
    throw new Error("Book ID is not defined in the URL");
  }
  const result = useApiSuspenseQuery(["notes", bookId], () =>
    notesService.getNotesFromBook(bookId),
  );

  const deleteMutation = useApiMutation(
    (bookId: string) => booksService.deleteBook(bookId),
    () => {
      toast.success("Book deleted successfully");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Failed to delete book: ${error.message}`);
    },
    ["books"],
  );

  return (
    <DetailPageShell>
      <BookDescription
        book={result.data.book}
        onDelete={() => deleteMutation.mutate(bookId)}
        isDeleting={deleteMutation.isPending}
        backLink={{ to: "/", label: "Back to Home" }}
      />
      <NoteList
        notes={result.data.notes}
        onNoteClick={(note) => navigate(`/books/${bookId}/notes/${note.id}`)}
      />
    </DetailPageShell>
  );
}
