import type {
  KindleBook,
  KindleDetailedNote,
  KindleNote,
  KindleNoteBundle,
} from "../models";

export interface KindleNoteApiResponse {
  id: string;
  content: string;
  created_at: string;
}

export interface KindleInitialNoteApiResponse {
  book: KindleBook;
  note: KindleNoteApiResponse;
  related_notes: KindleNoteApiResponse[];
}

export interface KindleNoteBundleApiResponse {
  book: KindleBook;
  notes: KindleNoteApiResponse[];
}

const mapNote = (apiNote: KindleNoteApiResponse): KindleNote => ({
  id: apiNote.id,
  content: apiNote.content,
  createdAt: apiNote.created_at,
});

export const mapNoteBundle = (
  bundle: KindleNoteBundleApiResponse,
): KindleNoteBundle => ({
  book: bundle.book,
  notes: bundle.notes.map(mapNote),
});

export const mapInitialDetailedNote = (
  apiNote: KindleInitialNoteApiResponse,
): KindleDetailedNote => ({
  book: apiNote.book,
  note: mapNote(apiNote.note),
  additionalContext: "",
  relatedNotes: apiNote.related_notes.map(mapNote),
});
