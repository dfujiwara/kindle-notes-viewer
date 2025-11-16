import { useNavigate } from "react-router";
import { notesService, useApiSuspenseQuery } from "src/api";
import { NoteDescription } from "./NoteDescription";

export function RandomNotePage() {
  const result = useApiSuspenseQuery(
    ["notes", "random"],
    () => notesService.getRandomNote(),
    {
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
  );
  const navigate = useNavigate();
  const { book } = result.data;
  return (
    <div>
      <NoteDescription
        detailedNote={result.data}
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
