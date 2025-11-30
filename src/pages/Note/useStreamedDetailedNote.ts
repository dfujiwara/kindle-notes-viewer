import { useEffect, useState } from "react";
import { notesService } from "src/api";
import type { KindleDetailedNote } from "src/models";

type StreamState =
  | { status: "loading" }
  | { status: "streaming"; note: KindleDetailedNote }
  | { status: "success"; note: KindleDetailedNote }
  | { status: "error"; error: Error };

export function useStreamedDetailedNote(): StreamState {
  const [state, setState] = useState<StreamState>({
    status: "loading",
  });

  useEffect(() => {
    const handlers = {
      onMetadata: (note: KindleDetailedNote) => {
        setState({
          status: "streaming",
          note,
        });
      },
      onContextChunk: (content: string) => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            throw new Error(
              `Cannot process context chunk in ${prev.status} state`,
            );
          }
          const { relatedNotes, note, book, additionalContext } = prev.note;
          const updatedAdditionalContext = `${additionalContext}${content}`;
          return {
            ...prev,
            note: {
              relatedNotes,
              note,
              book,
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
            note: prev.note,
          };
        });
      },
      onInStreamError: () => {
        setState({
          status: "error",
          error: new Error("Failed to stream note"),
        });
      },
      onError: (_streamErrorEvent: Event) => {
        setState({
          status: "error",
          error: new Error("Failed to stream note"),
        });
      },
    };

    const eventSource = notesService.getStreamedRandomNote(handlers);

    return () => {
      eventSource.close();
    };
  }, []);

  return state;
}
