import type { KindleBook } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: "/books",
  UPLOAD: "/books",
  UPLOAD_URL: "/urls",
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

  async uploadBookFromUrl(
    url: string,
  ): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.request<{ success: boolean }>(ENDPOINTS.UPLOAD_URL, {
      method: "POST",
      headers: {},
      body: { url },
    });
  }
}

export const booksService = new BooksService();
