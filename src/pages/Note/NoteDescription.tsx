import type { KindleDetailedNote } from "src/models";

interface NoteDescriptionProps {
  detailedNote: KindleDetailedNote;
  onRelatedNoteClick: (noteId: string) => void;
  onBookClick: () => void;
}

export function NoteDescription({
  detailedNote,
  onRelatedNoteClick,
  onBookClick,
}: NoteDescriptionProps) {
  const { note, book } = detailedNote;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
      <button
        type="button"
        className="block mb-4 hover:bg-zinc-750 rounded p-2 -m-2 transition-colors w-full text-left cursor-pointer"
        onClick={onBookClick}
      >
        <h2 className="text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
          {book.title}
        </h2>
        <p className="text-zinc-400 text-sm">by {book.author}</p>
      </button>

      <div className="text-lg text-zinc-300 mb-4">{note.content}</div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Additional Context
        </h3>
        <p className="text-zinc-300">{detailedNote.additionalContext}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Related Notes</h3>
        <div className="space-y-2">
          {detailedNote.relatedNotes.length > 0 ? (
            detailedNote.relatedNotes.map((relatedNote) => (
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
