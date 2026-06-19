import type { KindleNote } from "../../models";
import { NoteItem } from "./NoteItem";

interface NoteListProps {
  notes: KindleNote[];
  onNoteClick: (note: KindleNote) => void;
}

export function NoteList({ notes, onNoteClick }: NoteListProps) {
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
          <NoteItem note={note} onClick={() => onNoteClick(note)} />
        </li>
      ))}
    </ul>
  );
}
