import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { KindleDetailedNote } from "src/models";
import { NoteDescription } from "./NoteDescription";

const mockDetailedNote: KindleDetailedNote = {
  book: {
    id: "book-1",
    title: "Sample Book",
    author: "Sample Author",
  },
  note: {
    id: "note-1",
    content: "This is the main note content that provides valuable insights.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  additionalContext:
    "This note discusses important concepts related to the topic.",
  relatedNotes: [
    {
      id: "related-1",
      content: "First related note content",
      createdAt: "2024-01-14T09:15:00Z",
    },
    {
      id: "related-2",
      content: "Second related note content",
      createdAt: "2024-01-16T14:20:00Z",
    },
  ],
};

const mockDetailedNoteWithoutRelated: KindleDetailedNote = {
  book: {
    id: "book-2",
    title: "Another Book",
    author: "Another Author",
  },
  note: {
    id: "note-2",
    content: "A note without related notes.",
    createdAt: "2024-01-17T11:45:00Z",
  },
  additionalContext: "Some additional context for this note.",
  relatedNotes: [],
};

describe("NoteDescription", () => {
  const mockOnBookClick = vi.fn();
  const mockOnRelatedNoteClick = vi.fn();

  beforeEach(() => {
    mockOnBookClick.mockClear();
    mockOnRelatedNoteClick.mockClear();
  });

  it("renders book title and author", () => {
    render(
      <NoteDescription
        detailedNote={mockDetailedNote}
        onBookClick={mockOnBookClick}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(screen.getByText("Sample Book")).toBeInTheDocument();
    expect(screen.getByText("by Sample Author")).toBeInTheDocument();
  });

  it("renders main note content", () => {
    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(
      screen.getByText(
        "This is the main note content that provides valuable insights.",
      ),
    ).toBeInTheDocument();
  });

  it("renders additional context section", () => {
    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(screen.getByText("Additional Context")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This note discusses important concepts related to the topic.",
      ),
    ).toBeInTheDocument();
  });

  it("renders related notes section with notes", () => {
    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(screen.getByText("Related Notes")).toBeInTheDocument();
    expect(screen.getByText("First related note content")).toBeInTheDocument();
    expect(screen.getByText("Second related note content")).toBeInTheDocument();
  });

  it("renders related notes as clickable buttons", () => {
    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    const relatedNoteButtons = screen.getAllByRole("button");
    expect(relatedNoteButtons).toHaveLength(3); // 1 book button + 2 related note buttons
  });

  it("calls onRelatedNoteClick when related note is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    const firstRelatedNote = screen.getByText("First related note content");
    await user.click(firstRelatedNote);

    expect(mockOnRelatedNoteClick).toHaveBeenCalledTimes(1);
    expect(mockOnRelatedNoteClick).toHaveBeenCalledWith("related-1");
  });

  it("displays 'No related notes found' when no related notes exist", () => {
    render(
      <NoteDescription
        onBookClick={mockOnBookClick}
        detailedNote={mockDetailedNoteWithoutRelated}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(screen.getByText("No related notes found")).toBeInTheDocument();
    // There should still be 1 button for the book title/author
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
