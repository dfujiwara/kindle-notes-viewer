import type { KindleBook } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: "/books",
} as const;

export class BooksService {
  async getBooks(): Promise<ApiResponse<KindleBook[]>> {
    const response = await httpClient.request<{ books: KindleBook[] }>(
      ENDPOINTS.LIST,
    );
    const data = response.data.books || [];
    return { ...response, data };
  }
}

export const booksService = new BooksService();
