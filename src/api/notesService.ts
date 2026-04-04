import { logger } from "src/utils/logger";
import type { KindleDetailedNote, KindleNoteBundle } from "../models";
import { httpClient } from "./httpClient";
import type {
  KindleInitialNoteApiResponse,
  KindleNoteBundleApiResponse,
} from "./kindleApiTypes";
import { mapInitialDetailedNote, mapNoteBundle } from "./kindleApiTypes";
import { sseClient } from "./sseClient";
import type { ApiResponse } from "./types";

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
