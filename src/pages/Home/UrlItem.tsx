import type { Url } from "src/models";
import { formatDate } from "src/utils/date";

interface UrlItemProps {
  url: Url;
  onClick: (url: Url) => void;
}

export function UrlItem({ url, onClick }: UrlItemProps) {
  const formattedDate = formatDate(url.createdAt);

  return (
    <button
      type="button"
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6 hover:bg-zinc-750 transition-colors cursor-pointer text-left w-full active:bg-zinc-700"
      onClick={() => onClick(url)}
    >
      <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-2">
        {url.title}
      </h3>
      <p className="text-zinc-400 text-sm line-clamp-1 mb-2">{url.url}</p>
      <p className="text-zinc-500 text-xs">
        {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
        {formattedDate}
      </p>
    </button>
  );
}
