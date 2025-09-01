import type { KindleNote } from "../../models";
import { NoteItem } from "./NoteItem";

interface NotesListProps {
  notes: KindleNote[];
}

export function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 text-lg">No notes found for this book.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}
