import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import App from "./App";
import { booksService, notesService, urlService } from "./api";

vi.mock("./api/booksService");
vi.mock("./api/notesService");
vi.mock("./api/urlService");

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
    vi.mocked(urlService.getUrls).mockResolvedValue({
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

  describe("Home Page", async () => {
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
  });

  describe("Book Page ", async () => {
    beforeEach(() => {
      vi.mocked(booksService.getBooks).mockResolvedValue({
        data: [{ id: "1", title: "A book title", author: "The Man" }],
        status: 200,
      });
      vi.mocked(notesService.getNotesFromBook).mockResolvedValue({
        data: {
          book: { id: "1", title: "A book title", author: "The Man" },
          notes: [],
        },
        status: 200,
      });
    });
    it("renders books page content", async () => {
      render(
        <TestWrapper initialEntries={["/books/1"]}>
          <App />
        </TestWrapper>,
      );
      await waitFor(() => {
        expect(screen.getByText("A book title")).toBeInTheDocument();
      });
    });
  });
});
