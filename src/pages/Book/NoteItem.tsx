import type { KindleNote } from "src/models";
import { getCardButtonClassName } from "src/utils/styles";

interface NoteItemProps {
  note: KindleNote;
  onClick: () => void;
}

export function NoteItem({ note, onClick }: NoteItemProps) {
  return (
    <button
      type="button"
      className={`${getCardButtonClassName("p-3 sm:p-4")} touch-manipulation`}
      onClick={onClick}
    >
      <p className="text-zinc-300 leading-relaxed text-sm sm:text-base break-words">
        {note.content}
      </p>
    </button>
  );
}
