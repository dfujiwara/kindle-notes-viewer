import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  type ApiError,
  booksService,
  tweetService,
  urlService,
  useApiMutation,
} from "src/api";
import { FileDropZone, TabBar, UploadControl, UrlInputZone } from "src/components";
import { validateTweetUrl, validateUrl } from "src/utils/validation";

type UploadMode = "file" | "url" | "tweet";

const UPLOAD_TABS = [
  { id: "file" as const, label: "File Upload" },
  { id: "url" as const, label: "URL Upload" },
  { id: "tweet" as const, label: "Tweet" },
];

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [tweetInput, setTweetInput] = useState<string>("");

  const fileMutation = useApiMutation(
    (file: File) => booksService.uploadBook(file),
    () => {
      toast.success("Book uploaded successfully!");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Upload failed: ${error.message}`);
    },
    ["books"],
  );

  const urlMutation = useApiMutation(
    (url: string) => urlService.uploadUrl(url),
    () => {
      toast.success("URL uploaded successfully!");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Upload failed: ${error.message}`);
    },
    ["urls"],
  );

  const tweetMutation = useApiMutation(
    (url: string) => tweetService.ingestTweet(url),
    () => {
      toast.success("Tweet ingested!");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Ingestion failed: ${error.message}`);
    },
    ["tweets"],
  );

  const handleClear = () => {
    setSelectedFile(null);
    setUrlInput("");
    setTweetInput("");
  };

  const handleModeChange = (mode: UploadMode) => {
    setUploadMode(mode);
    handleClear();
  };

  const handleUpload = () => {
    if (uploadMode === "file") {
      if (selectedFile === null) return;
      fileMutation.mutate(selectedFile);
    } else if (uploadMode === "url") {
      urlMutation.mutate(urlInput);
    } else {
      tweetMutation.mutate(tweetInput);
    }
  };

  const hasContent: Record<UploadMode, boolean> = {
    file: selectedFile !== null,
    url: validateUrl(urlInput),
    tweet: validateTweetUrl(tweetInput),
  };
  const isUploading: Record<UploadMode, boolean> = {
    file: fileMutation.isPending,
    url: urlMutation.isPending,
    tweet: tweetMutation.isPending,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Upload Notes
      </h1>

      <form onSubmit={handleSubmit}>
        <TabBar
          tabs={UPLOAD_TABS}
          activeTab={uploadMode}
          onChange={handleModeChange}
        />

        {uploadMode === "file" ? (
          <FileDropZone
            onFilesSelected={(files) => setSelectedFile(files[0])}
            selectedFiles={selectedFile ? [selectedFile] : []}
            acceptedTypes={["txt", "html"]}
            maxFiles={1}
            maxSizeMB={10}
          />
        ) : uploadMode === "url" ? (
          <UrlInputZone url={urlInput} onUrlChange={setUrlInput} />
        ) : (
          <UrlInputZone
            url={tweetInput}
            onUrlChange={setTweetInput}
            placeholder="Enter twitter.com or x.com URL"
            validate={validateTweetUrl}
          />
        )}

        <UploadControl
          hasContent={hasContent[uploadMode]}
          onClear={handleClear}
          onUpload={handleUpload}
          isUploading={isUploading[uploadMode]}
        />
      </form>
    </div>
  );
}
