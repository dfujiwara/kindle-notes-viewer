import { DetailCardButton } from "src/components";
import type { KindleNote } from "src/models";

interface NoteItemProps {
  note: KindleNote;
  onClick: () => void;
}

export function NoteItem({ note, onClick }: NoteItemProps) {
  return (
    <DetailCardButton padding="p-3 sm:p-4" onClick={onClick}>
      <p className="text-zinc-300 leading-relaxed text-sm sm:text-base break-words">
        {note.content}
      </p>
    </DetailCardButton>
  );
}
