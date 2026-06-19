import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { KindleNote } from "src/models";
import { NoteList } from "./NoteList";

const mockNotes: KindleNote[] = [
  {
    id: "1",
    content: "First note from the book.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    content: "Second note with different content.",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    content: "Third note for testing purposes.",
    createdAt: "2024-01-17T09:15:00Z",
  },
];

describe("NotesList", () => {
  it("renders all notes when notes array is not empty", () => {
    render(<NoteList notes={mockNotes} onNoteClick={vi.fn()} />);

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
    render(<NoteList notes={[]} onNoteClick={vi.fn()} />);

    expect(
      screen.getByText("No notes found for this book."),
    ).toBeInTheDocument();
  });

  it("handles single note", () => {
    render(<NoteList notes={[mockNotes[0]]} onNoteClick={vi.fn()} />);

    expect(screen.getByText("First note from the book.")).toBeInTheDocument();
    expect(
      screen.queryByText("Second note with different content."),
    ).not.toBeInTheDocument();
  });

  it("calls onNoteClick with the clicked note", async () => {
    const onNoteClick = vi.fn();
    render(<NoteList notes={mockNotes} onNoteClick={onNoteClick} />);

    await userEvent.click(
      screen.getByText("Second note with different content."),
    );

    expect(onNoteClick).toHaveBeenCalledWith(mockNotes[1]);
  });
});
