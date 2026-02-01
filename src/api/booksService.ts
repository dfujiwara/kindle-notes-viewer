import type { KindleBook } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: "/books",
  UPLOAD: "/books",
  DELETE: (bookId: string) => `/books/${bookId}`,
} as const;

export class BooksService {
  async getBooks(): Promise<ApiResponse<KindleBook[]>> {
    const response = await httpClient.request<{ books: KindleBook[] }>(
      ENDPOINTS.LIST,
    );
    const data = response.data.books || [];
    return { ...response, data };
  }
  async uploadBook(file: File): Promise<ApiResponse<{ success: boolean }>> {
    const formData = new FormData();
    formData.append("file", file);

    return httpClient.request<{ success: boolean }>(ENDPOINTS.UPLOAD, {
      method: "POST",
      headers: {},
      body: formData,
    });
  }
  async deleteBook(bookId: string): Promise<ApiResponse<null>> {
    return httpClient.request<null>(ENDPOINTS.DELETE(bookId), {
      method: "DELETE",
      headers: {},
    });
  }
}

export const booksService = new BooksService();
