import { useNavigate } from "react-router";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import { NoteDescription } from "./NoteDescription";
import { useStreamedDetailedNote } from "./useStreamedDetailedNote";

export function StreamedRandomNotePage() {
  const navigate = useNavigate();
  const state = useStreamedDetailedNote();

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
