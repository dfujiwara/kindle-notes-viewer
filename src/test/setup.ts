import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock logger globally to prevent console noise in tests
vi.mock("src/utils/logger", () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));
