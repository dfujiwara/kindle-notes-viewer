import { useNavigate, useParams } from "react-router";
import { notesService, useApiSuspenseQuery } from "src/api";
import { NoteDescription } from "./NoteDescription";

export function NotePage() {
  const { bookId, noteId } = useParams<{ bookId: string; noteId: string }>();
  if (bookId === undefined || noteId === undefined) {
    throw new Error("Book ID or Note ID is not defined in the URL");
  }
  const result = useApiSuspenseQuery(
    ["note", bookId, noteId],
    () => notesService.getNote(bookId, noteId),
    { refetchOnWindowFocus: false },
  );
  const navigate = useNavigate();
  return (
    <div>
      <NoteDescription
        book={result.data.book}
        note={result.data.note}
        additionalContext={result.data.additionalContext}
        relatedNotes={result.data.relatedNotes}
        onBookClick={() => navigate(`/books/${bookId}`)}
        onRelatedNoteClick={(relatedNoteId) => {
          navigate(`/books/${bookId}/notes/${relatedNoteId}`);
        }}
      />
    </div>
  );
}
