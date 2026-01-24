import { useNavigate } from "react-router";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import {
  mapBookSourceToKindleBook,
  mapNoteContentToKindleNote,
  mapRelatedItemsToNotes,
  mapRelatedItemsToUrlChunks,
  mapUrlChunkContentToUrlChunk,
  mapUrlSourceToUrl,
  type NoteContent,
  type UrlChunkContent,
} from "src/models";
import { ChunkDescription } from "../Chunk/ChunkDescription";
import { NoteDescription } from "../Note/NoteDescription";
import { useStreamedRandomContent } from "./useStreamedRandomContent";

export function RandomPage() {
  const navigate = useNavigate();
  const state = useStreamedRandomContent();

  switch (state.status) {
    case "loading":
      return <LoadingIndicator />;
    case "error":
      throw state.error;
    case "streaming":
    case "success": {
      const { source, content, additionalContext, relatedItems } = state.data;

      return source.type === "book" ? (
        <div>
          <NoteDescription
            book={mapBookSourceToKindleBook(source)}
            note={mapNoteContentToKindleNote(content as NoteContent)}
            relatedNotes={mapRelatedItemsToNotes(relatedItems)}
            additionalContext={additionalContext}
            onBookClick={() => {
              navigate(`/books/${source.id}/`);
            }}
            onRelatedNoteClick={(relatedNoteId) => {
              navigate(`/books/${source.id}/notes/${relatedNoteId}`);
            }}
          />
        </div>
      ) : (
        <div>
          <ChunkDescription
            url={mapUrlSourceToUrl(source)}
            chunk={mapUrlChunkContentToUrlChunk(content as UrlChunkContent)}
            relatedChunks={mapRelatedItemsToUrlChunks(relatedItems)}
            additionalContext={additionalContext}
            onUrlClick={() => {
              navigate(`/urls/${source.id}/`);
            }}
            onRelatedChunkClick={(relatedChunkId) => {
              navigate(`/urls/${source.id}/chunks/${relatedChunkId}`);
            }}
          />
        </div>
      );
    }
  }
}
