import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { KindleBook } from "src/models";
import { vi } from "vitest";
import { BookList } from "./BookList";

const mockBooks: KindleBook[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
  },
];

describe("BookList", () => {
  it("renders all books when books array is not empty", () => {
    const mockOnBookClick = vi.fn();

    render(<BookList books={mockBooks} onBookClick={mockOnBookClick} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("To Kill a Mockingbird")).toBeInTheDocument();
    expect(screen.getByText("1984")).toBeInTheDocument();
    expect(screen.getByText("by F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("by Harper Lee")).toBeInTheDocument();
    expect(screen.getByText("by George Orwell")).toBeInTheDocument();
  });

  it("displays 'No Books Found' message when books array is empty", () => {
    const mockOnBookClick = vi.fn();

    render(<BookList books={[]} onBookClick={mockOnBookClick} />);

    expect(screen.getByText("No Books Found")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onBookClick when a book is clicked", async () => {
    const user = userEvent.setup();
    const mockOnBookClick = vi.fn();

    render(<BookList books={mockBooks} onBookClick={mockOnBookClick} />);

    const firstBookButton = screen
      .getByText("The Great Gatsby")
      .closest("button");
    expect(firstBookButton).toBeInTheDocument();

    await user.click(firstBookButton!);

    expect(mockOnBookClick).toHaveBeenCalledTimes(1);
    expect(mockOnBookClick).toHaveBeenCalledWith(mockBooks[0]);
  });

  it("calls onBookClick with correct book data for each book", async () => {
    const user = userEvent.setup();
    const mockOnBookClick = vi.fn();

    render(<BookList books={mockBooks} onBookClick={mockOnBookClick} />);

    const secondBookButton = screen
      .getByText("To Kill a Mockingbird")
      .closest("button");
    await user.click(secondBookButton!);

    expect(mockOnBookClick).toHaveBeenCalledWith(mockBooks[1]);

    mockOnBookClick.mockClear();

    const thirdBookButton = screen.getByText("1984").closest("button");
    await user.click(thirdBookButton!);

    expect(mockOnBookClick).toHaveBeenCalledWith(mockBooks[2]);
  });

  it("renders correct number of book items", () => {
    const mockOnBookClick = vi.fn();

    render(<BookList books={mockBooks} onBookClick={mockOnBookClick} />);

    const bookButtons = screen.getAllByRole("button");
    expect(bookButtons).toHaveLength(mockBooks.length);
  });

  it("handles single book", () => {
    const singleBook = [mockBooks[0]];
    const mockOnBookClick = vi.fn();

    render(<BookList books={singleBook} onBookClick={mockOnBookClick} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
