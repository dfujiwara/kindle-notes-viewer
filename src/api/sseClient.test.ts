import { SSEClient } from "./sseClient";

// Mock EventSource
class MockEventSource {
  url: string;
  withCredentials: boolean;
  listeners: Map<string, Array<(event: MessageEvent) => void>> = new Map();
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string, options?: { withCredentials?: boolean }) {
    this.url = url;
    this.withCredentials = options?.withCredentials ?? false;
  }

  addEventListener(eventName: string, handler: (event: MessageEvent) => void) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(handler);
  }

  close() {
    // Mock close
  }

  // Helper to simulate events in tests
  simulateEvent(eventName: string, data: string) {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      const event = new MessageEvent(eventName, { data });
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  // Helper to simulate errors
  simulateError() {
    if (this.onerror) {
      this.onerror(new Event("error"));
    }
  }
}

// Store original EventSource
const OriginalEventSource = global.EventSource;

describe("SSEClient", () => {
  let client: SSEClient;
  const baseUrl = "http://localhost:3000";

  beforeEach(() => {
    global.EventSource = MockEventSource as any;
    client = new SSEClient(baseUrl);
  });

  afterEach(() => {
    global.EventSource = OriginalEventSource;
  });

  describe("createEventSource", () => {
    it("should create EventSource with correct URL", () => {
      const eventSource = client.createEventSource(
        "/stream/notes",
      ) as unknown as MockEventSource;

      expect(eventSource.url).toBe(`${baseUrl}/stream/notes`);
    });

    it("should set withCredentials to true", () => {
      const eventSource = client.createEventSource(
        "/stream/notes",
      ) as unknown as MockEventSource;

      expect(eventSource.withCredentials).toBe(true);
    });
  });

  describe("createEventSourceWithHandlers", () => {
    it("should handle multiple event types correctly", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const data1 = { type: "event1" };
      const data2 = { type: "event2" };

      const eventSource = client.createEventSourceWithHandlers("/stream/test", {
        event1: handler1,
        event2: handler2,
      }) as unknown as MockEventSource;

      eventSource.simulateEvent("event1", JSON.stringify(data1));
      eventSource.simulateEvent("event2", JSON.stringify(data2));

      expect(handler1).toHaveBeenCalledWith(data1, eventSource);
      expect(handler2).toHaveBeenCalledWith(data2, eventSource);
      expect(handler1).not.toHaveBeenCalledWith(data2, expect.anything());
      expect(handler2).not.toHaveBeenCalledWith(data1, expect.anything());
    });

    it("should call onError callback when error occurs", () => {
      const onError = vi.fn();

      const eventSource = client.createEventSourceWithHandlers(
        "/stream/test",
        {
          testEvent: vi.fn(),
        },
        onError,
      ) as unknown as MockEventSource;

      eventSource.simulateError();

      expect(onError).toHaveBeenCalledWith(expect.any(Event));
    });

    it("should not attach error handler if onError is undefined", () => {
      const eventSource = client.createEventSourceWithHandlers("/stream/test", {
        testEvent: vi.fn(),
      }) as unknown as MockEventSource;

      expect(eventSource.onerror).toBeNull();
    });

    it("should continue processing other events after parse error", () => {
      const handler = vi.fn();
      const validData = { id: "123" };

      const eventSource = client.createEventSourceWithHandlers("/stream/test", {
        testEvent: handler,
      }) as unknown as MockEventSource;

      // Send invalid JSON
      eventSource.simulateEvent("testEvent", "invalid json");
      // Send valid JSON
      eventSource.simulateEvent("testEvent", JSON.stringify(validData));

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(validData, eventSource);
    });
  });
});
