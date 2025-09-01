import { render, screen } from "@testing-library/react";
import type { KindleNote } from "src/models";
import { NoteItem } from "./NoteItem";

const mockNote: KindleNote = {
  id: "1",
  content: "This is a sample note from the book.",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
};

describe("NoteItem", () => {
  it("renders note content", () => {
    render(<NoteItem note={mockNote} />);

    expect(
      screen.getByText("This is a sample note from the book."),
    ).toBeInTheDocument();
  });

  it("handles empty note content", () => {
    const emptyNote: KindleNote = {
      id: "4",
      content: "",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    };

    render(<NoteItem note={emptyNote} />);

    const noteContent = screen.getByRole("paragraph");
    expect(noteContent).toBeInTheDocument();
    expect(noteContent).toHaveTextContent("");
  });

  it("handles note content with line breaks", () => {
    const multilineNote: KindleNote = {
      id: "5",
      content:
        "First line of the note.\nSecond line of the note.\nThird line of the note.",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    };

    render(<NoteItem note={multilineNote} />);

    const noteContent = screen.getByRole("paragraph");
    expect(noteContent).toHaveTextContent(
      "First line of the note. Second line of the note. Third line of the note.",
    );
  });
});
