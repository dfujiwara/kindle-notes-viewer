import { ClickableUrl } from "src/components/ClickableUrl";
import type { Url } from "src/models";
import { formatDate } from "src/utils/date";
import { getCardButtonClassName } from "src/utils/styles";

interface UrlItemProps {
  url: Url;
  onClick: (url: Url) => void;
}

export function UrlItem({ url, onClick }: UrlItemProps) {
  const formattedDate = formatDate(url.createdAt);

  return (
    <button
      type="button"
      className={getCardButtonClassName()}
      onClick={() => onClick(url)}
    >
      <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-2">
        {url.title}
      </h3>
      <ClickableUrl
        url={url.url}
        className="text-zinc-400 text-sm line-clamp-1 mb-2 block"
      />
      <p className="text-zinc-500 text-xs">
        {url.chunkCount} {url.chunkCount === 1 ? "chunk" : "chunks"} •{" "}
        {formattedDate}
      </p>
    </button>
  );
}
