import type {
  KindleDetailedNote,
  KindleNote,
  KindleNoteBundle,
} from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: (bookId: string) => `/books/${bookId}/notes`,
  NOTE: (bookId: string, noteId: string) => `/books/${bookId}/notes/${noteId}`,
  CREATE: "/notes",
  RANDOM: "/random",
} as const;

export class NotesService {
  async getNotesFromBook(
    bookId: string,
  ): Promise<ApiResponse<KindleNoteBundle>> {
    return httpClient.request<KindleNoteBundle>(ENDPOINTS.LIST(bookId));
  }

  async getNote(
    bookId: string,
    noteId: string,
  ): Promise<ApiResponse<KindleDetailedNote>> {
    return httpClient.request<KindleDetailedNote>(
      ENDPOINTS.NOTE(bookId, noteId),
    );
  }

  async getRandomNote(): Promise<ApiResponse<KindleNote>> {
    return httpClient.request<KindleNote>(ENDPOINTS.RANDOM);
  }

  async createNote(
    note: Omit<KindleNote, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<KindleNote>> {
    return httpClient.request<KindleNote>(ENDPOINTS.CREATE, {
      method: "POST",
      headers: {},
      body: note,
    });
  }
}

export const notesService = new NotesService();
