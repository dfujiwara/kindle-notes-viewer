import type { KindleBook } from "./book";

export interface KindleNoteBundle {
  book: KindleBook;
  notes: KindleNote[];
}
export interface KindleNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface KindleDetailedNote {
  book: KindleBook;
  note: KindleNote;
  additionalContext: string;
  relatedNotes: KindleNote[];
}
