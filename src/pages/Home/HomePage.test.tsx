import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { booksService, urlService } from "src/api";
import type { KindleBook, Url } from "src/models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage";

// Mock the API
vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    booksService: {
      getBooks: vi.fn(),
    },
    urlService: {
      getUrls: vi.fn(),
    },
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

async function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const result = render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );

  // Wait for initial data to load (Books tab is default)
  await waitFor(() => {
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
  });

  return result;
}

const mockBooks: KindleBook[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
  },
];

const mockUrls: Url[] = [
  {
    id: "url-1",
    url: "https://example.com/article1",
    title: "Example Article 1",
    chunkCount: 5,
    createdAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "url-2",
    url: "https://example.com/article2",
    title: "Example Article 2",
    chunkCount: 3,
    createdAt: "2026-01-05T11:00:00Z",
  },
];

describe("HomePage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    // Mock API responses
    vi.mocked(booksService.getBooks).mockResolvedValue({
      data: mockBooks,
      status: 200,
    });
    vi.mocked(urlService.getUrls).mockResolvedValue({
      data: mockUrls,
      status: 200,
    });
  });

  describe("Tab Navigation", () => {
    it("renders both Books and URLs tabs", async () => {
      await renderWithProviders(<HomePage />);

      expect(screen.getByRole("tab", { name: /^Books$/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /^URLs$/i })).toBeInTheDocument();
    });

    it("shows Books tab as active by default", async () => {
      await renderWithProviders(<HomePage />);

      const booksTab = screen.getByRole("tab", { name: /^Books$/i });
      expect(booksTab).toHaveAttribute("aria-selected", "true");
      expect(booksTab).toHaveAttribute("tabindex", "0");

      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      expect(urlsTab).toHaveAttribute("aria-selected", "false");
      expect(urlsTab).toHaveAttribute("tabindex", "-1");
    });

    it("displays Books content by default", async () => {
      await renderWithProviders(<HomePage />);

      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(screen.getByText("1984")).toBeInTheDocument();

      // URLs should not be visible
      expect(screen.queryByText("Example Article 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Example Article 2")).not.toBeInTheDocument();
    });

    it("switches to URLs tab when clicked", async () => {
      await renderWithProviders(<HomePage />);

      // Click URLs tab
      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      await user.click(urlsTab);

      // URLs should be visible (data already loaded, no need to wait)
      expect(screen.getByText("Example Article 1")).toBeInTheDocument();
      expect(screen.getByText("Example Article 2")).toBeInTheDocument();

      // Books should not be visible
      expect(screen.queryByText("The Great Gatsby")).not.toBeInTheDocument();
      expect(screen.queryByText("1984")).not.toBeInTheDocument();

      // Tab should be marked as active
      expect(urlsTab).toHaveAttribute("aria-selected", "true");
      expect(urlsTab).toHaveAttribute("tabindex", "0");
    });

    it("switches back to Books tab when clicked", async () => {
      await renderWithProviders(<HomePage />);

      // Switch to URLs
      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      await user.click(urlsTab);

      expect(screen.getByText("Example Article 1")).toBeInTheDocument();

      // Switch back to Books
      const booksTab = screen.getByRole("tab", { name: /^Books$/i });
      await user.click(booksTab);

      // Books should be visible again
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(screen.getByText("1984")).toBeInTheDocument();

      // URLs should not be visible
      expect(screen.queryByText("Example Article 1")).not.toBeInTheDocument();

      // Tab should be marked as active
      expect(booksTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("switches tabs with arrow keys from Books tab", async () => {
      await renderWithProviders(<HomePage />);

      // Focus on Books tab and press ArrowRight
      const booksTab = screen.getByRole("tab", { name: /^Books$/i });
      booksTab.focus();
      await user.keyboard("{ArrowRight}");

      // Should switch to URLs (data already loaded)
      expect(screen.getByText("Example Article 1")).toBeInTheDocument();

      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      expect(urlsTab).toHaveAttribute("aria-selected", "true");
    });

    it("switches tabs with arrow keys from URLs tab", async () => {
      await renderWithProviders(<HomePage />);

      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      await user.click(urlsTab);

      expect(screen.getByText("Example Article 1")).toBeInTheDocument();

      // Focus on URLs tab and press ArrowLeft
      urlsTab.focus();
      await user.keyboard("{ArrowLeft}");

      // Should switch back to Books
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();

      const booksTab = screen.getByRole("tab", { name: /^Books$/i });
      expect(booksTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes for tabs", async () => {
      await renderWithProviders(<HomePage />);

      const booksTab = screen.getByRole("tab", { name: /^Books$/i });
      expect(booksTab).toHaveAttribute("aria-controls");
      expect(booksTab).toHaveAttribute("id");

      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      expect(urlsTab).toHaveAttribute("aria-controls");
      expect(urlsTab).toHaveAttribute("id");
    });

    it("has proper ARIA attributes for tab panels", async () => {
      await renderWithProviders(<HomePage />);

      const booksPanel = screen.getByRole("tabpanel");
      expect(booksPanel).toHaveAttribute("id");
      expect(booksPanel).toHaveAttribute("aria-labelledby");

      // Switch to URLs tab
      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      await user.click(urlsTab);

      await waitFor(() => {
        const urlsPanel = screen.getByRole("tabpanel");
        expect(urlsPanel).toHaveAttribute("id");
        expect(urlsPanel).toHaveAttribute("aria-labelledby");
      });
    });

    it("has tablist role on tab container", async () => {
      await renderWithProviders(<HomePage />);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to book detail when book is clicked", async () => {
      await renderWithProviders(<HomePage />);

      const bookButton = screen.getByRole("button", {
        name: /The Great Gatsby/i,
      });
      await user.click(bookButton);

      expect(mockNavigate).toHaveBeenCalledWith("/books/1");
    });

    it("navigates to URL detail when URL is clicked", async () => {
      await renderWithProviders(<HomePage />);

      const urlsTab = screen.getByRole("tab", { name: /^URLs$/i });
      await user.click(urlsTab);

      expect(screen.getByText("Example Article 1")).toBeInTheDocument();

      const urlButton = screen.getByRole("button", {
        name: /Example Article 1/i,
      });
      await user.click(urlButton);

      expect(mockNavigate).toHaveBeenCalledWith("/urls/url-1");
    });
  });
});
