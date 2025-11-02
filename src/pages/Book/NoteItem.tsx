import type { KindleNote } from "src/models";

interface NoteItemProps {
  note: KindleNote;
  onClick: () => void;
}

export function NoteItem({ note, onClick }: NoteItemProps) {
  return (
    <button
      type="button"
      className="bg-zinc-800 rounded-lg p-3 sm:p-4 border border-zinc-700 hover:border-zinc-600 active:border-zinc-500 transition-colors cursor-pointer w-full text-left touch-manipulation"
      onClick={onClick}
    >
      <p className="text-zinc-300 leading-relaxed text-sm sm:text-base break-words">
        {note.content}
      </p>
    </button>
  );
}
