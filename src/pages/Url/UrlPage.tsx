import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { ApiError } from "src/api";
import { urlService, useApiMutation, useApiSuspenseQuery } from "src/api";
import { PageContainer } from "src/components";
import { ChunkList } from "./ChunkList";
import { UrlDescription } from "./UrlDescription";

export function UrlPage() {
  const { urlId } = useParams<{ urlId: string }>();
  const navigate = useNavigate();
  if (urlId === undefined) {
    throw new Error("URL ID is not defined in the URL");
  }
  const result = useApiSuspenseQuery(["chunks", urlId], () =>
    urlService.getChunksFromUrl(urlId),
  );

  const deleteMutation = useApiMutation(
    (urlId: string) => urlService.deleteUrl(urlId),
    () => {
      toast.success("URL deleted successfully");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Failed to delete URL: ${error.message}`);
    },
    ["urls"],
  );

  return (
    <PageContainer>
      <UrlDescription
        url={result.data.url}
        onDelete={() => deleteMutation.mutate(urlId)}
        isDeleting={deleteMutation.isPending}
      />
      <ChunkList
        chunks={result.data.chunks}
        onChunkClick={(chunk) => navigate(`/urls/${urlId}/chunks/${chunk.id}`)}
      />
    </PageContainer>
  );
}
