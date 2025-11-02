import { useId, useState } from "react";

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  acceptedTypes: string[];
  maxFiles?: number;
  maxSizeMB?: number;
}

interface SelectedFilesViewProps {
  files: File[];
}

function SelectedFilesView({ files }: SelectedFilesViewProps) {
  return (
    <div className="w-full">
      <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-6 bg-gray-50">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700">
            File Selection:
          </h3>
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-start sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded border border-gray-200"
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DropZoneViewProps {
  isDragging: boolean;
  fileInputId: string;
  acceptedTypesWithExtension: string[];
  formattedTypeString: string;
  maxFiles: number;
  maxSizeMB: number;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DropZoneView({
  isDragging,
  fileInputId,
  acceptedTypesWithExtension,
  formattedTypeString,
  maxFiles,
  maxSizeMB,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
}: DropZoneViewProps) {
  return (
    <div className="w-full">
      <div
        role="presentation"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors cursor-pointer
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}
        `}
      >
        <input
          type="file"
          id={fileInputId}
          className="hidden"
          accept={acceptedTypesWithExtension.join(",")}
          multiple={maxFiles > 1}
          onChange={onFileInput}
        />
        <label htmlFor={fileInputId} className="cursor-pointer">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Upload file"
            >
              <title>Upload file</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              <span className="hidden sm:inline">
                Drag and drop your file here, or{" "}
              </span>
              <span className="sm:hidden">Tap to upload or </span>
              click to browse
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Accepted formats: {formattedTypeString} (max {maxSizeMB}MB)
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

export function FileDropZone({
  onFilesSelected,
  selectedFiles,
  acceptedTypes = ["txt", "html"],
  maxFiles = 1,
  maxSizeMB = 10,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputId = useId();

  const acceptedTypesWithExtension = acceptedTypes.map((ext) => `.${ext}`);
  const formattedTypeString = acceptedTypesWithExtension.join(", ");

  const validateFiles = (files: File[]): File[] => {
    if (files.length === 0) {
      setError("No files selected");
      return [];
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed`);
      return [];
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return [];
    }

    const invalidFiles = files.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return !acceptedTypes.includes(extension || "");
    });

    if (invalidFiles.length > 0) {
      setError(`Only ${formattedTypeString} files are allowed`);
      return [];
    }

    setError(null);
    return files;
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  if (selectedFiles.length > 0) {
    return <SelectedFilesView files={selectedFiles} />;
  }

  return (
    <>
      <DropZoneView
        isDragging={isDragging}
        fileInputId={fileInputId}
        acceptedTypesWithExtension={acceptedTypesWithExtension}
        formattedTypeString={formattedTypeString}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onFileInput={handleFileInput}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}
