import {
  ClickableUrl,
  DetailCardButton,
  MarkdownSection,
  RelatedItemsSection,
} from "src/components";
import type { Url, UrlChunk } from "src/models";
import { formatDate } from "src/utils/date";

interface ChunkDescriptionProps {
  url: Url;
  chunk: UrlChunk;
  relatedChunks: UrlChunk[];
  additionalContext: string;
  onRelatedChunkClick: (chunkId: string) => void;
  onUrlClick: () => void;
}

export function ChunkDescription({
  url,
  chunk,
  relatedChunks,
  additionalContext,
  onRelatedChunkClick,
  onUrlClick,
}: ChunkDescriptionProps) {
  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6">
      <div className="mb-3 md:mb-4">
        <DetailCardButton
          className="mb-3 md:mb-4 text-left"
          padding="p-2"
          onClick={onUrlClick}
        >
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
            {url.title}
          </h2>
          <p className="text-zinc-500 text-xs">
            {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
            {formatDate(url.createdAt)}
          </p>
        </DetailCardButton>
        <ClickableUrl
          url={url.url}
          className="text-zinc-400 text-sm line-clamp-1 block mt-2"
        />
      </div>

      <div className="mb-3 md:mb-4">
        {chunk.isSummary && (
          <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
            Summary
          </span>
        )}
        <div className="text-base md:text-lg text-zinc-300">
          {chunk.content}
        </div>
        <p className="text-zinc-500 text-xs mt-2">
          {formatDate(chunk.createdAt)}
        </p>
      </div>

      {additionalContext && (
        <MarkdownSection
          title="Additional Context"
          content={additionalContext}
        />
      )}

      <RelatedItemsSection
        title="Related Chunks"
        items={relatedChunks}
        emptyMessage="No related chunks found"
        getKey={(relatedChunk) => relatedChunk.id}
        renderItem={(relatedChunk) => (
          <DetailCardButton
            className="text-left"
            padding="p-2 md:p-3"
            onClick={() => onRelatedChunkClick(relatedChunk.id)}
          >
            {relatedChunk.isSummary && (
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded mb-1">
                Summary
              </span>
            )}
            <p className="text-zinc-300 text-sm">{relatedChunk.content}</p>
          </DetailCardButton>
        )}
      />
    </article>
  );
}
