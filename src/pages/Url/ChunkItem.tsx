import type { UrlChunk } from "src/models";
import { getCardButtonClassName } from "src/utils/styles";

interface ChunkItemProps {
  chunk: UrlChunk;
  onClick: () => void;
}

export function ChunkItem({ chunk, onClick }: ChunkItemProps) {
  return (
    <button
      type="button"
      className={`${getCardButtonClassName("p-3 sm:p-4")} touch-manipulation`}
      onClick={onClick}
    >
      {chunk.isSummary && (
        <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
          Summary
        </span>
      )}
      <p className="text-zinc-300 leading-relaxed text-sm sm:text-base break-words">
        {chunk.content}
      </p>
    </button>
  );
}
