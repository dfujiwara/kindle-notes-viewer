import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("does not trigger search when pressing Enter with less than 3 characters", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "ab");
    await user.keyboard("{Enter}");

    // Should still show idle message
    expect(
      screen.getByText("Enter a search query and press Enter to find notes"),
    ).toBeInTheDocument();
  });

  it("shows placeholder with Enter hint", () => {
    renderWithQueryClient(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  });
});
