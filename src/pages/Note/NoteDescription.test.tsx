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
  additional_context:
    "This note discusses important concepts related to the topic.",
  related_notes: [
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
  additional_context: "Some additional context for this note.",
  related_notes: [],
};

describe("NoteDescription", () => {
  const mockOnRelatedNoteClick = vi.fn();

  beforeEach(() => {
    mockOnRelatedNoteClick.mockClear();
  });

  it("renders main note content", () => {
    render(
      <NoteDescription
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
        detailedNote={mockDetailedNote}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    const relatedNoteButtons = screen.getAllByRole("button");
    expect(relatedNoteButtons).toHaveLength(2);
  });

  it("calls onRelatedNoteClick when related note is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NoteDescription
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
        detailedNote={mockDetailedNoteWithoutRelated}
        onRelatedNoteClick={mockOnRelatedNoteClick}
      />,
    );

    expect(screen.getByText("No related notes found")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
