import { render, screen } from "@testing-library/react";
import type { KindleNote } from "src/models";
import { NotesList } from "./NotesList";

const mockNotes: KindleNote[] = [
  {
    id: "1",
    content: "First note from the book.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    content: "Second note with different content.",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    content: "Third note for testing purposes.",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
];

describe("NotesList", () => {
  it("renders all notes when notes array is not empty", () => {
    render(<NotesList notes={mockNotes} />);

    expect(screen.getByText("First note from the book.")).toBeInTheDocument();
    expect(
      screen.getByText("Second note with different content."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Third note for testing purposes."),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/note/)).toHaveLength(mockNotes.length);
  });

  it("displays 'No notes found' message when notes array is empty", () => {
    render(<NotesList notes={[]} />);

    expect(
      screen.getByText("No notes found for this book."),
    ).toBeInTheDocument();
  });

  it("handles single note", () => {
    const singleNote = [mockNotes[0]];

    render(<NotesList notes={singleNote} />);

    expect(screen.getByText("First note from the book.")).toBeInTheDocument();
    expect(
      screen.queryByText("Second note with different content."),
    ).not.toBeInTheDocument();
  });
});
