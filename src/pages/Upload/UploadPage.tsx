import { useState } from "react";
import { FileDropZone } from "../../components/FileDropZone";
import { FileUploadControl } from "../../components/FileUploadControl";

export function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };
  const handleClearFiles = () => {
    setSelectedFiles([]);
  };
  const handleUpload = () => {
    // TODO: Handle file upload
    console.log("Uploading files:", selectedFiles);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Kindle Notes</h1>
      <FileDropZone
        onFilesSelected={handleFilesSelected}
        selectedFiles={selectedFiles}
        acceptedTypes={["txt", "html"]}
        maxFiles={1}
        maxSizeMB={10}
      />
      <FileUploadControl
        selectedFiles={selectedFiles}
        onClearFiles={handleClearFiles}
        onUpload={handleUpload}
      />
    </div>
  );
}
