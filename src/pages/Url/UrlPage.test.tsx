import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router";
import { urlService } from "src/api";
import type { UrlChunkBundle } from "src/models";
import { UrlPage } from "./UrlPage";

vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    urlService: {
      getChunksFromUrl: vi.fn(),
      deleteUrl: vi.fn(),
    },
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ urlId: "url-1" }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-hot-toast", async () => {
  const actual = await vi.importActual("react-hot-toast");
  return {
    ...actual,
    default: {
      ...actual.default,
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const mockChunkBundle: UrlChunkBundle = {
  url: {
    id: "url-1",
    url: "https://example.com",
    title: "Example Page",
    chunkCount: 1,
    createdAt: "2026-01-01",
  },
  chunks: [
    {
      id: "chunk-1",
      content: "Chunk content 1",
      isSummary: false,
      createdAt: "2026-01-01",
    },
  ],
};

function renderUrlPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <UrlPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("UrlPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(urlService.getChunksFromUrl).mockResolvedValue({
      data: mockChunkBundle,
      status: 200,
    });
  });

  it("renders URL description and chunks", async () => {
    renderUrlPage();

    await waitFor(() => {
      expect(screen.getByText("Example Page")).toBeInTheDocument();
    });
    expect(screen.getByText("Chunk content 1")).toBeInTheDocument();
  });

  it("deletes URL and navigates home on success", async () => {
    vi.mocked(urlService.deleteUrl).mockResolvedValue({
      data: null,
      status: 204,
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderUrlPage();

    await waitFor(() => {
      expect(screen.getByText("Example Page")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(urlService.deleteUrl).toHaveBeenCalledWith("url-1");
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("URL deleted successfully");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows error toast on delete failure", async () => {
    const apiError = new Error("Not found");
    Object.assign(apiError, { status: 404, message: "Not found" });
    vi.mocked(urlService.deleteUrl).mockRejectedValue(apiError);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderUrlPage();

    await waitFor(() => {
      expect(screen.getByText("Example Page")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete URL: Not found",
      );
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
