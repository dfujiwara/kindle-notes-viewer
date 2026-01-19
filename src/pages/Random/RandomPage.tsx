import { useNavigate } from "react-router";
import {
  mapRelatedItemsToUrlChunks,
  mapUrlChunkContentToUrlChunk,
  mapUrlSourceToUrl,
} from "src/api";
import { LoadingIndicator } from "src/components/LoadingIndicator";
import type {
  BookSource,
  Content,
  KindleBook,
  KindleNote,
  NoteContent,
  UrlChunkContent,
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

// Mapping functions to convert unified API response to existing model types

function mapBookSourceToKindleBook(source: BookSource): KindleBook {
  return {
    id: source.id,
    title: source.title,
    author: source.author,
  };
}

function mapNoteContentToKindleNote(content: NoteContent): KindleNote {
  return {
    id: content.id,
    content: content.content,
    createdAt: content.createdAt,
  };
}

function mapRelatedItemsToNotes(relatedItems: Content[]): KindleNote[] {
  return relatedItems
    .filter((item): item is NoteContent => item.contentType === "note")
    .map(mapNoteContentToKindleNote);
}
