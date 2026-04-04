import { useNavigate } from "react-router";
import { LoadingIndicator } from "src/components";
import {
  mapBookSourceToKindleBook,
  mapNoteContentToKindleNote,
  mapRelatedItemsToNotes,
  mapRelatedItemsToTweets,
  mapRelatedItemsToUrlChunks,
  mapTweetContentToTweet,
  mapTweetThreadSourceToThread,
  mapUrlChunkContentToUrlChunk,
  mapUrlSourceToUrl,
} from "src/models";
import { ChunkDescription } from "../Chunk/ChunkDescription";
import { NoteDescription } from "../Note/NoteDescription";
import { TweetDescription } from "../Tweet/TweetDescription";
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

      if (source.type === "book") {
        if (content.contentType !== "note") {
          throw new Error(
            `Expected note content for book source, got ${content.contentType}`,
          );
        }
        return (
          <div>
            <NoteDescription
              book={mapBookSourceToKindleBook(source)}
              note={mapNoteContentToKindleNote(content)}
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
        );
      }

      if (source.type === "tweet_thread") {
        if (content.contentType !== "tweet") {
          throw new Error(
            `Expected tweet content for tweet_thread source, got ${content.contentType}`,
          );
        }
        const thread = mapTweetThreadSourceToThread(source);
        const tweet = mapTweetContentToTweet(content);
        return (
          <div>
            <TweetDescription
              thread={thread}
              tweet={tweet}
              relatedTweets={mapRelatedItemsToTweets(relatedItems)}
              additionalContext={additionalContext}
              onThreadClick={() => navigate(`/tweets/${source.id}/`)}
              onRelatedTweetClick={(relatedTweetId) =>
                navigate(`/tweets/${source.id}/tweets/${relatedTweetId}`)
              }
            />
          </div>
        );
      }

      if (content.contentType !== "url_chunk") {
        throw new Error(
          `Expected url_chunk content for url source, got ${content.contentType}`,
        );
      }
      return (
        <div>
          <ChunkDescription
            url={mapUrlSourceToUrl(source)}
            chunk={mapUrlChunkContentToUrlChunk(content)}
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
