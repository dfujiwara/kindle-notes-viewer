import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { KindleBook } from "src/models";
import { describe, expect, it, vi } from "vitest";
import { useApiQuery, useApiSuspenseQuery } from "./queries";
import type { ApiResponse } from "./types";

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useApiQuery", () => {
  it("should unwrap ApiResponse and return data", async () => {
    const bookData = { id: "1", title: "Test Book" };
    const apiCall = vi.fn().mockResolvedValue({
      data: bookData,
      status: 200,
    } as ApiResponse<KindleBook>);

    const { result } = renderHook(() => useApiQuery(["test"], apiCall), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(bookData);
  });

  it("should return loading state (not throw)", () => {
    const apiCall = vi.fn().mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        }),
    );

    const { result } = renderHook(() => useApiQuery(["test"], apiCall), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should pass through query options", async () => {
    const apiCall = vi.fn();

    const { result } = renderHook(
      () => useApiQuery(["test"], apiCall, { enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(apiCall).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useApiSuspenseQuery", () => {
  it("should unwrap ApiResponse and return data", async () => {
    const bookData = { id: "1", title: "Test Book" };
    const apiCall = vi.fn().mockResolvedValue({
      data: bookData,
      status: 200,
    } as ApiResponse<KindleBook>);

    const { result } = renderHook(
      () => useApiSuspenseQuery(["test"], apiCall),
      { wrapper: createWrapper() },
    );

    // Suspense queries don't have isLoading state
    await waitFor(() => expect(result.current.data).toEqual(bookData));
  });
});
