import type { KindleNote } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: (bookId: string) => `/books/${bookId}/notes`,
  CREATE: "/notes",
  RANDOM: "/random",
} as const;

export class NotesService {
  async getNotesFromBook(bookId: string): Promise<ApiResponse<KindleNote[]>> {
    return httpClient.request<KindleNote[]>(ENDPOINTS.LIST(bookId));
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
