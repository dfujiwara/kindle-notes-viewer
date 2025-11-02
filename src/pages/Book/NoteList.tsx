import { useNavigate } from "react-router";
import type { KindleNote } from "../../models";
import { NoteItem } from "./NoteItem";

interface NoteListProps {
  bookId: string;
  notes: KindleNote[];
}

export function NoteList({ bookId, notes }: NoteListProps) {
  const navigate = useNavigate();
  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 text-lg">No notes found for this book.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onClick={() => {
            navigate(`/books/${bookId}/notes/${note.id}`);
          }}
        />
      ))}
    </div>
  );
}
