import type { ApiResponse } from './types';
import type { KindleNote } from '../models/note';
import { httpClient } from './httpClient';

const ENDPOINTS = {
  LIST: '/notes',
  GET: (id: string) => `/notes/${id}`,
  CREATE: '/notes',
} as const;

export class NotesService {
  async getNotes(): Promise<ApiResponse<KindleNote[]>> {
    return httpClient.request<KindleNote[]>(ENDPOINTS.LIST);
  }

  async getNote(id: string): Promise<ApiResponse<KindleNote>> {
    return httpClient.request<KindleNote>(ENDPOINTS.GET(id));
  }

  async createNote(
    note: Omit<KindleNote, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<KindleNote>> {
    return httpClient.request<KindleNote>(ENDPOINTS.CREATE, {
      method: "POST",
      headers: {},
      body: note,
    });
  }
}

export const notesService = new NotesService();