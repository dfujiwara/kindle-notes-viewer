import { useEffect, useState } from "react";
import { urlService } from "src/api";
import type { UrlDetailedChunk } from "src/models";

type StreamState =
  | { status: "loading" }
  | { status: "streaming"; data: UrlDetailedChunk }
  | { status: "success"; data: UrlDetailedChunk }
  | { status: "error"; error: Error };

export function useStreamedDetailedChunk(
  urlId: string,
  chunkId: string,
): StreamState {
  const [state, setState] = useState<StreamState>({
    status: "loading",
  });

  useEffect(() => {
    const handlers = {
      onMetadata: (chunk: UrlDetailedChunk) => {
        setState({
          status: "streaming",
          data: chunk,
        });
      },
      onContextChunk: (content: string) => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            throw new Error(
              `Cannot process context chunk in ${prev.status} state`,
            );
          }
          const { relatedChunks, chunk, url, additionalContext } = prev.data;
          const updatedAdditionalContext = `${additionalContext}${content}`;
          return {
            ...prev,
            data: {
              relatedChunks,
              chunk,
              url,
              additionalContext: updatedAdditionalContext,
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
          error: new Error("Failed to stream chunk"),
        });
      },
      onError: (_streamErrorEvent: Event) => {
        setState({
          status: "error",
          error: new Error("Failed to stream chunk"),
        });
      },
    };

    const eventSource = urlService.getStreamedChunk(urlId, chunkId, handlers);

    return () => {
      eventSource.close();
    };
  }, [urlId, chunkId]);

  return state;
}
