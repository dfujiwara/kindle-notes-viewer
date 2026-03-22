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
  type NoteContent,
  type TweetContent,
  type UrlChunkContent,
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
        return (
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
        );
      }

      if (source.type === "tweet_thread") {
        const thread = mapTweetThreadSourceToThread(source);
        const tweet = mapTweetContentToTweet(
          content as TweetContent,
          source.id,
        );
        return (
          <div>
            <TweetDescription
              thread={thread}
              tweet={tweet}
              relatedTweets={mapRelatedItemsToTweets(relatedItems, source.id)}
              additionalContext={additionalContext}
              onThreadClick={() => navigate(`/tweets/${source.id}/`)}
              onRelatedTweetClick={(relatedTweetId) =>
                navigate(`/tweets/${source.id}/tweets/${relatedTweetId}`)
              }
            />
          </div>
        );
      }

      return (
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
