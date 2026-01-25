import { useNavigate, useParams } from "react-router";
import { LoadingIndicator } from "src/components";
import { ChunkDescription } from "./ChunkDescription";
import { useStreamedDetailedChunk } from "./useStreamedDetailedChunk";

export function ChunkPage() {
  const navigate = useNavigate();
  const { urlId, chunkId } = useParams<{ urlId: string; chunkId: string }>();
  if (urlId === undefined || chunkId === undefined) {
    throw new Error("URL ID or Chunk ID is not defined in the URL");
  }

  const state = useStreamedDetailedChunk(urlId, chunkId);

  switch (state.status) {
    case "loading":
      return <LoadingIndicator />;
    case "error":
      throw state.error;
    case "streaming":
    case "success": {
      const {
        url,
        chunk: chunkData,
        additionalContext,
        relatedChunks,
      } = state.data;

      return (
        <div>
          <ChunkDescription
            url={url}
            chunk={chunkData}
            relatedChunks={relatedChunks}
            additionalContext={additionalContext}
            onUrlClick={() => {
              navigate(`/urls/${url.id}/`);
            }}
            onRelatedChunkClick={(relatedChunkId) => {
              navigate(`/urls/${url.id}/chunks/${relatedChunkId}`);
            }}
          />
        </div>
      );
    }
  }
}
