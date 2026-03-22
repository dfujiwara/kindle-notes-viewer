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
import { FileDropZone, UploadControl, UrlInputZone } from "src/components";
import { validateTweetUrl, validateUrl } from "src/utils/validation";

type UploadMode = "file" | "url" | "tweet";

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

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUrlInput("");
    setTweetInput("");
  };

  const handleUpload = () => {
    if (uploadMode === "file") {
      if (selectedFile === null) {
        return;
      }
      fileMutation.mutate(selectedFile);
    } else if (uploadMode === "url") {
      urlMutation.mutate(urlInput);
    } else {
      tweetMutation.mutate(tweetInput);
    }
  };

  const handleModeChange = (mode: UploadMode) => {
    setUploadMode(mode);
    // Clear state when switching modes
    handleClear();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Upload Notes
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Mode Toggle */}
        <fieldset className="mb-6 border-0 p-0">
          <legend className="sr-only">Upload Mode</legend>
          <div className="inline-flex gap-2 rounded-lg border border-gray-300 p-1 bg-white">
            <button
              type="button"
              onClick={() => handleModeChange("file")}
              aria-pressed={uploadMode === "file"}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === "file"
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              File Upload
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("url")}
              aria-pressed={uploadMode === "url"}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === "url"
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              URL Upload
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("tweet")}
              aria-pressed={uploadMode === "tweet"}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === "tweet"
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Tweet
            </button>
          </div>
        </fieldset>

        {/* Upload Area */}
        {uploadMode === "file" ? (
          <FileDropZone
            onFilesSelected={handleFilesSelected}
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

        {/* Upload Control */}
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
