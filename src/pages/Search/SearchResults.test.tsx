import { render, screen } from "@testing-library/react";
import type { KindleNoteBundle } from "src/models";
import { SearchResults } from "./SearchResults";

const mockNoteBundles: KindleNoteBundle[] = [
  {
    book: {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    },
    notes: [
      {
        id: "note-1",
        content: "In my younger and more vulnerable years",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "note-2",
        content: "So we beat on, boats against the current",
        createdAt: "2024-01-16T14:20:00Z",
      },
    ],
  },
  {
    book: {
      id: "2",
      title: "1984",
      author: "George Orwell",
    },
    notes: [
      {
        id: "note-3",
        content: "War is peace. Freedom is slavery. Ignorance is strength.",
        createdAt: "2024-01-20T09:15:00Z",
      },
    ],
  },
];

describe("SearchResults", () => {
  it("displays initial message when status is idle", () => {
    render(<SearchResults status="idle" />);

    expect(
      screen.getByText("Enter a search query and press Enter to find notes"),
    ).toBeInTheDocument();
  });

  it("displays error message when status is error", () => {
    render(
      <SearchResults status="error" errorMessage="Network error occurred" />,
    );

    expect(
      screen.getByText("Error: Network error occurred"),
    ).toBeInTheDocument();
  });

  it("displays loading state when status is loading", () => {
    render(<SearchResults status="loading" />);

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("displays no results message when status is success with empty notes", () => {
    render(<SearchResults status="success" notes={[]} />);

    expect(screen.getByText("No notes found")).toBeInTheDocument();
  });

  it("renders all note bundles with book titles and authors", () => {
    render(<SearchResults status="success" notes={mockNoteBundles} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("1984")).toBeInTheDocument();
    expect(screen.getByText("George Orwell")).toBeInTheDocument();
  });

  it("renders all notes within each bundle", () => {
    render(<SearchResults status="success" notes={mockNoteBundles} />);

    expect(
      screen.getByText("In my younger and more vulnerable years"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("So we beat on, boats against the current"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "War is peace. Freedom is slavery. Ignorance is strength.",
      ),
    ).toBeInTheDocument();
  });

  it("formats and displays note creation dates", () => {
    render(<SearchResults status="success" notes={mockNoteBundles} />);

    const expectedDate = new Date("2024-01-15T10:30:00Z").toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
