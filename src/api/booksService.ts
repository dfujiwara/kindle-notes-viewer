import type { KindleBook } from "../models";
import { httpClient } from "./httpClient";
import type { ApiResponse } from "./types";

const ENDPOINTS = {
  LIST: "/books",
} as const;

export class BooksService {
  async getBooks(): Promise<ApiResponse<KindleBook[]>> {
    return httpClient.request<KindleBook[]>(ENDPOINTS.LIST);
  }
}

export const booksService = new BooksService();
