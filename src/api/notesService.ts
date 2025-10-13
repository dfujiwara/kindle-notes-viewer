import type {
  KindleBook,
  KindleDetailedNote,
  KindleNote,
  KindleNoteBundle,
} from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

// API response interfaces with snake_case fields
interface KindleNoteApiResponse {
  id: string;
  content: string;
  created_at: string;
}

interface KindleDetailedNoteApiResponse {
  book: KindleBook;
  note: KindleNoteApiResponse;
  additional_context: string;
  related_notes: KindleNoteApiResponse[];
}

interface KindleNoteBundleApiResponse {
  book: KindleBook;
  notes: KindleNoteApiResponse[];
}

// Mapping functions
const mapNote = (apiNote: KindleNoteApiResponse): KindleNote => ({
  id: apiNote.id,
  content: apiNote.content,
  createdAt: apiNote.created_at,
});

const mapNoteBundle = (
  apiBundle: KindleNoteBundleApiResponse,
): KindleNoteBundle => ({
  book: apiBundle.book,
  notes: apiBundle.notes.map(mapNote),
});

const mapDetailedNote = (
  apiNote: KindleDetailedNoteApiResponse,
): KindleDetailedNote => ({
  book: apiNote.book,
  note: mapNote(apiNote.note),
  additionalContext: apiNote.additional_context,
  relatedNotes: apiNote.related_notes.map(mapNote),
});

const ENDPOINTS = {
  LIST: (bookId: string) => `/books/${bookId}/notes`,
  NOTE: (bookId: string, noteId: string) => `/books/${bookId}/notes/${noteId}`,
  RANDOM: "/random",
} as const;

export class NotesService {
  async getNotesFromBook(
    bookId: string,
  ): Promise<ApiResponse<KindleNoteBundle>> {
    const response = await httpClient.request<KindleNoteBundleApiResponse>(
      ENDPOINTS.LIST(bookId),
    );
    return {
      ...response,
      data: mapNoteBundle(response.data),
    };
  }

  async getNote(
    bookId: string,
    noteId: string,
  ): Promise<ApiResponse<KindleDetailedNote>> {
    const response = await httpClient.request<KindleDetailedNoteApiResponse>(
      ENDPOINTS.NOTE(bookId, noteId),
    );
    return {
      ...response,
      data: mapDetailedNote(response.data),
    };
  }

  async getRandomNote(): Promise<ApiResponse<KindleDetailedNote>> {
    const response = await httpClient.request<KindleDetailedNoteApiResponse>(
      ENDPOINTS.RANDOM,
    );
    return {
      ...response,
      data: mapDetailedNote(response.data),
    };
  }
}

export const notesService = new NotesService();
