import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { KindleBook } from "src/models";
import { vi } from "vitest";
import { BookItem } from "./BookItem";

const mockBook: KindleBook = {
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
};

describe("BookItem", () => {
  it("renders book title and author", () => {
    render(<BookItem book={mockBook} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("by F. Scott Fitzgerald")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<BookItem book={mockBook} onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockBook);
  });

  it("does not crash when onClick is not provided", async () => {
    const user = userEvent.setup();

    render(<BookItem book={mockBook} />);

    const button = screen.getByRole("button");
    await user.click(button);
  });
});
