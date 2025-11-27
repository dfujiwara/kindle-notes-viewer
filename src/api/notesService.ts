import type {
  KindleBook,
  KindleDetailedNote,
  KindleNote,
  KindleNoteBundle,
} from "../models";
import { httpClient } from "./httpClient";
import { sseClient } from "./sseClient";
import type { ApiResponse } from "./types";

// API response interfaces with snake_case fields
interface KindleNoteApiResponse {
  id: string;
  content: string;
  created_at: string;
}

interface KindleInitialNoteApiResponse {
  book: KindleBook;
  note: KindleNoteApiResponse;
  related_notes: KindleNoteApiResponse[];
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

const mapInitialDetailedNote = (
  apiNote: KindleInitialNoteApiResponse,
): KindleDetailedNote => ({
  book: apiNote.book,
  note: mapNote(apiNote.note),
  additionalContext: "",
  relatedNotes: apiNote.related_notes.map(mapNote),
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
  STREAM_RANDOM: "/random/stream",
  STREAM_NOTE: (bookId: string, noteId: string) =>
    `/books/${bookId}/notes/${noteId}/stream`,
} as const;

type NoteStreamEvents = {
  metadata: KindleInitialNoteApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};

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

  /**
   * Creates a streaming connection for a specific note
   * @param bookId - The book ID
   * @param noteId - The note ID
   * @param onChunk - Callback for each data chunk received
   * @param onComplete - Callback when stream completes
   * @param onError - Callback for errors
   * @returns EventSource instance (caller must close it)
   */
  getStreamedNote(
    bookId: string,
    noteId: string,
    onMetadata: (note: KindleDetailedNote) => void,
    onContextChunk: (content: string) => void,
    onComplete: () => void,
    onInStreamError: () => void,
    onError?: (error: Event) => void,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<NoteStreamEvents>(
      ENDPOINTS.STREAM_NOTE(bookId, noteId),
      {
        metadata: (data, _es) => {
          const mappedData = mapInitialDetailedNote(data);
          onMetadata(mappedData);
        },
        context_chunk: (data, _es) => {
          onContextChunk(data.content);
        },
        context_complete: (_data, es) => {
          onComplete();
          es.close();
        },
        error: (data, es) => {
          console.log(data.detail);
          onInStreamError();
          es.close();
        },
      },
      onError,
    );
  }

  /**
   * Creates a streaming connection for random notes
   * @param onChunk - Callback for each data chunk received
   * @param onComplete - Callback when stream completes
   * @param onError - Callback for errors
   * @returns EventSource instance (caller must close it)
   */
  getStreamedRandomNote(
    onMetadata: (note: KindleDetailedNote) => void,
    onContextChunk: (content: string) => void,
    onComplete: () => void,
    onInStreamError: () => void,
    onError?: (error: Event) => void,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<NoteStreamEvents>(
      ENDPOINTS.STREAM_RANDOM,
      {
        metadata: (data, _es) => {
          const mappedData = mapInitialDetailedNote(data);
          onMetadata(mappedData);
        },
        context_chunk: (data, _es) => {
          onContextChunk(data.content);
        },
        context_complete: (_data, es) => {
          onComplete();
          es.close();
        },
        error: (data, es) => {
          console.log(data.detail);
          onInStreamError();
          es.close();
        },
      },
      onError,
    );
  }
}

export const notesService = new NotesService();
