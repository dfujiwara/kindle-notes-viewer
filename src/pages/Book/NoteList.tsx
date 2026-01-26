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
    <ul className="space-y-3 sm:space-y-4 list-none">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteItem
            note={note}
            onClick={() => {
              navigate(`/books/${bookId}/notes/${note.id}`);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
