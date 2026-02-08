import { logger } from "src/utils/logger";
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

const ENDPOINTS = {
  LIST: (bookId: string) => `/books/${bookId}/notes`,
  STREAM_NOTE: (bookId: string, noteId: string) =>
    `/books/${bookId}/notes/${noteId}`,
} as const;

type NoteStreamEvents = {
  metadata: KindleInitialNoteApiResponse;
  context_chunk: { content: string };
  context_complete: Record<string, never>;
  error: { detail: string };
};

export type StreamHandlers = {
  onMetadata: (note: KindleDetailedNote) => void;
  onContextChunk: (content: string) => void;
  onComplete: () => void;
  onInStreamError: () => void;
  onError?: (error: Event) => void;
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

  /**
   * Creates a streaming connection for a specific note
   * @param bookId - The book ID
   * @param noteId - The note ID
   * @param handlers - Object containing all stream event handlers
   * @returns EventSource instance (caller must close it)
   */
  getStreamedNote(
    bookId: string,
    noteId: string,
    handlers: StreamHandlers,
  ): EventSource {
    return sseClient.createEventSourceWithHandlers<NoteStreamEvents>(
      ENDPOINTS.STREAM_NOTE(bookId, noteId),
      {
        metadata: (data, _es) => {
          const mappedData = mapInitialDetailedNote(data);
          handlers.onMetadata(mappedData);
        },
        context_chunk: (data, _es) => {
          handlers.onContextChunk(data.content);
        },
        context_complete: (_data, es) => {
          handlers.onComplete();
          es.close();
        },
        error: (data, es) => {
          logger.error(data.detail);
          handlers.onInStreamError();
          es.close();
        },
      },
      handlers.onError,
    );
  }
}

export const notesService = new NotesService();
