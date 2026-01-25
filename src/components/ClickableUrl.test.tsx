import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ClickableUrl } from "./ClickableUrl";

describe("ClickableUrl", () => {
  const testUrl = "https://example.com/article";

  it("renders the URL as a link", () => {
    render(<ClickableUrl url={testUrl} />);

    const link = screen.getByRole("link", { name: testUrl });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", testUrl);
  });

  it("opens link in a new tab with security attributes", () => {
    render(<ClickableUrl url={testUrl} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows full URL in title attribute for tooltip", () => {
    render(<ClickableUrl url={testUrl} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("title", testUrl);
  });

  it("applies custom className", () => {
    render(
      <ClickableUrl url={testUrl} className="custom-class text-red-500" />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class", "text-red-500");
  });

  it("stops event propagation when clicked", async () => {
    const user = userEvent.setup();
    const parentClickHandler = vi.fn();

    render(
      <button type="button" onClick={parentClickHandler}>
        <ClickableUrl url={testUrl} />
      </button>,
    );

    const link = screen.getByRole("link");
    await user.click(link);

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
