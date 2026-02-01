import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router";
import { booksService, notesService } from "src/api";
import type { KindleNoteBundle } from "src/models";
import { BookPage } from "./BookPage";

vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    notesService: {
      getNotesFromBook: vi.fn(),
    },
    booksService: {
      deleteBook: vi.fn(),
    },
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ bookId: "book-1" }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-hot-toast", async () => {
  const actual =
    await vi.importActual<typeof import("react-hot-toast")>("react-hot-toast");
  return {
    ...actual,
    default: {
      ...actual.default,
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const mockNoteBundle: KindleNoteBundle = {
  book: { id: "book-1", title: "Test Book", author: "Test Author" },
  notes: [{ id: "note-1", content: "Note content 1", createdAt: "2026-01-01" }],
};

function renderBookPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <BookPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notesService.getNotesFromBook).mockResolvedValue({
      data: mockNoteBundle,
      status: 200,
    });
  });

  it("renders book description and notes", async () => {
    renderBookPage();

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });
    expect(screen.getByText("Note content 1")).toBeInTheDocument();
  });

  it("deletes book and navigates home on success", async () => {
    vi.mocked(booksService.deleteBook).mockResolvedValue({
      data: null,
      status: 204,
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderBookPage();

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(booksService.deleteBook).toHaveBeenCalledWith("book-1");
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Book deleted successfully");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows error toast on delete failure", async () => {
    const apiError = new Error("Not found");
    Object.assign(apiError, { status: 404, message: "Not found" });
    vi.mocked(booksService.deleteBook).mockRejectedValue(apiError);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderBookPage();

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete book: Not found",
      );
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
