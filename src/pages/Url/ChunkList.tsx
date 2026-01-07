import { useNavigate } from "react-router";
import type { UrlChunk } from "../../models";
import { ChunkItem } from "./ChunkItem";

interface ChunkListProps {
  urlId: string;
  chunks: UrlChunk[];
}

export function ChunkList({ urlId, chunks }: ChunkListProps) {
  const navigate = useNavigate();
  if (chunks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 text-lg">No chunks found for this URL.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {chunks.map((chunk) => (
        <ChunkItem
          key={chunk.id}
          chunk={chunk}
          onClick={() => {
            navigate(`/urls/${urlId}/chunks/${chunk.id}`);
          }}
        />
      ))}
    </div>
  );
}
