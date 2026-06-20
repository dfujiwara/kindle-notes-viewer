import {
  DetailCardButton,
  MarkdownSection,
  RelatedItemsSection,
} from "src/components";
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
  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6">
      <div className="mb-3 md:mb-4">
        <DetailCardButton
          className="mb-3 md:mb-4 text-left"
          padding="p-2"
          onClick={onBookClick}
        >
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
            {book.title}
          </h2>
          <p className="text-zinc-400 text-sm">by {book.author}</p>
        </DetailCardButton>
      </div>

      <div className="text-base md:text-lg text-zinc-300 mb-3 md:mb-4">
        {note.content}
      </div>

      {additionalContext && (
        <MarkdownSection
          title="Additional Context"
          content={additionalContext}
        />
      )}

      <RelatedItemsSection
        title="Related Notes"
        items={relatedNotes}
        emptyMessage="No related notes found"
        getKey={(relatedNote) => relatedNote.id}
        renderItem={(relatedNote) => (
          <DetailCardButton
            className="text-left"
            padding="p-2 md:p-3"
            onClick={() => onRelatedNoteClick(relatedNote.id)}
          >
            <p className="text-zinc-300 text-sm">{relatedNote.content}</p>
          </DetailCardButton>
        )}
      />
    </article>
  );
}
