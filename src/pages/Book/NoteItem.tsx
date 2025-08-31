import type { KindleNote } from "src/models";

interface NoteItemProps {
  note: KindleNote;
}

export function NoteItem({ note }: NoteItemProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
      <div className="mb-3">
        <p className="text-zinc-300 leading-relaxed">{note.content}</p>
      </div>
    </div>
  );
}
