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
      screen.getByRole("heading", { name: /upload kindle notes/i }),
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
      screen.queryByRole("button", { name: /upload/i }),
    ).not.toBeInTheDocument();
  });

  it("shows selected file name and upload button when file is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);

    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });

  it("clears selected file when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UploadPage />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/drag and drop your file here/i);

    await user.upload(input, file);
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: /clear/i });
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

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await user.click(uploadButton);

    expect(screen.getByRole("button", { name: /uploading/i })).toBeDisabled();
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

    const uploadButton = screen.getByRole("button", { name: /upload/i });
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

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await user.click(uploadButton);

    // Wait for async operations
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Upload failed: Upload failed");
    });
  });
});
