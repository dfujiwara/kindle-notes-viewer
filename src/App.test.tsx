import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders heading", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Kindle Notes" }),
    ).toBeInTheDocument();
  });

  it("renders home page content", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders books page content", () => {
    render(
      <MemoryRouter initialEntries={["/books"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("books")).toBeInTheDocument();
  });
});
