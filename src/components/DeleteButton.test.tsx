import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteButton } from "./DeleteButton";

describe("DeleteButton", () => {
  it("renders delete button with aria-label", () => {
    render(
      <DeleteButton
        confirmMessage="Delete this?"
        onDelete={vi.fn()}
        isDeleting={false}
        ariaLabel="Delete item"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Delete item" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onDelete when confirm is accepted", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <DeleteButton
        confirmMessage="Delete this?"
        onDelete={onDelete}
        isDeleting={false}
        ariaLabel="Delete item"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete item" }));

    expect(window.confirm).toHaveBeenCalledWith("Delete this?");
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("does not call onDelete when confirm is cancelled", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <DeleteButton
        confirmMessage="Delete this?"
        onDelete={onDelete}
        isDeleting={false}
        ariaLabel="Delete item"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete item" }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("shows 'Deleting...' and is disabled when isDeleting is true", () => {
    render(
      <DeleteButton
        confirmMessage="Delete this?"
        onDelete={vi.fn()}
        isDeleting={true}
        ariaLabel="Delete item"
      />,
    );

    const button = screen.getByRole("button", { name: "Delete item" });
    expect(button).toBeDisabled();
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});
