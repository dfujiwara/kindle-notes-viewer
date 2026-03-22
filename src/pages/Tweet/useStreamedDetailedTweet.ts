import { useEffect, useState } from "react";
import { tweetService } from "src/api";
import type { TweetDetailedContent } from "src/models";

type StreamState =
  | { status: "loading" }
  | { status: "streaming"; data: TweetDetailedContent }
  | { status: "success"; data: TweetDetailedContent }
  | { status: "error"; error: Error };

export function useStreamedDetailedTweet(
  threadId: string,
  tweetId: string,
): StreamState {
  const [state, setState] = useState<StreamState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const handlers = {
      onMetadata: (data: TweetDetailedContent) => {
        setState({ status: "streaming", data });
      },
      onContextChunk: (content: string) => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            return {
              status: "error",
              error: new Error(
                `Cannot process context chunk in ${prev.status} state`,
              ),
            };
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
            return {
              status: "error",
              error: new Error(
                `Cannot complete streaming in ${prev.status} state`,
              ),
            };
          }
          return { status: "success", data: prev.data };
        });
      },
      onInStreamError: () => {
        setState({
          status: "error",
          error: new Error("Failed to stream tweet"),
        });
      },
      onError: (_streamErrorEvent: Event) => {
        setState({
          status: "error",
          error: new Error("Failed to stream tweet"),
        });
      },
    };

    const eventSource = tweetService.getStreamedTweet(
      threadId,
      tweetId,
      handlers,
    );

    return () => {
      eventSource.close();
    };
  }, [threadId, tweetId]);

  return state;
}
