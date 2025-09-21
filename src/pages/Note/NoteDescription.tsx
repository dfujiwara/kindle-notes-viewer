import type { KindleDetailedNote } from "src/models";

interface NoteDescriptionProps {
  detailedNote: KindleDetailedNote;
  onRelatedNoteClick: (noteId: string) => void;
}

export function NoteDescription({
  detailedNote,
  onRelatedNoteClick,
}: NoteDescriptionProps) {
  const { note } = detailedNote;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
      <div className="text-lg text-zinc-300 mb-4">{note.content}</div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Additional Context
        </h3>
        <p className="text-zinc-300">{detailedNote.additional_context}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Related Notes</h3>
        <div className="space-y-2">
          {detailedNote.related_notes.length > 0 ? (
            detailedNote.related_notes.map((relatedNote) => (
              <button
                key={relatedNote.id}
                type="button"
                className="bg-zinc-700 rounded p-3 border border-zinc-600 cursor-pointer hover:border-zinc-500 transition-colors w-full text-left"
                onClick={() => onRelatedNoteClick(relatedNote.id)}
              >
                <p className="text-zinc-300 text-sm">{relatedNote.content}</p>
              </button>
            ))
          ) : (
            <p className="text-zinc-500 text-sm italic">
              No related notes found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
