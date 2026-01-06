import { useParams } from "react-router";
import { urlService, useApiSuspenseQuery } from "src/api";
import { ChunkList } from "./ChunkList";
import { UrlDescription } from "./UrlDescription";

export function UrlPage() {
  const { urlId } = useParams<{ urlId: string }>();
  if (urlId === undefined) {
    throw new Error("URL ID is not defined in the URL");
  }
  const result = useApiSuspenseQuery(["chunks", urlId], () =>
    urlService.getChunksFromUrl(urlId),
  );
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <UrlDescription url={result.data.url} />
      <ChunkList urlId={urlId} chunks={result.data.chunks} />
    </div>
  );
}
