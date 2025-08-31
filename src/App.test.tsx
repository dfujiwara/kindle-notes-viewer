import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import App from "./App";
import { booksService } from "./api";

vi.mock("./api/booksService");

const TestWrapper = ({
  children,
  initialEntries = ["/"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("App", () => {
  beforeEach(() => {
    vi.mocked(booksService.getBooks).mockResolvedValue({
      data: [],
      status: 200,
    });
  });

  it("renders heading", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Kindle Notes" }),
      ).toBeInTheDocument();
    });
  });

  it("renders home page content with no books", async () => {
    render(
      <TestWrapper initialEntries={["/"]}>
        <App />
      </TestWrapper>,
    );
    await waitFor(() => {
      expect(screen.getByText("No Books Found")).toBeInTheDocument();
    });
  });

  it("renders books page content", () => {
    render(
      <TestWrapper initialEntries={["/books"]}>
        <App />
      </TestWrapper>,
    );
    expect(screen.getByText("books")).toBeInTheDocument();
  });
});
