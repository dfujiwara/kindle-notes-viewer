interface FileUploadControlProps {
  selectedFiles: File[];
  onClearFiles: () => void;
  onUpload: () => void;
  isUploading?: boolean;
}

export function FileUploadControl({
  selectedFiles,
  onClearFiles,
  onUpload,
  isUploading = false,
}: FileUploadControlProps) {
  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={onClearFiles}
        disabled={isUploading}
        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear Selection
      </button>
      <button
        type="button"
        onClick={onUpload}
        disabled={isUploading}
        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
