import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ApiResponse } from "src/api";
import { searchService } from "src/api";
import type { SearchResult } from "src/models";
import { SearchPage } from "./SearchPage";

// Mock the search service
vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    searchService: {
      search: vi.fn(),
    },
  };
});

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(searchService.search).mockResolvedValue({
      status: 200,
      data: {
        q: "test",
        count: 0,
        books: [],
        urls: [],
        tweetThreads: [],
      },
    } satisfies ApiResponse<SearchResult>);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays helper text when input has 1-2 characters", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "ab");

    expect(
      screen.getByText("Please enter at least 3 characters"),
    ).toBeInTheDocument();
  });

  it("does not display helper text when input is empty", () => {
    renderWithQueryClient(<SearchPage />);

    expect(
      screen.queryByText("Please enter at least 3 characters"),
    ).not.toBeInTheDocument();
  });

  it("does not display helper text when input has 3 or more characters", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "abc");

    expect(
      screen.queryByText("Please enter at least 3 characters"),
    ).not.toBeInTheDocument();
  });

  it("handles whitespace-only input correctly", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "   ");

    // Should not show helper text for whitespace-only input
    expect(
      screen.queryByText("Please enter at least 3 characters"),
    ).not.toBeInTheDocument();
  });

  it("handles whitespace with few characters correctly", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "  a  ");

    // Should show helper text since trimmed length is 1
    expect(
      screen.getByText("Please enter at least 3 characters"),
    ).toBeInTheDocument();
  });

  it("does not trigger search when input is shorter than 3 characters", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "ab");

    expect(searchService.search).not.toHaveBeenCalled();
    expect(screen.getByText("Start typing to search")).toBeInTheDocument();
  });

  it("debounces search requests while typing", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "abc");

    expect(searchService.search).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(searchService.search).toHaveBeenCalledWith("abc");
    });
  });

  it("shows placeholder without an Enter hint", () => {
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  });
});
