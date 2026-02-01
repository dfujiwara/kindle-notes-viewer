import { render, screen } from "@testing-library/react";
import type { KindleBook } from "src/models";
import { BookDescription } from "./BookDescription";

const mockBook: KindleBook = {
  id: "1",
  title: "Test Book Title",
  author: "Test Author",
};

describe("BookDescription", () => {
  it("renders book title, author, and delete button", () => {
    render(
      <BookDescription book={mockBook} onDelete={vi.fn()} isDeleting={false} />,
    );

    expect(screen.getByText("Test Book Title")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
