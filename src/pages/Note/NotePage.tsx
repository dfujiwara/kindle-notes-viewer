import { useNavigate, useParams } from "react-router";
import { notesService, useApiSuspenseQuery } from "src/api";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import { NoteDescription } from "./NoteDescription";
import { useStreamedDetailedNote } from "./useStreamedDetailedNote";

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

export function StreamedNotePage() {
  const navigate = useNavigate();
  const { bookId, noteId } = useParams<{ bookId: string; noteId: string }>();
  if (bookId === undefined || noteId === undefined) {
    throw new Error("Book ID or Note ID is not defined in the URL");
  }

  const state = useStreamedDetailedNote(bookId, noteId);

  switch (state.status) {
    case "loading":
      return <LoadingIndicator />;
    case "error":
      throw state.error;
    case "streaming":
    case "success": {
      const {
        book,
        note: noteData,
        additionalContext,
        relatedNotes,
      } = state.note;

      return (
        <div>
          <NoteDescription
            book={book}
            note={noteData}
            relatedNotes={relatedNotes}
            additionalContext={additionalContext}
            onBookClick={() => {
              navigate(`/books/${book.id}/`);
            }}
            onRelatedNoteClick={(relatedNoteId) => {
              navigate(`/books/${book.id}/notes/${relatedNoteId}`);
            }}
          />
        </div>
      );
    }
  }
}
