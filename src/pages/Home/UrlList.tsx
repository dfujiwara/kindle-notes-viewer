import type { Url } from "src/models";
import { UrlItem } from "./UrlItem";

interface UrlListProps {
  urls: Url[];
  onUrlClick: (url: Url) => void;
}

export function UrlList({ urls, onUrlClick }: UrlListProps) {
  // Empty state handling
  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg">No URLs Found</p>
      </div>
    );
  }

  // Responsive grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {urls.map((url) => (
        <UrlItem key={url.id} url={url} onClick={onUrlClick} />
      ))}
    </div>
  );
}
