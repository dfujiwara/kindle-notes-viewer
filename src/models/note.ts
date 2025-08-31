import type { KindleBook } from "./book";

export interface KindleNoteBundle {
  book: KindleBook;
  notes: KindleNote[];
}
export interface KindleNote {
  id: string;
  title: string;
  author: string;
  content: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}
