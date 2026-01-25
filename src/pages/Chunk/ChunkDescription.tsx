import Markdown from "react-markdown";
import { ClickableUrl } from "src/components";
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
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
      <div className="mb-3 md:mb-4">
        <button
          type="button"
          className="block hover:bg-zinc-750 rounded p-2 -m-2 transition-colors w-full text-left cursor-pointer"
          onClick={onUrlClick}
        >
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
            {url.title}
          </h2>
          <p className="text-zinc-500 text-xs">
            {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
            {formatDate(url.createdAt)}
          </p>
        </button>
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

      <div className="mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">
          Additional Context
        </h3>
        <div className="text-zinc-300 text-sm md:text-base [&_p]:mb-3 md:[&_p]:mb-4">
          <Markdown>{additionalContext}</Markdown>
        </div>
      </div>

      <div className="mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">
          Related Chunks
        </h3>
        <div className="space-y-2">
          {relatedChunks.length > 0 ? (
            relatedChunks.map((relatedChunk) => (
              <button
                key={relatedChunk.id}
                type="button"
                className="bg-zinc-700 rounded p-2 md:p-3 border border-zinc-600 cursor-pointer hover:border-zinc-500 transition-colors w-full text-left"
                onClick={() => onRelatedChunkClick(relatedChunk.id)}
              >
                {relatedChunk.isSummary && (
                  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded mb-1">
                    Summary
                  </span>
                )}
                <p className="text-zinc-300 text-sm">{relatedChunk.content}</p>
              </button>
            ))
          ) : (
            <p className="text-zinc-500 text-sm italic">
              No related chunks found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
