import type { Url } from "src/models";
import { formatDate } from "src/utils/date";

interface UrlDescriptionProps {
  url: Url;
}

export function UrlDescription({ url }: UrlDescriptionProps) {
  const formattedDate = formatDate(url.createdAt);

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
        {url.title}
      </h1>
      <p className="text-sm sm:text-base text-zinc-400 line-clamp-1 mb-2">
        {url.url}
      </p>
      <p className="text-zinc-500 text-xs">
        {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
        {formattedDate}
      </p>
    </div>
  );
}
