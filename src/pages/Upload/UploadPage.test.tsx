import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UploadPage } from "./UploadPage";

// Mock the API
vi.mock("src/api", async () => {
  const actual = await vi.importActual("src/api");
  return {
    ...actual,
    booksService: {
      uploadBook: vi.fn(),
      uploadBookFromUrl: vi.fn(),
    },
  };
});

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("UploadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the upload page with title", () => {
    renderWithProviders(<UploadPage />);

    expect(
      screen.getByRole("heading", { name: /upload notes/i }),
    ).toBeInTheDocument();
  });

  it("renders file drop zone without upload button", () => {
    renderWithProviders(<UploadPage />);

    expect(
      screen.getByText(/drag and drop your file here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/accepted formats: .txt, .html/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Upload", exact: true }),
    ).not.toBeInTheDocument();
  });

  it("shows selected file name and upload button when file is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);

    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Upload", exact: true }),
    ).toBeInTheDocument();
  });

  it("clears selected file when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", {
      name: "Clear Selection",
      exact: true,
    });
    await user.click(clearButton);

    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    expect(
      screen.getByText(/drag and drop your file here/i),
    ).toBeInTheDocument();
  });

  it("shows loading state when uploading", async () => {
    const { booksService } = await import("src/api");
    const user = userEvent.setup();

    // Mock upload to delay resolution
    vi.mocked(booksService.uploadBook).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        }),
    );

    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);

    const uploadButton = screen.getByRole("button", {
      name: "Upload",
      exact: true,
    });
    await user.click(uploadButton);

    expect(
      screen.getByRole("button", { name: "Uploading...", exact: true }),
    ).toBeDisabled();
  });

  it("calls toast.success and navigates on successful upload", async () => {
    const { booksService } = await import("src/api");
    const user = userEvent.setup();

    // Mock successful upload
    vi.mocked(booksService.uploadBook).mockResolvedValue({
      data: { success: true },
      status: 200,
    });

    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);

    const uploadButton = screen.getByRole("button", {
      name: "Upload",
      exact: true,
    });
    await user.click(uploadButton);

    // Wait for async operations
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Book uploaded successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("calls toast.error on failed upload", async () => {
    const { booksService } = await import("src/api");
    const user = userEvent.setup();

    // Mock failed upload
    const error = new Error("Upload failed");
    vi.mocked(booksService.uploadBook).mockRejectedValue(error);

    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);

    const uploadButton = screen.getByRole("button", {
      name: "Upload",
      exact: true,
    });
    await user.click(uploadButton);

    // Wait for async operations
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Upload failed: Upload failed");
    });
  });

  describe("Mode Toggle", () => {
    it("renders both file and url mode buttons", () => {
      renderWithProviders(<UploadPage />);

      expect(
        screen.getByRole("button", { name: /file upload/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /url upload/i }),
      ).toBeInTheDocument();
    });

    it("switches from file mode to url mode", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Default is file mode
      expect(
        screen.getByText(/drag and drop your file here/i),
      ).toBeInTheDocument();

      // Click URL Upload button
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Should show URL input
      expect(
        screen.getByPlaceholderText("https://example.com/article"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/drag and drop your file here/i),
      ).not.toBeInTheDocument();
    });

    it("switches from url mode to file mode", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);
      expect(
        screen.getByPlaceholderText("https://example.com/article"),
      ).toBeInTheDocument();

      // Switch back to file mode
      const fileButton = screen.getByRole("button", { name: /file upload/i });
      await user.click(fileButton);

      // Should show file drop zone
      expect(
        screen.getByText(/drag and drop your file here/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("https://example.com/article"),
      ).not.toBeInTheDocument();
    });

    it("clears file when switching to URL mode", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Select a file
      const file = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const input = screen.getByLabelText(/drag and drop your file here/i);
      await user.upload(input, file);
      expect(screen.getByText("test.txt")).toBeInTheDocument();

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Switch back to file mode
      const fileButton = screen.getByRole("button", { name: /file upload/i });
      await user.click(fileButton);

      // File should be cleared
      expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    });

    it("clears URL when switching to file mode", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode and enter URL
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Switch to file mode
      const fileButton = screen.getByRole("button", { name: /file upload/i });
      await user.click(fileButton);

      // Switch back to URL mode
      await user.click(urlButton);

      // URL should be cleared
      const urlInputAfter = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      expect(urlInputAfter).toHaveValue("");
    });
  });

  describe("URL Upload", () => {
    it("shows URL input in URL mode", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      expect(
        screen.getByPlaceholderText("https://example.com/article"),
      ).toBeInTheDocument();
    });

    it("shows upload button when valid URL is entered", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Upload button should appear (exact match to avoid mode toggle buttons)
      expect(
        screen.getByRole("button", { name: "Upload", exact: true }),
      ).toBeInTheDocument();
    });

    it("shows error for invalid URL", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter invalid URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "not-a-url");

      // Upload button appears because text is entered
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should show validation error
      expect(screen.getByText(/invalid url format/i)).toBeInTheDocument();
    });

    it("shows error for non-http(s) URLs", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter ftp URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "ftp://example.com");

      // Upload button appears
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should show validation error
      expect(
        screen.getByText(/url must use http or https protocol/i),
      ).toBeInTheDocument();
    });

    it("calls uploadBookFromUrl with valid URL", async () => {
      const { booksService } = await import("src/api");
      const user = userEvent.setup();

      vi.mocked(booksService.uploadBookFromUrl).mockResolvedValue({
        data: { success: true },
        status: 200,
      });

      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter valid URL (paste to avoid character-by-character validation)
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.click(urlInput);
      await user.paste("https://example.com");

      // Click upload
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should call the API
      await waitFor(() => {
        expect(booksService.uploadBookFromUrl).toHaveBeenCalledWith(
          "https://example.com",
        );
      });
    });

    it("shows loading state during URL upload", async () => {
      const { booksService } = await import("src/api");
      const user = userEvent.setup();

      vi.mocked(booksService.uploadBookFromUrl).mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          }),
      );

      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter valid URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Click upload
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should show loading state
      expect(
        screen.getByRole("button", { name: "Uploading...", exact: true }),
      ).toBeDisabled();
    });

    it("shows success toast and navigates on successful URL upload", async () => {
      const { booksService } = await import("src/api");
      const user = userEvent.setup();

      vi.mocked(booksService.uploadBookFromUrl).mockResolvedValue({
        data: { success: true },
        status: 200,
      });

      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter valid URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Click upload
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should show success and navigate
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Book uploaded successfully!",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("shows error toast on failed URL upload", async () => {
      const { booksService } = await import("src/api");
      const user = userEvent.setup();

      const error = new Error("URL upload failed");
      vi.mocked(booksService.uploadBookFromUrl).mockRejectedValue(error);

      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter valid URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Click upload
      const uploadButton = screen.getByRole("button", {
        name: "Upload",
        exact: true,
      });
      await user.click(uploadButton);

      // Should show error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Upload failed: URL upload failed",
        );
      });
    });

    it("clears URL when clear button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UploadPage />);

      // Switch to URL mode
      const urlButton = screen.getByRole("button", { name: /url upload/i });
      await user.click(urlButton);

      // Enter URL
      const urlInput = screen.getByPlaceholderText(
        "https://example.com/article",
      );
      await user.type(urlInput, "https://example.com");

      // Click clear
      const clearButton = screen.getByRole("button", {
        name: "Clear Selection",
        exact: true,
      });
      await user.click(clearButton);

      // URL should be cleared - input should be visible again
      expect(
        screen.getByPlaceholderText("https://example.com/article"),
      ).toHaveValue("");
    });
  });
});
