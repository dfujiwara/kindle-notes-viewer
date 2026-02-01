import { ClickableUrl, DeleteButton } from "src/components";
import type { Url } from "src/models";
import { formatDate } from "src/utils/date";

interface UrlDescriptionProps {
  url: Url;
  onDelete: () => void;
  isDeleting: boolean;
}

export function UrlDescription({
  url,
  onDelete,
  isDeleting,
}: UrlDescriptionProps) {
  const formattedDate = formatDate(url.createdAt);

  return (
    <article className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
            {url.title}
          </h1>
          <ClickableUrl
            url={url.url}
            className="text-sm sm:text-base text-zinc-400 line-clamp-1 mb-2 block"
          />
          <p className="text-zinc-500 text-xs">
            {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
            {formattedDate}
          </p>
        </div>
        <DeleteButton
          confirmMessage={`Delete "${url.title}" and all its chunks?`}
          onDelete={onDelete}
          isDeleting={isDeleting}
          ariaLabel={`Delete URL ${url.title}`}
        />
      </div>
    </article>
  );
}
