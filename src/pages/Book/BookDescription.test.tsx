import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("calls onDelete when confirm is accepted", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <BookDescription
        book={mockBook}
        onDelete={onDelete}
        isDeleting={false}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("does not call onDelete when confirm is cancelled", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <BookDescription
        book={mockBook}
        onDelete={onDelete}
        isDeleting={false}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("shows 'Deleting...' when isDeleting is true", () => {
    render(
      <BookDescription book={mockBook} onDelete={vi.fn()} isDeleting={true} />,
    );
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});
