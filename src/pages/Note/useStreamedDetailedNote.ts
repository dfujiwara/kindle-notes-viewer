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
    const eventSource = notesService.getStreamedRandomNote(
      (note: KindleDetailedNote) => {
        setState({
          status: "streaming",
          note,
        });
      },
      (content: string) => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            console.error(
              "Received context chunk in unexpected state:",
              prev.status,
            );
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
      () => {
        setState((prev) => {
          if (prev.status !== "streaming") {
            console.error(
              "Received context_complete in unexpected state:",
              prev.status,
            );
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
      () => {
        setState({
          status: "error",
          error: new Error("Failed to stream note"),
        });
      },
      (streamError) => {
        setState({
          status: "error",
          error: new Error("Failed to stream note"),
        });
        console.error("Stream error:", streamError);
      },
    );

    return () => {
      eventSource.close();
    };
  }, []);

  return state;
}
