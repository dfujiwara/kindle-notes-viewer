import { logger } from "src/utils/logger";

export class SSEClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Creates an EventSource connection to the specified endpoint
   * @param endpoint - The API endpoint (e.g., '/stream/notes')
   * @returns EventSource instance
   */
  createEventSource(endpoint: string): EventSource {
    const url = `${this.baseUrl}${endpoint}`;

    return new EventSource(url, {
      withCredentials: true, // Include cookies/auth like httpClient
    });
  }

  /**
   * Helper to create EventSource with event listeners
   * @param endpoint - The API endpoint
   * @param handlers - Map of event names to handler functions, with per-event type safety
   * @returns EventSource instance with listeners attached
   */
  createEventSourceWithHandlers<TEvents extends Record<string, unknown>>(
    endpoint: string,
    handlers: {
      [K in keyof TEvents]: (
        data: TEvents[K],
        eventSource: EventSource,
      ) => void;
    },
    onError?: (error: Event) => void,
  ): EventSource {
    const eventSource = this.createEventSource(endpoint);

    // Attach handlers for each event type
    for (const [eventName, handler] of Object.entries(handlers)) {
      eventSource.addEventListener(eventName, (event: MessageEvent) => {
        logger.log(`fetched event data is : ${event.data} for ${eventName}`);
        try {
          const parsed = JSON.parse(event.data);
          handler(parsed, eventSource);
        } catch (error) {
          logger.error(`Error processing SSE event ${eventName}:`, error);
          onError?.(new ErrorEvent("error", { error }));
          throw error;
        }
      });
    }

    // Attach error handler if provided
    if (onError) {
      eventSource.onerror = onError;
    }

    return eventSource;
  }
}

export const sseClient = new SSEClient(import.meta.env.VITE_API_URL);
