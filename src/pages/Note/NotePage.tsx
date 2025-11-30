import { useNavigate, useParams } from "react-router";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import { NoteDescription } from "./NoteDescription";
import { useStreamedDetailedNote } from "./useStreamedDetailedNote";

export function NotePage() {
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
