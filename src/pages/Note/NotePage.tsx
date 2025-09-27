import { useNavigate, useParams } from "react-router";
import { notesService, useApiQuery } from "src/api";
import { NoteDescription } from "./NoteDescription";

export function NotePage() {
  const { bookId, noteId } = useParams<{ bookId: string; noteId: string }>();
  if (bookId === undefined || noteId === undefined) {
    throw new Error("Book ID or Note ID is not defined in the URL");
  }
  const result = useApiQuery(["note", bookId, noteId], () =>
    notesService.getNote(bookId, noteId),
  );
  const navigate = useNavigate();
  return (
    <div>
      <NoteDescription
        detailedNote={result.data}
        onRelatedNoteClick={(relatedNoteId) => {
          navigate(`/books/${bookId}/notes/${relatedNoteId}`);
        }}
      />
    </div>
  );
}
