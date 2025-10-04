interface FileUploadControlProps {
  selectedFiles: File[];
  onClearFiles: () => void;
  onUpload: () => void;
}

export function FileUploadControl({
  selectedFiles,
  onClearFiles,
  onUpload,
}: FileUploadControlProps) {
  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={onClearFiles}
        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear Selection
      </button>
      <button
        type="button"
        onClick={onUpload}
        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
      >
        Upload
      </button>
    </div>
  );
}
