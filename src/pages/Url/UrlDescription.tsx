import { ClickableUrl, DeleteButton, PageHeader } from "src/components";
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
      <PageHeader
        title={url.title}
        subtitle={
          <ClickableUrl
            url={url.url}
            className="text-sm sm:text-base text-zinc-400 line-clamp-1 block"
          />
        }
        meta={`${url.chunkCount} ${url.chunkCount === 1 ? "chunk" : "chunks"} • ${formattedDate}`}
        action={
          <DeleteButton
            confirmMessage={`Delete "${url.title}" and all its chunks?`}
            onDelete={onDelete}
            isDeleting={isDeleting}
            ariaLabel={`Delete URL ${url.title}`}
          />
        }
      />
    </article>
  );
}
