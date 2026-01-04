import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  type ApiError,
  booksService,
  urlService,
  useApiMutation,
} from "src/api";
import { FileDropZone } from "src/components/FileDropZone";
import { FileUploadControl } from "src/components/FileUploadControl";
import { UrlInputZone, validateUrl } from "src/components/UrlInputZone";

type UploadMode = "file" | "url";

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");

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

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  const handleClear = () => {
    if (uploadMode === "file") {
      setSelectedFile(null);
    } else {
      setUrlInput("");
    }
  };

  const handleUpload = () => {
    if (uploadMode === "file") {
      if (selectedFile === null) {
        return;
      }
      fileMutation.mutate(selectedFile);
    } else {
      urlMutation.mutate(urlInput);
    }
  };

  const handleModeChange = (mode: UploadMode) => {
    setUploadMode(mode);
    // Clear state when switching modes
    if (mode === "url") {
      setSelectedFile(null);
    } else {
      setUrlInput("");
    }
  };

  const hasContent =
    uploadMode === "file" ? selectedFile !== null : validateUrl(urlInput);
  const isUploading =
    uploadMode === "file" ? fileMutation.isPending : urlMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Upload Notes
      </h1>

      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
          <button
            type="button"
            onClick={() => handleModeChange("file")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "file"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("url")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "url"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            URL Upload
          </button>
        </div>
      </div>

      {/* Upload Area */}
      {uploadMode === "file" ? (
        <FileDropZone
          onFilesSelected={handleFilesSelected}
          selectedFiles={selectedFile ? [selectedFile] : []}
          acceptedTypes={["txt", "html"]}
          maxFiles={1}
          maxSizeMB={10}
        />
      ) : (
        <UrlInputZone url={urlInput} onUrlChange={setUrlInput} />
      )}

      {/* Upload Control */}
      {hasContent && (
        <FileUploadControl
          selectedFiles={hasContent ? [new File([], "")] : []}
          onClearFiles={handleClear}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
