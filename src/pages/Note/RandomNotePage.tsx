import { useNavigate } from "react-router";
import { notesService, useApiQuery } from "src/api";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import { NoteDescription } from "./NoteDescription";
import { useStreamedDetailedNote } from "./useStreamedDetailedNote";

export function RandomNotePage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useApiQuery(
    ["notes", "random"],
    () => notesService.getRandomNote(),
    {
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    throw error;
  }

  if (!data) {
    return <LoadingIndicator />;
  }

  const { book, note, additionalContext, relatedNotes } = data;

  return (
    <div>
      <NoteDescription
        book={book}
        note={note}
        additionalContext={additionalContext}
        relatedNotes={relatedNotes}
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
