import { useId } from "react";
import Markdown from "react-markdown";
import type { KindleBook, KindleNote } from "src/models";

interface NoteDescriptionProps {
  book: KindleBook;
  note: KindleNote;
  relatedNotes: KindleNote[];
  additionalContext: string;
  onRelatedNoteClick: (noteId: string) => void;
  onBookClick: () => void;
}

export function NoteDescription({
  book,
  note,
  relatedNotes,
  additionalContext,
  onRelatedNoteClick,
  onBookClick,
}: NoteDescriptionProps) {
  const additionalContextId = useId();
  const relatedNotesId = useId();

  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
      <button
        type="button"
        className="block mb-3 md:mb-4 hover:bg-zinc-750 rounded p-2 -m-2 transition-colors w-full text-left cursor-pointer"
        onClick={onBookClick}
      >
        <h2 className="text-lg md:text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
          {book.title}
        </h2>
        <p className="text-zinc-400 text-sm">by {book.author}</p>
      </button>

      <div className="text-base md:text-lg text-zinc-300 mb-3 md:mb-4">
        {note.content}
      </div>

      <section className="mb-3 md:mb-4" aria-labelledby={additionalContextId}>
        <h3
          id={additionalContextId}
          className="text-base md:text-lg font-semibold text-white mb-2"
        >
          Additional Context
        </h3>
        <div className="text-zinc-300 text-sm md:text-base [&_p]:mb-3 md:[&_p]:mb-4">
          <Markdown>{additionalContext}</Markdown>
        </div>
      </section>

      <section className="mb-3 md:mb-4" aria-labelledby={relatedNotesId}>
        <h3
          id={relatedNotesId}
          className="text-base md:text-lg font-semibold text-white mb-2"
        >
          Related Notes
        </h3>
        <ul className="space-y-2 list-none">
          {relatedNotes.length > 0 ? (
            relatedNotes.map((relatedNote) => (
              <li key={relatedNote.id}>
                <button
                  type="button"
                  className="bg-zinc-700 rounded p-2 md:p-3 border border-zinc-600 cursor-pointer hover:border-zinc-500 transition-colors w-full text-left"
                  onClick={() => onRelatedNoteClick(relatedNote.id)}
                >
                  <p className="text-zinc-300 text-sm">{relatedNote.content}</p>
                </button>
              </li>
            ))
          ) : (
            <li>
              <p className="text-zinc-500 text-sm italic">
                No related notes found
              </p>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}
