import { useEffect, useState } from "react";
import { randomService } from "src/api";
import type { RandomContent } from "src/models";

type StreamState =
  | { status: "loading" }
  | { status: "streaming"; data: RandomContent }
  | { status: "success"; data: RandomContent }
  | { status: "error"; error: Error };

export function useStreamedRandomContent(): StreamState {
  const [state, setState] = useState<StreamState>({
    status: "loading",
  });

  useEffect(() => {
    const handlers = {
      onMetadata: (content: RandomContent) => {
        setState({
          status: "streaming",
          data: content,
        });
      },
      onContextChunk: (content: string) => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            throw new Error(
              `Cannot process context chunk in ${prev.status} state`,
            );
          }
          return {
            ...prev,
            data: {
              ...prev.data,
              additionalContext: `${prev.data.additionalContext}${content}`,
            },
          };
        });
      },
      onComplete: () => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            throw new Error(
              `Cannot complete streaming in ${prev.status} state`,
            );
          }
          return {
            status: "success",
            data: prev.data,
          };
        });
      },
      onInStreamError: () => {
        setState({
          status: "error",
          error: new Error("Failed to stream random content"),
        });
      },
      onError: (_streamErrorEvent: Event) => {
        setState({
          status: "error",
          error: new Error("Failed to stream random content"),
        });
      },
    };

    const eventSource = randomService.getStreamedRandomContent(handlers);

    return () => {
      eventSource.close();
    };
  }, []);

  return state;
}
