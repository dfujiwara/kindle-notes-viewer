import type { KindleNote } from "src/models";

interface NoteItemProps {
  note: KindleNote;
  onClick: () => void;
}

export function NoteItem({ note, onClick }: NoteItemProps) {
  return (
    <button
      type="button"
      className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer w-full text-left"
      onClick={onClick}
    >
      <div className="mb-3">
        <p className="text-zinc-300 leading-relaxed">{note.content}</p>
      </div>
    </button>
  );
}
