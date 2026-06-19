import type { UrlChunk } from "../../models";
import { ChunkItem } from "./ChunkItem";

interface ChunkListProps {
  chunks: UrlChunk[];
  onChunkClick: (chunk: UrlChunk) => void;
}

export function ChunkList({ chunks, onChunkClick }: ChunkListProps) {
  if (chunks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 text-lg">No chunks found for this URL.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 sm:space-y-4 list-none">
      {chunks.map((chunk) => (
        <li key={chunk.id}>
          <ChunkItem chunk={chunk} onClick={() => onChunkClick(chunk)} />
        </li>
      ))}
    </ul>
  );
}
